// OH_API_BASE is the URL we dial from the server. In production we use the
// internal docker-network alias http://ohr-api:3000 so we don't loop through
// the box's public IP (Azure blocks host → own-public-IP hairpin). The alias
// is re-attached after every API redeploy — see the `ohr-api` note in CLAUDE.md.
const BASE = process.env.OH_API_BASE || "http://api.52.162.164.124.sslip.io";

export type AuthorGroup = "nachman" | "nossen" | "anash" | "set" | "other";

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  titleHe: string | null;
  author: string | null;
  series: string | null;
  authorGroup: AuthorGroup;
  seforGroup: string | null;
  priceCentsMin: number | null;
  priceCentsMax: number | null;
  compareAtCentsMax: number | null;
  image: { url: string; altText: string | null } | null;
  variantCount: number;
};

export type SeforGroup = {
  slug: string;
  title: string;
  titleHe: string | null;
  authorGroup: AuthorGroup;
  priceCentsMin: number | null;
  priceCentsMax: number | null;
  image: { url: string; altText: string | null } | null;
  formats: string[];
  productHandle: string;
  count: number;
};

export type ProductSibling = {
  handle: string;
  title: string;
  image: string | null;
  priceCents: number | null;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  compareAtCents: number | null;
  weightGrams: number | null;
  inStock: boolean;
};

export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  titleHe: string | null;
  author: string | null;
  series: string | null;
  authorGroup: AuthorGroup;
  seforGroup: string | null;
  descriptionHtml: string | null;
  variants: ProductVariant[];
  images: { url: string; altText: string | null; position: number }[];
  siblings: ProductSibling[];
};

export async function fetchProducts(): Promise<ProductCard[]> {
  const res = await fetch(`${BASE}/api/storefront/products`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`products ${res.status}`);
  const body = await res.json();
  return body.products as ProductCard[];
}

export async function fetchGroups(series?: string): Promise<SeforGroup[]> {
  const url = new URL(`${BASE}/api/storefront/groups`);
  if (series) url.searchParams.set("series", series);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`groups ${res.status}`);
  const body = await res.json();
  return body.groups as SeforGroup[];
}

export const AUTHOR_LABEL: Record<AuthorGroup, string> = {
  nachman: "R' Nachman of Breslev",
  nossen: "R' Nossen of Breslev",
  anash: "Sifrei Anash",
  set: "Complete Set",
  other: "",
};

export async function fetchProduct(handle: string): Promise<ProductDetail | null> {
  const res = await fetch(
    `${BASE}/api/storefront/products/${encodeURIComponent(handle)}`,
    { next: { revalidate: 60 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`product ${res.status}`);
  const body = await res.json();
  return body.product as ProductDetail;
}

export function money(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}
