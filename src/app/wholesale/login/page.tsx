import type { Metadata } from "next";
import Crown from "@/components/Crown";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Wholesale sign in",
  description: "Sign in to your Ohr Hanachal wholesale account.",
};

export default function WholesaleLoginPage() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 480 }}>
        <div className="center-head">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <span className="kicker">Wholesale</span>
          <h1 className="h-display">Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
