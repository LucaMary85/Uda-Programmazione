// Comparsa "3D" dei blocchi principali quando entrano nel viewport
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const selector = ".lesson-block, .topic-card, .exercise-card, .exercise-tile, .history-card, .compare-card, .char-card, .approach, .activity-card, .rel-card";
  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  document.body.classList.add("js-reveal");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  // Controllo immediato: rivela subito ciò che è già dentro (o vicino a) il
  // viewport al caricamento. Serve perché in alcuni contesti (tab aperta in
  // background, pagina non ancora "visible") il primo giro automatico di
  // IntersectionObserver può tardare o non scattare finché la pagina non
  // torna in primo piano: getBoundingClientRect() invece riflette sempre il
  // layout corrente, anche a pagina non composta a video.
  function revealIfVisible(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    if (r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) {
      el.classList.add("in-view");
      io.unobserve(el);
      return true;
    }
    return false;
  }

  function recheckAll() {
    targets.forEach((t) => {
      if (!t.classList.contains("in-view")) revealIfVisible(t);
    });
  }

  targets.forEach((t) => {
    if (!revealIfVisible(t)) io.observe(t);
  });

  // Se la pagina torna visibile dopo essere stata in background, ricontrolla
  // subito gli elementi non ancora rivelati (l'IO potrebbe non essere stato
  // eseguito mentre la pagina era nascosta).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") recheckAll();
  });

  // La SPA (app.js) chiama questa funzione dopo ogni cambio vista: i blocchi
  // della vista appena mostrata passano da display:none a visibili e vanno
  // ricontrollati subito, senza aspettare il giro automatico di IO.
  window.appRevealCheck = recheckAll;
})();
