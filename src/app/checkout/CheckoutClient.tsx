"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";

function money(n: number) { return "$" + n.toFixed(2); }

type PaymentPref = "contact_me" | "invoice" | "phone" | "in_person";

const PREF_OPTIONS: { value: PaymentPref; title: string; note: string }[] = [
  { value: "contact_me", title: "Contact me for payment details",
    note: "We'll email/call within one business day to arrange payment however works for you." },
  { value: "invoice", title: "Invoice me — I'll pay by check or wire",
    note: "You'll get an invoice with pay-to information; we ship as soon as it clears." },
  { value: "phone", title: "I'll call in with my card",
    note: "We'll follow up with a phone number to reach the press directly." },
  { value: "in_person", title: "Pay on pickup / delivery",
    note: "For local orders only — no shipping charge, cash or card on hand-off." },
];

export default function CheckoutClient() {
  const cart = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");
  const [paymentPref, setPaymentPref] = useState<PaymentPref>("contact_me");
  const [note, setNote] = useState("");

  const ship = useMemo(() => {
    if (cart.subtotal === 0) return 0;
    if (paymentPref === "in_person") return 0;
    return cart.subtotal >= 75 ? 0 : 6.95;
  }, [cart.subtotal, paymentPref]);
  const total = cart.subtotal + ship;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.lines.length === 0) { setErr("Your cart is empty."); return; }
    setErr(null); setBusy(true);
    try {
      const payload = {
        customer: {
          email: email.trim().toLowerCase(),
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          phone: phone.trim() || undefined,
        },
        shipping: {
          street: street.trim(),
          street2: street2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          zip: zip.trim(),
          country,
        },
        paymentPref,
        note: note.trim() || undefined,
        lines: cart.lines.map((l) => ({ variantId: l.variantId, quantity: l.qty })),
      };
      const OH_API_PUBLIC = "http://api.52.162.164.124.sslip.io"; // browser-side URL
      const res = await fetch(`${OH_API_PUBLIC}/api/storefront/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.error === "unavailable" && Array.isArray(body.unavailable)) {
          setErr("Some items are no longer available: " + body.unavailable.map((u: { reason: string }) => u.reason).join("; "));
        } else {
          setErr(body.error || "We couldn't place your order. Please try again.");
        }
        return;
      }
      cart.clear();
      router.push(`/confirmation?orderNo=${encodeURIComponent(body.orderNo)}&email=${encodeURIComponent(payload.customer.email)}`);
    } catch {
      setErr("Network error placing your order.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pay">
      <div className="wrap">
        <form onSubmit={onSubmit}>
          <h1>Checkout</h1>
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>
            Ships free, direct from the press. No card up front — we&rsquo;ll be in touch to arrange payment.
          </p>

          <div className="step">1 · Contact</div>
          <div className="row2">
            <div className="field"><label>First name</label>
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
            <div className="field"><label>Last name</label>
              <input required value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          </div>
          <div className="field"><label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></div>
          <div className="field"><label>Phone (helpful — we may call)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(000) 000-0000" /></div>

          <div className="step">2 · Shipping address</div>
          <div className="field"><label>Address</label>
            <input required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street address" /></div>
          <div className="field"><label>Apt / suite (optional)</label>
            <input value={street2} onChange={(e) => setStreet2(e.target.value)} /></div>
          <div className="row3">
            <div className="field"><label>City</label>
              <input required value={city} onChange={(e) => setCity(e.target.value)} /></div>
            <div className="field"><label>State</label>
              <input required value={state} onChange={(e) => setState(e.target.value)} /></div>
            <div className="field"><label>ZIP</label>
              <input required value={zip} onChange={(e) => setZip(e.target.value)} /></div>
          </div>
          <div className="field"><label>Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Israel</option>
              <option>Other</option>
            </select>
          </div>

          <div className="step">3 · How would you like to pay?</div>
          <div style={{ display: "grid", gap: 10 }}>
            {PREF_OPTIONS.map((opt) => (
              <label key={opt.value} className={"framed"}
                style={{
                  padding: "10px 14px",
                  display: "block",
                  cursor: "pointer",
                  borderColor: paymentPref === opt.value ? "var(--gold-deep)" : undefined,
                  background: paymentPref === opt.value ? "rgba(212,181,113,0.08)" : undefined,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="radio" name="paymentPref" value={opt.value} checked={paymentPref === opt.value}
                    onChange={() => setPaymentPref(opt.value)} />
                  <strong style={{ fontFamily: "var(--ui)", fontSize: ".92rem" }}>{opt.title}</strong>
                </div>
                <p style={{ margin: "4px 0 0 26px", color: "var(--ink-soft)", fontSize: ".8rem" }}>{opt.note}</p>
              </label>
            ))}
          </div>

          <div className="field" style={{ marginTop: 18 }}>
            <label>Note for us (optional)</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Gift wrap, best time to call, delivery notes" />
          </div>

          {err && <p style={{ color: "#a33", marginTop: 12 }}>{err}</p>}

          <button className="btn btn--solid btn--block" type="submit" disabled={busy || cart.lines.length === 0}
            style={{ marginTop: 18 }}>
            {busy ? "Placing your order…" : `Place order — ${money(total)}`}
          </button>
          <p style={{ textAlign: "center", marginTop: 14 }}>
            <Link className="link-gold" href="/collection">← Continue shopping</Link>
          </p>
        </form>

        <aside className="summary framed">
          <h3>Order Summary</h3>
          <div className="s-items">
            {cart.lines.length === 0 ? (
              <p style={{ color: "var(--ink-soft)" }}>
                Your cart is empty. <Link className="link-gold" href="/collection">Browse seforim →</Link>
              </p>
            ) : (
              cart.lines.map((l) => (
                <div className="s-row" key={l.variantId}>
                  <span>{l.title} <b style={{ color: "var(--gold-deep)" }}>×{l.qty}</b></span>
                  <b>{money(l.price * l.qty)}</b>
                </div>
              ))
            )}
          </div>
          <div className="s-row"><span>Subtotal</span><b>{money(cart.subtotal)}</b></div>
          <div className="s-row">
            <span>Shipping</span>
            <b>{cart.subtotal === 0 ? "—" : ship === 0 ? "FREE" : money(ship)}</b>
          </div>
          <div className="s-total"><span>Total</span><span>{money(total)}</span></div>
          <p style={{ marginTop: 10, fontSize: ".78rem", color: "var(--ink-soft)" }}>
            No card charged today. We&rsquo;ll follow up to arrange payment before shipping.
          </p>
        </aside>
      </div>
    </div>
  );
}
