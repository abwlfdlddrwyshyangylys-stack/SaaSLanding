/* RIFTGEAR motion layer — Anime.js v4 (vendored, MIT).
   Fail-closed: if anime fails to load or user prefers reduced motion,
   the site stays fully visible (CSS default). This file only ADDS motion. */
(() => {
  "use strict";
  if (!window.anime || typeof window.anime.animate !== "function") return;
  const { animate, stagger } = window.anime;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  /* Hero entrance: eyebrow -> title -> sub -> ctas -> proof -> mockup */
  const heroEls = document.querySelectorAll(
    ".hero .eyebrow, .hero h1, .hero .hero-sub, .hero .hero-ctas, .hero .hero-proof, .hero .mockup"
  );
  if (heroEls.length) {
    try {
      animate(heroEls, { opacity: [0, 1], y: [26, 0], duration: 800, delay: stagger(90), ease: "outExpo" });
    } catch (e) { /* CSS default keeps everything visible */ }
  }

  /* Card entrance helper — called from main.js after each grid render */
  window.__riftAnim = cards => {
    try {
      const list = [...cards].filter(el => !el.dataset.animated);
      if (!list.length) return;
      list.forEach(el => { el.dataset.animated = "1"; });
      animate(list, { opacity: [0, 1], y: [22, 0], duration: 600, delay: stagger(60), ease: "outExpo" });
    } catch (e) { /* visible by default anyway */ }
  };
  /* Animate cards already rendered by main.js (script order: main -> anim) */
  window.__riftAnim(document.querySelectorAll("#productsGrid .card, #dealsGrid .card"));

  /* Aurora parallax — ambient only, never touches content */
  const auroras = document.querySelectorAll(".aurora");
  if (auroras.length) {
    let tick = false;
    window.addEventListener("scroll", () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        auroras.forEach((el, i) => { el.style.translate = "0 " + (y * (0.04 + i * 0.02)) + "px"; });
        tick = false;
      });
    }, { passive: true });
  }

  /* Button press micro-interaction */
  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("mousedown", () => {
      try { animate(btn, { scale: [1, 0.96], duration: 120, ease: "outQuad" }); } catch (e) {}
    });
    btn.addEventListener("mouseup", () => {
      try { animate(btn, { scale: 1, duration: 200, ease: "outQuad" }); } catch (e) {}
    });
  });
})();
