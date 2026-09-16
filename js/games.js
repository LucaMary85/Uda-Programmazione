function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ================= MEMORY GAME =================
(function () {
  const grid = document.getElementById("memory-grid");
  const restartBtn = document.getElementById("memory-restart");
  const movesEl = document.getElementById("memory-moves");
  const pairsEl = document.getElementById("memory-pairs");
  if (!grid) return;

  let cards = [];
  let firstCard = null;
  let lock = false;
  let moves = 0;
  let matched = 0;

  function buildDeck() {
    let deck = [];
    MEMORY_PAIRS.forEach((p) => {
      deck.push({ pairId: p.id, type: "shape", display: p.shapeChar, label: p.label });
      deck.push({ pairId: p.id, type: "label", display: p.label, label: p.label });
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
    cardEl.innerHTML = data.type === "shape" ? `<span class="shape-preview">${data.display}</span>` : data.display;

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
      if (matched === MEMORY_PAIRS.length) {
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
    cards = buildDeck();
    firstCard = null;
    lock = false;
    moves = 0;
    matched = 0;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    render();
  }

  restartBtn.addEventListener("click", restart);
  restart();
})();

// ================= PIZZA DRAG & DROP =================
(function () {
  const list = document.getElementById("pizza-list");
  const shuffleBtn = document.getElementById("pizza-shuffle");
  const checkBtn = document.getElementById("pizza-check");
  const result = document.getElementById("pizza-result");
  if (!list) return;

  let dragEl = null;

  function render(order) {
    list.innerHTML = "";
    order.forEach((text) => {
      const li = document.createElement("li");
      li.draggable = true;
      li.dataset.text = text;
      li.innerHTML = `<span class="handle">⠿</span> ${text}`;
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
      const isCorrect = li.dataset.text === PIZZA_STEPS[i];
      li.classList.remove("correct", "wrong");
      li.classList.add(isCorrect ? "correct" : "wrong");
      if (isCorrect) correctCount++;
    });
    result.innerHTML = correctCount === PIZZA_STEPS.length
      ? "🎉 <strong>Perfetto!</strong> L'ordine è corretto."
      : `📌 Hai ${correctCount}/${PIZZA_STEPS.length} passaggi al posto giusto. Riprova a sistemare le righe evidenziate in rosso.`;
  }

  function doShuffle() {
    render(shuffleArray(PIZZA_STEPS));
    result.innerHTML = "";
  }

  shuffleBtn.addEventListener("click", doShuffle);
  checkBtn.addEventListener("click", check);
  doShuffle();
})();

// ================= SFIDA LOGICA RAPIDA =================
(function () {
  const startBtn = document.getElementById("logic-game-start");
  const area = document.getElementById("logic-game-area");
  if (!startBtn) return;

  const TOTAL = 10;
  let round, score, current;

  function newQuestion() {
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
      <p class="quiz-progress">Domanda ${round + 1} di ${TOTAL} — Punteggio: ${score}</p>
      <h3>${text}</h3>
      <div class="sim-controls">
        <button class="btn" id="lg-true">Vero</button>
        <button class="btn btn-secondary" id="lg-false">Falso</button>
      </div>
      <div id="lg-feedback"></div>
    `;
    document.getElementById("lg-true").addEventListener("click", () => answerQ(true));
    document.getElementById("lg-false").addEventListener("click", () => answerQ(false));
  }

  function answerQ(val) {
    const correct = val === current.answer;
    if (correct) score++;
    document.getElementById("lg-feedback").innerHTML = correct
      ? `<p style="color:#166534;font-weight:700;">✔ Corretto!</p>`
      : `<p style="color:#991b1b;font-weight:700;">✘ Sbagliato, la risposta era ${current.answer ? "Vero" : "Falso"}.</p>`;
    round++;
    setTimeout(() => {
      if (round >= TOTAL) endGame();
      else newQuestion();
    }, 700);
  }

  function endGame() {
    area.innerHTML = `
      <div class="quiz-result">
        <p>Hai risposto correttamente a</p>
        <div class="score">${score} / ${TOTAL}</div>
        <button class="btn" id="lg-retry">Rigioca</button>
      </div>
    `;
    document.getElementById("lg-retry").addEventListener("click", start);
  }

  function start() {
    round = 0;
    score = 0;
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
