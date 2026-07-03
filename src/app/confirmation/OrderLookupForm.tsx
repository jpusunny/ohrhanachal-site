"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderLookupForm({ defaultOrderNo = "" }: { defaultOrderNo?: string }) {
  const router = useRouter();
  const [orderNo, setOrderNo] = useState(defaultOrderNo);
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNo.trim() || !email.trim()) return;
    const qs = new URLSearchParams({ orderNo: orderNo.trim(), email: email.trim() });
    router.push(`/confirmation?${qs.toString()}`);
  }
  return (
    <form className="inquiry framed" onSubmit={onSubmit} style={{ maxWidth: 480, margin: "20px auto" }}>
      <div className="field">
        <label>Order number</label>
        <input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} placeholder="OH-100123" required />
      </div>
      <div className="field">
        <label>Email address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn--solid btn--block">Look up my order</button>
    </form>
  );
}
