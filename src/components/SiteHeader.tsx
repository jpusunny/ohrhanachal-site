import Link from "next/link";
import Crown from "./Crown";
import HeaderActions from "./HeaderActions";

export default function SiteHeader() {
  return (
    <>
      <div className="announce">
        Now <strong>direct from the publisher</strong> &nbsp;·&nbsp; Free US shipping over $75
      </div>
      <header className="site">
        <div className="wrap nav">
          <Link className="brand" href="/">
            <Crown className="crown" />
            <span className="name">
              <b>Ohr Hanachal</b>
              <span>Breslev · Est. בס״ד</span>
            </span>
          </Link>
          <nav>
            <ul className="menu">
              <li><Link href="/collection">All Seforim</Link></li>
              <li><Link href="/collection?series=nachman">Sifrei Rabbeinu</Link></li>
              <li><Link href="/collection?series=nossen">Sifrei R&apos; Nossen</Link></li>
              <li><Link href="/collection?series=anash">Sifrei Anash</Link></li>
              <li><Link href="/collection?format=set">Sets</Link></li>
              <li><Link href="/wholesale">Wholesale</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </nav>
          <HeaderActions />
        </div>
      </header>
    </>
  );
}
