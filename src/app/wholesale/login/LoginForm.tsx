"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OH_API_PUBLIC = "https://api.52.162.164.124.sslip.io";

export default function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`${OH_API_PUBLIC}/api/wholesale/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.error === "account_suspended") setErr("Your account is suspended. Please contact the press.");
        else setErr("Invalid email or password.");
        return;
      }
      if (body.status !== "approved") {
        setErr("Your account is awaiting approval. We'll email you once it's active.");
        return;
      }
      router.push("/wholesale/account");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} className="framed" style={{ padding: 24 }}>
      <div className="field"><label>Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="field"><label>Password</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {err && <p style={{ color: "#a33" }}>{err}</p>}
      <button className="btn btn--solid btn--block" disabled={busy} type="submit">
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p style={{ textAlign: "center", marginTop: 12 }}>
        New here? <Link className="link-gold" href="/wholesale/signup">Open an account →</Link>
      </p>
    </form>
  );
}
