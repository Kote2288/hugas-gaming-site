"""
Steam OpenID авторизация.
GET /?action=login — редирект на Steam
GET /?action=callback&... — обработка ответа от Steam, создание сессии
GET /?action=me — получить текущего пользователя по сессии
POST /?action=logout — удалить сессию
"""
import os
import json
import secrets
import hashlib
import urllib.parse
import urllib.request
import psycopg2


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    }


def handler(event: dict, context) -> dict:
    headers = get_cors_headers()

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'login')

    site_url = os.environ.get('SITE_URL', 'https://hugas-gaming.poehali.dev')
    func_url = os.environ.get('STEAM_AUTH_URL', site_url + '/api/steam-auth')

    # === LOGIN: редирект на Steam ===
    if action == 'login':
        openid_params = {
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.return_to': func_url + '?action=callback',
            'openid.realm': site_url,
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
        }
        steam_url = 'https://steamcommunity.com/openid/login?' + urllib.parse.urlencode(openid_params)
        return {
            'statusCode': 302,
            'headers': {**headers, 'Location': steam_url},
            'body': ''
        }

    # === CALLBACK: обработка ответа от Steam ===
    if action == 'callback':
        # Верификация ответа Steam
        verify_params = dict(params)
        verify_params['openid.mode'] = 'check_authentication'
        verify_body = urllib.parse.urlencode(verify_params).encode('utf-8')

        req = urllib.request.Request(
            'https://steamcommunity.com/openid/login',
            data=verify_body,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        with urllib.request.urlopen(req) as resp:
            result = resp.read().decode('utf-8')

        if 'is_valid:true' not in result:
            return {
                'statusCode': 302,
                'headers': {**headers, 'Location': site_url + '/?auth=fail'},
                'body': ''
            }

        # Извлекаем Steam ID
        claimed_id = params.get('openid.claimed_id', '')
        steam_id = claimed_id.split('/')[-1]
        if not steam_id.isdigit():
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'invalid steam id'})}

        # Получаем профиль через Steam API
        api_key = os.environ.get('STEAM_API_KEY', '')
        name = 'Steam User'
        avatar = ''
        if api_key:
            api_url = f'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={api_key}&steamids={steam_id}'
            with urllib.request.urlopen(api_url) as resp:
                profile_data = json.loads(resp.read().decode('utf-8'))
            players = profile_data.get('response', {}).get('players', [])
            if players:
                name = players[0].get('personaname', name)
                avatar = players[0].get('avatarfull', avatar)

        # Сохраняем/обновляем пользователя в БД
        db = get_db()
        cur = db.cursor()
        cur.execute("""
            INSERT INTO users (steam_id, name, avatar)
            VALUES (%s, %s, %s)
            ON CONFLICT (steam_id) DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar
            RETURNING id, steam_id, name, avatar, balance, role, banned
        """, (steam_id, name, avatar))
        user = cur.fetchone()
        user_id = user[0]

        # Создаём сессию
        session_id = secrets.token_hex(32)
        cur.execute("""
            INSERT INTO sessions (id, user_id) VALUES (%s, %s)
        """, (session_id, user_id))
        db.commit()
        cur.close()
        db.close()

        # Редирект на профиль с сессией
        redirect_url = site_url + f'/profile?session={session_id}'
        return {
            'statusCode': 302,
            'headers': {**headers, 'Location': redirect_url},
            'body': ''
        }

    # === ME: получить текущего пользователя ===
    if action == 'me':
        req_headers = event.get('headers') or {}
        session_id = req_headers.get('X-Session-Id') or params.get('session_id', '')
        if not session_id:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'no session'})}

        db = get_db()
        cur = db.cursor()
        cur.execute("""
            SELECT u.id, u.steam_id, u.name, u.avatar, u.balance, u.role, u.banned, u.join_date
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = %s AND s.expires_at > NOW()
        """, (session_id,))
        row = cur.fetchone()

        # Получаем историю покупок
        purchases = []
        if row:
            cur.execute("""
                SELECT product_name, price, status, created_at
                FROM purchases WHERE user_id = %s ORDER BY created_at DESC LIMIT 20
            """, (row[0],))
            for p in cur.fetchall():
                purchases.append({
                    'productName': p[0],
                    'price': p[1],
                    'status': p[2],
                    'date': str(p[3])[:10]
                })
        cur.close()
        db.close()

        if not row:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'session expired'})}

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'id': str(row[0]),
                'steamId': row[1],
                'name': row[2],
                'avatar': row[3],
                'balance': row[4],
                'role': row[5],
                'banned': row[6],
                'joinDate': str(row[7]),
                'playtime': 0,
                'purchases': purchases,
            })
        }

    # === LOGOUT ===
    if action == 'logout' and method == 'POST':
        req_headers = event.get('headers') or {}
        session_id = req_headers.get('X-Session-Id') or ''
        if session_id:
            db = get_db()
            cur = db.cursor()
            cur.execute("UPDATE sessions SET expires_at = NOW() WHERE id = %s", (session_id,))
            db.commit()
            cur.close()
            db.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'unknown action'})}
