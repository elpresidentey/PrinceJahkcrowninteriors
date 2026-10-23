import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "pjc_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const DEFAULT_ADMIN_USERNAME = "admin";

/**
 * Single-user admin gate. The credentials live only in the environment
 * (`ADMIN_USERNAME` + `ADMIN_PASSWORD`, set in `.env.local` / the host's
 * dashboard); the browser holds an httpOnly cookie of the form
 *
 *   "<expiry-unix-seconds>.<HMAC(password, "pjc-admin-v2:username:expiry")>"
 *
 * The HMAC binds the token to the credentials AND an expiry timestamp, so a
 * stolen cookie stops working once it expires. Rotating either value
 * instantly invalidates every session, and old plaintext-HMAC ("v1") cookies
 * fail the format check and force a fresh login.
 */
function sessionHmac(payload: string): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "")
    .update(payload)
    .digest("hex");
}

function expectedExp(): number {
  return Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
}

/**
 * Token for a NEW session, including its expiry. Null when no admin password
 * is configured (the login flow refuses to run in that case anyway).
 */
export function createSessionToken(): { value: string; expiresAt: number } | null {
  if (!process.env.ADMIN_PASSWORD) return null;
  const username = process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
  const expiresAt = expectedExp();
  const mac = sessionHmac(`pjc-admin-v2:${username}:${expiresAt}`);
  return { value: `${expiresAt}.${mac}`, expiresAt };
}

/** True when the request carries a valid, unexpired session cookie. */
export async function isAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;

  const provided = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!provided || !/^\d+\.[0-9a-f]{64}$/.test(provided)) return false;

  const [rawExpiry, mac] = provided.split(".");
  const expiry = Number(rawExpiry);
  if (!Number.isSafeInteger(expiry) || expiry < Math.floor(Date.now() / 1000)) {
    return false; // expired — never accept a stale MAC even if it verifies
  }

  const username = process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
  const expected = sessionHmac(`pjc-admin-v2:${username}:${expiry}`);
  const a = Buffer.from(expected);
  const b = Buffer.from(mac);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/**
 * Constant-time credential check against the configured admin username and
 * password. When no `ADMIN_USERNAME` is configured, the login form must still
 * submit the default username — one field is committed to memory, and both
 * values are checked.
 */
export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(password);
  const passwordOk = a.length === b.length && timingSafeEqual(a, b);
  if (!passwordOk) return false;

  const expectedUsername = process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
  const c = Buffer.from(expectedUsername);
  const d = Buffer.from(username);
  return c.length === d.length && timingSafeEqual(c, d);
}

export async function createAdminSession(): Promise<void> {
  const token = createSessionToken();
  if (!token) return;

  (await cookies()).set(SESSION_COOKIE, token.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroyAdminSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
