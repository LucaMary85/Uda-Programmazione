// Effetto 3D "tilt" al passaggio del mouse sulle card principali
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (prefersReduced || !canHover) return;

  const selector = ".topic-card, .exercise-tile, .history-card, .compare-card, .char-card, .approach, .activity-card";
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const MAX_TILT = 10;

  els.forEach((el) => {
    el.classList.add("tilt-el");
    let raf = null;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - py) * MAX_TILT;
      const rotateY = (px - 0.5) * (MAX_TILT + 2);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
    });

    el.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  });
})();
