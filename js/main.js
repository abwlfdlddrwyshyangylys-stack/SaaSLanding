(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const TG_BASE = "https://t.me/share/url?url=";

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

  /* Mobile hamburger */
  const burger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.textContent = open ? "✕" : "☰";
    });
    $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.textContent = "☰";
    }));
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
      navProducts: "Products", navCompare: "Compare", navDeals: "Best sellers",
      navDeals2: "Best sellers", navReviews: "Reviews", navFaq: "FAQ",
      dealsTitle: "Hot picks, live stock",
      dealsSub: "Full catalog below — search, filter by category, or sort by price.",
      timerLabel: "Deals end in",
      searchPh: "Search products…", sortNew: "Newest", sortAsc: "Cheapest", sortDesc: "Priciest",
      cartTitle: "🛒 Cart", cartEmpty: "Your cart is empty — go grab some gear!",
      cartNote: "Cart is saved on this device only.",
      checkout: "Order via Telegram", add: "Add to cart", details: "Details",
      total: "Total", oos: "Out of stock", inStock: "In stock",
      onlyLeft: n => `Only ${n} left`, empty: "No products match your search.",
      remove: "Remove", close: "Close",
    },
    fa: {
      navProducts: "محصولات", navCompare: "مقایسه", navDeals: "پرفروش‌ها",
      navDeals2: "پرفروش‌ها", navReviews: "نظرات", navFaq: "سؤالات",
      dealsTitle: "پرفروش‌ها، موجودی زنده",
      dealsSub: "کاتالوگ کامل — جستجو، فیلتر دسته‌بندی یا مرتب‌سازی بر اساس قیمت.",
      timerLabel: "پایان پیشنهادها تا",
      searchPh: "جستجوی محصول…", sortNew: "جدیدترین", sortAsc: "ارزان‌ترین", sortDesc: "گران‌ترین",
      cartTitle: "🛒 سبد خرید", cartEmpty: "سبد خالی است — بریم خرید!",
      cartNote: "سبد فقط روی همین دستگاه ذخیره می‌شود.",
      checkout: "ثبت سفارش از طریق تلگرام", add: "افزودن به سبد", details: "جزئیات",
      total: "جمع کل", oos: "ناموجود", inStock: "موجود",
      onlyLeft: n => `فقط ${n} عدد مانده`, empty: "محصولی با این جستجو پیدا نشد.",
      remove: "حذف", close: "بستن",
    },
  };
  const loadStr = (k, ok, dflt) => {
    try { const v = localStorage.getItem(k); return ok.includes(v) ? v : dflt; }
    catch { return dflt; }
  };
  let lang = loadStr("slp_lang", ["en", "fa"], "en");
  let query = "", activeCat = "all", sortMode = "new";
  const t = k => I18N[lang][k];
  const pname = p => (lang === "fa" ? p.name_fa : p.name_en);
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

  const fmtToman = n => Number(n).toLocaleString("en-US");

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
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotals = () => {
    let toman = 0, usd = 0;
    for (const [id, q] of Object.entries(cart)) {
      const p = byId(id);
      if (p && q > 0) { toman += p.price_toman * q; usd += p.usd * q; }
    }
    return { toman, usd };
  };
  function addToCart(id, n = 1) {
    const p = byId(id);
    if (!p || p.stock <= 0) return false;
    const have = cart[id] || 0;
    if (have + n > p.stock) return false;
    cart[id] = have + n;
    saveCart();
    return true;
  }
  function changeQty(id, delta) {
    const p = byId(id);
    const next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id];
    else if (p && next <= p.stock) cart[id] = next;
    else return;
    saveCart();
  }
  function orderText() {
    const lines = Object.entries(cart).map(([id, q]) => {
      const p = byId(id);
      if (!p) return "";
      return `${q}× ${p.name_en} — ${fmtToman(p.price_toman * q)} Toman ($${p.usd * q})`;
    }).filter(Boolean);
    const { toman, usd } = cartTotals();
    return ["RIFTGEAR order:", ...lines,
      `Total: ${fmtToman(toman)} Toman ($${usd})`].join("\n");
  }
  function renderCart() {
    const n = cartCount();
    const cc = $("#cartCount");
    if (cc) cc.textContent = n;
    const box = $("#cartItems");
    const { toman, usd } = cartTotals();
    if (box) {
      const ids = Object.keys(cart).filter(id => byId(id));
      box.innerHTML = ids.length ? ids.map(id => {
        const p = byId(id), q = cart[id];
        return `<div class="cart-item" data-id="${id}">
          <div><b>${pname(p)}</b>
            <span class="cart-line">${q} × ${fmtToman(p.price_toman)} Toman ($${p.usd})</span></div>
          <div class="qty">
            <button data-q="-" aria-label="decrease">−</button><span>${q}</span>
            <button data-q="+" aria-label="increase">+</button>
            <button data-rm aria-label="${t("remove")}">✕</button>
          </div>
        </div>`;
      }).join("") : `<p class="cart-empty">${t("cartEmpty")}</p>`;
    }
    const tot = $("#cartTotal"), tote = $("#cartTotalUsd");
    if (tot) tot.textContent = `${t("total")}: ${fmtToman(toman)} Toman`;
    if (tote) tote.textContent = `$${usd}`;
    const co = $("#checkoutBtn");
    if (co) {
      const site = location.href.split("#")[0];
      co.href = TG_BASE + encodeURIComponent(site) + "&text=" + encodeURIComponent(orderText());
      co.classList.toggle("is-disabled", !n);
      co.setAttribute("aria-disabled", String(!n));
    }
  }
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

  /* drawer open/close */
  const drawer = $("#cartDrawer"), scrim = $("#cartScrim");
  function toggleCart(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("show", open);
    document.body.classList.toggle("no-scroll", open);
    if (open) { const c = $("#cartClose"); if (c) c.focus(); }
  }
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
    if (sortMode === "asc") list = [...list].sort((a, b) => a.price_toman - b.price_toman);
    else if (sortMode === "desc") list = [...list].sort((a, b) => b.price_toman - a.price_toman);
    return list;
  }
  function stockLine(p) {
    if (p.stock <= 0) return `<p style="color:#f87171;font-weight:700;font-size:.88rem">${t("oos")}</p>`;
    if (p.stock <= 2) return `<p style="color:var(--gold);font-weight:700;font-size:.88rem">${t("onlyLeft")(p.stock)}</p>`;
    return "";
  }
  function cardHTML(p) {
    const old = p.old_toman
      ? ` <small style="text-decoration:line-through;color:var(--dim)">${fmtToman(p.old_toman)} Toman</small>`
      : "";
    const dis = p.stock <= 0 ? "disabled" : "";
    return `<article class="card price-card${p.stock <= 2 && p.stock > 0 ? " popular" : ""}" data-id="${p.id}" style="cursor:pointer" tabindex="0" role="button" aria-label="${pname(p)}">
      ${p.hot ? `<span class="tier">◆ HOT</span>` : ""}
      <img src="${p.image}" alt="${pname(p)}" loading="lazy" style="width:100%;border-radius:12px;border:1px solid var(--border);margin-bottom:14px">
      <h3>${pname(p)}</h3>
      ${lang === "en" && p.name_fa ? `<span dir="auto" style="color:var(--dim);font-size:.88rem">${p.name_fa}</span>` : ""}
      <p>${pdesc(p)}</p>
      ${stockLine(p)}
      <div class="amount">$${p.usd}<small> · ${fmtToman(p.price_toman)} Toman</small>${old}</div>
      <ul>${pspecs(p).slice(0, 3).map(s => `<li>${s}</li>`).join("")}</ul>
      <div style="display:flex;gap:10px;margin-top:auto">
        <button class="btn btn-primary btn-sm" data-add="${p.id}" ${dis} style="flex:1">${p.stock <= 0 ? t("oos") : t("add")}</button>
        <button class="btn btn-ghost btn-sm" data-detail="${p.id}">${t("details")}</button>
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
      : `<p style="color:var(--dim)">${t("empty")}</p>`;
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
    const stockTxt = p.stock <= 0 ? t("oos")
      : p.stock <= 2 ? t("onlyLeft")(p.stock)
      : `${t("inStock")}: ${p.stock}`;
    const old = p.old_toman
      ? ` <small style="text-decoration:line-through;color:var(--dim)">${fmtToman(p.old_toman)} Toman</small>`
      : "";
    pdBody.innerHTML = `
      <img src="${p.image}" alt="${pname(p)}">
      <h3 id="pdTitle">${pname(p)}</h3>
      ${lang === "en" && p.name_fa ? `<span dir="auto" style="color:var(--dim);font-size:.9rem">${p.name_fa}</span>` : ""}
      <p>${pdesc(p)}</p>
      <p class="pd-stock">${stockTxt}</p>
      <ul>${pspecs(p).map(s => `<li>${s}</li>`).join("")}</ul>
      <div class="amount">$${p.usd}<small> · ${fmtToman(p.price_toman)} Toman</small>${old}</div>
      <div class="pd-actions">
        <button class="btn btn-primary" id="pdAdd" ${p.stock <= 0 ? "disabled" : ""}>${p.stock <= 0 ? t("oos") : t("add")}</button>
        <button class="btn btn-ghost" id="pdClose">${t("close")}</button>
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
    const tl = $("[data-i18n-t]"); if (tl) tl.textContent = t("timerLabel");
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

  /* ---------------- deal timer: countdown to midnight Tehran ---------------- */
  function tickTimer() {
    const el = $("#dealTimer");
    if (!el) return;
    const tehran = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
    const mid = new Date(tehran);
    mid.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((mid - tehran) / 1000));
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    el.textContent = `${hh}:${mm}:${ss}`;
  }
  tickTimer();
  setInterval(tickTimer, 1000);

  /* ---------------- SEO: JSON-LD ItemList/Offer for all products ---------------- */
  function injectJsonLd() {
    if ($("#rg-jsonld")) return;
    const items = catalog.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${p.name_fa} | ${p.name_en}`,
        sku: p.id,
        description: p.desc_en,
        category: p.category,
        image: p.image,
        offers: {
          "@type": "Offer",
          price: String(p.price_toman * 10),
          priceCurrency: "IRR",
          availability: p.stock > 0
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
    document.head.appendChild(s);
  }

  /* boot: catalog first, then render everything */
  function boot(list) {
    if (Array.isArray(list) && list.length) catalog = list;
    cart = Object.fromEntries(
      Object.entries(cart).filter(([id, q]) => byId(id) && Number(q) > 0)
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

  /* Count-up stats */
  const statIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
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
  $$("[data-count]").forEach(el => statIo.observe(el));

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") toggleCart(false);
  });
})();
