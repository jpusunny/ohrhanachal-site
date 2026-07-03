import type { Metadata } from "next";
import Crown from "@/components/Crown";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your Ohr Hanachal account — order history and details.",
};

export default function AccountPage() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 840 }}>
        <div className="center-head">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <span className="kicker">Account</span>
          <h1 className="h-display">Your account</h1>
        </div>
        <AccountClient />
      </div>
    </section>
  );
}
