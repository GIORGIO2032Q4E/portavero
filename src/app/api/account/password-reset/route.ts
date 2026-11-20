import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 20;

const usersPerPage = 1000;
const maxUserPages = 25;
const lookupTimeLimitMs = 12_000;
const attemptWindowMs = 15 * 60 * 1000;
const maxAttemptsPerWindow = 5;
const resetAttempts = new Map<string, number[]>();

type SupabaseUser = { email?: unknown };

function json(body: Record<string, unknown>, status = 200, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0", ...extraHeaders }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normaliseEmail(value: string) {
  return value.trim().toLowerCase();
}

function isRateLimited(ipAddress: string) {
  const now = Date.now();
  const recent = (resetAttempts.get(ipAddress) ?? [])
    .filter((timestamp) => now - timestamp < attemptWindowMs);

  if (recent.length >= maxAttemptsPerWindow) {
    resetAttempts.set(ipAddress, recent);
    return true;
  }

  recent.push(now);
  resetAttempts.set(ipAddress, recent);

  if (resetAttempts.size > 5000) {
    for (const [key, timestamps] of resetAttempts) {
      if (timestamps.every((timestamp) => now - timestamp >= attemptWindowMs)) {
        resetAttempts.delete(key);
      }
    }
  }

  return false;
}

async function accountExists(
  supabaseUrl: string,
  adminKey: string,
  email: string
): Promise<boolean | null> {
  const deadline = Date.now() + lookupTimeLimitMs;

  for (let page = 1; page <= maxUserPages; page += 1) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) return null;

    const url = new URL(`${supabaseUrl}/auth/v1/admin/users`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(usersPerPage));

    const response = await fetch(url, {
      headers: {
        apikey: adminKey,
        Authorization: `Bearer ${adminKey}`,
        Accept: "application/json"
      },
      cache: "no-store",
      signal: AbortSignal.timeout(Math.min(5000, remainingMs))
    });

    if (!response.ok) return null;

    const payload: unknown = await response.json().catch(() => null);
    if (!isRecord(payload) || !Array.isArray(payload.users)) return null;

    const users = payload.users as SupabaseUser[];
    if (users.some((user) =>
      typeof user.email === "string" && normaliseEmail(user.email) === email
    )) {
      return true;
    }

    if (users.length < usersPerPage) return false;
  }

  // Do not report "not found" when the lookup could not finish checking users.
  return null;
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const rawEmail = isRecord(body) && typeof body.email === "string" ? body.email : "";
  const email = normaliseEmail(rawEmail);

  if (!email || email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return json({ code: "invalid_email", error: "Enter a valid email address." }, 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\\/+$/, "");
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminKey = process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publicKey || !adminKey) {
    return json({
      code: "server_not_configured",
      error: "Password reset is not fully configured on the server. Please try again later."
    }, 503);
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipAddress = forwardedFor || request.headers.get("x-real-ip") || "unknown";

  if (isRateLimited(ipAddress)) {
    return json(
      { code: "rate_limited", error: "Too many password reset attempts. Please wait 15 minutes and try again." },
      429,
      { "Retry-After": String(attemptWindowMs / 1000) }
    );
  }

  let exists: boolean | null;
  try {
    exists = await accountExists(supabaseUrl, adminKey, email);
  } catch {
    exists = null;
  }

  if (exists === null) {
    return json({
      code: "account_check_failed",
      error: "We couldn't check this account right now. Please try again later."
    }, 503);
  }

  if (!exists) {
    return json({
      code: "user_not_found",
      error: "No Portavero account was found with that email address. Check the address or create an account."
    }, 404);
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\\/+$/, "");
  const redirectTo = new URL("/account?reset=1", siteUrl);
  const recoveryUrl = new URL(`${supabaseUrl}/auth/v1/recover`);
  recoveryUrl.searchParams.set("redirect_to", redirectTo.toString());

  try {
    const response = await fetch(recoveryUrl, {
      method: "POST",
      headers: {
        apikey: publicKey,
        Authorization: `Bearer ${publicKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) {
      return json({
        code: "email_send_failed",
        error: "We found the account, but the password reset email could not be sent. Please try again later."
      }, 502);
    }
  } catch {
    return json({
      code: "email_send_failed",
      error: "We found the account, but the password reset email could not be sent. Please try again later."
    }, 502);
  }

  return json({ status: "sent" });
}
