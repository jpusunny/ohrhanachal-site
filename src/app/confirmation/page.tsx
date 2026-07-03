import Link from "next/link";
import type { Metadata } from "next";
import Crown from "@/components/Crown";
import { fetchOrder, money, type StorefrontOrder } from "@/lib/api";
import OrderLookupForm from "./OrderLookupForm";

export const metadata: Metadata = {
  title: "Order status",
  description: "Look up an Ohr Hanachal order — placed, paid, or shipped.",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Placed — awaiting payment",
  paid: "Paid — preparing to ship",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "var(--gold-deep)",
  paid: "#1e3a8a",
  shipped: "#6d28d9",
  delivered: "#166534",
  cancelled: "#6b7280",
};

const PREF_LABEL: Record<string, string> = {
  contact_me: "We'll contact you for payment details",
  invoice: "You'll pay by check/wire",
  phone: "You'll call in with your card",
  in_person: "Pay on pickup / delivery",
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const orderNo = typeof sp.orderNo === "string" ? sp.orderNo : undefined;
  const email = typeof sp.email === "string" ? sp.email : undefined;

  if (!orderNo || !email) {
    return (
      <section className="block">
        <div className="wrap" style={{ maxWidth: 520 }}>
          <div className="center-head">
            <span className="kicker">Order lookup</span>
            <h1 className="h-display" style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", marginBottom: 6 }}>
              Find your order
            </h1>
            <p style={{ color: "var(--ink-soft)" }}>
              Enter your order number and the email you used to place it.
            </p>
          </div>
          <OrderLookupForm />
        </div>
      </section>
    );
  }

  const order = await fetchOrder(orderNo, email).catch(() => null);
  if (!order) return <NotFound orderNo={orderNo} />;

  return <OrderReceipt order={order} />;
}

function OrderReceipt({ order }: { order: StorefrontOrder }) {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="center-head" style={{ marginBottom: 14 }}>
          <div className="ornament">
            <span className="rule" /><Crown className="crown" style={{ width: 46 }} /><span className="rule r" />
          </div>
          <span className="kicker" style={{ display: "block", marginTop: 16 }}>{STATUS_LABEL[order.status] || order.status}</span>
          <h1 className="h-display" style={{ fontSize: "clamp(2.2rem,4vw,3rem)", margin: "8px 0 6px" }}>
            {order.status === "pending"
              ? "A shapt nachas — your seforim are set aside."
              : order.status === "paid"
                ? "Payment received — packing now."
                : order.status === "shipped"
                  ? "Your seforim are on the way."
                  : order.status === "delivered"
                    ? "Delivered — beteavon on the learning."
                    : "This order was cancelled."}
          </h1>
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>
            {order.status === "pending" && `We'll be in touch within one business day — ${PREF_LABEL[order.paymentPref] || order.paymentPref}.`}
            {order.status === "paid" && "We'll email you tracking as soon as it ships."}
            {order.status === "shipped" && order.trackingNumber && (
              <>Tracking: <strong>{order.trackingCarrier}</strong> · <span style={{ fontFamily: "monospace" }}>{order.trackingNumber}</span></>
            )}
          </p>
          <p style={{
            fontFamily: "var(--ui)", fontSize: ".8rem", letterSpacing: ".1em",
            textTransform: "uppercase", color: STATUS_COLOR[order.status] || "var(--gold-deep)",
            marginTop: 18,
          }}>
            Order <b>#{order.orderNo}</b>
          </p>
        </div>

        <div className="summary framed" style={{ textAlign: "left", position: "static", margin: "20px auto 0", maxWidth: 620 }}>
          <h3>What you ordered</h3>
          <div className="s-items">
            {order.lines.map((l) => (
              <div className="s-row" key={l.id}>
                <span>
                  {l.title}{l.variantName && l.variantName !== "Default" && ` — ${l.variantName}`}
                  {" "}<b style={{ color: "var(--gold-deep)" }}>×{l.quantity}</b>
                </span>
                <b>{money(l.lineTotalCents)}</b>
              </div>
            ))}
          </div>
          <div className="s-row"><span>Subtotal</span><b>{money(order.subtotalCents)}</b></div>
          <div className="s-row"><span>Shipping</span><b>{order.shippingCents === 0 ? "FREE" : money(order.shippingCents)}</b></div>
          <div className="s-total"><span>Total</span><span>{money(order.totalCents)}</span></div>
        </div>

        <div className="summary framed" style={{ textAlign: "left", position: "static", margin: "20px auto 0", maxWidth: 620 }}>
          <h3>Ship to</h3>
          <p style={{ margin: 0 }}>
            {order.customerName}<br />
            {order.shipping.street}
            {order.shipping.street2 && <>< br />{order.shipping.street2}</>}
            <br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
            {order.shipping.country}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <Link className="btn btn--solid" href="/collection">Continue shopping</Link>
          <Link className="btn btn--outline" href="/about">About the press</Link>
        </div>
      </div>
    </section>
  );
}

function NotFound({ orderNo }: { orderNo: string }) {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 520 }}>
        <div className="center-head">
          <span className="kicker">Order lookup</span>
          <h1 className="h-display" style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", marginBottom: 6 }}>
            We couldn&rsquo;t find that order.
          </h1>
          <p style={{ color: "var(--ink-soft)" }}>
            Double-check the order number ({orderNo}) and email address — they need to match exactly.
          </p>
        </div>
        <OrderLookupForm defaultOrderNo={orderNo} />
      </div>
    </section>
  );
}
