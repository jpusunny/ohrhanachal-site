import Link from "next/link";
import type { Metadata } from "next";
import Crown from "@/components/Crown";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you — your Ohr Hanachal order has been placed.",
};

export default function ConfirmationPage() {
  const orderNo = "#OH-" + Math.floor(100000 + Math.random() * 900000);
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 640, textAlign: "center" }}>
        <div className="ornament"><span className="rule" /><Crown className="crown" style={{ width: 46 }} /><span className="rule r" /></div>
        <span className="kicker" style={{ display: "block", marginTop: 16 }}>Order Confirmed</span>
        <h1 className="h-display" style={{ fontSize: "clamp(2.2rem,4vw,3rem)", margin: "8px 0 6px" }}>
          A shapt nachas — your seforim are on the way.
        </h1>
        <p style={{ color: "var(--ink-soft)", margin: 0 }}>
          We&rsquo;ve emailed your receipt. Orders ship direct from the press, usually within 1–2 business days.
        </p>
        <p style={{ fontFamily: "var(--ui)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold-deep)", marginTop: 18 }}>
          Order <b>{orderNo}</b>
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <Link className="btn btn--solid" href="/collection">Continue Shopping</Link>
          <Link className="btn btn--outline" href="/about">About the Press</Link>
        </div>
      </div>
    </section>
  );
}
