"""
ЮКасса оплата баланса.
POST /?action=create — создать платёж (тело: {amount, session_id, description})
POST /?action=webhook — вебхук от ЮКасса при успешной оплате
GET /?action=status&payment_id=... — проверить статус платежа
"""
import os
import json
import uuid
import base64
import urllib.request
import urllib.error
import psycopg2


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    }


def get_user_by_session(cur, session_id):
    cur.execute("""
        SELECT u.id, u.steam_id, u.name, u.balance
        FROM sessions s JOIN users u ON s.user_id = u.id
        WHERE s.id = %s AND s.expires_at > NOW()
    """, (session_id,))
    return cur.fetchone()


def yukassa_request(method, path, body=None):
    shop_id = os.environ['YUKASSA_SHOP_ID']
    secret_key = os.environ['YUKASSA_SECRET_KEY']
    credentials = base64.b64encode(f'{shop_id}:{secret_key}'.encode()).decode()

    url = f'https://api.yookassa.ru/v3{path}'
    headers = {
        'Authorization': f'Basic {credentials}',
        'Content-Type': 'application/json',
    }
    data = json.dumps(body).encode('utf-8') if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))


def handler(event: dict, context) -> dict:
    headers = get_cors_headers()

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'create')

    # === CREATE PAYMENT ===
    if action == 'create' and event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        amount = int(body.get('amount', 0))
        session_id = body.get('session_id', '')
        description = body.get('description', f'Пополнение баланса {amount}₽')

        if amount < 10 or amount > 100000:
            return {'statusCode': 400, 'headers': headers,
                    'body': json.dumps({'error': 'Сумма должна быть от 10 до 100000 рублей'})}

        if not session_id:
            return {'statusCode': 401, 'headers': headers,
                    'body': json.dumps({'error': 'Необходима авторизация'})}

        db = get_db()
        cur = db.cursor()
        user = get_user_by_session(cur, session_id)
        if not user:
            cur.close(); db.close()
            return {'statusCode': 401, 'headers': headers,
                    'body': json.dumps({'error': 'Сессия истекла'})}

        site_url = os.environ.get('SITE_URL', 'https://hugas-gaming.poehali.dev')
        idempotency_key = str(uuid.uuid4())

        payment_data = {
            'amount': {'value': f'{amount}.00', 'currency': 'RUB'},
            'confirmation': {
                'type': 'redirect',
                'return_url': f'{site_url}/profile?payment=success'
            },
            'capture': True,
            'description': description,
            'metadata': {
                'user_id': str(user[0]),
                'session_id': session_id,
                'amount_rub': str(amount)
            }
        }

        req = urllib.request.Request(
            'https://api.yookassa.ru/v3/payments',
            data=json.dumps(payment_data).encode('utf-8'),
            headers={
                'Authorization': 'Basic ' + base64.b64encode(
                    f"{os.environ['YUKASSA_SHOP_ID']}:{os.environ['YUKASSA_SECRET_KEY']}".encode()
                ).decode(),
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotency_key,
            },
            method='POST'
        )
        with urllib.request.urlopen(req) as resp:
            payment = json.loads(resp.read().decode('utf-8'))

        yukassa_id = payment['id']
        confirmation_url = payment['confirmation']['confirmation_url']

        cur.execute("""
            INSERT INTO payments (user_id, yukassa_id, amount, status, description)
            VALUES (%s, %s, %s, 'pending', %s)
        """, (user[0], yukassa_id, amount, description))
        db.commit()
        cur.close(); db.close()

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'payment_id': yukassa_id,
                'confirmation_url': confirmation_url
            })
        }

    # === WEBHOOK from YuKassa ===
    if action == 'webhook' and event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        event_type = body.get('event', '')
        payment_obj = body.get('object', {})

        if event_type != 'payment.succeeded':
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        yukassa_id = payment_obj.get('id')
        meta = payment_obj.get('metadata', {})
        user_id = meta.get('user_id')
        amount_rub = int(meta.get('amount_rub', 0))

        if not yukassa_id or not user_id or amount_rub <= 0:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'bad data'})}

        db = get_db()
        cur = db.cursor()

        # Проверяем, не обработали ли уже
        cur.execute("SELECT status FROM payments WHERE yukassa_id = %s", (yukassa_id,))
        row = cur.fetchone()
        if not row or row[0] == 'succeeded':
            cur.close(); db.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        # Пополняем баланс
        cur.execute("""
            UPDATE users SET balance = balance + %s WHERE id = %s
        """, (amount_rub, user_id))
        cur.execute("""
            UPDATE payments SET status = 'succeeded', confirmed_at = NOW()
            WHERE yukassa_id = %s
        """, (yukassa_id,))
        db.commit()
        cur.close(); db.close()

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    # === STATUS CHECK ===
    if action == 'status':
        payment_id = params.get('payment_id', '')
        if not payment_id:
            return {'statusCode': 400, 'headers': headers,
                    'body': json.dumps({'error': 'payment_id required'})}

        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT status, amount, confirmed_at FROM payments WHERE yukassa_id = %s", (payment_id,))
        row = cur.fetchone()
        cur.close(); db.close()

        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'not found'})}

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'status': row[0], 'amount': row[1], 'confirmed_at': str(row[2]) if row[2] else None})
        }

    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'unknown action'})}
