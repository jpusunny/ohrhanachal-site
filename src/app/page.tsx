import Link from "next/link";
import Crown from "@/components/Crown";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { getLang } from "@/lib/lang";

export const revalidate = 60;

export default async function HomePage() {
  // Try the owner-curated "in our press this month" set first; fall back to the
  // general catalog when nothing is flagged yet, so the homepage never shows
  // an empty band before the flag is used.
  const [pressed, all, lang] = await Promise.all([
    fetchProducts({ press: true }).catch(() => []),
    fetchProducts().catch(() => []),
    getLang(),
  ]);
  const pressBand = (pressed.length > 0 ? pressed : all).slice(0, 8);
  const more = all.filter((p) => !pressBand.some((q) => q.id === p.id)).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <Crown className="crown" />
            <p className="kicker">Breslev Publishing House</p>
            <h1>The seforim of Rabbeinu, <em>bound by the house that prints them.</em></h1>
            <p className="lead">Espresso leather, gold filigree, lashon kodesh set with care. For years you found them through stores — now order the full Ohr Hanachal catalog direct.</p>
            <div className="hero-cta">
              <Link className="btn btn--solid" href="/collection">Shop the Catalog</Link>
              <a className="link-gold" href="#press-this-month">In our press this month →</a>
            </div>
          </div>
          <figure className="hero-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/hero-likutei-halachos.jpg" alt="Likutei Halachos — Ohr Hanachal, full leather set" />
            <figcaption className="cap">Likutei Halachos · Full Set</figcaption>
          </figure>
        </div>
      </section>

      <section className="declare">
        <div className="wrap">
          <article className="letter" aria-label="A letter from the press">
            <span className="letter__bs">בס״ד</span>
            <div className="letter__body">
              <p className="letter__lede">
                For twenty years, our seforim reached you through someone else&rsquo;s shelf.
              </p>
              <p>
                Today, the press opens its own doors. The same editions our talmidim have learned from
                for two decades — printed, proofed, and bound in our house — now shipped to your door,
                at the publisher&rsquo;s price, with a line straight to the people who made them.
              </p>
              <div className="letter__sign">
                <span className="letter__rule" />
                <p className="letter__signee">
                  <span className="he">הבית דפוס אור הנחל</span>
                  <span className="letter__loc">The Ohr Hanachal Press</span>
                </p>
              </div>
            </div>
            <WaxSeal />
          </article>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="center-head">
            <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
            <span className="kicker">Browse by Series</span>
            <h2 className="h-display">Find your sefer</h2>
          </div>
          <div className="series">
            <Link href="/collection?series=nachman"><span className="he">רבינו</span><h3>Sifrei Rabbeinu</h3><p>Likutei Moharan, Sipurei Maasiyos, Sichos Haran, Sefer Hamidos</p><span className="go">Shop the series →</span></Link>
            <Link href="/collection?series=nossen"><span className="he">ר׳ נתן</span><h3>Sifrei R&apos; Nossen</h3><p>Likutei Halachos, Likutei Tefilos, Likutei Eitzos, Alim LeTrufah</p><span className="go">Shop the series →</span></Link>
            <Link href="/collection?format=set"><span className="he">סטים</span><h3>Sets &amp; Bundles</h3><p>Complete matched shelves at a single price</p><span className="go">Shop the series →</span></Link>
            <Link href="/collection?format=pocket"><span className="he">כיס</span><h3>Pocket Editions</h3><p>The whole sefer, sized for the road</p><span className="go">Shop the series →</span></Link>
            <Link href="/collection?format=leather"><span className="he">עור</span><h3>Leather Bound</h3><p>Gift-quality bindings made to last</p><span className="go">Shop the series →</span></Link>
            <Link href="/collection?series=anash"><span className="he">אנ״ש</span><h3>Sifrei Anash</h3><p>Kochvei Ohr, Shemos HaTzadikim &amp; more</p><span className="go">Shop the series →</span></Link>
          </div>
        </div>
      </section>

      <section className="block alt" id="press-this-month">
        <div className="wrap">
          <div className="center-head">
            <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
            <span className="kicker">On the Press Floor</span>
            <h2 className="h-display">In our press this month</h2>
            <p>Set, proofed, and bound in-house — these are the seforim we&rsquo;re printing right now.</p>
          </div>
          <div className="grid">
            {pressBand.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                badge={p.currentlyPrinting ? "On the press" : undefined}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link className="btn btn--outline" href="/collection">View the full catalog</Link>
          </div>
        </div>
      </section>

      <section className="feature">
        <div className="wrap">
          <div className="copy">
            <Crown className="crown" />
            <p className="kicker" style={{ color: "var(--gold-lt)" }}>Build Your Shelf</p>
            <h2>The complete Breslev set</h2>
            <p>Every foundational sefer — Rabbeinu and R&apos; Nossen — in one matched, hand-bound collection. Available as a full hardcover set or a complete pocket set, shipped direct from the press.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 10 }}>
              <span className="price">from $39.99</span>
              <span style={{ fontFamily: "var(--ui)", fontSize: ".72rem", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold-lt)" }}>Pocket set in stock</span>
            </div>
            <p style={{ fontSize: ".9rem", color: "#cdbfa6", margin: "0 0 22px" }}>Full hardcover set ($100) — back in stock soon.</p>
            <Link className="btn btn--gold" href="/collection?format=set">View the Sets</Link>
          </div>
          <div className="figure framed">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/featured-set.jpg" alt="Set Sifrei Breslev — Ohr Hanachal" />
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="center-head">
              <div className="ornament"><span className="rule" /><Crown className="crown" /><span className="rule r" /></div>
              <span className="kicker">From the Press</span>
              <h2 className="h-display">More from the catalog</h2>
            </div>
            <div className="grid">
              {more.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="house" id="house">
        <div className="wrap">
          <div>
            <Crown className="crown" />
            <p className="kicker">Our House</p>
            <h2>Printed by the people who learn it</h2>
            <p>Ohr Hanachal began as a small press with one aim — to put accurate, beautiful Breslev seforim into as many hands as possible. Every volume is set and proofread in lashon kodesh, faithful to the original, and bound in the leather-and-gold our learners know on sight.</p>
            <p className="quote">וְהָעִקָּר — לְהַמְשִׁיךְ אֶת הָאוֹר לְכָל אֶחָד וְאֶחָד</p>
            <p>Selling direct means a fair price, the full catalog in every format, and a line straight to the press for sets, leather bindings, and bulk orders for your shul or mosad.</p>
            <p className="sig">— The Ohr Hanachal Press</p>
          </div>
          <figure className="house-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/house.jpg" alt="Likutei Moharan — Ohr Hanachal binding" />
          </figure>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

function NewsletterSection() {
  return (
    <section className="news">
      <div className="wrap">
        <Crown className="crown" />
        <h2>When we go to print — we tell you first.</h2>
        <p>A short note from the press when a sefer is on the floor, a new binding is finished, or a set is back in stock. No marketing.</p>
        <form>
          <input type="email" placeholder="your@email.com" required />
          <button type="submit">Send from the press</button>
        </form>
      </div>
    </section>
  );
}

// A small burgundy wax seal with the Ohr Hanachal crown, stamped as if pressed
// into the letter above. Kept inline so the SVG palette can inherit brand vars
// without another asset round-trip.
function WaxSeal() {
  return (
    <svg className="wax-seal" viewBox="0 0 88 88" aria-hidden="true">
      <defs>
        <radialGradient id="waxfill" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#a83030" />
          <stop offset="55%" stopColor="#7d1f1f" />
          <stop offset="100%" stopColor="#4d1010" />
        </radialGradient>
      </defs>
      <circle cx="44" cy="44" r="40" fill="url(#waxfill)"
        stroke="#3a0d0d" strokeWidth="1.2"
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }} />
      <circle cx="44" cy="44" r="34" fill="none" stroke="#d1b06a" strokeWidth="0.8" opacity="0.6" />
      {/* Crown, scaled/centered inside the seal */}
      <g transform="translate(20 34) scale(0.75)" fill="#e8c778" opacity="0.95">
        <path d="M3 36 7 13 20 25 32 5 44 25 57 13 61 36Z" />
        <rect x="6" y="36" width="52" height="4" />
      </g>
      <text x="44" y="76" textAnchor="middle" fontSize="6.5" fill="#e8c778"
        style={{ letterSpacing: "0.2em", fontFamily: "var(--ui)" }}>
        אור הנחל
      </text>
    </svg>
  );
}
