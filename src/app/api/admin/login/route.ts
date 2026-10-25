import { NextResponse } from "next/server";

import {
  adminConfigured,
  createAdminSession,
  loginClientIpForwarded,
  loginThrottleGate,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

/**
 * Plain route-handler login (JSON in, JSON out).
 *
 * This replaced the server-action login: on Next 16 a form driven by
 * `useActionState` intermittently stopped dispatching retries after a failed
 * attempt (the second submit never reached the server), locking the user out
 * of the admin until a manual reload. A plain POST endpoint is stateless from
 * the browser's perspective — every the submit is a real HTTP call that the
 * server can see, throttle and answer.
 */
export async function POST(request: Request): Promise<Response> {
  if (!adminConfigured()) {
    return NextResponse.json(
      {
        error:
          "No admin password is configured on this server. Set ADMIN_PASSWORD first.",
      },
      { status: 503 }
    );
  }

  let username = "";
  let password = "";
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    username = String(body.username ?? "").trim();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Malformed login request." }, { status: 400 });
  }

  const ip = loginClientIpForwarded(request.headers.get("x-forwarded-for"));
  if (!loginThrottleGate(ip)) {
    return NextResponse.json(
      {
        error:
          "Too many failed attempts from this network. Wait 15 minutes and try again.",
      },
      { status: 429 }
    );
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json(
      { error: "That username or password is not right. Try again." },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
