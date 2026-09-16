// ================= RICERCA SU TUTTO IL SITO =================
(function () {
  const input = document.getElementById("site-search-input");
  const btn = document.getElementById("site-search-btn");
  const resultsEl = document.getElementById("site-search-results");
  if (!input || !btn || !resultsEl) return;

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, ""); // rimuove gli accenti per un confronto più permissivo
  }

  function escapeHtmlLocal(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Costruisce l'indice: un elemento per ogni blocco di lezione e per ogni scheda esercizio, di ogni sezione (tranne la Home)
  const index = [];
  let blockCounter = 0;

  function addEntry(el, viewId, viewLabel, blockTitle) {
    const text = el.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;
    if (!el.id) el.id = "search-block-" + blockCounter++;
    index.push({ viewId, viewLabel, blockTitle: blockTitle || viewLabel, text, normText: normalize(text), el });
  }

  document.querySelectorAll(".view").forEach((view) => {
    if (view.id === "view-home") return;
    const titleEl = view.querySelector(".view-title");
    const viewLabel = titleEl ? titleEl.textContent.trim() : view.id.replace("view-", "");
    const viewId = view.id.replace("view-", "");

    view.querySelectorAll(".lesson-block").forEach((block) => {
      const headingEl = block.querySelector("h2, h3");
      addEntry(block, viewId, viewLabel, headingEl ? headingEl.textContent.trim() : null);
    });

    // Le schede esercizio dentro #exercises-grid non sono in un .lesson-block: le indicizziamo a parte
    view.querySelectorAll(".exercise-tile").forEach((tile) => {
      const headingEl = tile.querySelector("h4");
      addEntry(tile, viewId, viewLabel, headingEl ? headingEl.textContent.trim() : null);
    });
  });

  function buildSnippet(entry, normQuery) {
    const idx = entry.normText.indexOf(normQuery);
    if (idx === -1) return entry.text.slice(0, 140) + (entry.text.length > 140 ? "…" : "");
    const start = Math.max(0, idx - 50);
    const end = Math.min(entry.text.length, idx + normQuery.length + 70);
    let snippet = entry.text.slice(start, end);
    if (start > 0) snippet = "…" + snippet;
    if (end < entry.text.length) snippet += "…";
    return snippet;
  }

  function highlightSnippet(snippet, rawQuery) {
    const lower = snippet.toLowerCase();
    const q = rawQuery.toLowerCase();
    if (!q) return escapeHtmlLocal(snippet);
    let result = "";
    let i = 0;
    while (i < snippet.length) {
      const idx = lower.indexOf(q, i);
      if (idx === -1) {
        result += escapeHtmlLocal(snippet.slice(i));
        break;
      }
      result += escapeHtmlLocal(snippet.slice(i, idx));
      result += "<mark>" + escapeHtmlLocal(snippet.slice(idx, idx + q.length)) + "</mark>";
      i = idx + q.length;
    }
    return result;
  }

  function goToResult(entry) {
    if (window.appGoTo) window.appGoTo(entry.viewId);
    setTimeout(() => {
      entry.el.scrollIntoView({ behavior: "smooth", block: "start" });
      entry.el.classList.add("search-highlight");
      setTimeout(() => entry.el.classList.remove("search-highlight"), 1800);
    }, 300);
  }

  function runSearch() {
    const raw = input.value.trim();
    if (!raw) {
      resultsEl.innerHTML = "";
      return;
    }
    const normQuery = normalize(raw);
    const matches = index
      .filter((entry) => entry.normText.includes(normQuery))
      .sort((a, b) => a.normText.indexOf(normQuery) - b.normText.indexOf(normQuery))
      .slice(0, 12);

    if (matches.length === 0) {
      resultsEl.innerHTML = `<p class="search-empty">Nessun risultato per "<strong>${escapeHtmlLocal(raw)}</strong>". Prova con un'altra parola chiave (es. "ciclo", "puntatore", "efficienza"...).</p>`;
      return;
    }

    resultsEl.innerHTML = matches
      .map((entry, i) => {
        const snippet = buildSnippet(entry, normQuery);
        return `
          <div class="search-result-item" data-index="${i}">
            <div class="sr-view">${escapeHtmlLocal(entry.viewLabel)}</div>
            <div class="sr-title">${escapeHtmlLocal(entry.blockTitle)}</div>
            <div class="sr-snippet">${highlightSnippet(snippet, raw)}</div>
          </div>
        `;
      })
      .join("");

    [...resultsEl.querySelectorAll(".search-result-item")].forEach((el, i) => {
      el.addEventListener("click", () => goToResult(matches[i]));
    });
  }

  let debounceTimer = null;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 200);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer);
      runSearch();
    }
  });
  btn.addEventListener("click", runSearch);
})();
