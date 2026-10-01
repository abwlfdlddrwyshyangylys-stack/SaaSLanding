(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const CANON = "https://abwlfdlddrwyshyangylys-stack.github.io/SaaSLanding/";
  const TG_BASE = "https://t.me/riftgear_support?text=";
  const IMG_HOST = "https://abwlfdlddrwyshyangylys-stack.github.io";

  /* esc(): escape text before innerHTML (security) */
  const esc = s => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  /* image https-whitelist (security) */
  const safeImg = u => (typeof u === "string" && u.startsWith("https://" + IMG_HOST.replace("https://", "")) ? u : "");

  /* Year */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky nav background + floating CTA */
  const nav = $("#nav");
  const floatCta = $("#floatCta");
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (floatCta) floatCta.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile hamburger: hidden/inert + Escape */
  const burger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");
  function setMobile(open) {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.toggle("open", open);
    if (open) { mobileMenu.removeAttribute("hidden"); mobileMenu.removeAttribute("inert"); }
    else { mobileMenu.setAttribute("hidden", ""); mobileMenu.setAttribute("inert", ""); }
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.textContent = open ? "✕" : "☰";
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => setMobile(!mobileMenu.classList.contains("open")));
    $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => setMobile(false)));
  }

  /* ---------------- i18n ---------------- */
  const CATS = [
    { id: "all",      en: "All",        fa: "همه" },
    { id: "mouse",    en: "Mouse",      fa: "ماوس" },
    { id: "keyboard", en: "Keyboard",   fa: "کیبورد" },
    { id: "headset",  en: "Headset",    fa: "هدست" },
    { id: "pad",      en: "Controller", fa: "دسته بازی" },
    { id: "chair",    en: "Chair",      fa: "صندلی" },
    { id: "console",  en: "Console",    fa: "کنسول" },
    { id: "game",     en: "Game",       fa: "بازی" },
  ];
  const I18N = {
    en: {
      skip: "Skip to products",
      navProducts: "Products", navCompare: "Compare", navDeals: "Today's picks",
      navDeals2: "Today's picks", navReviews: "Reviews", navFaq: "FAQ", navContact: "Contact",
      dealsTitle: "Today's picks, live stock",
      dealsSub: "Full catalog below — search, filter by category, or sort by price. Low-stock items show exactly how many are left.",
      picksEyebrow: "TODAY'S PICKS",
      searchPh: "Search products…", sortNew: "Newest", sortAsc: "Price: Low to High", sortDesc: "Price: High to Low",
      cartWord: "Cart", cartTitle: "🛒 Cart", cartEmpty: "Your cart is empty — go grab some gear!",
      cartNote: "Cart is saved on this device only.",
      checkout: "Order via Telegram", add: "Add to cart", details: "Details",
      total: "Total", oos: "Out of stock", inStock: "In stock",
      onlyLeft: n => `Only ${n} left`, empty: "No products match your search.", reset: "Reset filters",
      remove: "Remove", close: "Close", added: n => `${n} added to cart`, maxStock: n => `Only ${n} in stock`,
      cartEmptyNote: "Your cart is empty.", browseProducts: "Browse products", browsePicks: "Browse today's picks",
      fastShip: "Fast shipping across Iran", shipsIran: "Ships within Iran only",
      orderTg: "Order via Telegram", orderTgArrow: "Order via Telegram →",
      contactEyebrow: "CONTACT", contactTitle: "Talk to support",
      contactSub: "Questions about stock, shipping or returns? Message us on Telegram — we usually reply within a few hours.",
      contactBtn: "Message support on Telegram",
      catTitle: "Seven categories, zero filler",
      catSub: "Every product below is real catalog stock — prices and specs copied from the RIFTGEAR store.",
      footAbout: "RIFTGEAR storefront — no online payment; orders via Telegram. Pay on delivery · 7-day returns.",
    },
    fa: {
      skip: "پرش به محصولات",
      navProducts: "محصولات", navCompare: "مقایسه", navDeals: "پرفروش‌ها",
      navDeals2: "پرفروش‌ها", navReviews: "نظرات", navFaq: "سؤالات", navContact: "تماس",
      dealsTitle: "پرفروش‌ها، موجودی زنده",
      dealsSub: "کاتالوگ کامل — جستجو، فیلتر دسته‌بندی یا مرتب‌سازی بر اساس قیمت.",
      picksEyebrow: "پیشنهادهای امروز",
      searchPh: "جستجوی محصول…", sortNew: "جدیدترین", sortAsc: "ارزان‌ترین", sortDesc: "گران‌ترین",
      cartWord: "سبد", cartTitle: "🛒 سبد خرید", cartEmpty: "سبد خالی است — بریم خرید!",
      cartNote: "سبد فقط روی همین دستگاه ذخیره می‌شود.",
      checkout: "ثبت سفارش از طریق تلگرام", add: "افزودن به سبد", details: "جزئیات",
      total: "جمع کل", oos: "ناموجود", inStock: "موجود",
      onlyLeft: n => `فقط ${n} عدد مانده`, empty: "محصولی با این جستجو پیدا نشد.", reset: "حذف فیلترها",
      remove: "حذف", close: "بستن", added: n => `${n} به سبد اضافه شد`, maxStock: n => `فقط ${n} عدد موجود است`,
      cartEmptyNote: "سبد شما خالی است.", browseProducts: "مشاهده محصولات", browsePicks: "مشاهده پیشنهادها",
      fastShip: "ارسال سریع به سراسر ایران", shipsIran: "فقط داخل ایران ارسال می‌شود",
      orderTg: "ثبت سفارش از طریق تلگرام", orderTgArrow: "ثبت سفارش از طریق تلگرام ←",
      contactEyebrow: "تماس", contactTitle: "گفتگو با پشتیبانی",
      contactSub: "سؤالی درباره موجودی، ارسال یا مرجوعی دارید؟ در تلگرام پیام بدهید — معمولاً ظرف چند ساعت جواب می‌دهیم.",
      contactBtn: "پیام به پشتیبانی در تلگرام",
      catTitle: "هفت دسته‌بندی، بدون حشو",
      catSub: "همه محصولات زیر موجودی واقعی کاتالوگ است — قیمت‌ها و مشخصات از فروشگاه RIFTGEAR.",
      footAbout: "فروشگاه RIFTGEAR — بدون پرداخت آنلاین؛ سفارش از طریق تلگرام. پرداخت هنگام تحویل · ۷ روز مرجوعی.",
    },
  };
  const loadStr = (k, ok, dflt) => {
    try { const v = localStorage.getItem(k); return ok.includes(v) ? v : dflt; }
    catch { return dflt; }
  };
  let lang = loadStr("slp_lang", ["en", "fa"], "en");
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "fa" || q === "en") lang = q;
  } catch { /* ignore */ }
  let query = "", activeCat = "all", sortMode = "new";
  const t = k => I18N[lang][k];
  const pname = p => (lang === "fa" ? (p.name_fa || p.name_en) : p.name_en);
  const pdesc = p => (lang === "fa" ? (p.desc_fa || p.desc_en) : p.desc_en);
  const pspecs = p => (lang === "fa" ? (p.specs_fa || p.specs_en) : p.specs_en) || [];

  /* ---------------- catalog ---------------- */
  const grid = $("#dealsGrid");
  const fallback = [
    { id: "m1", name_en: "Vortex X8 Wireless Mouse", name_fa: "ماوس بدون‌سیم Vortex X8", usd: 35, price_toman: 2490000, old_toman: 2890000, stock: 3, hot: true, category: "mouse", desc_en: "26K sensor, 58g weight, 0.8ms latency — built for competitive FPS.", specs_en: ["26,000 DPI sensor", "58g weight", "70h battery", "2.4G + Bluetooth"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/m1.webp" },
    { id: "m3", name_en: "Nova Pro Esports Mouse", name_fa: "ماوس حرفه‌ای Nova Pro", usd: 69, price_toman: 4890000, old_toman: null, stock: 8, hot: true, category: "mouse", desc_en: "Flagship: 30K sensor, 100M-click optical switches, magnetic charging dock.", specs_en: ["30,000 DPI sensor", "Optical switches", "52g weight", "Charging dock"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/m3.webp" },
    { id: "k1", name_en: "Hex 65% Mechanical Keyboard", name_fa: "کیبورد مکانیکی Hex 65%", usd: 53, price_toman: 3790000, old_toman: 4290000, stock: 2, hot: true, category: "keyboard", desc_en: "Linear red switches, hot-swappable, detachable Type-C — compact and fast.", specs_en: ["65% layout", "Linear red switches", "Hot-swap", "Per-key RGB"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/k1.webp" },
    { id: "h1", name_en: "Echo 7.1 Wireless Headset", name_fa: "هدست بی‌سیم Echo 7.1", usd: 41, price_toman: 2890000, old_toman: 3290000, stock: 4, hot: true, category: "headset", desc_en: "7.1 surround, noise-cancelling mic, 40h battery.", specs_en: ["7.1 surround", "40h battery", "ENC microphone", "50mm drivers"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/h1.webp" },
    { id: "c1", name_en: "Throne S Gaming Chair", name_fa: "صندلی Throne S", usd: 112, price_toman: 7990000, old_toman: 8990000, stock: 2, hot: true, category: "chair", desc_en: "High back with lumbar pillow, PU leather, 150kg capacity.", specs_en: ["Lumbar support", "Height adjustable", "180° backrest", "150kg capacity"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/c1.webp" },
    { id: "cs1", name_en: "PlayStation 5 Pro — Disc Edition", name_fa: "پلی‌استیشن 5 Pro — نسخه دیسک", usd: 485, price_toman: 34500000, old_toman: null, stock: 1, hot: true, category: "console", desc_en: "Faster GPU, advanced ray tracing, 2TB SSD.", specs_en: ["2TB SSD", "4K/120Hz", "DualSense controller"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/cs1.webp" },
    { id: "g1", name_en: "Cyber Rift 2 — Complete Edition", name_fa: "Cyber Rift 2 — نسخهٔ کامل", usd: 45, price_toman: 3200000, old_toman: 3800000, stock: 15, hot: true, category: "game", desc_en: "Cyberpunk open world with mech combat; all DLC included.", specs_en: ["Single/Online", "4K HDR", "Cloud saves"], image: "https://abwlfdlddrwyshyangylys-stack.github.io/RIFTGEAR/images/g1.webp" }
  ];
  let catalog = fallback.slice();
  const byId = id => catalog.find(p => p.id === id);

  const fmtToman = n => (lang === "fa"
    ? Number(n).toLocaleString("fa-IR")
    : Number(n).toLocaleString("en-US"));
  const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
  const normQty = v => Math.max(0, Math.floor(Number(v) || 0));

  /* ---------------- cart ---------------- */
  let cart = {};
  try {
    const v = JSON.parse(localStorage.getItem("slp_cart"));
    if (v && typeof v === "object" && !Array.isArray(v)) cart = v;
  } catch { /* fresh cart */ }
  const saveCart = () => {
    try { localStorage.setItem("slp_cart", JSON.stringify(cart)); } catch { /* private mode */ }
    renderCart();
  };
  const cartIds = () => Object.keys(cart).filter(id => byId(id));
  const cartCount = () => cartIds().reduce((a, id) => a + normQty(cart[id]), 0);
  const cartTotals = () => {
    let toman = 0, usd = 0;
    for (const id of cartIds()) {
      const p = byId(id), q = normQty(cart[id]);
      if (q > 0 && num(p.price_toman) > 0) { toman += num(p.price_toman) * q; usd += num(p.usd) * q; }
    }
    return { toman, usd };
  };
  const liveMsg = msg => { const el = $("#cartLive"); if (el) el.textContent = msg; };
  function addToCart(id, n = 1) {
    const p = byId(id);
    if (!p || num(p.stock) <= 0 || num(p.price_toman) <= 0) return false;
    const qty = normQty(n) || 1;
    const have = normQty(cart[id]);
    if (have + qty > num(p.stock)) { liveMsg(t("maxStock")(num(p.stock))); return false; }
    cart[id] = have + qty;
    saveCart();
    liveMsg(t("added")(pname(p)));
    return true;
  }
  function changeQty(id, delta) {
    const p = byId(id);
    const next = normQty(cart[id]) + normQty(Math.abs(delta)) * (delta < 0 ? -1 : 1);
    if (next <= 0) delete cart[id];
    else if (p && next <= num(p.stock)) cart[id] = next;
    else if (p) { liveMsg(t("maxStock")(num(p.stock))); return; }
    else return;
    saveCart();
  }
  function orderText() {
    const lines = cartIds().map(id => {
      const p = byId(id), q = normQty(cart[id]);
      return `${q}× ${pname(p)} — ${fmtToman(num(p.price_toman) * q)} Toman ($${num(p.usd) * q})`;
    });
    const { toman, usd } = cartTotals();
    const head = lang === "fa" ? "سفارش RIFTGEAR:" : "RIFTGEAR order:";
    const tot = lang === "fa" ? `جمع کل: ${fmtToman(toman)} تومان ($${usd})` : `Total: ${fmtToman(toman)} Toman ($${usd})`;
    return [head, ...lines, tot].join("\n");
  }
  function renderCart() {
    const n = cartCount();
    const cc = $("#cartCount");
    if (cc) cc.textContent = n;
    const box = $("#cartItems");
    const { toman, usd } = cartTotals();
    if (box) {
      const ids = cartIds();
      box.innerHTML = ids.length ? ids.map(id => {
        const p = byId(id), q = normQty(cart[id]);
        return `<div class="cart-item" data-id="${esc(id)}">
          <div><b dir="auto">${esc(pname(p))}</b>
            <span class="cart-line">${q} × ${esc(fmtToman(p.price_toman))} Toman ($${esc(p.usd)})</span></div>
          <div class="qty">
            <button data-q="-" aria-label="decrease">−</button><span>${q}</span>
            <button data-q="+" aria-label="increase">+</button>
            <button data-rm aria-label="${esc(t("remove"))}">✕</button>
          </div>
        </div>`;
      }).join("") : `<p class="cart-empty">${esc(t("cartEmpty"))}</p>`;
    }
    const tot = $("#cartTotal"), tote = $("#cartTotalUsd");
    if (tot) tot.textContent = `${t("total")}: ${fmtToman(toman)} Toman`;
    if (tote) tote.textContent = `$${usd}`;
    const co = $("#checkoutBtn");
    if (co) {
      co.href = TG_BASE + encodeURIComponent(orderText() + "\n" + CANON);
      const empty = !n;
      co.classList.toggle("is-disabled", empty);
      co.setAttribute("aria-disabled", String(empty));
    }
  }
  const checkoutBtn = $("#checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", e => {
    if (!cartCount()) e.preventDefault();
  });
  document.addEventListener("click", e => {
    const q = e.target.closest("[data-q]");
    if (q) {
      const item = q.closest(".cart-item");
      if (item) changeQty(item.dataset.id, q.dataset.q === "+" ? 1 : -1);
      return;
    }
    if (e.target.closest("[data-rm]")) {
      const item = e.target.closest(".cart-item");
      if (item) { delete cart[item.dataset.id]; saveCart(); }
    }
  });

  /* drawer open/close: hidden/inert + focus trap + focus return */
  const drawer = $("#cartDrawer"), scrim = $("#cartScrim");
  let lastFocus = null;
  function toggleCart(open) {
    if (!drawer) return;
    if (open) {
      lastFocus = document.activeElement;
      drawer.removeAttribute("hidden"); drawer.removeAttribute("inert");
      drawer.classList.add("open");
      if (scrim) scrim.classList.add("show");
      document.body.classList.add("no-scroll");
      const c = $("#cartClose"); if (c) c.focus();
    } else {
      drawer.classList.remove("open");
      if (scrim) scrim.classList.remove("show");
      document.body.classList.remove("no-scroll");
      drawer.setAttribute("hidden", ""); drawer.setAttribute("inert", "");
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    }
  }
  if (drawer) drawer.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const f = $$('button, a[href], input, select, [tabindex]:not([tabindex="-1"])', drawer)
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const cartBtn = $("#cartBtn"), cartClose = $("#cartClose");
  if (cartBtn) cartBtn.addEventListener("click", () => toggleCart(true));
  if (cartClose) cartClose.addEventListener("click", () => toggleCart(false));
  if (scrim) scrim.addEventListener("click", () => toggleCart(false));

  /* ---------------- grid: search + filter + sort ---------------- */
  function filtered() {
    let list = catalog.filter(p => activeCat === "all" || p.category === activeCat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => [p.name_en, p.name_fa, p.desc_en, p.desc_fa,
        p.category, ...(p.specs_en || []), ...(p.specs_fa || [])]
        .filter(Boolean).some(s => String(s).toLowerCase().includes(q)));
    }
    if (sortMode === "asc") list = [...list].sort((a, b) => num(a.price_toman) - num(b.price_toman));
    else if (sortMode === "desc") list = [...list].sort((a, b) => num(b.price_toman) - num(a.price_toman));
    return list;
  }
  function stockLine(p) {
    if (num(p.stock) <= 0) return `<p class="pd-stock" style="color:#f87171">${esc(t("oos"))}</p>`;
    if (num(p.stock) <= 2) return `<p class="pd-stock">${esc(t("onlyLeft")(num(p.stock)))}</p>`;
    return "";
  }
  function cardHTML(p) {
    const showOld = num(p.old_toman) > num(p.price_toman);
    const old = showOld
      ? ` <small style="text-decoration:line-through;color:var(--dim)">${esc(fmtToman(p.old_toman))} Toman</small>`
      : "";
    const dis = num(p.stock) <= 0 ? "disabled" : "";
    const img = safeImg(p.image);
    return `<article class="card price-card${num(p.stock) <= 2 && num(p.stock) > 0 ? " popular" : ""}" data-id="${esc(p.id)}" tabindex="0" aria-label="${esc(pname(p))}">
      ${p.hot ? `<span class="tier">◆ HOT</span>` : ""}
      ${img ? `<img src="${esc(img)}" alt="${esc(pname(p))}" loading="lazy" width="600" height="450" class="pimg">` : ""}
      <h3 dir="auto">${esc(pname(p))}</h3>
      ${p.name_fa ? `<span dir="auto" lang="fa" class="fa-sub">${esc(p.name_fa)}</span>` : ""}
      <p>${esc(pdesc(p))}</p>
      ${stockLine(p)}
      <div class="amount">$${esc(p.usd)}<small> · ${esc(fmtToman(p.price_toman))} Toman</small>${old}</div>
      <p class="ships">${esc(t("shipsIran"))}</p>
      <ul>${pspecs(p).slice(0, 3).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" data-add="${esc(p.id)}" ${dis}>${num(p.stock) <= 0 ? esc(t("oos")) : esc(t("add"))}</button>
        <button class="btn btn-ghost btn-sm" data-detail="${esc(p.id)}">${esc(t("details"))}</button>
      </div>
    </article>`;
  }
  function renderChips() {
    const row = $("#chipsRow");
    if (!row) return;
    row.innerHTML = "";
    CATS.forEach(c => {
      const b = document.createElement("button");
      b.className = "chip" + (c.id === activeCat ? " active" : "");
      b.textContent = lang === "fa" ? c.fa : c.en;
      b.setAttribute("aria-pressed", String(c.id === activeCat));
      b.addEventListener("click", () => { activeCat = c.id; renderChips(); renderShop(); });
      row.appendChild(b);
    });
  }
  function renderShop() {
    if (!grid) return;
    const list = filtered();
    grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty-state"><p>${esc(t("empty"))}</p><button class="btn btn-ghost btn-sm" id="resetFilters">${esc(t("reset"))}</button></div>`;
    const rb = $("#resetFilters");
    if (rb) rb.addEventListener("click", () => {
      query = ""; activeCat = "all"; sortMode = "new";
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "new";
      renderChips(); renderShop();
    });
    if (grid.classList.contains("stagger")) grid.classList.add("visible");
  }
  if (grid) {
    grid.addEventListener("click", e => {
      const add = e.target.closest("[data-add]");
      if (add) { e.stopPropagation(); addToCart(add.dataset.add, 1); return; }
      const det = e.target.closest("[data-detail]");
      if (det) { e.stopPropagation(); openProduct(det.dataset.detail); return; }
      const card = e.target.closest(".card[data-id]");
      if (card) openProduct(card.dataset.id);
    });
    grid.addEventListener("keydown", e => {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card[data-id]")) {
        e.preventDefault();
        openProduct(e.target.dataset.id);
      }
    });
  }
  const searchInput = $("#searchInput");
  if (searchInput) {
    let st;
    searchInput.addEventListener("input", e => {
      clearTimeout(st);
      st = setTimeout(() => { query = e.target.value.trim(); renderShop(); }, 150);
    });
  }
  const sortSelect = $("#sortSelect");
  if (sortSelect) sortSelect.addEventListener("change", e => {
    sortMode = e.target.value;
    renderShop();
  });

  /* ---------------- product modal ---------------- */
  const dialog = $("#productDialog"), pdBody = $("#pdBody");
  function openProduct(id) {
    const p = byId(id);
    if (!p || !dialog || !pdBody) return;
    const stockTxt = num(p.stock) <= 0 ? t("oos")
      : num(p.stock) <= 2 ? t("onlyLeft")(num(p.stock))
      : `${t("inStock")}: ${num(p.stock)}`;
    const showOld = num(p.old_toman) > num(p.price_toman);
    const old = showOld
      ? ` <small style="text-decoration:line-through;color:var(--dim)">${esc(fmtToman(p.old_toman))} Toman</small>`
      : "";
    const img = safeImg(p.image);
    pdBody.innerHTML = `
      ${img ? `<img src="${esc(img)}" alt="${esc(pname(p))}" width="600" height="450">` : ""}
      <h3 id="pdTitle" dir="auto">${esc(pname(p))}</h3>
      ${p.name_fa ? `<span dir="auto" lang="fa">${esc(p.name_fa)}</span>` : ""}
      <p>${esc(pdesc(p))}</p>
      <p class="pd-stock">${esc(stockTxt)}</p>
      <ul>${pspecs(p).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="amount">$${esc(p.usd)}<small> · ${esc(fmtToman(p.price_toman))} Toman</small>${old}</div>
      <p class="ships">${esc(t("shipsIran"))}</p>
      <div class="pd-actions">
        <button class="btn btn-primary" id="pdAdd" ${num(p.stock) <= 0 ? "disabled" : ""}>${num(p.stock) <= 0 ? esc(t("oos")) : esc(t("add"))}</button>
        <button class="btn btn-ghost" id="pdClose">${esc(t("close"))}</button>
      </div>`;
    const add = $("#pdAdd"), close = $("#pdClose");
    if (add) add.addEventListener("click", () => {
      if (addToCart(p.id, 1) && typeof dialog.close === "function") dialog.close();
    });
    if (close) close.addEventListener("click", () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    });
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    else if (!dialog.open) dialog.setAttribute("open", "");
  }

  /* ---------------- FA/EN toggle ---------------- */
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    try { localStorage.setItem("slp_lang", lang); } catch { /* private mode */ }
    $$("[data-i18n]").forEach(el => {
      const v = t(el.dataset.i18n);
      if (typeof v === "string") el.textContent = v;
    });
    const h = $("[data-i18n-h]"); if (h) h.textContent = t("dealsTitle");
    const ps = $("[data-i18n-p]"); if (ps) ps.textContent = t("dealsSub");
    const ch = $("[data-i18n-h='contactTitle']"); if (ch && ch !== h) ch.textContent = t("contactTitle");
    const cps = $("[data-i18n-p='contactSub']"); if (cps && cps !== ps) cps.textContent = t("contactSub");
    const cth = $("[data-i18n-h='catTitle']"); if (cth && cth !== h) cth.textContent = t("catTitle");
    const ctp = $("[data-i18n-p='catSub']"); if (ctp && ctp !== ps) ctp.textContent = t("catSub");
    const cfp = $("[data-i18n-p='footAbout']"); if (cfp) cfp.textContent = t("footAbout");
    const ct = $("[data-i18n-cart='title']"); if (ct) ct.textContent = t("cartTitle");
    const cn = $("[data-i18n-cart='note']"); if (cn) cn.textContent = t("cartNote");
    const lb = $("#langBtn"); if (lb) lb.textContent = lang === "en" ? "فارسی" : "EN";
    if (searchInput) searchInput.placeholder = t("searchPh");
    if (sortSelect && sortSelect.options.length >= 3) {
      sortSelect.options[0].textContent = t("sortNew");
      sortSelect.options[1].textContent = t("sortAsc");
      sortSelect.options[2].textContent = t("sortDesc");
    }
    const co = $("#checkoutBtn"); if (co) co.textContent = t("checkout");
    const cc2 = $("#cartClose"); if (cc2) cc2.setAttribute("aria-label", t("close"));
    renderChips(); renderShop(); renderCart();
  }
  const langBtn = $("#langBtn");
  if (langBtn) langBtn.addEventListener("click", () => {
    lang = lang === "en" ? "fa" : "en";
    applyLang();
  });

  /* ---------------- SEO: JSON-LD ItemList/Offer for all products ---------------- */
  function injectJsonLd() {
    if ($("#rg-jsonld") || document.querySelector('script[type="application/ld+json"]')) return;
    const items = catalog.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${p.name_fa} | ${p.name_en}`,
        sku: p.id,
        description: p.desc_en,
        category: p.category,
        image: safeImg(p.image) || undefined,
        url: CANON + "#" + p.id,
        brand: { "@type": "Brand", name: "RIFTGEAR" },
        offers: {
          "@type": "Offer",
          url: CANON + "#" + p.id,
          price: String(num(p.price_toman)),
          priceCurrency: "IRR",
          availability: num(p.stock) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    }));
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "RIFTGEAR products",
      numberOfItems: catalog.length,
      itemListElement: items,
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "rg-jsonld";
    s.textContent = JSON.stringify(ld);
    document.body.appendChild(s);
  }

  /* boot: catalog first, then render everything */
  function boot(list) {
    if (Array.isArray(list) && list.length) catalog = list.filter(p => p && p.id);
    const known = new Set(catalog.map(p => p.id));
    cart = Object.fromEntries(
      Object.entries(cart)
        .filter(([id, q]) => known.has(id) && normQty(q) > 0 && num(byId(id).stock) > 0)
        .map(([id, q]) => [id, Math.min(normQty(q), num(byId(id).stock))])
    );
    applyLang();
    injectJsonLd();
  }
  renderChips(); renderShop(); renderCart(); applyLang();
  fetch("data/catalog.json")
    .then(r => { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .then(d => boot(d.products || d))
    .catch(() => fetch("data/products.json")
      .then(r => { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(d => boot(d.products || d))
      .catch(() => boot(null)));

  /* FAQ accordion (keyboard-accessible via <button>) */
  $$(".faq-item").forEach(item => {
    const btn = $(".faq-q", item);
    const panel = $(".faq-a", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item.open").forEach(o => {
        o.classList.remove("open");
        $(".faq-a", o).style.maxHeight = null;
        $(".faq-q", o).setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Scroll reveals + stagger */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal, .stagger").forEach(el => io.observe(el));

  /* Count-up stats (disabled with prefers-reduced-motion) */
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$("[data-count]").forEach(el => {
    if (reduceMotion) {
      const target0 = parseFloat(el.dataset.count);
      el.textContent = (target0 % 1 ? target0.toFixed(1) : Math.round(target0).toLocaleString()) + (el.dataset.suffix || "");
      return;
    }
    const statIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        statIo.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const dur = 1400, t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (target % 1 ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    statIo.observe(el);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { toggleCart(false); setMobile(false); }
  });
})();
