"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

export default function HeaderActions() {
  const router = useRouter();
  const cart = useCart();

  function onSearch() {
    const q = prompt("Search seforim:");
    if (q) router.push(`/collection?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="nav-actions">
      <button className="iconbtn" aria-label="Search" onClick={onSearch}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      </button>
      <button className="iconbtn" aria-label="Account">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
      </button>
      <button className="iconbtn" aria-label="Cart" onClick={cart.open}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
        <span className="badge">{cart.count}</span>
      </button>
      <button className="iconbtn hamburger" aria-label="Menu" onClick={() => document.querySelector(".menu")?.classList.toggle("open")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </button>
    </div>
  );
}
