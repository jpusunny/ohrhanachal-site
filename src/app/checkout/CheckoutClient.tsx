"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";

// Types for the parts of Cardknox iFields we call.
declare global {
  interface Window {
    setAccount?: (name: string, version: string, key: string) => void;
    setIfieldStyle?: (fieldName: string, style: Record<string, string>) => void;
    enableAutoFormatting?: () => void;
    getTokens?: (
      onSuccess: () => void,
      onError: (msg: string) => void,
      timeoutMs?: number,
    ) => void;
  }
}

const IFIELDS_SCRIPT = "https://cdn.cardknox.com/ifields/2.16.2412.0801/ifields.min.js";
const OH_API_PUBLIC = "http://api.52.162.164.124.sslip.io"; // browser-side URL

function money(n: number) { return "$" + n.toFixed(2); }

type PaymentPref = "contact_me" | "invoice" | "phone" | "in_person" | "card";

const PREF_OPTIONS: { value: PaymentPref; title: string; note: string }[] = [
  { value: "card", title: "Pay by credit card now",
    note: "Secure checkout via Sola/Cardknox. Your card is charged immediately and we ship as soon as we pack." },
  { value: "contact_me", title: "Contact me for payment details",
    note: "We'll email/call within one business day to arrange payment however works for you." },
  { value: "invoice", title: "Invoice me — I'll pay by check or wire",
    note: "You'll get an invoice with pay-to information; we ship as soon as it clears." },
  { value: "phone", title: "I'll call in with my card",
    note: "We'll follow up with a phone number to reach the press directly." },
  { value: "in_person", title: "Pay on pickup / delivery",
    note: "For local orders only — no shipping charge, cash or card on hand-off." },
];

