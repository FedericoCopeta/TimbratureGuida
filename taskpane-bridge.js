// taskpane-bridge.js
// Ponte tra VBA (RibbonX) e l'Office Web Add-in per mostrare/nascondere il task pane.
// Richiede: shared runtime abilitato nel manifest.

(async () => {
  await Office.onReady();

  // Facoltativo ma consigliato: carica il runtime all'apertura del documento
  try {
    await Office.addin.setStartupBehavior(Office.StartupBehavior.load);
  } catch (e) {
    console.warn("setStartupBehavior(load) non riuscito:", e);
  }

  // Tracciamo la visibilità corrente (per TOGGLE)
  let isPaneVisible = false;
  try {
    const remove = await Office.addin.onVisibilityModeChanged((args) => {
      isPaneVisible = (args.visibilityMode === Office.VisibilityMode.taskpane);
    });
    // (volendo: salva remove() per deregistrare in futuro)
  } catch (e) {
    console.warn("onVisibilityModeChanged non disponibile:", e);
  }

  // (Opzionale) marca il documento per l'auto-open del task pane
  try {
    Office.context.document.settings.set("Office.AutoShowTaskpaneWithDocument", true);
    Office.context.document.settings.saveAsync();
  } catch (e) {
    console.warn("Impossibile salvare AutoShowTaskpaneWithDocument:", e);
  }

  // Registra l'handler sul worksheet per intercettare il Named Range "Timbrature_ShowPane"
  try {
    await Excel.run(async (context) => {
      const wb = context.workbook;

      // Recupera il named range
      const nm = wb.names.getItem("Timbrature_ShowPane");
      nm.load("name, refersTo");
      await context.sync();

      // Esempio: "=FoglioConfig!$A$1"
      const targetRef = nm.refersTo.replace("=", "").replace(/\$/g, "");

      // Ascolta i cambiamenti nel foglio interessato
      const sheetName = targetRef.split("!")[0].replace(/'/g, "");
      const ws = wb.worksheets.getItem(sheetName);

      ws.onChanged.add(async (evt) => {
        try {
          // Confronta indirizzi senza dollari
          const evtAddr = (evt.address || "").replace(/\$/g, "");
          if (evtAddr.toLowerCase() !== targetRef.toLowerCase()) return;

          await Excel.run(async (ctx) => {
            const range = ctx.workbook.worksheets.getItem(sheetName).getRange(evt.address);
            range.load("values");
            await ctx.sync();

            const cmd = String(range.values?.[0]?.[0] || "").trim().toUpperCase();

            if (cmd === "SHOW") {
              await Office.addin.showAsTaskpane();
            } else if (cmd === "HIDE") {
              await Office.addin.hide();
            } else if (cmd === "TOGGLE") {
              if (isPaneVisible) {
                await Office.addin.hide();
              } else {
                await Office.addin.showAsTaskpane();
              }
            }

            // Pulisci il comando
            range.values = [[""]];
            await ctx.sync();
          });
        } catch (err) {
          console.error("Errore onChanged:", err);
        }
      });

      await context.sync();
    });
  } catch (e) {
    console.error("Errore inizializzazione handler NamedRange:", e);
  }
})();
``