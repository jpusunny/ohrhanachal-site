import type { Metadata } from "next";
import Crown from "@/components/Crown";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Wholesale account",
  description: "Your Ohr Hanachal wholesale account.",
};

export default function WholesaleAccountPage() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="center-head">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <span className="kicker">Wholesale</span>
          <h1 className="h-display">Your account</h1>
        </div>
        <AccountClient />
      </div>
    </section>
  );
}
