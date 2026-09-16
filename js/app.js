// Navigazione principale della SPA
(function () {
  const navButtons = document.querySelectorAll(".navbtn");
  const views = document.querySelectorAll(".view");
  const hamburger = document.getElementById("hamburger");
  const mainnav = document.getElementById("mainnav");

  function goTo(target) {
    views.forEach((v) => v.classList.toggle("active", v.id === "view-" + target));
    navButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === target));
    mainnav.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
