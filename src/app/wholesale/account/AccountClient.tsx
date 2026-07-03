"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OH_API_PUBLIC = "http://api.52.162.164.124.sslip.io";

type Account = {
  id: string;
  email: string;
  businessName: string;
  contactName: string;
  status: "pending" | "approved" | "suspended";
};

export default function AccountClient() {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null | undefined>(undefined);

  useEffect(() => {
    fetch(`${OH_API_PUBLIC}/api/wholesale/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((body) => setAccount(body.account))
      .catch(() => setAccount(null));
  }, []);

  async function logout() {
    await fetch(`${OH_API_PUBLIC}/api/wholesale/logout`, { method: "POST", credentials: "include" });
    setAccount(null);
    router.push("/wholesale/login");
    router.refresh();
  }

  if (account === undefined) return <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>Loading…</p>;
  if (account === null) return (
    <div className="framed" style={{ padding: 24, textAlign: "center" }}>
      <p>You&rsquo;re not signed in.</p>
      <p>
        <Link className="link-gold" href="/wholesale/login">Sign in</Link>
        {" · "}
        <Link className="link-gold" href="/wholesale/signup">Open an account</Link>
      </p>
    </div>
  );

  return (
    <div className="framed" style={{ padding: 24 }}>
      <p style={{ marginTop: 0 }}>
        Signed in as <strong>{account.contactName}</strong> ({account.email}) for <strong>{account.businessName}</strong>.
      </p>
      {account.status === "pending" && (
        <p style={{ background: "rgba(212,181,113,0.15)", padding: 12, borderRadius: 3 }}>
          Your account is <strong>pending approval</strong>. Retail prices apply until we approve you — we&rsquo;ll email you when that&rsquo;s done.
        </p>
      )}
      {account.status === "approved" && (
        <p style={{ background: "rgba(90,150,90,0.10)", padding: 12, borderRadius: 3 }}>
          <strong>Wholesale pricing is active.</strong> Browse the catalog — prices you see reflect your negotiated rates.
          Orders will be invoiced (net-30).
        </p>
      )}
      {account.status === "suspended" && (
        <p style={{ background: "rgba(200,80,80,0.10)", padding: 12, borderRadius: 3 }}>
          Your account is <strong>suspended</strong>. Please contact the press to reactivate.
        </p>
      )}

      <div style={{ marginTop: 18, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link className="btn btn--solid" href="/collection">Browse catalog</Link>
        <button className="btn" onClick={logout} style={{ background: "transparent" }}>Sign out</button>
      </div>
    </div>
  );
}
