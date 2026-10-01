(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Year */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky nav background */
  const nav = $("#nav");
  const floatCta = $("#floatCta");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 24);
    floatCta.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile hamburger */
  const burger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");
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

  /* Pricing: render from JSON w/ static fallback */
  const grid = $("#pricingGrid");
  const matrixBody = $("#matrixBody");
  const toggle = $("#billingToggle");
  let pricingData = null;
  let annual = false;

  const fallback = {
    currency: "$",
    tiers: [
      { id: "starter", name: "Starter", tagline: "For solo founders.", monthly: 12, annual: 9, cta: "Start free trial", features: ["3 projects", "10k events / mo", "Community support"] },
      { id: "growth", name: "Growth", tagline: "For scaling teams.", monthly: 39, annual: 31, cta: "Start free trial", popular: true, features: ["Unlimited projects", "500k events / mo", "Priority support"] },
      { id: "enterprise", name: "Enterprise", tagline: "For compliance.", monthly: 99, annual: 79, cta: "Talk to sales", features: ["Everything in Growth", "Unlimited events", "SLA + CSM"] }
    ],
    matrix: []
  };

  function renderPricing() {
    const d = pricingData || fallback;
    grid.innerHTML = d.tiers.map(t => {
      const price = annual ? t.annual : t.monthly;
      return `<article class="card price-card${t.popular ? " popular" : ""}">
        <span class="tier">${t.popular ? "◆ MOST POPULAR" : t.name.toUpperCase()}</span>
        ${t.popular ? `<h3>${t.name}</h3>` : `<h3>${t.name}</h3>`}
        <p>${t.tagline}</p>
        <div class="amount">${d.currency}${price}<small> /mo${annual ? ", billed annually" : ""}</small></div>
        <ul>${t.features.map(f => `<li>${f}</li>`).join("")}</ul>
        <a href="#cta" class="btn ${t.popular ? "btn-primary" : "btn-ghost"}">${t.cta}</a>
      </article>`;
    }).join("");
    if (d.matrix && d.matrix.length) {
      matrixBody.innerHTML = d.matrix.map(r =>
        `<tr><td>${r.feature}</td><td>${r.starter}</td><td>${r.growth}</td><td>${r.enterprise}</td></tr>`
      ).join("");
    }
  }

  toggle.addEventListener("click", () => {
    annual = !annual;
    toggle.setAttribute("aria-checked", String(annual));
    $("#billMonthly").style.color = annual ? "" : "var(--text)";
    $("#billAnnual").style.color = annual ? "var(--text)" : "";
    renderPricing();
  });

  fetch("data/pricing.json")
    .then(r => { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .then(d => { pricingData = d; renderPricing(); })
    .catch(() => { pricingData = fallback; renderPricing(); });
  renderPricing();

  /* FAQ accordion (keyboard-accessible via <button>) */
  $$(".faq-item").forEach(item => {
    const btn = $(".faq-q", item);
    const panel = $(".faq-a", item);
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
