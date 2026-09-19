(function () {
  const catSel = document.getElementById("quiz-category");
  const countSel = document.getElementById("quiz-count");
  const startBtn = document.getElementById("quiz-start");
  const printBtn = document.getElementById("quiz-print");
  const area = document.getElementById("quiz-area");
  const printArea = document.getElementById("quiz-print-area");
  if (!startBtn) return;

  const CAT_LABELS = { problemi: "Problemi & Algoritmi", flowchart: "Flow Chart", cicli: "Cicli", cpp: "C++ Procedurale", "cpp-oop": "C++ OOP", all: "Tutti gli argomenti" };

  let quiz = { questions: [], index: 0, answers: [] };

  function pickQuestions() {
    const cat = catSel.value;
    let pool = cat === "all" ? QUIZ_BANK.slice() : QUIZ_BANK.filter((q) => q.cat === cat);
    pool = shuffleArray(pool);
    const countVal = countSel.value;
    if (countVal !== "all") {
      pool = pool.slice(0, Math.min(parseInt(countVal, 10), pool.length));
    }
    return pool;
  }

  function renderQuestion() {
    const q = quiz.questions[quiz.index];
    const savedAnswer = quiz.answers[quiz.index];

    area.innerHTML = `
      <div class="quiz-question">
        <p class="quiz-progress">Domanda ${quiz.index + 1} di ${quiz.questions.length} — ${CAT_LABELS[q.cat]}</p>
        <h3>${q.q}</h3>
        <ul class="quiz-options" id="quiz-options"></ul>
        <div id="quiz-explain-area"></div>
        <div class="quiz-nav">
          <button class="btn btn-secondary" id="quiz-prev" ${quiz.index === 0 ? "disabled" : ""}>◀ Indietro</button>
          <button class="btn" id="quiz-next" ${savedAnswer === undefined ? "disabled" : ""}>${quiz.index === quiz.questions.length - 1 ? "Vedi risultati" : "Avanti ▶"}</button>
        </div>
      </div>
    `;

    const optionsEl = document.getElementById("quiz-options");
    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      if (savedAnswer !== undefined) {
        li.classList.add("answered");
        if (i === q.correct) li.classList.add("correct");
        else if (i === savedAnswer) li.classList.add("incorrect");
      }
      li.addEventListener("click", () => selectAnswer(i));
      optionsEl.appendChild(li);
    });

    if (savedAnswer !== undefined) {
      document.getElementById("quiz-explain-area").innerHTML = `<div class="quiz-explain">💡 ${q.explain}</div>`;
    }

    document.getElementById("quiz-next").addEventListener("click", () => {
      if (quiz.index === quiz.questions.length - 1) showResults();
      else {
        quiz.index++;
        renderQuestion();
      }
    });
    document.getElementById("quiz-prev").addEventListener("click", () => {
      quiz.index--;
      renderQuestion();
    });
  }

  function selectAnswer(i) {
    if (quiz.answers[quiz.index] !== undefined) return; // già risposto
    quiz.answers[quiz.index] = i;
    renderQuestion();
  }

  function showResults() {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (quiz.answers[i] === q.correct) score++;
    });

    let reviewHtml = quiz.questions
      .map((q, i) => {
        const userAns = quiz.answers[i];
        const ok = userAns === q.correct;
        return `
          <div class="quiz-review-item ${ok ? "ok" : "ko"}">
            <p><strong>${i + 1}. ${q.q}</strong></p>
            <p>Risposta data: ${userAns !== undefined ? q.options[userAns] : "(nessuna)"} ${ok ? "✔" : "✘"}</p>
            ${!ok ? `<p>Risposta corretta: <strong>${q.options[q.correct]}</strong></p>` : ""}
            <p class="note">${q.explain}</p>
          </div>
        `;
      })
      .join("");

    area.innerHTML = `
      <div class="quiz-result">
        <p>Punteggio finale</p>
        <div class="score">${score} / ${quiz.questions.length}</div>
        <button class="btn" id="quiz-retry">Nuova verifica</button>
      </div>
      <div class="quiz-review">${reviewHtml}</div>
    `;
    document.getElementById("quiz-retry").addEventListener("click", () => {
      area.innerHTML = "";
    });
  }

  function start() {
    quiz.questions = pickQuestions();
    quiz.index = 0;
    quiz.answers = [];
    printArea.style.display = "none";
    area.style.display = "block";
    if (quiz.questions.length === 0) {
      area.innerHTML = "<p>Nessuna domanda disponibile per questa selezione.</p>";
      return;
    }
    renderQuestion();
  }

  function generatePrintable() {
    const cat = catSel.value;
    let pool = cat === "all" ? QUIZ_BANK.slice() : QUIZ_BANK.filter((q) => q.cat === cat);
    pool = shuffleArray(pool);
    const countVal = countSel.value;
    if (countVal !== "all") pool = pool.slice(0, Math.min(parseInt(countVal, 10), pool.length));

    let html = `<h1>Verifica — ${CAT_LABELS[cat]}</h1>
      <p>Nome: _______________________________ Classe: _________ Data: ____________</p>
      <ol>`;
    pool.forEach((q) => {
      html += `<li style="margin-bottom:14px;"><strong>${q.q}</strong><br>`;
      q.options.forEach((opt, i) => {
        html += `☐ ${String.fromCharCode(65 + i)}) ${opt}<br>`;
      });
      html += `</li>`;
    });
    html += `</ol><div style="page-break-before: always;"><h2>Soluzioni</h2><ol>`;
    pool.forEach((q) => {
      html += `<li>${String.fromCharCode(65 + q.correct)}) ${q.options[q.correct]} — <em>${q.explain}</em></li>`;
    });
    html += `</ol></div>`;

    printArea.innerHTML = html;
    printArea.style.display = "block";
    area.style.display = "none";
    setTimeout(() => window.print(), 200);
  }

  startBtn.addEventListener("click", start);
  printBtn.addEventListener("click", generatePrintable);
})();
