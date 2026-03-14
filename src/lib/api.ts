const STEAM_AUTH_URL = 'https://functions.poehali.dev/ffae37bd-85a6-4861-954d-c0b9dde78e4a';
const YUKASSA_URL = 'https://functions.poehali.dev/d48ab53d-f7c2-4852-bc7f-8a2d5b80e5eb';

const SESSION_KEY = 'hg_session';

export function getSession(): string {
  return localStorage.getItem(SESSION_KEY) || '';
}

export function setSession(id: string) {
  localStorage.setItem(SESSION_KEY, id);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Steam login: перенаправляет на Steam
export function steamLoginRedirect() {
  window.location.href = `${STEAM_AUTH_URL}?action=login`;
}

// Получить текущего пользователя по сессии
export async function fetchMe() {
  const session = getSession();
  if (!session) return null;
  try {
    const res = await fetch(`${STEAM_AUTH_URL}?action=me`, {
      headers: { 'X-Session-Id': session }
    });
    if (res.status === 401) { clearSession(); return null; }
    return await res.json();
  } catch {
    return null;
  }
}

// Выйти
export async function logoutApi() {
  const session = getSession();
  if (!session) return;
  await fetch(`${STEAM_AUTH_URL}?action=logout`, {
    method: 'POST',
    headers: { 'X-Session-Id': session }
  });
  clearSession();
}

// Создать платёж ЮКасса
export async function createPayment(amount: number, description?: string): Promise<{ confirmation_url: string; payment_id: string } | null> {
  const session = getSession();
  try {
    const res = await fetch(`${YUKASSA_URL}?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, session_id: session, description: description || `Пополнение баланса ${amount}₽` })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Проверить статус платежа
export async function checkPaymentStatus(paymentId: string) {
  try {
    const res = await fetch(`${YUKASSA_URL}?action=status&payment_id=${paymentId}`);
    return await res.json();
  } catch {
    return null;
  }
}
