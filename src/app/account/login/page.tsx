import type { Metadata } from "next";
import Crown from "@/components/Crown";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Ohr Hanachal account.",
};

export default function AccountLoginPage() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 480 }}>
        <div className="center-head">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <span className="kicker">Account</span>
          <h1 className="h-display">Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
