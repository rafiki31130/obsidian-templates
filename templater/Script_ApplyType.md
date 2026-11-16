<%*
// Dossier des templates : celui du plugin de base « Modèles » (Templates),
// d'où les type_* sont insérés ("" = non configuré → tout le vault)
const tplRoot = String(
  app.internalPlugins?.getPluginById?.("templates")?.instance?.options?.folder
  ?? app.internalPlugins?.plugins?.templates?.instance?.options?.folder
  ?? ""
).trim().replace(/^\/+|\/+$/g, "");
const typeFiles = app.vault
  .getMarkdownFiles()
  .filter(f => f.basename.startsWith("type_") && (tplRoot === "" || f.path.startsWith(tplRoot + "/")))
  .sort((a, b) => a.basename.localeCompare(b.basename));

if (typeFiles.length === 0) {
  new Notice(`Aucun template type_* trouvé dans ${tplRoot || "le vault"}`);
  return;
}

const labels = typeFiles.map(f => f.basename.replace(/^type_Props-/, "").replace(/^type_/, ""));
const chosen = await tp.system.suggester(labels, typeFiles, false, "Quel type appliquer ?");
if (!chosen) return;

// Variables du plugin de base « Modèles » ({{title}}, {{date[:FMT]}}, {{time[:FMT]}}) :
// remplacées ici, car le contenu du template type_* est inséré par Templater
const tplOpts = app.internalPlugins?.getPluginById?.("templates")?.instance?.options
  ?? app.internalPlugins?.plugins?.templates?.instance?.options ?? {};
const renderCoreVars = (raw, title) => raw
  .replace(/\{\{\s*title\s*\}\}/gi, title)
  .replace(/\{\{\s*date(?::([^}]*))?\s*\}\}/gi, (_, fmt) => moment().format((fmt || tplOpts.dateFormat || "YYYY-MM-DD").trim()))
  .replace(/\{\{\s*time(?::([^}]*))?\s*\}\}/gi, (_, fmt) => moment().format((fmt || tplOpts.timeFormat || "HH:mm").trim()));

tR += renderCoreVars(await app.vault.read(chosen), tp.file.title);
%>
