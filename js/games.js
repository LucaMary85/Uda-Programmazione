function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ================= MEMORY GAME =================
(function () {
  const grid = document.getElementById("memory-grid");
  const restartBtn = document.getElementById("memory-restart");
  const movesEl = document.getElementById("memory-moves");
  const pairsEl = document.getElementById("memory-pairs");
  const totalEl = document.getElementById("memory-total");
  const topicSel = document.getElementById("memory-topic");
  if (!grid) return;

  let cards = [];
  let firstCard = null;
  let lock = false;
  let moves = 0;
  let matched = 0;
  let currentPairs = [];

  function buildDeck() {
    let deck = [];
    currentPairs.forEach((p) => {
      deck.push({ pairId: p.id, display: p.a, big: p.iconSide === "a" });
      deck.push({ pairId: p.id, display: p.b, big: p.iconSide === "b" });
    });
    return shuffleArray(deck);
  }

  function render() {
    grid.innerHTML = "";
    cards.forEach((card, i) => {
      const div = document.createElement("div");
      div.className = "memory-card";
      div.dataset.index = i;
      div.textContent = "?";
      div.addEventListener("click", () => onFlip(i));
      grid.appendChild(div);
    });
  }

  function onFlip(i) {
    if (lock) return;
    const cardEl = grid.children[i];
    if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;

    const data = cards[i];
    cardEl.classList.add("flipped");
    cardEl.innerHTML = data.big ? `<span class="shape-preview">${data.display}</span>` : data.display;

    if (!firstCard) {
      firstCard = { i, data, el: cardEl };
      return;
    }

    moves++;
    movesEl.textContent = moves;
    const second = { i, data, el: cardEl };

    if (firstCard.data.pairId === second.data.pairId && firstCard.i !== second.i) {
      firstCard.el.classList.add("matched");
      second.el.classList.add("matched");
      matched++;
      pairsEl.textContent = matched;
      firstCard = null;
      if (matched === currentPairs.length) {
        setTimeout(() => alert("🎉 Complimenti! Hai trovato tutte le coppie in " + moves + " mosse!"), 200);
      }
    } else {
      lock = true;
      setTimeout(() => {
        firstCard.el.classList.remove("flipped");
        firstCard.el.textContent = "?";
        second.el.classList.remove("flipped");
        second.el.textContent = "?";
        firstCard = null;
        lock = false;
      }, 800);
    }
  }

  function restart() {
    currentPairs = MEMORY_SETS[topicSel ? topicSel.value : "flowchart"].pairs;
    cards = buildDeck();
    firstCard = null;
    lock = false;
    moves = 0;
    matched = 0;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    if (totalEl) totalEl.textContent = currentPairs.length;
    render();
  }

  restartBtn.addEventListener("click", restart);
  if (topicSel) topicSel.addEventListener("change", restart);
  restart();
})();

// ================= DRAG & DROP: RIORDINA I PASSI (factory riusabile) =================
function createReorderGame({ listId, shuffleBtnId, checkBtnId, resultId, steps }) {
  const list = document.getElementById(listId);
  const shuffleBtn = document.getElementById(shuffleBtnId);
  const checkBtn = document.getElementById(checkBtnId);
  const result = document.getElementById(resultId);
  if (!list) return;

  let dragEl = null;

  function render(order) {
    list.innerHTML = "";
    order.forEach((text) => {
      const li = document.createElement("li");
      li.draggable = true;
      li.dataset.text = text;
      li.innerHTML = `<span class="handle">⠿</span> ${escapeHtml(text)}`;
      li.addEventListener("dragstart", () => {
        dragEl = li;
        setTimeout(() => li.classList.add("dragging"), 0);
      });
      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        dragEl = null;
      });
      list.appendChild(li);
    });
  }

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const after = getDragAfterElement(list, e.clientY);
    if (!dragEl) return;
    if (after == null) {
      list.appendChild(dragEl);
    } else {
      list.insertBefore(dragEl, after);
    }
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragEl) dragEl.classList.remove("dragging");
  });

  function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll("li:not(.dragging)")];
    return els.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  }

  function check() {
    const items = [...list.children];
    let correctCount = 0;
    items.forEach((li, i) => {
      const isCorrect = li.dataset.text === steps[i];
      li.classList.remove("correct", "wrong");
      li.classList.add(isCorrect ? "correct" : "wrong");
      if (isCorrect) correctCount++;
    });
    result.innerHTML = correctCount === steps.length
      ? "🎉 <strong>Perfetto!</strong> L'ordine è corretto."
      : `📌 Hai ${correctCount}/${steps.length} passaggi al posto giusto. Riprova a sistemare le righe evidenziate in rosso.`;
  }

  function doShuffle() {
    render(shuffleArray(steps));
    result.innerHTML = "";
  }

  shuffleBtn.addEventListener("click", doShuffle);
  checkBtn.addEventListener("click", check);
  doShuffle();
}

