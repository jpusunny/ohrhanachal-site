import Link from "next/link";
import type { Metadata } from "next";
import { fetchGroups, money, AUTHOR_LABEL, type SeforGroup } from "@/lib/api";
import { getLang, type Lang } from "@/lib/lang";

export const revalidate = 60;

const SERIES_TITLE: Record<string, string> = {
  nachman: "Sifrei Rabbeinu",
  nossen: "Sifrei R' Nossen",
  anash: "Sifrei Anash",
  set: "Sets & Bundles",
};

const SERIES_DESC: Record<string, string> = {
  nachman: "The seforim of Rabbeinu Nachman of Breslev — Likutei Moharan, Sipurei Maasiyos, Sichos Haran, Sefer Hamidos, and more.",
  nossen: "The seforim of Rabbeinu Nossen — Likutei Halachos, Likutei Tefilos, Likutei Eitzos, Alim LeTrufah.",
  anash: "Sifrei Anash — Kochvei Ohr, Shemos HaTzadikim, and other essential Breslev works from the talmidim.",
  set: "Complete Breslev shelves — full hardcover and pocket sets, matched bindings, shipped as one.",
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const sp = await searchParams;
  const series = typeof sp.series === "string" ? sp.series : undefined;
  const heading = series && SERIES_TITLE[series] ? SERIES_TITLE[series] : "All Seforim";
  return {
    title: heading,
    description: series && SERIES_DESC[series]
      ? SERIES_DESC[series]
      : "The full Ohr Hanachal catalog — every sefer, every binding, direct from the press.",
  };
}

