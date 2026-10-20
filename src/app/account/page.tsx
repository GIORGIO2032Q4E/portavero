"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  deleteCloudEstimate,
  getSession,
  isAuthConfigured,
  listCloudEstimates,
  sendPasswordReset,
  setRecoverySessionFromUrlHash,
  updatePassword,
  signIn,
  signOut,
  signUp,
  type CloudEstimate,
  type PortaveroSession
} from "@/lib/auth";

export default function AccountPage() {
  const [session, setSession] = useState<PortaveroSession | null>(null);
  const [estimates, setEstimates] = useState<CloudEstimate[]>([]);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoverySession, setRecoverySession] = useState<PortaveroSession | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const configured = isAuthConfigured();

  const refreshAccount = useCallback(async () => {
    const current = await getSession();
    setSession(current);
    if (current) {
      try {
        setEstimates(await listCloudEstimates());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load saved estimates.");
      }
    } else {
      setEstimates([]);
    }
  }, []);

  useEffect(() => {
    async function initialise() {
      const recovery = await setRecoverySessionFromUrlHash();
      if (recovery) {
        setRecoverySession(recovery);
        setRecoveryMode(true);
        setMessage("Choose a new password for your account.");
      } else if (new URLSearchParams(window.location.search).get("reset") === "1") {
        setMessage("If the email address matches an account, a password reset link will arrive shortly.");
      }
      await refreshAccount();
    }
    void initialise();
  }, [refreshAccount]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (recoveryMode && recoverySession) {
        await updatePassword(newPassword, recoverySession.access_token);
        setRecoveryMode(false);
        setRecoverySession(null);
        setNewPassword("");
        await signOut();
        setSession(null);
        setMessage("Password updated. Sign in with your new password.");
      } else if (resetMode) {
        await sendPasswordReset(email.trim());
        setMessage("If the email address matches an account, a password reset link will arrive shortly.");
      } else if (mode === "signup") {
        const result = await signUp(email.trim(), password);
        if (result.session) {
          setMessage("Your account is ready.");
          setPassword("");
          await refreshAccount();
        } else {
          setMessage("Account created. Check your inbox to confirm your email, then sign in.");
          setPassword("");
        }
      } else {
        await signIn(email.trim(), password);
        setMessage("You are signed in.");
        setPassword("");
        await refreshAccount();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setError("");
    try {
      await signOut();
      setSession(null);
      setEstimates([]);
      setMessage("You have signed out.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign out.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteCloudEstimate(id);
      setEstimates((current) => current.filter((item) => item.id !== id));
      setMessage("Saved estimate deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the estimate.");
    }
  }

  function handleLoad(item: CloudEstimate) {
    try {
      const raw = window.localStorage.getItem("portavero-saved-estimates");
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const localEstimates = Array.isArray(parsed) ? parsed.filter((entry) => entry && typeof entry === "object") as Record<string, unknown>[] : [];
      const snapshot = { ...item.data, id: Date.now(), name: item.name, savedAt: item.updated_at };
      window.localStorage.setItem("portavero-saved-estimates", JSON.stringify([snapshot, ...localEstimates].slice(0, 10)));
      window.location.assign("/calculator");
    } catch {
      setError("Could not load this estimate into the current browser.");
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Your Portavero account</span>
          <h1>{session ? "Your import workspace." : "Keep your import plans together."}</h1>
          <p>Sign in to keep saved estimates connected to your account instead of only one browser.</p>
        </div>
      </section>
      <section className="section">
        <div className="container account-layout">
          {!configured ? (
            <section className="panel account-panel">
              <h2>One setup step first</h2>
              <p>Account security is handled by Supabase. The code is ready to connect, but the live account service needs a Supabase project URL and public anon key.</p>
              <ol>
                <li>Create a project at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Supabase</a>.</li>
                <li>Copy the project URL and anon/public key into your local environment and Vercel environment variables.</li>
                <li>Run the SQL in <code>supabase/schema.sql</code> in the Supabase SQL Editor.</li>
                <li>In Supabase Authentication settings, set the site URL and allow your Portavero preview/production URLs.</li>
              </ol>
              <div className="notice">Do not put a Supabase service-role key in browser code or commit secrets to GitHub.</div>
              <Link href="/how-it-works" className="button button-dark">Back to Portavero</Link>
            </section>
          ) : session ? (
            <section className="panel account-panel">
              <div className="account-heading">
                <div><span className="eyebrow">Signed in</span><h2>{session.user.email ?? "Portavero user"}</h2></div>
                <button type="button" className="button button-outline" disabled={busy} onClick={handleSignOut}>Sign out</button>
              </div>
              <p>Your estimates saved while signed in can be accessed from other devices using the same account.</p>
              <h3>Saved estimates ({estimates.length})</h3>
              {estimates.length === 0 ? <p className="empty-state">No cloud estimates yet. Open the import calculator and save an estimate while signed in.</p> : (
                <div className="account-estimate-list">
                  {estimates.map((item) => (
                    <div className="account-estimate" key={item.id}>
                      <div><strong>{item.name}</strong><small>Updated {new Date(item.updated_at).toLocaleDateString()}</small></div>
                      <div className="account-estimate-actions">
                        <button type="button" className="button button-outline button-small" onClick={() => handleLoad(item)}>Load</button>
                        <button type="button" className="button button-outline button-small" onClick={() => void handleDelete(item.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/calculator" className="button button-dark">Open import calculator</Link>
            </section>
          ) : (
            <section className="panel account-panel">
              <div className="account-heading"><div><span className="eyebrow">Secure access</span><h2>{recoveryMode ? "Choose a new password" : resetMode ? "Reset your password" : mode === "signup" ? "Create your account" : "Welcome back"}</h2></div></div>
              <p>{recoveryMode ? "Set a new password to finish recovering your account." : resetMode ? "We will email you a password reset link if this address has an account." : mode === "signup" ? "Create an account to keep your saved import estimates available across devices." : "Sign in to access your Portavero workspace."}</p>
              <form className="account-form" onSubmit={handleSubmit}>
                {!recoveryMode && <div className="field"><label htmlFor="account-email">Email address</label><input id="account-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></div>}
                {recoveryMode ? <div className="field"><label htmlFor="new-account-password">New password</label><input id="new-account-password" type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><small>Use at least 8 characters.</small></div> : !resetMode && <div className="field"><label htmlFor="account-password">Password</label><input id="account-password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /><small>Use at least 8 characters. Portavero never stores your password in its own database.</small></div>}
                {error && <p className="account-error" role="alert">{error}</p>}
                {message && <p className="account-message" role="status">{message}</p>}
                <button type="submit" className="button button-dark" disabled={busy}>{busy ? "Please wait…" : recoveryMode ? "Update password" : resetMode ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}</button>
              </form>
              <div className="account-switches">
                {!resetMode && !recoveryMode && <button type="button" className="text-button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); setError(""); }}>{mode === "signin" ? "New to Portavero? Create an account" : "Already have an account? Sign in"}</button>}
                {!recoveryMode && <button type="button" className="text-button" onClick={() => { setResetMode(!resetMode); setMessage(""); setError(""); }}>{resetMode ? "Back to sign in" : "Forgot your password?"}</button>}
                {recoveryMode && <button type="button" className="text-button" onClick={() => { setRecoveryMode(false); setRecoverySession(null); setResetMode(false); setMessage(""); }}>Back to sign in</button>}
              </div>
              <p className="account-privacy">By creating an account, you agree to the <Link href="/terms">Terms</Link> and acknowledge the <Link href="/privacy-policy">Privacy Policy.</Link></p>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
