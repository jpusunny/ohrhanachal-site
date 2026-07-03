/* Ohr Hanachal — shared cart (localStorage + slide-out drawer).
   Include on every page: <script src="cart.js"></script>. */
(function(){
  const KEY = 'oh_cart_v2';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } };
  const set = (c) => { localStorage.setItem(KEY, JSON.stringify(c)); paint(); };
  const money = (n) => '$' + Number(n).toFixed(2);
  const priceOf = (s) => parseFloat(String(s).replace(/[^0-9.]/g,'')) || 0;

  function mount(){
    if (document.getElementById('cartDrawer')) return;
    const d = document.createElement('div');
    d.innerHTML = `
      <div id="cartOverlay" class="drawer-overlay"></div>
      <aside id="cartDrawer" class="drawer" aria-label="Shopping cart">
        <div class="drawer-head"><h3>Your Cart</h3><button class="drawer-close" aria-label="Close">×</button></div>
        <div class="drawer-items" id="drawerItems"></div>
        <div class="drawer-foot">
          <div class="drawer-sub">Subtotal <span id="drawerSub">$0.00</span></div>
          <p class="drawer-ship" id="drawerShip">Free US shipping over $75</p>
          <a class="btn btn--solid btn--block" href="checkout.html">Checkout</a>
        </div>
      </aside>`;
    document.body.appendChild(d);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    d.querySelector('.drawer-close').addEventListener('click', closeCart);
    document.querySelectorAll('[aria-label="Cart"]').forEach(b => { b.onclick = openCart; });
    document.querySelectorAll('[aria-label="Search"]').forEach(b => { b.onclick = () => {
      const q = prompt('Search seforim:'); if (q) location.href = 'collection.html?q=' + encodeURIComponent(q);
    }; });
  }

  function paint(){
    const cart = get();
    const count = cart.reduce((s,i)=>s+i.qty,0);
    document.querySelectorAll('#cartCount').forEach(b => b.textContent = count);
    const wrap = document.getElementById('drawerItems');
    if (wrap){
      if (!cart.length){ wrap.innerHTML = '<p class="drawer-empty">Your cart is empty.<br>The shelf awaits.</p>'; }
      else wrap.innerHTML = cart.map((i,idx)=>`
        <div class="ci">
          <div class="ci-img">${i.img?`<img src="${i.img}" alt="">`:''}</div>
          <div>
            <h4>${i.handle?`<a href="product.html?handle=${encodeURIComponent(i.handle)}">${i.title}</a>`:i.title}</h4>
            <div class="ci-q"><button onclick="OHCart.dec(${idx})">−</button><span>${i.qty}</span><button onclick="OHCart.inc(${idx})">+</button></div>
            <button class="ci-rm" onclick="OHCart.remove(${idx})">Remove</button>
          </div>
          <div class="ci-price">${money(i.price*i.qty)}</div>
        </div>`).join('');
    }
    const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
    const subEl = document.getElementById('drawerSub'); if (subEl) subEl.textContent = money(sub);
    const ship = document.getElementById('drawerShip');
    if (ship) ship.textContent = sub >= 75 || sub === 0 ? 'Free US shipping over $75' : `Add ${money(75-sub)} for free shipping`;
    if (window.renderSummary) window.renderSummary(cart, sub);
  }

  function openCart(){ mount(); document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
  function closeCart(){ const d=document.getElementById('cartDrawer'),o=document.getElementById('cartOverlay'); if(d)d.classList.remove('open'); if(o)o.classList.remove('open'); }

  function addItem(item){
    if (!item.variantId) { console.warn('cart.addItem: missing variantId'); return; }
    const cart = get();
    const ex = cart.find(i => i.variantId === item.variantId);
    if (ex) ex.qty += (item.qty || 1);
    else cart.push({
      productId: item.productId, variantId: item.variantId, handle: item.handle,
      title: item.title, price: item.price, img: item.img || '', qty: item.qty || 1,
    });
    set(cart);
    openCart();
  }

  // Card "Add +" fallback: if the card has a handle, deep-link to the PDP where
  // real variant selection lives. Otherwise (mockup grids), add a synthetic line.
  function addFromCard(btn){
    const card = btn.closest('.card');
    if (!card) return;
    const handle = card.dataset.handle;
    if (handle) {
      location.href = `product.html?handle=${encodeURIComponent(handle)}`;
      return;
    }
    const title = card.querySelector('h3')?.textContent.trim() || 'Sefer';
    const price = priceOf(card.querySelector('.price')?.textContent || '0');
    const img = card.querySelector('img')?.src || '';
    addItem({ variantId: 'synth-' + title, title, price, img, qty: 1 });
  }

  window.OHCart = {
    inc:(i)=>{ const c=get(); c[i].qty++; set(c); },
    dec:(i)=>{ const c=get(); c[i].qty=Math.max(1,c[i].qty-1); set(c); },
    remove:(i)=>{ const c=get(); c.splice(i,1); set(c); },
    get, money, openCart, closeCart, addItem, addFromCard, clear:()=>set([])
  };
  window.openCart = openCart;
  // legacy shim
  window.addToCart = () => { OHCart.addFromCard(window.event?.target); };

  document.addEventListener('DOMContentLoaded', ()=>{ mount(); paint(); });
})();