createReorderGame({ listId: "pizza-list", shuffleBtnId: "pizza-shuffle", checkBtnId: "pizza-check", resultId: "pizza-result", steps: PIZZA_STEPS });
createReorderGame({ listId: "loop-trace-list", shuffleBtnId: "loop-trace-shuffle", checkBtnId: "loop-trace-check", resultId: "loop-trace-result", steps: LOOP_TRACE_STEPS });

// ================= SFIDA A TEMPO: LOGICA / OUTPUT C++ =================
(function () {
  const startBtn = document.getElementById("logic-game-start");
  const modeSel = document.getElementById("logic-game-mode");
  const area = document.getElementById("logic-game-area");
  if (!startBtn) return;

  let round, score, current, queue, total;

  function newLogicQuestion() {
    const a = Math.random() < 0.5;
    const b = Math.random() < 0.5;
    const ops = ["AND", "OR", "NOT"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let answer, text;
    if (op === "AND") {
      answer = a && b;
      text = `A = ${a ? "Vero" : "Falso"} , B = ${b ? "Vero" : "Falso"} → A &amp;&amp; B ?`;
    } else if (op === "OR") {
      answer = a || b;
      text = `A = ${a ? "Vero" : "Falso"} , B = ${b ? "Vero" : "Falso"} → A || B ?`;
    } else {
      answer = !a;
      text = `A = ${a ? "Vero" : "Falso"} → !A ?`;
    }
    current = { answer };
    area.innerHTML = `
      <p class="quiz-progress">Domanda ${round + 1} di ${total} — Punteggio: ${score}</p>
      <h3>${text}</h3>
      <div class="sim-controls">
        <button class="btn" id="lg-true">Vero</button>
        <button class="btn btn-secondary" id="lg-false">Falso</button>
      </div>
      <div id="lg-feedback"></div>
    `;
    document.getElementById("lg-true").addEventListener("click", () => answerBool(true));
    document.getElementById("lg-false").addEventListener("click", () => answerBool(false));
  }

  function answerBool(val) {
    finishRound(val === current.answer, current.answer ? "Vero" : "Falso", null);
  }

  function newOutputQuestion() {
    current = queue[round];
    area.innerHTML = `
      <p class="quiz-progress">Domanda ${round + 1} di ${total} — Punteggio: ${score}</p>
      <pre class="code-panel active">${escapeHtml(current.snippet)}</pre>
      <ul class="quiz-options" id="lg-options"></ul>
      <div id="lg-feedback"></div>
    `;
    const optsEl = document.getElementById("lg-options");
    current.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", () => answerOption(i));
      optsEl.appendChild(li);
    });
  }

  function answerOption(i) {
    finishRound(i === current.correct, current.options[current.correct], current.explain);
  }

  function finishRound(correct, correctText, explain) {
    if (correct) score++;
    document.getElementById("lg-feedback").innerHTML = correct
      ? `<p style="color:#6ee7b7;font-weight:700;">✔ Corretto!</p>${explain ? `<p class="note">${explain}</p>` : ""}`
      : `<p style="color:#fca5a5;font-weight:700;">✘ Sbagliato, la risposta era ${correctText}.</p>${explain ? `<p class="note">${explain}</p>` : ""}`;
    round++;
    setTimeout(() => {
      if (round >= total) endGame();
      else if (modeSel.value === "output") newOutputQuestion();
      else newLogicQuestion();
    }, explain ? 1500 : 700);
  }

  function endGame() {
    area.innerHTML = `
      <div class="quiz-result">
        <p>Hai risposto correttamente a</p>
        <div class="score">${score} / ${total}</div>
        <button class="btn" id="lg-retry">Rigioca</button>
      </div>
    `;
    document.getElementById("lg-retry").addEventListener("click", start);
  }

  function start() {
    round = 0;
    score = 0;
    if (modeSel.value === "output") {
      queue = shuffleArray(OUTPUT_QUESTIONS);
      total = queue.length;
      newOutputQuestion();
    } else {
      total = 10;
      newLogicQuestion();
    }
  }

  startBtn.addEventListener("click", start);
})();

