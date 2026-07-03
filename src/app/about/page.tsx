import Link from "next/link";
import Crown from "@/components/Crown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Ohr Hanachal — a small Breslev press. Lashon kodesh, faithful setting, and bindings made to last, direct from the publisher.",
};

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <Crown className="crown" />
            <p className="kicker">Our House</p>
            <h1>A small press with <em>one large aim.</em></h1>
            <p className="lead">To put accurate, beautiful Breslev seforim into as many hands as possible — set in lashon kodesh, faithful to the original, and bound to be learned from.</p>
            <div className="hero-cta">
              <Link className="btn btn--solid" href="/collection">Shop the Catalog</Link>
              <a className="link-gold" href="#editions">How we make them →</a>
            </div>
          </div>
          <figure className="hero-figure framed">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/hero-likutei-halachos.jpg" alt="Likutei Halachos — Ohr Hanachal" />
          </figure>
        </div>
      </section>

      <section className="declare">
        <div className="wrap">
          <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
          <p>אֹר הַנַּחַל — &ldquo;the light of the flowing stream&rdquo;</p>
          <p className="sub">Nachal Novea, Mekor Chochma — the wellspring of Rabbeinu&rsquo;s wisdom, which it is our whole purpose to carry onward.</p>
        </div>
      </section>

      <section className="house">
        <div className="wrap">
          <div>
            <p className="kicker">The Beginning</p>
            <h2>From a single sefer to a full shelf</h2>
            <p>Ohr Hanachal began the way most holy things do — quietly, with one volume, printed because it needed to exist. What started as a careful reprint became a press: setting Rabbeinu&rsquo;s teachings and the works of Reb Noson in clear, accurate type, and binding them in editions a learner is proud to open every day.</p>
            <p className="quote">וְהָעִקָּר — לְהַמְשִׁיךְ אֶת הָאוֹר לְכָל אֶחָד וְאֶחָד</p>
            <p>Today the catalog spans the foundational seforim — Likutei Moharan, Likutei Halachos, Likutei Tefilos and more — in full, pocket, and leather formats, so the right edition exists for the beis medrash, the coat pocket, and the gift.</p>
            <p className="sig">— The Ohr Hanachal Press</p>
          </div>
          <figure className="house-figure framed">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/house.jpg" alt="Likutei Moharan binding" />
          </figure>
        </div>
      </section>

      <section className="block" id="editions">
        <div className="wrap">
          <div className="center-head">
            <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
            <span className="kicker">How We Make Them</span>
            <h2 className="h-display">Four things we won&rsquo;t compromise</h2>
          </div>
          <div className="values">
            <div className="v"><b>Lashon Kodesh</b><span>Set and proofread in the holy tongue, faithful to the original text.</span></div>
            <div className="v"><b>Honest Type</b><span>Clean, legible setting that&rsquo;s a pleasure to learn from for hours.</span></div>
            <div className="v"><b>Bound to Last</b><span>Espresso leather and gold filigree — made to survive daily use.</span></div>
            <div className="v"><b>Every Format</b><span>Full size for the shtender, pocket for the road, leather for the gift.</span></div>
          </div>
        </div>
      </section>

      <section className="feature">
        <div className="wrap">
          <div className="copy">
            <Crown className="crown" />
            <p className="kicker" style={{ color: "var(--gold-lt)" }}>Direct From the Press</p>
            <h2>The same seforim, without the middleman</h2>
            <p>For years our seforim reached you through stores. Bringing the shop online means a fair price, the full catalog in every format, and a direct line to us — for sets, special leather bindings, and bulk orders for your shul or mosad.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btn--gold" href="/collection">Shop the Catalog</Link>
              <Link className="btn btn--outline" href="/wholesale" style={{ color: "var(--gold-pale)", borderColor: "var(--gold-lt)" }}>Bulk &amp; Wholesale</Link>
            </div>
          </div>
          <figure className="figure framed">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/featured-set.jpg" alt="Set Sifrei Breslev" />
          </figure>
        </div>
      </section>
    </>
  );
}
