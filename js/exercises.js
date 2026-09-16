// ================= SCHEDE ESERCIZI =================
(function () {
  const grid = document.getElementById("exercises-grid");
  if (!grid) return;

  const EXERCISES = [
    {
      tag: "Flow Chart",
      title: "Il doppio di un numero",
      statement: "Rappresenta l'algoritmo che calcola il doppio di un numero ricevuto in input.",
      solution: "input(n)\nris = n * 2\noutput(ris)"
    },
    {
      tag: "Flow Chart",
      title: "Operatore modulo",
      statement: "Quanto vale 20 % 3? Spiega il perché.",
      solution: "20 % 3 = 2\nInfatti 20 diviso 3 fa 6 con resto 2, e il modulo restituisce proprio il resto."
    },
    {
      tag: "Flow Chart",
      title: "Numero pari",
      statement: "Rappresenta l'algoritmo che verifica se un numero in input è pari.",
      solution: "input(n)\nSe (n % 2 == 0)\n    output(\"Il numero è pari\")\nAltrimenti\n    output(\"Il numero non è pari\")"
    },
    {
      tag: "Flow Chart",
      title: "Valore assoluto — selezione binaria",
      statement: "Rappresenta l'algoritmo per il valore assoluto usando la selezione binaria (due variabili).",
      solution: "input(n)\nSe (n >= 0)\n    ris = n\nAltrimenti\n    ris = n * (-1)\noutput(ris)"
    },
    {
      tag: "Flow Chart",
      title: "Valore assoluto — versione ottimizzata",
      statement: "Ora risolvi lo stesso problema con la selezione unaria (una sola variabile). Perché è più efficiente in memoria?",
      solution: "input(n)\nSe (n < 0)\n    n = n * (-1)\noutput(n)\n\nÈ più efficiente perché non serve creare una variabile aggiuntiva (ris): si riusa n."
    },
    {
      tag: "Flow Chart",
      title: "Maggiorenne",
      statement: "Rappresenta l'algoritmo che stabilisce se una persona è maggiorenne, dato in input la sua età.",
      solution: "output(\"Inserisci la tua età\")\ninput(n)\nSe (n >= 18)\n    output(\"maggiorenne\")\nAltrimenti\n    output(\"minorenne\")"
    },
    {
      tag: "Operatori logici",
      title: "Numero dispari con NOT",
      statement: "Verifica se un numero è dispari utilizzando l'operatore di negazione (NOT).",
      solution: "input(n)\nSe !(n % 2 == 0)\n    output(\"Il numero non è pari\")\nAltrimenti\n    output(\"Il numero è pari\")"
    },
    {
      tag: "Operatori logici",
      title: "Compreso tra 10 e 20",
      statement: "Stabilisci se un numero in input è compreso tra 10 e 20, estremi inclusi (usa AND).",
      solution: "input(n)\nSe (n >= 10 && n <= 20)\n    output(\"compreso\")\nAltrimenti\n    output(\"non compreso\")"
    },
    {
      tag: "Tracciamento",
      title: "Segui i passaggi (n = 4)",
      statement: "Dato n = 4, esegui in ordine: n = n + 1, n = n * n, n = n - 1. Qual è il valore finale di n?",
      solution: "n = 4 → n+1 = 5 → n*n = 25 → n-1 = 24\nOutput finale: n = 24\n\nVerifica con il simulatore nella sezione Flow Chart!"
    },
    {
      tag: "Algoritmi",
      title: "La pizza margherita",
      statement: "Scrivi tutte le istruzioni, una per riga, per preparare e cuocere una pizza margherita.",
      solution: "Consulta la soluzione completa nella sezione Algoritmi, oppure mettiti alla prova con il gioco «Riordina la ricetta» nella sezione Giochi & Cooperative Learning."
    },
    {
      tag: "Algoritmi",
      title: "Generalizzare la telefonata",
      statement: "Riscrivi l'algoritmo della telefonata in modo che funzioni anche se il numero è occupato, oltre al caso in cui Alice non risponde.",
      solution: "1. Leggi il numero telefonico\n2. Digita il numero sul telefono\n3. Se il numero è occupato, aspetta e riprova (torna al punto 2) oppure rinuncia\n4. Se non risponde, salta al punto 6\n5. Se risponde, conversa con Alice\n6. Chiudi la comunicazione\n\nNon esiste un'unica soluzione corretta: l'importante è aver previsto il nuovo caso."
    },
    {
      tag: "Cicli",
      title: "Quante volte si stampa 'ciao'?",
      statement: "Nel flow chart visto a lezione, se la condizione fosse i < 5 invece di i < 3 (partendo da i = 0), quante volte verrebbe stampato «ciao»?",
      solution: "5 volte (per i = 0, 1, 2, 3, 4). Quando i diventa 5, la condizione i<5 è falsa e si esce dal ciclo stampando «arrivederci»."
    },
    {
      tag: "Problemi",
      title: "Fibonacci di 10 elementi",
      statement: "Calcola a mano i primi 10 elementi della sequenza di Fibonacci, poi verifica con il simulatore.",
      solution: "1, 1, 2, 3, 5, 8, 13, 21, 34, 55\n\nVerifica nella sezione Problemi con il simulatore Fibonacci impostando n = 10."
    },
    {
      tag: "Problemi",
      title: "97 è un numero primo?",
      statement: "Usando il 2° approccio (metà intera), verifica se 97 è un numero primo.",
      solution: "La metà intera di 97 è 48. Nessun numero da 2 a 48 divide 97 esattamente: quindi 97 è primo.\n\nVerifica con il simulatore nella sezione Problemi!"
    }
  ];

  grid.innerHTML = EXERCISES.map((ex) => `
    <div class="exercise-tile">
      <span class="exercise-tag">${ex.tag}</span>
      <h4>${ex.title}</h4>
      <p>${ex.statement}</p>
      <details class="reveal">
        <summary>Mostra soluzione</summary>
        <pre style="white-space:pre-wrap;background:#f1f5f9;padding:10px 14px;border-radius:8px;font-size:0.88rem;">${ex.solution}</pre>
      </details>
    </div>
  `).join("");
})();

// ================= MINI CALCOLATRICI DI VERIFICA =================
(function () {
  const absBtn = document.getElementById("tool-abs-btn");
  if (!absBtn) return;

  absBtn.addEventListener("click", () => {
    const n = parseFloat(document.getElementById("tool-abs-n").value);
    document.getElementById("tool-abs-result").textContent = isNaN(n) ? "" : "→ " + Math.abs(n);
  });

  document.getElementById("tool-parity-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("tool-parity-n").value, 10);
    document.getElementById("tool-parity-result").textContent = isNaN(n) ? "" : "→ " + (n % 2 === 0 ? "pari" : "dispari");
  });

  document.getElementById("tool-range-btn").addEventListener("click", () => {
    const n = parseFloat(document.getElementById("tool-range-n").value);
    document.getElementById("tool-range-result").textContent = isNaN(n) ? "" : "→ " + (n >= 10 && n <= 20 ? "compreso" : "non compreso");
  });

  document.getElementById("tool-mod-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("tool-mod-n").value, 10);
    const m = parseInt(document.getElementById("tool-mod-m").value, 10);
    document.getElementById("tool-mod-result").textContent = isNaN(n) || isNaN(m) || m === 0 ? "" : "→ " + (n % m);
  });
})();
