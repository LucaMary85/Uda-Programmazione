// Navigazione principale della SPA
(function () {
  const navButtons = document.querySelectorAll(".navbtn");
  const views = document.querySelectorAll(".view");
  const hamburger = document.getElementById("hamburger");
  const mainnav = document.getElementById("mainnav");

  // Rimuove la classe di transizione a fine animazione CSS, con un timeout
  // di sicurezza per i casi in cui "animationend" non scatti mai (pagina in
  // background con l'animazione sospesa, prefers-reduced-motion attivato a
  // metà sessione dopo che la classe è già stata aggiunta, ecc.): senza
  // questo fallback la vista uscente resterebbe bloccata per sempre come
  // overlay posizionato in absolute.
  function cleanupAfterAnimation(el, className, fallbackMs) {
    let done = false;
    const timer = setTimeout(finish, fallbackMs);
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.classList.remove(className);
      el.removeEventListener("animationend", finish);
    }
    el.addEventListener("animationend", finish, { once: true });
  }

  function goTo(target) {
    const newView = document.getElementById("view-" + target);
    const oldView = document.querySelector(".view.active");

    navButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === target));
    mainnav.classList.remove("open");

    if (!newView || newView === oldView) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Controllato a ogni chiamata (non messo in cache): l'utente può
    // attivare "riduci animazioni" anche a sessione già avviata.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      views.forEach((v) => v.classList.toggle("active", v === newView));
      window.scrollTo({ top: 0, behavior: "auto" });
      if (window.appRevealCheck) window.appRevealCheck();
      return;
    }

    if (oldView) {
      oldView.classList.remove("active");
      oldView.classList.add("view-exit");
      cleanupAfterAnimation(oldView, "view-exit", 500);
    }

    newView.classList.add("active", "view-enter");
    cleanupAfterAnimation(newView, "view-enter", 700);

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
