import type { Metadata } from "next";
import Crown from "@/components/Crown";
import WholesaleInquiryForm from "./WholesaleInquiryForm";

export const metadata: Metadata = {
  title: "Wholesale",
  description: "Volume pricing on Breslev seforim for shuls, yeshivos, and mosdos — direct from the Ohr Hanachal press.",
};

export default function WholesalePage() {
  return (
    <>
      <section className="hero hero--dark">
        <div className="wrap">
          <div className="hero-copy">
            <Crown className="crown" />
            <p className="kicker" style={{ color: "var(--gold-lt)" }}>Bulk &amp; Wholesale</p>
            <h1>Fill the beis medrash, not just the shelf.</h1>
            <p>Outfitting a shul, yeshiva, or mosad? Buy direct from the press at volume pricing — full cases of any sefer, matched sets, and custom leather bindings, shipped on a schedule that fits your zman.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn--gold" href="/wholesale/signup">Open an account</a>
              <a className="btn" href="/wholesale/login" style={{ background: "transparent", borderColor: "var(--gold-lt)", color: "var(--gold-lt)" }}>Sign in</a>
            </div>
          </div>
          <div className="figure framed on-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/featured-set.jpg" alt="Set Sifrei Breslev — bulk" />
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="center-head">
            <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
            <span className="kicker">Who We Supply</span>
            <h2 className="h-display">Made for mosdos</h2>
          </div>
          <div className="who">
            <div className="w">
              <Crown className="crown" />
              <h3>Shuls &amp; Batei Medrash</h3>
              <p>Stock the shtenders with matched sets that hold up to daily learning — Likutei Moharan, Likutei Halachos, and the full Breslev shelf.</p>
            </div>
            <div className="w">
              <Crown className="crown" />
              <h3>Yeshivos &amp; Mosdos</h3>
              <p>Per-talmid pocket editions at case pricing — perfect for distribution, avos u&rsquo;banim, and learning programs.</p>
            </div>
            <div className="w">
              <Crown className="crown" />
              <h3>Stores &amp; Resellers</h3>
              <p>Carry authentic Ohr Hanachal editions with trade terms direct from the publisher — no middleman markup.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="center-head">
            <span className="kicker">Volume Pricing</span>
            <h2 className="h-display">The more you learn, the more you save</h2>
            <p>Indicative tiers off catalog price. Final quote depends on title, format, and binding.</p>
          </div>
          <div className="tiers">
            <div className="tier"><div className="q">12 – 35 copies</div><div className="d">10%</div><div className="n">off catalog · one case minimum</div></div>
            <div className="tier feat"><div className="q">36 – 99 copies</div><div className="d">18%</div><div className="n">off catalog · free freight</div></div>
            <div className="tier"><div className="q">100+ copies</div><div className="d">25%+</div><div className="n">off catalog · custom terms</div></div>
          </div>
          <p style={{ textAlign: "center", color: "var(--ink-soft)", marginTop: 18, fontSize: ".92rem" }}>
            Mix titles and formats to reach a tier. Net-30 terms available for established mosdos.
          </p>
        </div>
      </section>

      <section className="block alt" id="inquiry">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="center-head">
            <span className="kicker">Request a Quote</span>
            <h2 className="h-display">Tell us what your mosad needs</h2>
            <p>We&rsquo;ll come back within one business day with pricing, lead time, and freight.</p>
          </div>
          <WholesaleInquiryForm />
        </div>
      </section>
    </>
  );
}
