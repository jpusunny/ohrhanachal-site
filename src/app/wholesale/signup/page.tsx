import type { Metadata } from "next";
import Crown from "@/components/Crown";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Wholesale sign up",
  description: "Create a wholesale account for your mosad — request approval to see wholesale pricing.",
};

export default function WholesaleSignupPage() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="center-head">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <span className="kicker">Wholesale</span>
          <h1 className="h-display">Open a wholesale account</h1>
          <p>Tell us about your mosad and we&rsquo;ll review your application. Once approved, sign in to see wholesale pricing on the catalog and order on net-30 terms.</p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
}
