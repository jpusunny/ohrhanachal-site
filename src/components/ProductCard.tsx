import Link from "next/link";
import { money, type ProductCard as PC } from "@/lib/api";
import type { Lang } from "@/lib/lang";

type Props = {
  product: PC;
  badge?: string;
  subLabel?: string;
  lang?: Lang;
};

export default function ProductCard({ product: p, badge, subLabel, lang = "en" }: Props) {
  const priceLabel = p.priceCentsMin == null
    ? "—"
    : p.priceCentsMin === p.priceCentsMax
      ? money(p.priceCentsMin)
      : `from ${money(p.priceCentsMin)}`;
  const heMode = lang === "he" && !!p.titleHe;
  return (
    <article className="card">
      {badge ? <span className="tag tag--gold">{badge}</span> : null}
      <div className="media">
        <Link href={`/product/${encodeURIComponent(p.handle)}`}>
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image.url} alt={p.image.altText || p.title} loading="lazy" />
          ) : null}
        </Link>
      </div>
      <div className="body">
        {subLabel ? <span className="author">{subLabel}</span> : null}
        {heMode ? (
          <>
            <h3 className="he-primary"><Link href={`/product/${encodeURIComponent(p.handle)}`}>{p.titleHe}</Link></h3>
            <span className="en-sub">{p.title}</span>
          </>
        ) : (
          <>
            <h3><Link href={`/product/${encodeURIComponent(p.handle)}`}>{p.title}</Link></h3>
            {p.titleHe ? <span className="he-ttl">{p.titleHe}</span> : null}
          </>
        )}
        <div className="foot">
          <span className="price">{priceLabel}</span>
          <Link className="add" href={`/product/${encodeURIComponent(p.handle)}`}>Add +</Link>
        </div>
      </div>
    </article>
  );
}
