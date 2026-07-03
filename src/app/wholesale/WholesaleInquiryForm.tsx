"use client";

import { useState } from "react";

export default function WholesaleInquiryForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="framed" style={{ padding: 40, textAlign: "center" }}>
        <h3 style={{ marginTop: 0 }}>Thank you — we&rsquo;ll be in touch.</h3>
        <p>We&rsquo;ll come back within one business day with pricing, lead time, and freight.</p>
      </div>
    );
  }

  return (
    <form className="inquiry framed" onSubmit={onSubmit}>
      <div className="row2">
        <div className="field"><label>Your name</label><input required /></div>
        <div className="field"><label>Mosad / organization</label><input required /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Email</label><input type="email" required /></div>
        <div className="field"><label>Phone</label><input type="tel" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Organization type</label><select><option>Shul / Beis Medrash</option><option>Yeshiva / Mosad</option><option>Store / Reseller</option><option>Other</option></select></div>
        <div className="field"><label>Estimated quantity</label><select><option>12 – 35</option><option>36 – 99</option><option>100 – 250</option><option>250+</option></select></div>
      </div>
      <div className="field"><label>Which seforim &amp; formats?</label><textarea rows={4} placeholder="e.g. 50× Likutei Eitzos pocket, 10× full Likutei Halachos sets, leather binding…" /></div>
      <button className="btn btn--solid btn--block" type="submit">Send Quote Request</button>
    </form>
  );
}
