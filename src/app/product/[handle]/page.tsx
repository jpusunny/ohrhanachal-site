import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProduct, money, AUTHOR_LABEL } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

type Params = { handle: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { handle } = await params;
  const p = await fetchProduct(handle).catch(() => null);
  if (!p) return { title: "Sefer not found" };
  return {
    title: p.title,
    description: p.descriptionHtml
      ? p.descriptionHtml.replace(/<[^>]*>/g, "").slice(0, 160)
      : `${p.title} — Ohr Hanachal Breslev seforim, direct from the publisher.`,
    openGraph: {
      title: `${p.title} — Ohr Hanachal`,
      images: p.images[0] ? [p.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const p = await fetchProduct(handle).catch(() => null);
  if (!p) notFound();

  const priceInit = p.variants[0]?.priceCents ?? 0;
  const authorLabel = AUTHOR_LABEL[p.authorGroup];

  return (
    <div className="wrap">
      <div className="crumbs" style={{ paddingTop: 24 }}>
        <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/collection">Seforim</Link> &nbsp;/&nbsp; {p.title}
      </div>

      <div className="pdp">
        <ProductDetailClient product={p} authorLabel={authorLabel} />
      </div>

      {p.siblings.length > 0 && (
        <section className="block" style={{ padding: "40px 0 60px" }}>
          <div className="center-head">
            <span className="kicker">Same Sefer, Other Bindings</span>
            <h2 className="h-display">Also available as</h2>
          </div>
          <div className="grid">
            {p.siblings.map((s) => (
              <article className="card" key={s.handle}>
                <div className="media">
                  <Link href={`/product/${encodeURIComponent(s.handle)}`}>
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt={s.title} loading="lazy" />
                    ) : null}
                  </Link>
                </div>
                <div className="body">
                  <h3><Link href={`/product/${encodeURIComponent(s.handle)}`}>{s.title}</Link></h3>
                  <div className="foot">
                    <span className="price">{s.priceCents != null ? money(s.priceCents) : "—"}</span>
                    <Link className="add" href={`/product/${encodeURIComponent(s.handle)}`}>View →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 60 }} />
    </div>
  );
}
