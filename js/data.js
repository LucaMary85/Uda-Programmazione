// Dati condivisi: banca domande, passi pizza, esercizi

const PIZZA_STEPS = [
  "Procurarsi la ricetta",
  "Leggere la ricetta",
  "Controllare gli ingredienti in casa",
  "Se manca un ingrediente comprarlo, altrimenti saltare al punto successivo",
  "Preparare l'impasto e lasciarlo lievitare",
  "Stendere l'impasto",
  "Disporre pomodoro, mozzarella e basilico sull'impasto",
  "Accendere il forno",
  "Portarlo alla giusta temperatura",
  "Inserire la pizza nel forno",
  "Ruotare la pizza ogni 30 secondi",
  "Estrarre la pizza dopo 90 secondi",
  "Disporre la pizza su un piatto"
];

const MEMORY_PAIRS = [
  { id: "start", label: "Inizio / Fine", shapeClass: "fc-oval", shapeChar: "⬭" },
  { id: "io", label: "Input / Output", shapeClass: "fc-io", shapeChar: "▱" },
  { id: "process", label: "Elaborazione", shapeClass: "fc-process", shapeChar: "▭" },
  { id: "decision", label: "Decisione", shapeClass: "fc-decision-mini", shapeChar: "◇" }
];

const QUIZ_BANK = [
  // ---- Problemi & Algoritmi ----
  { cat: "problemi", q: "Cosa serve, oltre ai dati, per risolvere un problema difficile?", options: ["Solo tempo libero", "Una strategia risolutiva", "Un computer più veloce", "Niente, basta l'esperienza"], correct: 1, explain: "Serve individuare una strategia risolutiva: l'idea con cui affrontare il problema." },
  { cat: "problemi", q: "Nella sequenza di Fibonacci, quali sono i primi due elementi?", options: ["0 e 1", "1 e 2", "1 e 1", "0 e 0"], correct: 2, explain: "I primi due numeri della sequenza di Fibonacci sono 1 e 1." },
  { cat: "problemi", q: "Perché la difficoltà di un problema è 'relativa'?", options: ["Perché dipende dal computer usato", "Perché dipende da chi deve risolvere il problema", "Perché non esistono problemi difficili", "Perché dipende dall'orario"], correct: 1, explain: "Lo stesso problema può essere facile per un esperto e difficile per un principiante." },
  { cat: "problemi", q: "Cos'è l'efficienza di una strategia risolutiva?", options: ["La velocità di battitura del programmatore", "La capacità di usare meno risorse informatiche possibili (tempo e memoria)", "Il numero di righe di codice scritte", "La quantità di dati in input"], correct: 1, explain: "L'efficienza riguarda l'uso ottimale di tempo/CPU e memoria." },
  { cat: "problemi", q: "Nell'esempio dei numeri primi, perché il 2° approccio è più efficiente del 1°?", options: ["Perché usa più memoria", "Perché controlla i divisori solo fino alla metà del numero, dimezzando i passaggi", "Perché non richiede input", "Perché è scritto in un linguaggio più veloce"], correct: 1, explain: "Oltre la metà del numero non può esistere un divisore diverso dal numero stesso, quindi si dimezzano i controlli." },
  { cat: "problemi", q: "Un numero è primo quando...", options: ["è pari", "è divisibile solo per 1 e per se stesso", "è maggiore di 10", "è divisibile per 2 e 3"], correct: 1, explain: "Definizione di numero primo." },
  { cat: "problemi", q: "Cosa si intende per 'strategia risolutiva'?", options: ["Il linguaggio di programmazione scelto", "L'idea con cui, sfruttando esperienza e intuito, si trova la chiave di soluzione", "Il tempo impiegato per risolvere il problema", "La lista dei dati necessari"], correct: 1, explain: "È l'idea/intuizione alla base della soluzione, prima ancora di scrivere l'algoritmo." },

  { cat: "problemi", q: "Cos'è un algoritmo?", options: ["Un linguaggio di programmazione", "Una sequenza di istruzioni scritte in modo formale e preciso per risolvere un problema", "Un tipo di variabile", "Un errore di programmazione"], correct: 1, explain: "Definizione di algoritmo." },
  { cat: "problemi", q: "Da chi deriva il termine 'algoritmo'?", options: ["Pitagora", "Al-Khwārizmī", "Leonardo Fibonacci", "Alan Turing"], correct: 1, explain: "Il termine deriva dal nome del matematico persiano Al-Khwārizmī." },
  { cat: "problemi", q: "Dove si trova il primo algoritmo documentato nella storia?", options: ["Nel papiro di Ahmes (Egitto, ~1650 a.C.)", "In un manoscritto greco", "In un testo cinese", "In un libro romano"], correct: 0, explain: "Il papiro di Ahmes contiene tabelle e problemi aritmetici risolti circa 3500 anni fa." },
  { cat: "problemi", q: "Nell'esempio della telefonata, qual è il problema dell'algoritmo iniziale?", options: ["È troppo lungo", "Non generalizza il caso in cui Alice non risponda", "Usa troppe variabili", "Non ha un blocco di fine"], correct: 1, explain: "L'algoritmo iniziale non contemplava tutte le possibilità (Alice che non risponde)." },
  { cat: "problemi", q: "Cosa significa che un algoritmo deve essere 'generalizzabile'?", options: ["Deve funzionare solo per un caso specifico", "Deve contemplare tutte le possibili casistiche", "Deve essere il più corto possibile", "Deve usare solo numeri interi"], correct: 1, explain: "Un buon algoritmo copre tutti i casi possibili, non solo quello 'fortunato'." },
  { cat: "problemi", q: "Cos'è la pseudocodifica?", options: ["La descrizione di un algoritmo in un linguaggio di programmazione", "La descrizione di un algoritmo in linguaggio naturale, comprensibile all'uomo", "Un errore di sintassi", "Un tipo di variabile"], correct: 1, explain: "La pseudocodifica usa il linguaggio naturale, non un linguaggio di programmazione." },
  { cat: "problemi", q: "Cos'è la codifica di un algoritmo?", options: ["La sua traduzione in un linguaggio comprensibile al computer", "La sua traduzione in un'altra lingua umana", "La sua rappresentazione grafica", "Il suo tempo di esecuzione"], correct: 0, explain: "La codifica è la stesura dell'algoritmo in un linguaggio di programmazione." },
  { cat: "problemi", q: "Cosa sono le variabili in un algoritmo?", options: ["Simboli decorativi", "Contenitori che permettono di memorizzare dati", "Solo numeri negativi", "Blocchi grafici del flow chart"], correct: 1, explain: "Le variabili sono 'scatole' che contengono i dati usati dall'algoritmo." },
  { cat: "problemi", q: "In quale memoria vengono salvate le variabili durante l'esecuzione di un programma?", options: ["Hard disk", "RAM", "ROM", "Cache della stampante"], correct: 1, explain: "Le variabili risiedono nella RAM durante l'esecuzione." },
  { cat: "problemi", q: "Cos'è una costante?", options: ["Una variabile che cambia spesso valore", "Una porzione di memoria il cui valore non cambia durante l'esecuzione", "Un blocco di input", "Un ciclo infinito"], correct: 1, explain: "Le costanti mantengono sempre lo stesso valore, es. il -1 usato per cambiare segno." },
  { cat: "problemi", q: "Qual è il vantaggio della selezione unaria rispetto alla binaria nell'esempio del valore assoluto?", options: ["È più lenta", "Risparmia memoria perché non serve una variabile aggiuntiva (ris)", "Non richiede input", "Funziona solo con numeri pari"], correct: 1, explain: "Riutilizzando la variabile n invece di crearne una nuova, si risparmia memoria." },

  // ---- Flow chart ----
  { cat: "flowchart", q: "Che forma ha il blocco 'Inizio/Fine' in un flow chart?", options: ["Rettangolo", "Rombo", "Ovale", "Parallelogramma"], correct: 2, explain: "Il blocco Inizio/Fine è ovale, senza spigoli." },
  { cat: "flowchart", q: "Che forma ha il blocco di Input/Output?", options: ["Ovale", "Parallelogramma", "Rombo", "Cerchio"], correct: 1, explain: "Il blocco di input/output ha la forma di un parallelogramma." },
  { cat: "flowchart", q: "Che forma ha il blocco di Elaborazione?", options: ["Rettangolo", "Rombo", "Ovale", "Triangolo"], correct: 0, explain: "L'elaborazione (assegnamento/calcolo) è rappresentata da un rettangolo." },
  { cat: "flowchart", q: "Che forma ha il blocco di Decisione?", options: ["Ovale", "Rettangolo", "Rombo", "Esagono"], correct: 2, explain: "Il blocco di decisione (condizionale) è un rombo, con esiti Vero/Falso." },
  { cat: "flowchart", q: "Quali sono gli unici due esiti possibili di un blocco di decisione?", options: ["Alto/Basso", "Vero/Falso", "Uno/Zero", "Input/Output"], correct: 1, explain: "Un blocco di decisione dà sempre esito Vero o Falso." },
  { cat: "flowchart", q: "Cosa indicano le frecce in un flow chart?", options: ["Il tipo di variabile", "Il verso di percorrenza dell'algoritmo", "Il numero di iterazioni", "Il valore delle costanti"], correct: 1, explain: "Le frecce collegano i blocchi indicando il flusso di esecuzione." },
  { cat: "flowchart", q: "Cosa si intende per 'inizializzazione' di una variabile?", options: ["La cancellazione della variabile", "L'assegnazione del primo valore a una variabile", "Il cambio di nome della variabile", "Il confronto tra due variabili"], correct: 1, explain: "Assegnare il primo valore a una variabile, tipicamente a inizio algoritmo." },
  { cat: "flowchart", q: "Cosa succede se si usa 'cont = cont + 1' senza aver mai inizializzato 'cont'?", options: ["Funziona comunque", "Si genera un errore perché cont non ha un valore di partenza", "cont diventa automaticamente 0", "Il programma diventa più efficiente"], correct: 1, explain: "Senza inizializzazione l'algoritmo non sa a quale valore sommare 1." },
  { cat: "flowchart", q: "Quanto vale 20 % 3 (operatore modulo)?", options: ["6", "0", "2", "3"], correct: 2, explain: "20 diviso 3 fa 6 con resto 2: il modulo restituisce il resto, cioè 2." },
  { cat: "flowchart", q: "Qual è l'operatore di confronto 'uguale a' nei flow chart/linguaggi di programmazione?", options: ["=", "==", "<>", "!="], correct: 1, explain: "L'operatore == confronta, mentre = assegna un valore." },
  { cat: "flowchart", q: "Cosa fa l'operatore n++ ?", options: ["Decrementa n di 1", "Incrementa n di 1 (equivale a n = n + 1)", "Raddoppia n", "Azzera n"], correct: 1, explain: "n++ è l'operatore di incremento." },
  { cat: "flowchart", q: "Con n=4: n=n+1 → n=n*n → n=n-1. Quanto vale n alla fine?", options: ["16", "24", "15", "25"], correct: 1, explain: "4+1=5, 5*5=25, 25-1=24." },
  { cat: "flowchart", q: "Cosa fa l'operatore logico NOT (!)?", options: ["Somma due condizioni", "Nega/inverte una condizione logica", "Confronta due numeri", "Divide un numero per due"], correct: 1, explain: "NOT inverte il valore di verità di una condizione." },
  { cat: "flowchart", q: "Quando è vera la condizione A && B (AND)?", options: ["Quando almeno una delle due è vera", "Solo quando entrambe A e B sono vere", "Sempre", "Mai"], correct: 1, explain: "L'AND richiede che entrambe le condizioni siano vere." },
  { cat: "flowchart", q: "Quando è vera la condizione A || B (OR)?", options: ["Solo quando entrambe sono vere", "Quando almeno una delle due condizioni è vera", "Mai", "Solo quando entrambe sono false"], correct: 1, explain: "L'OR è vero se almeno una delle condizioni è vera." },
  { cat: "flowchart", q: "La condizione !(n==0) è falsa quando...", options: ["n è diverso da 0", "n è uguale a 0", "n è negativo", "n è positivo"], correct: 1, explain: "!(n==0) nega l'uguaglianza a 0: è falsa proprio quando n è 0." },
  { cat: "flowchart", q: "Per verificare se n è compreso tra 10 e 20 (estremi inclusi) quale condizione è corretta?", options: ["n>10 && n<20", "n>=10 && n<=20", "n>=10 || n<=20", "n==10 && n==20"], correct: 1, explain: "Servono entrambi i limiti con gli 'uguale', collegati da AND." },

  // ---- Cicli ----
  { cat: "cicli", q: "A cosa serve un ciclo (loop) in un algoritmo?", options: ["A terminare subito l'algoritmo", "A ripetere la stessa azione più volte", "A dichiarare le costanti", "A collegare due flow chart diversi"], correct: 1, explain: "Il ciclo permette di ripetere istruzioni finché una condizione lo richiede." },
  { cat: "cicli", q: "Come si chiama la variabile che scandisce le iterazioni di un ciclo?", options: ["Costante", "Indice", "Output", "Parametro"], correct: 1, explain: "L'indice è la variabile il cui cambiamento scandisce le iterazioni." },
  { cat: "cicli", q: "Cosa si intende per 'iterazione'?", options: ["L'inizializzazione della variabile", "Un singolo passaggio all'interno del ciclo", "La fine dell'algoritmo", "Un errore di sintassi"], correct: 1, explain: "Ogni volta che si entra nel ciclo si compie un'iterazione." },
  { cat: "cicli", q: "Nel ciclo do-while, quando viene controllata la condizione?", options: ["Prima dell'esecuzione dell'iterazione (in testa)", "Dopo l'esecuzione dell'iterazione (in coda)", "Non viene mai controllata", "A metà iterazione"], correct: 1, explain: "Nel do-while il controllo avviene in coda, dopo aver eseguito il blocco." },
  { cat: "cicli", q: "Nel ciclo while-do, quando viene controllata la condizione?", options: ["In coda all'iterazione", "In testa, prima di eseguire l'iterazione", "Solo alla fine dell'algoritmo", "Mai"], correct: 1, explain: "Nel while-do la condizione si controlla prima di eseguire il blocco." },
  { cat: "cicli", q: "Qual è la differenza fondamentale tra do-while e while-do?", options: ["Nessuna differenza", "Il do-while esegue sempre almeno una volta l'iterazione, il while-do no", "Il while-do è più veloce", "Il do-while non usa un indice"], correct: 1, explain: "Il do-while garantisce almeno un'esecuzione, il while-do no se la condizione è già falsa." },
  { cat: "cicli", q: "Nel flow chart che stampa 'ciao' finché i<3 e poi 'arrivederci', quante volte viene stampato 'ciao'?", options: ["2 volte", "3 volte", "4 volte", "Infinite volte"], correct: 1, explain: "i vale 0,1,2 (tre iterazioni con condizione vera), poi con i=3 la condizione è falsa." },
  { cat: "cicli", q: "Se una condizione di un while-do è falsa fin dall'inizio, cosa succede?", options: ["Il ciclo viene eseguito comunque una volta", "Il blocco del ciclo non viene mai eseguito", "Il programma va in errore", "Il ciclo si ripete all'infinito"], correct: 1, explain: "Nel while-do, se la condizione iniziale è falsa, l'iterazione non viene mai eseguita." }
];
