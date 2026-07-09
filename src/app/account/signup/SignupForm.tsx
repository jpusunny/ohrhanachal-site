"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OH_API_PUBLIC = "https://api.52.162.164.124.sslip.io";

export default function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`${OH_API_PUBLIC}/api/customer/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
          phone: phone.trim() || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.error === "email_in_use") setErr("An account with that email already exists — try signing in.");
        else setErr(body.error || "Sign up failed.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch { setErr("Network error."); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} className="framed" style={{ padding: 24 }}>
      <div className="field"><label>Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label>Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="field"><label>Password (8+ characters)</label>
        <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <div className="field"><label>Phone (optional)</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      {err && <p style={{ color: "#a33" }}>{err}</p>}
      <button className="btn btn--solid btn--block" disabled={busy} type="submit">
        {busy ? "Creating…" : "Create account"}
      </button>
      <p style={{ textAlign: "center", marginTop: 12 }}>
        Already registered? <Link className="link-gold" href="/account/login">Sign in →</Link>
      </p>
    </form>
  );
}
