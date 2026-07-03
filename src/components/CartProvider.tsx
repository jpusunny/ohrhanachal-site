"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  productId: string;
  variantId: string;
  handle: string;
  title: string;
  price: number; // dollars
  img: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  inc: (idx: number) => void;
  dec: (idx: number) => void;
  remove: (idx: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "oh_cart_v2";

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart called outside <CartProvider>");
  return c;
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines, hydrated]);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const addItem = useCallback((line: Omit<CartLine, "qty"> & { qty?: number }) => {
    setLines((cur) => {
      const idx = cur.findIndex((l) => l.variantId === line.variantId);
      const qty = line.qty ?? 1;
      if (idx >= 0) {
        const next = cur.slice();
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...cur, { ...line, qty }];
    });
    setOpen(true);
  }, []);

  const inc = useCallback((idx: number) => setLines((c) => c.map((l, i) => i === idx ? { ...l, qty: l.qty + 1 } : l)), []);
  const dec = useCallback((idx: number) => setLines((c) => c.map((l, i) => i === idx ? { ...l, qty: Math.max(1, l.qty - 1) } : l)), []);
  const remove = useCallback((idx: number) => setLines((c) => c.filter((_, i) => i !== idx)), []);
  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);

  const value: CartCtx = { lines, count, subtotal, isOpen, open, close, addItem, inc, dec, remove, clear };

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

function money(n: number) { return "$" + n.toFixed(2); }

function CartDrawer() {
  const cart = useCart();
  const shipMsg = cart.subtotal >= 75 || cart.subtotal === 0
    ? "Free US shipping over $75"
    : `Add ${money(75 - cart.subtotal)} for free shipping`;
  return (
    <>
      <div className={"drawer-overlay" + (cart.isOpen ? " open" : "")} onClick={cart.close} />
      <aside className={"drawer" + (cart.isOpen ? " open" : "")} aria-label="Shopping cart">
        <div className="drawer-head">
          <h3>Your Cart</h3>
          <button className="drawer-close" aria-label="Close" onClick={cart.close}>×</button>
        </div>
        <div className="drawer-items">
          {cart.lines.length === 0 ? (
            <p className="drawer-empty">Your cart is empty.<br />The shelf awaits.</p>
          ) : cart.lines.map((l, idx) => (
            <div className="ci" key={l.variantId}>
              <div className="ci-img">{l.img ? <img src={l.img} alt="" /> : null}</div>
              <div>
                <h4><Link href={`/product/${encodeURIComponent(l.handle)}`}>{l.title}</Link></h4>
                <div className="ci-q">
                  <button onClick={() => cart.dec(idx)}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => cart.inc(idx)}>+</button>
                </div>
                <button className="ci-rm" onClick={() => cart.remove(idx)}>Remove</button>
              </div>
              <div className="ci-price">{money(l.price * l.qty)}</div>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          <div className="drawer-sub">Subtotal <span>{money(cart.subtotal)}</span></div>
          <p className="drawer-ship">{shipMsg}</p>
          <Link className="btn btn--solid btn--block" href="/checkout">Checkout</Link>
        </div>
      </aside>
    </>
  );
}
