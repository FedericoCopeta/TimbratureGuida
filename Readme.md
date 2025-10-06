# Guida Interattiva TIMBRATURE

Questo repository contiene la **guida interattiva** per l'addin Excel "TIMBRATURE", pubblicata tramite **GitHub Pages**.

## 📘 Descrizione

La guida è progettata per offrire un'esperienza simile alla guida di Office:

- Navigazione ad albero con sezioni espandibili
- Ricerca in tempo reale tra gli argomenti
- Effetti visivi `onmouseover` e icone in stile Office UI
- Contenuti dinamici caricati da file JSON

## 📁 Struttura dei file

- `index.html`: pagina principale della guida
- `taskpane_tree.js`: script per la navigazione ad albero e la ricerca
- `taskpane.css`: stile coerente con Office UI Fabric
- `guida_tree.json`: contenuti della guida suddivisi in sezioni

## 🌐 Pubblicazione

La guida è pubblicata tramite GitHub Pages ed è accessibile al seguente indirizzo:

👉 [https://federicocopeta.github.io/TimratureGuida/

## 🧩 Integrazione con Excel

Nel file `manifest.xml` dell'addin Excel, imposta il percorso della guida come:


<SourceLocation DefaultValue="https://federicocopeta.github.io/TimbratureGuida/index.html"/>