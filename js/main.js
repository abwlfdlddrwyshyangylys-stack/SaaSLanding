(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const TG_URL = "https://t.me/share/url?url=https%3A%2F%2Fabwlfdlddrwyshyangylys-stack.github.io%2FRIFTGEAR%2F";

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

  /* Best sellers: render from JSON w/ inline fallback (file:// use) */
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

  const fmtToman = n => Number(n).toLocaleString("en-US");

  function cardHTML(p) {
    const stock = p.stock <= 2
      ? `<p style="color:var(--gold);font-weight:700;font-size:.88rem">Only ${p.stock} left</p>`
      : "";
    const old = p.old_toman
      ? ` <small style="text-decoration:line-through;color:var(--dim)">${fmtToman(p.old_toman)} Toman</small>`
      : "";
    return `<article class="card price-card${p.stock <= 2 ? " popular" : ""}">
      ${p.hot ? `<span class="tier">◆ HOT</span>` : ""}
      <img src="${p.image}" alt="${p.name_en}" loading="lazy" style="width:100%;border-radius:12px;border:1px solid var(--border);margin-bottom:14px">
      <h3>${p.name_en}</h3>
      <span dir="auto" style="color:var(--dim);font-size:.88rem">${p.name_fa}</span>
      <p>${p.desc_en}</p>
      ${stock}
      <div class="amount">$${p.usd}<small> · ${fmtToman(p.price_toman)} Toman</small>${old}</div>
      <ul>${(p.specs_en || []).slice(0, 3).map(s => `<li>${s}</li>`).join("")}</ul>
      <a href="${TG_URL}" target="_blank" rel="noopener" class="btn btn-primary">Order via Telegram</a>
    </article>`;
  }

  function renderDeals(list) {
    if (!grid) return;
    const items = Array.isArray(list) && list.length ? list : fallback;
    grid.innerHTML = items.map(cardHTML).join("");
  }

  renderDeals(fallback);
  fetch("data/products.json")
    .then(r => { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .then(d => renderDeals(d.products || d))
    .catch(() => { /* fallback already rendered */ });

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
})();