export default async function CollectionPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const series = typeof sp.series === "string" ? sp.series : undefined;
  const format = typeof sp.format === "string" ? sp.format : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  // Fetch ALL groups unfiltered so the sidebar can show accurate counts
  // for every filter option (not just the currently-selected series).
  const allGroups = await fetchGroups().catch(() => [] as SeforGroup[]);
  const lang = await getLang();

  const seriesCounts = { nachman: 0, nossen: 0, anash: 0, set: 0 };
  const formatCounts = { Regular: 0, Pocket: 0, Leather: 0, Set: 0 };
  for (const g of allGroups) {
    if (g.authorGroup in seriesCounts) seriesCounts[g.authorGroup as keyof typeof seriesCounts]++;
    for (const f of g.formats) if (f in formatCounts) formatCounts[f as keyof typeof formatCounts]++;
  }

  const groups = series ? allGroups.filter((g) => g.authorGroup === series) : allGroups;

  const filtered = groups.filter((g) => {
    if (format) {
      const wanted = format[0].toUpperCase() + format.slice(1).toLowerCase();
      if (!g.formats.includes(wanted)) return false;
    }
    if (q) {
      const s = q.toLowerCase();
      if (!g.title.toLowerCase().includes(s) && !(g.titleHe || "").includes(q)) return false;
    }
    return true;
  });

  const heading = series && SERIES_TITLE[series] ? SERIES_TITLE[series] : "All Seforim";
  const kicker = series ? "Series" : "The Full Catalog";
  const desc = q
    ? <>Showing matches for &ldquo;<strong>{q}</strong>&rdquo;. <Link className="link-gold" href="/collection" style={{ fontSize: ".8rem" }}>Clear search</Link></>
    : series && SERIES_DESC[series]
      ? SERIES_DESC[series]
      : "Every title we currently stock — full size, pocket, leather, and sets. Filter by series or binding to narrow it down.";

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <div className="crumbs"><Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/collection">Seforim</Link> &nbsp;/&nbsp; {heading}</div>
          <span className="kicker">{kicker}</span>
          <h1>{heading}</h1>
          <p>{desc}</p>
        </div>
      </div>

      <div className="wrap">
        <div className="shop">
          <aside className="filters">
            <FilterGroup title="Series">
              <FilterLink label="All series" count={allGroups.length} active={!series} href={buildHref({ series: undefined, format, q })} />
              <FilterLink label="R' Nachman" count={seriesCounts.nachman} active={series === "nachman"} href={buildHref({ series: "nachman", format, q })} />
              <FilterLink label="R' Nossen" count={seriesCounts.nossen} active={series === "nossen"} href={buildHref({ series: "nossen", format, q })} />
              <FilterLink label="Sifrei Anash" count={seriesCounts.anash} active={series === "anash"} href={buildHref({ series: "anash", format, q })} />
              <FilterLink label="Sets" count={seriesCounts.set} active={series === "set"} href={buildHref({ series: "set", format, q })} />
            </FilterGroup>
            <FilterGroup title="Binding">
              <FilterLink label="All bindings" active={!format} href={buildHref({ series, format: undefined, q })} />
              <FilterLink label="Regular size" count={formatCounts.Regular} active={format === "regular"} href={buildHref({ series, format: "regular", q })} />
              <FilterLink label="Pocket" count={formatCounts.Pocket} active={format === "pocket"} href={buildHref({ series, format: "pocket", q })} />
              <FilterLink label="Leather bound" count={formatCounts.Leather} active={format === "leather"} href={buildHref({ series, format: "leather", q })} />
              <FilterLink label="Set / bundle" count={formatCounts.Set} active={format === "set"} href={buildHref({ series, format: "set", q })} />
            </FilterGroup>
          </aside>

          <div>
            <div className="chips">
              <ChipLink label="All" active={!series} href={buildHref({ series: undefined, format, q })} />
              <ChipLink label="Rabbeinu" active={series === "nachman"} href={buildHref({ series: "nachman", format, q })} />
              <ChipLink label="R' Nossen" active={series === "nossen"} href={buildHref({ series: "nossen", format, q })} />
              <ChipLink label="Anash" active={series === "anash"} href={buildHref({ series: "anash", format, q })} />
              <ChipLink label="Sets" active={series === "set"} href={buildHref({ series: "set", format, q })} />
            </div>
            <div className="toolbar">
              <span className="count">Showing <strong>{filtered.length}</strong> of {groups.length} seforim</span>
            </div>

            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--ink-soft)", padding: "50px 0" }}>
                No seforim match those filters.
              </p>
            ) : (
              <div className="grid">
                {filtered.map((g) => <GroupCard key={g.slug} group={g} lang={lang} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function buildHref({ series, format, q }: { series?: string; format?: string; q?: string }): string {
  const u = new URLSearchParams();
  if (series) u.set("series", series);
  if (format) u.set("format", format);
  if (q) u.set("q", q);
  const s = u.toString();
  return s ? `/collection?${s}` : "/collection";
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fgroup">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function FilterLink({ label, active, href, count }: { label: string; active: boolean; href: string; count?: number }) {
  return (
    <Link href={href} className={"flink" + (active ? " is-active" : "")}>
      <span className="flink__label">{label}</span>
      {typeof count === "number" ? <span className="flink__count">{count}</span> : null}
    </Link>
  );
}

function ChipLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link href={href} className={"chip" + (active ? " is-active" : "")}>{label}</Link>
  );
}

function GroupCard({ group: g, lang }: { group: SeforGroup; lang: Lang }) {
  const priceLabel = g.priceCentsMin == null
    ? "—"
    : g.priceCentsMin === g.priceCentsMax
      ? money(g.priceCentsMin)
      : `from ${money(g.priceCentsMin)}`;
  const authorLabel = AUTHOR_LABEL[g.authorGroup];
  const chips = g.formatHandles && g.formatHandles.length > 1
    ? g.formatHandles
    : g.formats.length > 1
      ? g.formats.map((f) => ({ format: f, handle: g.productHandle }))
      : [];
  const heMode = lang === "he" && !!g.titleHe;
  return (
    <article className="card">
      <div className="media">
        <Link href={`/product/${encodeURIComponent(g.productHandle)}`}>
          {g.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={g.image.url} alt={g.image.altText || g.title} loading="lazy" />
          ) : null}
        </Link>
      </div>
      <div className="body">
        {authorLabel ? <span className="author">{authorLabel}</span> : null}
        {heMode ? (
          <>
            <h3 className="he-primary"><Link href={`/product/${encodeURIComponent(g.productHandle)}`}>{g.titleHe}</Link></h3>
            <span className="en-sub">{g.title}</span>
          </>
        ) : (
          <>
            <h3><Link href={`/product/${encodeURIComponent(g.productHandle)}`}>{g.title}</Link></h3>
            {g.titleHe ? <span className="he-ttl">{g.titleHe}</span> : null}
          </>
        )}
        {chips.length > 0 ? (
          <div className="fmt-chips">
            {chips.map((c) => (
              <Link
                key={c.format + c.handle}
                className="fmt-chip"
                href={`/product/${encodeURIComponent(c.handle)}`}
                aria-label={`View ${g.title} in ${c.format}`}
              >
                {c.format}
              </Link>
            ))}
          </div>
        ) : null}
        <div className="foot">
          <span className="price">{priceLabel}</span>
          <Link className="add" href={`/product/${encodeURIComponent(g.productHandle)}`}>View →</Link>
        </div>
      </div>
    </article>
  );
}