type PaymentConfig = { enabled: boolean; mode: "sandbox" | "live"; iFieldsKey: string };

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
  const [payConfig, setPayConfig] = useState<PaymentConfig | null>(null);
  const [ifieldsReady, setIfieldsReady] = useState(false);
  const [wholesale, setWholesale] = useState<{ status: string; businessName: string } | null>(null);
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cardholder, setCardholder] = useState("");

  // Fetch whether card payment is available. If not, drop the "card" option.
  useEffect(() => {
    fetch(`${OH_API_PUBLIC}/api/storefront/payment-config`)
      .then((r) => r.json())
      .then((c: PaymentConfig) => {
        setPayConfig(c);
        if (!c.enabled && paymentPref === "card") setPaymentPref("contact_me");
      })
      .catch(() => setPayConfig({ enabled: false, mode: "sandbox", iFieldsKey: "" }));
  }, [paymentPref]);

  // Check for a wholesale session so we can flag the customer that they're
  // paying wholesale (server enforces the pricing regardless).
  useEffect(() => {
    fetch(`${OH_API_PUBLIC}/api/wholesale/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((body) => {
        if (body.account?.status === "approved") setWholesale({ status: body.account.status, businessName: body.account.businessName });
      })
      .catch(() => {});
  }, []);

  // Initialize iFields once the script has loaded AND we have a key.
  useEffect(() => {
    if (!ifieldsReady || !payConfig?.enabled || !window.setAccount) return;
    try {
      window.setAccount("OhrHanachal", "1.0", payConfig.iFieldsKey);
      window.enableAutoFormatting?.();
      const style = {
        width: "100%", height: "42px", padding: "8px 12px",
        border: "1px solid #d6cfbe", "border-radius": "3px",
        "font-family": "system-ui, sans-serif", "font-size": "15px",
      };
      window.setIfieldStyle?.("card-number", style);
      window.setIfieldStyle?.("cvv", style);
    } catch (e) {
      console.error("iFields init failed", e);
    }
  }, [ifieldsReady, payConfig]);

  const ship = useMemo(() => {
    if (cart.subtotal === 0) return 0;
    if (paymentPref === "in_person") return 0;
    return cart.subtotal >= 75 ? 0 : 6.95;
  }, [cart.subtotal, paymentPref]);
  const total = cart.subtotal + ship;

  async function tokenizeCard(): Promise<string> {
    // iFields writes the token into hidden input[name="xToken"] after a successful
    // getTokens() call. We wrap the callback API in a promise.
    if (!window.getTokens) throw new Error("Card fields are still loading — please wait a moment.");
    return new Promise<string>((resolve, reject) => {
      window.getTokens!(
        () => {
          const el = document.querySelector<HTMLInputElement>('input[data-ifields-id="card-number-token"]');
          const t = el?.value || "";
          if (!t) reject(new Error("Card token was not returned. Double-check the card number."));
          else resolve(t);
        },
        (msg: string) => reject(new Error(msg || "Card validation failed.")),
        15000,
      );
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.lines.length === 0) { setErr("Your cart is empty."); return; }
    setErr(null); setBusy(true);
    try {
      let cardknoxToken: string | undefined;
      if (paymentPref === "card") {
        if (!cardholder.trim()) throw new Error("Cardholder name is required.");
        if (!/^\d{1,2}$/.test(expMonth) || !/^\d{2,4}$/.test(expYear)) throw new Error("Enter card expiry as MM / YY.");
        cardknoxToken = await tokenizeCard();
      }
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
        cardknoxToken,
        note: note.trim() || undefined,
        lines: cart.lines.map((l) => ({ variantId: l.variantId, quantity: l.qty })),
      };
      const res = await fetch(`${OH_API_PUBLIC}/api/storefront/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.error === "unavailable" && Array.isArray(body.unavailable)) {
          setErr("Some items are no longer available: " + body.unavailable.map((u: { reason: string }) => u.reason).join("; "));
        } else if (body.error === "card_declined") {
          setErr(`Card declined: ${body.details || "please try a different card"}.`);
        } else {
          setErr(body.error || "We couldn't place your order. Please try again.");
        }
        return;
      }
      cart.clear();
      router.push(`/confirmation?orderNo=${encodeURIComponent(body.orderNo)}&email=${encodeURIComponent(payload.customer.email)}`);
    } catch (e) {
      setErr((e as Error).message || "Network error placing your order.");
    } finally {
      setBusy(false);
    }
  }

  const visiblePrefOptions = PREF_OPTIONS.filter((o) => o.value !== "card" || payConfig?.enabled);

  return (
    <div className="pay">
      {payConfig?.enabled && (
        <Script src={IFIELDS_SCRIPT} strategy="afterInteractive" onLoad={() => setIfieldsReady(true)} />
      )}
      <div className="wrap">
        <form onSubmit={onSubmit}>
          <h1>Checkout</h1>
          {wholesale && (
            <div style={{ background: "rgba(212,181,113,0.15)", border: "1px solid var(--gold-lt)", padding: 12, borderRadius: 3, marginBottom: 12 }}>
              <strong>Wholesale account:</strong> {wholesale.businessName}. Prices will be recalculated at your wholesale rate on the server;
              order will be invoiced (net-30).
            </div>
          )}
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>
            {payConfig?.enabled
              ? "Ships free over $75, direct from the press. Pay by card at checkout or ask us to invoice you."
              : "Ships free over $75, direct from the press. No card up front — we’ll be in touch to arrange payment."}
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
            {visiblePrefOptions.map((opt) => (
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
                  {opt.value === "card" && payConfig?.mode === "sandbox" && (
                    <span style={{ fontSize: ".7rem", color: "#a06614", background: "rgba(212,181,113,0.15)", padding: "2px 8px", borderRadius: 3 }}>
                      SANDBOX
                    </span>
                  )}
                </div>
                <p style={{ margin: "4px 0 0 26px", color: "var(--ink-soft)", fontSize: ".8rem" }}>{opt.note}</p>
              </label>
            ))}
          </div>

          {paymentPref === "card" && payConfig?.enabled && (
            <div className="framed" style={{ padding: 16, marginTop: 16 }}>
              <div className="field">
                <label>Cardholder name</label>
                <input required value={cardholder} onChange={(e) => setCardholder(e.target.value)} placeholder="As it appears on the card" />
              </div>
              <div className="field">
                <label>Card number</label>
                {ifieldsReady ? (
                  <iframe title="Card number"
                    {...({ "data-ifields-id": "card-number", "data-ifields-placeholder": "•••• •••• •••• ••••" } as Record<string, string>)}
                    src="about:blank"
                    style={{ width: "100%", height: 44, border: "1px solid #d6cfbe", borderRadius: 3, background: "#fff" }} />
                ) : (
                  <div style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>Loading secure card entry…</div>
                )}
                <input type="hidden" data-ifields-id="card-number-token" name="xToken" />
              </div>
              <div className="row3">
                <div className="field">
                  <label>Exp month</label>
                  <input inputMode="numeric" maxLength={2} value={expMonth} onChange={(e) => setExpMonth(e.target.value)} placeholder="MM" />
                </div>
                <div className="field">
                  <label>Exp year</label>
                  <input inputMode="numeric" maxLength={4} value={expYear} onChange={(e) => setExpYear(e.target.value)} placeholder="YY" />
                </div>
                <div className="field">
                  <label>CVV</label>
                  <input inputMode="numeric" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="•••" />
                </div>
              </div>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: ".75rem" }}>
                Card number is captured directly by Cardknox&rsquo;s PCI-compliant iField — the number never touches our server.
              </p>
            </div>
          )}

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
            {paymentPref === "card"
              ? "Your card will be charged when you click Place order."
              : "No card charged today. We’ll follow up to arrange payment before shipping."}
          </p>
        </aside>
      </div>
    </div>
  );
}
