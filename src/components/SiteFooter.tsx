import Link from "next/link";
import Crown from "./Crown";

export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="grid-f">
          <div>
            <Link className="brand" href="/">
              <Crown className="crown" style={{ width: 30 }} />
              <span className="name">
                <b>Ohr Hanachal</b>
                <span>Breslev · Est. בס״ד</span>
              </span>
            </Link>
            <p className="fnote">Authentic Breslev seforim in lashon kodesh — printed, bound, and shipped direct from the publisher&apos;s own press.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/collection">All Seforim</Link></li>
              <li><Link href="/collection?series=nachman">Sifrei Rabbeinu</Link></li>
              <li><Link href="/collection?series=nossen">Sifrei R&apos; Nossen</Link></li>
              <li><Link href="/collection?format=set">Sets</Link></li>
              <li><Link href="/collection?format=pocket">Pocket &amp; Leather</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><a href="#">Shipping &amp; Returns</a></li>
              <li><a href="#">Track an Order</a></li>
              <li><a href="#">Bulk &amp; Wholesale</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>House</h4>
            <ul>
              <li><Link href="/#house">Our Story</Link></li>
              <li><a href="#">Editions &amp; Quality</a></li>
              <li><a href="#">Special Bindings</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="fbar">
          <span>© 2026 Ohr Hanachal Press · All rights reserved</span>
          <span>Direct from the publisher · Secure checkout</span>
        </div>
      </div>
    </footer>
  );
}
