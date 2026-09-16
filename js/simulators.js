// ================= FIBONACCI =================
(function () {
  const btn = document.getElementById("fib-calc");
  const input = document.getElementById("fib-n");
  const out = document.getElementById("fib-output");
  if (!btn) return;

  function calc() {
    const n = Math.max(1, Math.min(30, parseInt(input.value, 10) || 1));
    let seq = [1];
    if (n >= 2) seq.push(1);
    for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);

    let html = "<ol>";
    for (let i = 0; i < seq.length; i++) {
      if (i === 0 || i === 1) {
        html += `<li>${i + 1}° elemento = ${seq[i]}</li>`;
      } else {
        html += `<li>${i + 1}° elemento = ${seq[i - 1]} + ${seq[i - 2]} = ${seq[i]}</li>`;
      }
    }
    html += "</ol>";
    html += `<p><strong>Sequenza completa:</strong> ${seq.join(", ")}</p>`;
    out.innerHTML = html;
  }

  btn.addEventListener("click", calc);
  calc();
})();

// ================= NUMERI PRIMI =================
(function () {
  const btn = document.getElementById("prime-calc");
  const input = document.getElementById("prime-n");
  const out = document.getElementById("prime-output");
  if (!btn) return;

  function testApproach(n, limit) {
    let steps = [];
    let divisors = 0;
    for (let d = 1; d <= limit; d++) {
      const divides = n % d === 0;
      if (divides) divisors++;
      steps.push({ d, divides });
    }
    return { steps, divisors };
  }

  function renderRow(steps) {
    return steps
      .map((s) => `<span style="display:inline-block;margin:2px;padding:3px 8px;border-radius:6px;background:${s.divides ? "#dcfce7" : "#f1f5f9"};color:${s.divides ? "#166534" : "#64748b"};font-size:0.82rem;">${s.d} ${s.divides ? "✔" : "✘"}</span>`)
      .join("");
  }

  function calc() {
    const n = Math.max(2, Math.min(1000, parseInt(input.value, 10) || 2));
    const a1 = testApproach(n, n);
    const half = Math.floor(n / 2);
    const a2 = testApproach(n, half);
    const isPrime1 = a1.divisors === 2;
    const isPrime2 = a2.divisors === 1;

    const savedPct = Math.round((1 - a2.steps.length / a1.steps.length) * 100);

    out.innerHTML = `
      <p><strong>n = ${n}</strong> — ${isPrime1 ? "è un numero PRIMO ✅" : "NON è un numero primo ❌"}</p>
      <p><strong>1° approccio</strong> — controllo i divisori da 1 a ${n} (${a1.steps.length} passaggi):</p>
      <div>${renderRow(a1.steps)}</div>
      <p style="margin-top:10px;"><strong>2° approccio</strong> — controllo i divisori da 1 a ${half} (metà intera, ${a2.steps.length} passaggi):</p>
      <div>${renderRow(a2.steps)}</div>
      <p style="margin-top:12px;"><strong>Confronto:</strong> il 1° approccio ha richiesto ${a1.steps.length} passaggi, il 2° solo ${a2.steps.length}.
      ${savedPct > 0 ? `Il 2° approccio è più efficiente: ha risparmiato circa il <strong>${savedPct}%</strong> dei passaggi (e quindi, teoricamente, del tempo)!` : "Con numeri piccoli la differenza può essere minima."}</p>
    `;
  }

  btn.addEventListener("click", calc);
  calc();
})();

// ================= CODE TABS (pseudocodice/C/C++/Python) =================
(function () {
  const buttons = document.querySelectorAll(".code-tab-btn");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".code-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("code-" + btn.dataset.code).classList.add("active");
    });
  });
})();

