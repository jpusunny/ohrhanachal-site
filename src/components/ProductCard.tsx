import Link from "next/link";
import { money, type ProductCard as PC } from "@/lib/api";

type Props = {
  product: PC;
  badge?: string;
  subLabel?: string;
};

export default function ProductCard({ product: p, badge, subLabel }: Props) {
  const priceLabel = p.priceCentsMin == null
    ? "—"
    : p.priceCentsMin === p.priceCentsMax
      ? money(p.priceCentsMin)
      : `from ${money(p.priceCentsMin)}`;
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
        <h3><Link href={`/product/${encodeURIComponent(p.handle)}`}>{p.title}</Link></h3>
        {p.titleHe ? <span className="he-ttl">{p.titleHe}</span> : null}
        <div className="foot">
          <span className="price">{priceLabel}</span>
          <Link className="add" href={`/product/${encodeURIComponent(p.handle)}`}>Add +</Link>
        </div>
      </div>
    </article>
  );
}
