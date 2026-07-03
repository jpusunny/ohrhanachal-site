"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

function money(n: number) { return "$" + n.toFixed(2); }

export default function CheckoutClient() {
  const cart = useCart();
  const router = useRouter();
  const ship = cart.subtotal === 0 ? 0 : cart.subtotal >= 75 ? 0 : 6.95;
  const total = cart.subtotal + ship;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: Sola/Cardknox integration lands with roadmap #5.
    cart.clear();
    router.push("/confirmation");
  }

  return (
    <div className="pay">
      <div className="wrap">
        <form onSubmit={onSubmit}>
          <h1>Checkout</h1>
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>
            Ships free, direct from the press. Usually dispatched in 1–2 business days.
          </p>

          <div className="step">1 · Contact</div>
          <div className="field"><label>Email</label><input type="email" placeholder="you@email.com" required /></div>
          <div className="field"><label>Phone</label><input type="tel" placeholder="(000) 000-0000" /></div>

          <div className="step">2 · Shipping Address</div>
          <div className="row2">
            <div className="field"><label>First name</label><input required /></div>
            <div className="field"><label>Last name</label><input required /></div>
          </div>
          <div className="field"><label>Address</label><input placeholder="Street address" required /></div>
          <div className="field"><label>Apt / suite (optional)</label><input /></div>
          <div className="row3">
            <div className="field"><label>City</label><input required /></div>
            <div className="field"><label>State</label><input required /></div>
            <div className="field"><label>ZIP</label><input required /></div>
          </div>
          <div className="field"><label>Country</label>
            <select>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Israel</option>
              <option>Other</option>
            </select>
          </div>

          <div className="step">3 · Payment</div>
          <div className="field"><label>Card number</label><input placeholder="•••• •••• •••• ••••" inputMode="numeric" /></div>
          <div className="row3">
            <div className="field"><label>Expiry</label><input placeholder="MM / YY" /></div>
            <div className="field"><label>CVC</label><input placeholder="•••" /></div>
            <div className="field"><label>ZIP</label><input /></div>
          </div>

          <button className="btn btn--solid btn--block" type="submit" style={{ marginTop: 18 }}>
            Place Order
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
          <div className="s-row"><span>Shipping</span><b>{cart.subtotal === 0 ? "—" : ship === 0 ? "FREE" : money(ship)}</b></div>
          <div className="s-total"><span>Total</span><span>{money(total)}</span></div>
        </aside>
      </div>
    </div>
  );
}
