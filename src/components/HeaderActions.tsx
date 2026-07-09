"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

const OH_API_PUBLIC = "https://api.52.162.164.124.sslip.io";

function readLangCookie(): "en" | "he" {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|; )ohr_lang=([^;]*)/);
  return m && m[1] === "he" ? "he" : "en";
}

export default function HeaderActions() {
  const router = useRouter();
  const cart = useCart();
  const [signedIn, setSignedIn] = useState(false);
  const [lang, setLang] = useState<"en" | "he">("en");

  useEffect(() => {
    setLang(readLangCookie());
    fetch(`${OH_API_PUBLIC}/api/customer/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((body) => setSignedIn(!!body.customer))
      .catch(() => {});
  }, []);

  function onSearch() {
    const q = prompt("Search seforim:");
    if (q) router.push(`/collection?q=${encodeURIComponent(q)}`);
  }

  function toggleLang() {
    const next = lang === "he" ? "en" : "he";
    document.cookie = `ohr_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    setLang(next);
    router.refresh();
  }

  return (
    <div className="nav-actions">
      <button
        className="langtoggle"
        aria-label={lang === "he" ? "Switch to English titles" : "Switch to Hebrew titles"}
        title={lang === "he" ? "Showing Hebrew titles — click for English" : "Showing English titles — click for Hebrew"}
        onClick={toggleLang}
      >
        {lang === "he" ? <span>EN</span> : <span className="he">א</span>}
      </button>
      <button className="iconbtn" aria-label="Search" onClick={onSearch}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      </button>
      <button className="iconbtn" aria-label="Account"
        onClick={() => router.push(signedIn ? "/account" : "/account/login")}
        title={signedIn ? "Your account" : "Sign in"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
        {signedIn && <span className="badge" style={{ background: "var(--gold-deep)" }}>•</span>}
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
