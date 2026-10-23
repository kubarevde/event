// Сессия администратора: подписанная HMAC cookie "<expires>.<signature>".
// Использует только Web Crypto, поэтому работает и в middleware (edge), и в route handlers.

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret() {
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return s ? `${s}::admin-session` : null;
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

async function hmac(data: string, key: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken() {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const expires = String(Date.now() + SESSION_TTL_MS);
  return `${expires}.${await hmac(expires, key)}`;
}

export async function verifySessionToken(token: string | undefined) {
  const key = secret();
  if (!key || !token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, await hmac(expires, key));
}

export async function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Сравниваем хэши, чтобы не зависеть от длины строки.
  const key = "admin-password-compare";
  return safeEqual(await hmac(password, key), await hmac(expected, key));
}
