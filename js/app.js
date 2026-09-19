// Navigazione principale della SPA
(function () {
  const navButtons = document.querySelectorAll(".navbtn");
  const views = document.querySelectorAll(".view");
  const hamburger = document.getElementById("hamburger");
  const mainnav = document.getElementById("mainnav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function goTo(target) {
    const newView = document.getElementById("view-" + target);
    const oldView = document.querySelector(".view.active");

    navButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === target));
    mainnav.classList.remove("open");

    if (!newView || newView === oldView) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (reduceMotion) {
      views.forEach((v) => v.classList.toggle("active", v === newView));
      window.scrollTo({ top: 0, behavior: "auto" });
      if (window.appRevealCheck) window.appRevealCheck();
      return;
    }

    if (oldView) {
      oldView.classList.remove("active");
      oldView.classList.add("view-exit");
      oldView.addEventListener(
        "animationend",
        function handler() {
          oldView.classList.remove("view-exit");
          oldView.removeEventListener("animationend", handler);
        },
        { once: true }
      );
    }

    newView.classList.add("active", "view-enter");
    newView.addEventListener(
      "animationend",
      function handler() {
        newView.classList.remove("view-enter");
        newView.removeEventListener("animationend", handler);
      },
      { once: true }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.appRevealCheck) window.appRevealCheck();
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.dataset.target));
  });

  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => goTo(el.dataset.goto));
  });

  hamburger.addEventListener("click", () => {
    mainnav.classList.toggle("open");
  });

  window.appGoTo = goTo;

  // Se l'URL contiene un hash (es. Introduzione_Programmazione.html#esercizi),
  // apri direttamente quella view invece della home.
  const initialTarget = location.hash.replace("#", "");
  if (initialTarget && document.getElementById("view-" + initialTarget)) {
    goTo(initialTarget);
  }
})();
