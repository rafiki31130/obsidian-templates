---
type: Log
date: "[[{{date:YYYY-MM-DD}}]]"
topic:
person:
rating:
tags:
---
<%*
// Nommage des pages Log : « YYYY-MM-DD HHhmm - », sans prompt.
// (« : » est interdit dans un nom de fichier, d'où le « h »).
// Exécuté par « Définir le type » (Script_ApplyType) et à la création de page
// (Page-DynHierarchy). Le titre peut ensuite être complété manuellement.
const logFile = tp.config.target_file;
const logTitle = logFile.basename;
const logAt = logTitle.lastIndexOf("@");
const logParent = logAt > -1 ? logTitle.slice(0, logAt).trim() : "";
const logBase = (logAt > -1 ? logTitle.slice(logAt + 1) : logTitle).trim();
if (!/^\d{4}-\d{2}-\d{2} \d{2}h\d{2} -(?: |$)/.test(logBase)) {
  // Le parent porté par le titre (« Parent @ … ») est conservé en propriété
  if (logParent) await app.fileManager.processFrontMatter(logFile, fm => { if (!fm.parent) fm.parent = `[[${logParent}]]`; });
  try { await tp.file.rename(`${tp.date.now("YYYY-MM-DD HH[h]mm")} - `); }
  catch (e) { new Notice(`Log : renommage impossible (${e.message})`, 6000); }
}
-%>
