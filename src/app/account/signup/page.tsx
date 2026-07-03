import type { Metadata } from "next";
import Crown from "@/components/Crown";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an Ohr Hanachal account for faster checkout and order history.",
};

export default function AccountSignupPage() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 480 }}>
        <div className="center-head">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <span className="kicker">Account</span>
          <h1 className="h-display">Create an account</h1>
          <p>Faster checkout next time, plus your order history in one place.</p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
}