// ================= QUANTE ITERAZIONI? =================
(function () {
  const startBtn = document.getElementById("loopcount-start");
  const area = document.getElementById("loopcount-area");
  if (!startBtn) return;

  let round, score, queue, current;

  function newQuestion() {
    current = queue[round];
    area.innerHTML = `
      <p class="quiz-progress">Domanda ${round + 1} di ${queue.length} — Punteggio: ${score}</p>
      <pre class="code-panel active">${escapeHtml(current.code)}</pre>
      <p>Quante volte viene eseguito il corpo del ciclo?</p>
      <ul class="quiz-options" id="lc-options"></ul>
      <div id="lc-feedback"></div>
    `;
    const optsEl = document.getElementById("lc-options");
    current.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", () => answer(i));
      optsEl.appendChild(li);
    });
  }

  function answer(i) {
    const correct = i === current.correct;
    if (correct) score++;
    document.getElementById("lc-feedback").innerHTML = correct
      ? `<p style="color:#6ee7b7;font-weight:700;">✔ Corretto!</p><p class="note">${current.explain}</p>`
      : `<p style="color:#fca5a5;font-weight:700;">✘ Sbagliato, la risposta era "${current.options[current.correct]}".</p><p class="note">${current.explain}</p>`;
    round++;
    setTimeout(() => {
      if (round >= queue.length) endGame();
      else newQuestion();
    }, 1600);
  }

  function endGame() {
    area.innerHTML = `
      <div class="quiz-result">
        <p>Hai risposto correttamente a</p>
        <div class="score">${score} / ${queue.length}</div>
        <button class="btn" id="lc-retry">Rigioca</button>
      </div>
    `;
    document.getElementById("lc-retry").addEventListener("click", start);
  }

  function start() {
    round = 0;
    score = 0;
    queue = shuffleArray(LOOP_COUNT_QUESTIONS);
    newQuestion();
  }

  startBtn.addEventListener("click", start);
})();

// ================= GENERATORE GRUPPI =================
(function () {
  const namesArea = document.getElementById("group-names");
  const sizeInput = document.getElementById("group-size");
  const btn = document.getElementById("group-gen-btn");
  const out = document.getElementById("group-output");
  if (!btn) return;

  function generate() {
    const names = namesArea.value
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (names.length === 0) {
      out.innerHTML = "<p>Inserisci almeno un nome, uno per riga.</p>";
      return;
    }

    const size = Math.max(2, parseInt(sizeInput.value, 10) || 3);
    const shuffled = shuffleArray(names);
    const groups = [];
    for (let i = 0; i < shuffled.length; i += size) {
      groups.push(shuffled.slice(i, i + size));
    }

    let html = `<div class="group-list">`;
    groups.forEach((g, i) => {
      html += `<div class="group-item"><h5>Gruppo ${i + 1}</h5><ul>${g.map((n) => `<li>${n}</li>`).join("")}</ul></div>`;
    });
    html += `</div>`;
    out.innerHTML = html;
  }

  btn.addEventListener("click", generate);
})();
