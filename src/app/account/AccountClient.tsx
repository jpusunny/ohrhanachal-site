"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OH_API_PUBLIC = "http://api.52.162.164.124.sslip.io";

type Customer = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
};

type Order = {
  id: string;
  orderNo: string;
  status: string;
  placedAt: string;
  shippedAt: string | null;
  totalCents: number;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  lines: { snapshotTitle: string; quantity: number }[];
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting payment", paid: "Paid", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled",
};

function money(cents: number) { return "$" + (cents / 100).toFixed(2); }

export default function AccountClient() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch(`${OH_API_PUBLIC}/api/customer/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((body) => setCustomer(body.customer))
      .catch(() => setCustomer(null));
    fetch(`${OH_API_PUBLIC}/api/customer/orders`, { credentials: "include" })
      .then((r) => r.json())
      .then((body) => setOrders(body.orders || []))
      .catch(() => setOrders([]));
  }, []);

  async function logout() {
    await fetch(`${OH_API_PUBLIC}/api/customer/logout`, { method: "POST", credentials: "include" });
    setCustomer(null);
    router.push("/account/login");
    router.refresh();
  }

  if (customer === undefined) return <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>Loading…</p>;
  if (customer === null) return (
    <div className="framed" style={{ padding: 24, textAlign: "center" }}>
      <p>You&rsquo;re not signed in.</p>
      <p>
        <Link className="link-gold" href="/account/login">Sign in</Link>
        {" · "}
        <Link className="link-gold" href="/account/signup">Create an account</Link>
      </p>
    </div>
  );

  return (
    <>
      <div className="framed" style={{ padding: 20, marginBottom: 20 }}>
        <p style={{ margin: 0 }}>
          Signed in as <strong>{customer.name}</strong> ({customer.email}).
          <button onClick={logout} style={{ marginLeft: 12, background: "transparent", border: "none", color: "var(--gold-deep)", cursor: "pointer", textDecoration: "underline" }}>Sign out</button>
        </p>
      </div>

      <h2 style={{ fontFamily: "var(--display)", fontSize: "1.4rem", marginTop: 0 }}>
        Your orders
      </h2>

      {orders.length === 0 ? (
        <div className="framed" style={{ padding: 24, textAlign: "center" }}>
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>
            No orders yet. <Link className="link-gold" href="/collection">Browse seforim →</Link>
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <div key={o.id} className="framed" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "var(--ui)", fontSize: ".85rem", color: "var(--ink-soft)" }}>
                    {new Date(o.placedAt).toISOString().slice(0, 10)}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "1.05rem", marginTop: 4 }}>{o.orderNo}</div>
                  <div style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginTop: 4 }}>
                    {STATUS_LABEL[o.status] || o.status}
                    {o.shippedAt && ` · Shipped ${new Date(o.shippedAt).toISOString().slice(0, 10)}`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{money(o.totalCents)}</div>
                  <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>
                    {o.lines.reduce((n, l) => n + l.quantity, 0)} item{o.lines.reduce((n, l) => n + l.quantity, 0) === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: ".85rem" }}>
                {o.lines.slice(0, 4).map((l, i) => (
                  <span key={i}>
                    {i > 0 && " · "}{l.snapshotTitle} ×{l.quantity}
                  </span>
                ))}
                {o.lines.length > 4 && ` · +${o.lines.length - 4} more`}
              </div>
              <div style={{ marginTop: 10 }}>
                <Link className="link-gold" href={`/confirmation?orderNo=${encodeURIComponent(o.orderNo)}&email=${encodeURIComponent(customer.email)}`}>
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