// ================= TRACCIAMENTO VARIABILI (valore assoluto) =================
(function () {
  const versionSel = document.getElementById("trace-version");
  const nInput = document.getElementById("trace-n");
  const resetBtn = document.getElementById("trace-reset");
  const nextBtn = document.getElementById("trace-next");
  const codeEl = document.getElementById("trace-code");
  const boxesEl = document.getElementById("trace-boxes");
  const logEl = document.getElementById("trace-log");
  if (!resetBtn) return;

  const LINES = {
    binary: ["Input(n)", "Se n > 0", "    ris = n", "Altrimenti", "    ris = n * (-1)", "Output(ris)"],
    unary: ["Input(n)", "Se n < 0", "    n = n * (-1)", "Output(n)"]
  };

  let steps = [];
  let stepIndex = -1;
  let state = {};

  function buildSteps(version, n) {
    if (version === "binary") {
      const list = [
        { line: 0, desc: `Viene chiesto un numero all'utente e salvato in n → n = ${n}`, apply: (s) => { s.n = n; } },
        { line: 1, desc: `Controllo la condizione "n > 0" → ${n > 0 ? "VERO" : "FALSO"}`, apply: () => {} }
      ];
      if (n > 0) {
        list.push({ line: 2, desc: `Eseguo ris = n → ris = ${n}`, apply: (s) => { s.ris = n; } });
      } else {
        list.push({ line: 4, desc: `Eseguo ris = n * (-1) → ris = ${-n}`, apply: (s) => { s.ris = -n; } });
      }
      list.push({ line: 5, desc: `Output: comunico all'esterno ris = ${n > 0 ? n : -n}`, apply: () => {} });
      return list;
    } else {
      const list = [
        { line: 0, desc: `Viene chiesto un numero all'utente e salvato in n → n = ${n}`, apply: (s) => { s.n = n; } },
        { line: 1, desc: `Controllo la condizione "n < 0" → ${n < 0 ? "VERO" : "FALSO"}`, apply: () => {} }
      ];
      if (n < 0) {
        list.push({ line: 2, desc: `Eseguo n = n * (-1) → il nuovo valore (${-n}) sovrascrive il precedente (${n})`, apply: (s) => { s.n = -n; } });
      } else {
        list.push({ line: -1, desc: `La condizione è falsa: l'istruzione "n = n * (-1)" NON viene eseguita`, apply: () => {} });
      }
      list.push({ line: 3, desc: `Output: comunico all'esterno n = ${n < 0 ? -n : n}`, apply: () => {} });
      return list;
    }
  }

  function renderCode(version, highlightLine) {
    const lines = LINES[version];
    codeEl.innerHTML = lines
      .map((l, i) => (i === highlightLine ? `<span class="active-line">${l}</span>` : l))
      .join("\n");
  }

  function renderBoxes() {
    const version = versionSel.value;
    let html = `<div class="var-box"><div class="var-name">n</div><div class="var-value">${state.n === undefined ? "?" : state.n}</div></div>`;
    if (version === "binary") {
      html += `<div class="var-box"><div class="var-name">ris</div><div class="var-value">${state.ris === undefined ? "?" : state.ris}</div></div>`;
      html += `<div class="var-box const"><div class="var-name">costante</div><div class="var-value">-1</div></div>`;
    }
    boxesEl.innerHTML = html;
  }

  function reset() {
    const version = versionSel.value;
    const n = parseInt(nInput.value, 10) || 0;
    steps = buildSteps(version, n);
    stepIndex = -1;
    state = {};
    renderCode(version, -1);
    renderBoxes();
    logEl.innerHTML = "<p>Premi <strong>«Passo successivo»</strong> per iniziare la simulazione.</p>";
    nextBtn.disabled = false;
  }

  function next() {
    if (stepIndex >= steps.length - 1) return;
    stepIndex++;
    const step = steps[stepIndex];
    step.apply(state);
    renderCode(versionSel.value, step.line);
    renderBoxes();
    logEl.innerHTML += `<p>➡️ ${step.desc}</p>`;
    if (stepIndex === steps.length - 1) {
      logEl.innerHTML += "<p><strong>✅ Esecuzione terminata.</strong></p>";
      nextBtn.disabled = true;
    }
  }

  resetBtn.addEventListener("click", reset);
  nextBtn.addEventListener("click", next);
  versionSel.addEventListener("change", reset);
  reset();
})();

// ================= CONTATORE (assegnamento / incremento) =================
(function () {
  const resetBtn = document.getElementById("counter-reset");
  const stepBtn = document.getElementById("counter-step");
  const valEl = document.getElementById("counter-value");
  const initBlock = document.getElementById("counter-init-block");
  const incBlock = document.getElementById("counter-inc-block");
  if (!resetBtn) return;

  let value = null;
  let started = false;

  function reset() {
    value = null;
    started = false;
    initBlock.classList.remove("highlight");
    incBlock.classList.remove("highlight");
    valEl.textContent = "?";
  }

  function step() {
    initBlock.classList.remove("highlight");
    incBlock.classList.remove("highlight");
    if (!started) {
      value = 0;
      started = true;
      initBlock.classList.add("highlight");
    } else {
      value = value + 1;
      incBlock.classList.add("highlight");
    }
    valEl.textContent = value;
  }

  resetBtn.addEventListener("click", reset);
  stepBtn.addEventListener("click", step);
  reset();
})();

