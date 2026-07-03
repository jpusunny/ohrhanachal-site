import Link from "next/link";
import Crown from "@/components/Crown";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const all = await fetchProducts().catch(() => []);
  const bestsellers = all.slice(0, 8);
  const more = all.slice(8, 12);

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
              <a className="link-gold" href="#bestsellers">Bestselling seforim →</a>
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
          <div className="ornament">
            <span className="rule" />
            <Crown className="crown" />
            <span className="rule r" />
          </div>
          <p>&ldquo;Until now, our seforim reached you through someone else&rsquo;s shelf.&rdquo;</p>
          <p className="sub">Today the press opens its own doors — the same editions, at the publisher&rsquo;s price.</p>
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

      <section className="block alt" id="bestsellers">
        <div className="wrap">
          <div className="center-head">
            <span className="kicker">Most Learned</span>
            <h2 className="h-display">Bestselling seforim</h2>
          </div>
          <div className="grid">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} badge={i < 2 ? "Bestseller" : undefined} />
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
              <span className="kicker">From the Press</span>
              <h2 className="h-display">More from the catalog</h2>
            </div>
            <div className="grid">
              {more.map((p) => (
                <ProductCard key={p.id} product={p} />
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
        <h2>New printings, to your inbox</h2>
        <p>Be first to know when a sefer is reprinted or a new binding is bound.</p>
        <form>
          <input type="email" placeholder="your@email.com" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
