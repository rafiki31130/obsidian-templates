---
type: Log
date: "[[{{date:YYYY-MM-DD}}]]"
topic:
person:
rating:
tags:
---
<%*
// Nommage des pages Log : « YYYY-MM-DD HHhmm - <nom> »
// (« : » est interdit dans un nom de fichier, d'où le « h »).
// Exécuté par « Définir le type » (Script_ApplyType) et à la création de page
// (Page-DynHierarchy). Le nom proposé reprend le titre actuel, sans son parent.
const logFile = tp.config.target_file;
const logTitle = logFile.basename;
const logAt = logTitle.lastIndexOf("@");
const logParent = logAt > -1 ? logTitle.slice(0, logAt).trim() : "";
const logBase = (logAt > -1 ? logTitle.slice(logAt + 1) : logTitle).trim();
if (!/^\d{4}-\d{2}-\d{2} \d{2}h\d{2} - /.test(logBase)) {
  const untitled = /^(Sans titre|Untitled)(\s+\d+)?$/i.test(logBase);
  const logName = (await tp.system.prompt("Nom du log", untitled ? "" : logBase))?.trim();
  if (logName) {
    // Le parent porté par le titre (« Parent @ … ») est conservé en propriété
    if (logParent) await app.fileManager.processFrontMatter(logFile, fm => { if (!fm.parent) fm.parent = `[[${logParent}]]`; });
    const safe = logName.replace(/[\\/:*?"<>|#^\[\]]/g, "-");
    try { await tp.file.rename(`${tp.date.now("YYYY-MM-DD HH[h]mm")} - ${safe}`); }
    catch (e) { new Notice(`Log : renommage impossible (${e.message})`, 6000); }
  }
}
-%>
