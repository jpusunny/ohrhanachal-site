"use client";

import Link from "next/link";
import { useState } from "react";

const OH_API_PUBLIC = "https://api.52.162.164.124.sslip.io";

export default function SignupForm() {
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [taxId, setTaxId] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`${OH_API_PUBLIC}/api/wholesale/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          businessName: businessName.trim(),
          contactName: contactName.trim(),
          phone: phone.trim() || undefined,
          taxId: taxId.trim() || undefined,
          ship: { street: street.trim() || undefined, city: city.trim() || undefined, state: state.trim() || undefined, zip: zip.trim() || undefined },
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(body.error || "Sign up failed."); return; }
      setOk(true);
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (ok) {
    return (
      <div className="framed" style={{ padding: 24, textAlign: "center" }}>
        <h2 style={{ marginTop: 0 }}>Thanks — application received.</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          We&rsquo;ll email you at <strong>{email}</strong> once your account is approved. That&rsquo;s usually within one business day.
        </p>
        <p><Link className="link-gold" href="/wholesale/login">Sign in →</Link></p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="framed" style={{ padding: 24 }}>
      <div className="row2">
        <div className="field"><label>Business / mosad name</label>
          <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></div>
        <div className="field"><label>Contact name</label>
          <input required value={contactName} onChange={(e) => setContactName(e.target.value)} /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label>Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Password (8+ characters)</label>
          <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div className="field"><label>Tax ID (optional)</label>
          <input value={taxId} onChange={(e) => setTaxId(e.target.value)} /></div>
      </div>
      <div className="field"><label>Ship-to street (optional)</label>
        <input value={street} onChange={(e) => setStreet(e.target.value)} /></div>
      <div className="row3">
        <div className="field"><label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} /></div>
        <div className="field"><label>State</label>
          <input value={state} onChange={(e) => setState(e.target.value)} /></div>
        <div className="field"><label>ZIP</label>
          <input value={zip} onChange={(e) => setZip(e.target.value)} /></div>
      </div>
      {err && <p style={{ color: "#a33" }}>{err}</p>}
      <button className="btn btn--solid btn--block" disabled={busy} type="submit">
        {busy ? "Submitting…" : "Submit application"}
      </button>
      <p style={{ textAlign: "center", marginTop: 12 }}>
        Already have an account? <Link className="link-gold" href="/wholesale/login">Sign in →</Link>
      </p>
    </form>
  );
}
