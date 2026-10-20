const storageKey = "portavero-auth-session";

export type PortaveroUser = {
  id: string;
  email?: string;
};

export type PortaveroSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  token_type?: string;
  user: PortaveroUser;
};

export type CloudEstimate = {
  id: string;
  name: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isAuthConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

function config() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Accounts are not configured yet. Add the Supabase URL and anon key to the deployment environment.");
  }
  return { url: supabaseUrl, key: supabaseKey };
}

function normaliseSession(value: Record<string, unknown>): PortaveroSession | null {
  if (typeof value.access_token !== "string" || typeof value.refresh_token !== "string" || !value.user || typeof value.user !== "object") {
    return null;
  }
  const user = value.user as Record<string, unknown>;
  if (typeof user.id !== "string") return null;
  const expiresAt = typeof value.expires_at === "number"
    ? value.expires_at
    : typeof value.expires_in === "number" ? Math.floor(Date.now() / 1000) + value.expires_in : undefined;
  return {
    access_token: value.access_token,
    refresh_token: value.refresh_token,
    expires_at: expiresAt,
    token_type: typeof value.token_type === "string" ? value.token_type : "bearer",
    user: { id: user.id, email: typeof user.email === "string" ? user.email : undefined }
  };
}

export function readStoredSession(): PortaveroSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    return normaliseSession(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return null;
  }
}

function storeSession(session: PortaveroSession | null) {
  if (typeof window === "undefined") return;
  if (!session) window.localStorage.removeItem(storageKey);
  else window.localStorage.setItem(storageKey, JSON.stringify(session));
}

async function authRequest(path: string, body?: Record<string, unknown>, accessToken?: string) {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${accessToken ?? key}`,
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store"
  });
  const result = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    const message = typeof result.msg === "string" ? result.msg
      : typeof result.message === "string" ? result.message
      : typeof result.error_description === "string" ? result.error_description
      : typeof result.error === "string" ? result.error
      : "Authentication request failed.";
    throw new Error(message);
  }
  return result;
}

export async function signUp(email: string, password: string) {
  const redirect = typeof window !== "undefined" ? `?redirect_to=${encodeURIComponent(`${window.location.origin}/account`)}` : "";
  const result = await authRequest(`signup${redirect}`, { email, password });
  const session = result.session && typeof result.session === "object"
    ? normaliseSession(result.session as Record<string, unknown>)
    : normaliseSession(result);
  if (session) storeSession(session);
  return { session, user: result.user };
}

export async function signIn(email: string, password: string) {
  const result = await authRequest("token?grant_type=password", { email, password });
  const session = normaliseSession(result);
  if (!session) throw new Error("Sign-in succeeded but no session was returned. Check whether email confirmation is required.");
  storeSession(session);
  return session;
}

export async function signOut() {
  const session = await getSession();
  if (session) {
    try {
      await authRequest("logout", {}, session.access_token);
    } finally {
      storeSession(null);
    }
  } else {
    storeSession(null);
  }
}

export async function updatePassword(password: string, accessToken: string) {
  const { url, key } = config();
  const response = await fetch(url + "/auth/v1/user", {
    method: "PUT",
    headers: { apikey: key, Authorization: "Bearer " + accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    cache: "no-store"
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error(typeof result.message === "string" ? result.message : "Could not update password.");
  }
}

export async function setRecoverySessionFromUrlHash() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  if (params.get("type") !== "recovery") return null;
  const result: Record<string, unknown> = {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    token_type: params.get("token_type") ?? "bearer",
    expires_in: Number(params.get("expires_in") ?? 3600),
    user: { id: params.get("user_id") ?? "recovery" }
  };
  const session = normaliseSession(result);
  if (!session) return null;
  storeSession(session);
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  return session;
}

export async function sendPasswordReset(email: string) {
  const { url, key } = config();
  const redirect = typeof window !== "undefined" ? `${window.location.origin}/account?reset=1` : undefined;
  const response = await fetch(`${url}/auth/v1/recover${redirect ? `?redirect_to=${encodeURIComponent(redirect)}` : ""}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store"
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error(typeof result.message === "string" ? result.message : "Could not send password reset email.");
  }
}

export async function getSession(): Promise<PortaveroSession | null> {
  const session = readStoredSession();
  if (!session) return null;
  if (!session.expires_at || session.expires_at > Math.floor(Date.now() / 1000) + 60) return session;
  try {
    const result = await authRequest("token?grant_type=refresh_token", { refresh_token: session.refresh_token });
    const refreshed = normaliseSession(result);
    storeSession(refreshed);
    return refreshed;
  } catch {
    storeSession(null);
    return null;
  }
}

async function databaseRequest<T>(path: string, method: "GET" | "POST" | "DELETE", session: PortaveroSession, body?: Record<string, unknown>): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(method === "POST" ? { Prefer: "return=representation" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store"
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error(typeof result.message === "string" ? result.message : "Could not access your saved estimates.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function listCloudEstimates() {
  const session = await getSession();
  if (!session) return [];
  return databaseRequest<CloudEstimate[]>("saved_estimates?select=id,name,data,created_at,updated_at&order=updated_at.desc", "GET", session);
}

export async function saveCloudEstimate(name: string, data: Record<string, unknown>) {
  const session = await getSession();
  if (!session) return false;
  await databaseRequest<CloudEstimate[]>("saved_estimates", "POST", session, { name, data, user_id: session.user.id });
  return true;
}

export async function deleteCloudEstimate(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Sign in to manage your saved estimates.");
  await databaseRequest<undefined>(`saved_estimates?id=eq.${encodeURIComponent(id)}`, "DELETE", session);
}
