"use client";

import { useState } from "react";
import { money, type ProductDetail } from "@/lib/api";
import { useCart } from "@/components/CartProvider";

type Props = { product: ProductDetail; authorLabel: string };

export default function ProductDetailClient({ product: p, authorLabel }: Props) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const cart = useCart();

  const variant = p.variants[variantIdx];
  const priceLabel = variant ? money(variant.priceCents) : "—";
  const mainImg = p.images[imgIdx]?.url || "";
  const hasOptions = p.variants.length > 1;

  function add() {
    if (!variant) return;
    cart.addItem({
      productId: p.id,
      variantId: variant.id,
      handle: p.handle,
      title: p.title + (hasOptions ? ` — ${variant.name}` : ""),
      price: variant.priceCents / 100,
      img: p.images[0]?.url || "",
      qty,
    });
  }

  return (
    <>
      <div className="gallery">
        <div className="main framed">
          {mainImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainImg} alt={p.title} />
          ) : null}
        </div>
        {p.images.length > 1 && (
          <div className="thumbs">
            {p.images.map((im, i) => (
              <div
                key={im.url}
                className={"t" + (i === imgIdx ? " is-active" : "")}
                onClick={() => setImgIdx(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt={im.altText || ""} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pinfo">
        {authorLabel ? <span className="author">{authorLabel}</span> : null}
        <h1>{p.title}</h1>
        {p.titleHe ? <div className="he-ttl">{p.titleHe}</div> : null}
        {p.descriptionHtml ? (
          <div className="desc" dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} />
        ) : null}

        <div className="price-row">
          <span className="now">{priceLabel}</span>
          <span className="save">Direct from the press</span>
        </div>

        {hasOptions && (
          <div className="opts">
            <div className="lab">Edition</div>
            <div className="swatches">
              {p.variants.map((v, i) => (
                <button
                  key={v.id}
                  className={"swatch" + (i === variantIdx ? " is-active" : "")}
                  onClick={() => setVariantIdx(i)}
                  disabled={!v.inStock && variantIdx !== i}
                >
                  {v.name} · {money(v.priceCents)}
                  {!v.inStock ? " · out" : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="buy-row">
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button className="btn btn--solid btn--block" onClick={add} disabled={!variant?.inStock}>
            {variant?.inStock ? `Add to Cart — ${priceLabel}` : "Out of stock"}
          </button>
        </div>

        <div className="ship-note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="1.7">
            <path d="M5 18V7a2 2 0 0 1 2-2h7v13" />
            <path d="M14 9h4l3 3v6h-7" />
            <circle cx="7.5" cy="18.5" r="1.5" />
            <circle cx="17.5" cy="18.5" r="1.5" />
          </svg>
          Ships free, direct from the press — usually dispatched in 1–2 business days.
        </div>

        <div className="spec">
          <h3>Details</h3>
          <dl>
            {p.author ? (<><dt>Author</dt><dd>{p.author}</dd></>) : null}
            <dt>Publisher</dt><dd>Ohr Hanachal</dd>
            <dt>Language</dt><dd>Lashon Kodesh</dd>
            {p.series ? (<><dt>Series</dt><dd>{p.series}</dd></>) : null}
            {variant?.sku ? (<><dt>SKU</dt><dd>{variant.sku}</dd></>) : null}
          </dl>
        </div>
      </div>
    </>
  );
}