// ================= PIPELINE ARITMETICA (n=4 esempio) =================
(function () {
  const nInput = document.getElementById("pipe-n");
  const resetBtn = document.getElementById("pipe-reset");
  const stepBtn = document.getElementById("pipe-step");
  const view = document.getElementById("pipe-view");
  if (!resetBtn) return;

  const OPS = [
    { label: "n = n + 1", fn: (n) => n + 1 },
    { label: "n = n * n", fn: (n) => n * n },
    { label: "n = n - 1", fn: (n) => n - 1 }
  ];

  let n, idx;

  function reset() {
    n = parseInt(nInput.value, 10) || 0;
    idx = 0;
    view.innerHTML = `<p>Valore iniziale: <strong>n = ${n}</strong></p>`;
  }

  function step() {
    if (idx >= OPS.length) {
      view.innerHTML += `<p><strong>✅ output(n) → ${n}</strong></p>`;
      return;
    }
    const before = n;
    n = OPS[idx].fn(n);
    view.innerHTML += `<p>${OPS[idx].label} → n = ${before} → <strong>${n}</strong></p>`;
    idx++;
  }

  resetBtn.addEventListener("click", reset);
  stepBtn.addEventListener("click", step);
  reset();
})();

// ================= TAVOLE DI VERITÀ (NOT/AND/OR) =================
(function () {
  const aSel = document.getElementById("logic-a");
  const bSel = document.getElementById("logic-b");
  const results = document.getElementById("logic-results");
  if (!aSel) return;

  function render() {
    const a = aSel.value === "1";
    const b = bSel.value === "1";
    const notA = !a;
    const and = a && b;
    const or = a || b;
    const item = (label, val) => `<span class="lr-item ${val ? "true" : "false"}">${label} = ${val ? "Vero" : "Falso"}</span>`;
    results.innerHTML = item("!A", notA) + item("A &amp;&amp; B", and) + item("A || B", or);
  }

  aSel.addEventListener("change", render);
  bSel.addEventListener("change", render);
  render();
})();

// ================= CICLO: "ciao x3 poi arrivederci" =================
(function () {
  const resetBtn = document.getElementById("loop-reset");
  const stepBtn = document.getElementById("loop-step");
  const iVal = document.getElementById("loop-i-val");
  const condVal = document.getElementById("loop-cond-val");
  const outEl = document.getElementById("loop-output");
  const blocks = ["loop-init-block", "loop-cond-block", "loop-ciao-block", "loop-inc-block", "loop-bye-block"];
  if (!resetBtn) return;

  let state;

  function highlight(id) {
    blocks.forEach((b) => document.getElementById(b).classList.toggle("highlight", b === id));
  }

  function reset() {
    state = { i: null, phase: "start", output: [], cond: null };
    blocks.forEach((b) => document.getElementById(b).classList.remove("highlight"));
    iVal.textContent = "–";
    condVal.textContent = "–";
    outEl.textContent = "";
    stepBtn.disabled = false;
  }

  function step() {
    switch (state.phase) {
      case "start":
        state.i = 0;
        state.phase = "cond";
        highlight("loop-init-block");
        break;
      case "cond":
        state.cond = state.i < 3;
        state.phase = state.cond ? "ciao" : "bye";
        highlight("loop-cond-block");
        break;
      case "ciao":
        state.output.push("ciao");
        state.phase = "inc";
        highlight("loop-ciao-block");
        break;
      case "inc":
        state.i = state.i + 1;
        state.phase = "cond";
        highlight("loop-inc-block");
        break;
      case "bye":
        state.output.push("arrivederci");
        state.phase = "done";
        highlight("loop-bye-block");
        stepBtn.disabled = true;
        break;
    }
    iVal.textContent = state.i === null ? "–" : state.i;
    condVal.textContent = state.cond === null ? "–" : state.cond ? "VERO" : "FALSO";
    outEl.textContent = state.output.join("\n");
  }

  resetBtn.addEventListener("click", reset);
  stepBtn.addEventListener("click", step);
  reset();
})();

// ================= DO-WHILE vs WHILE-DO =================
(function () {
  const dwBtn = document.getElementById("dw-run");
  const wdBtn = document.getElementById("wd-run");
  const dwOut = document.getElementById("dw-output");
  const wdOut = document.getElementById("wd-output");
  if (!dwBtn) return;

  function typeLines(el, lines) {
    el.textContent = "";
    lines.forEach((line, i) => {
      setTimeout(() => {
        el.textContent += (i > 0 ? "\n" : "") + line;
      }, i * 500);
    });
  }

  dwBtn.addEventListener("click", () => {
    // condizione falsa fin dall'inizio, ma il blocco viene eseguito comunque una volta
    typeLines(dwOut, ["ciao", "arrivederci"]);
  });

  wdBtn.addEventListener("click", () => {
    // condizione falsa fin dall'inizio: il blocco non viene mai eseguito
    typeLines(wdOut, ["arrivederci"]);
  });
})();
