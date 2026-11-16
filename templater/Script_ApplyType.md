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

// Les type_* utilisent la syntaxe du plugin « Modèles » ({{date}}, {{time}}, {{title}}) :
// Templater ne l'interprète pas, on la résout ici.
let content = await app.vault.read(chosen);
const now = window.moment();
content = content
  .replace(/{{\s*date(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "YYYY-MM-DD"))
  .replace(/{{\s*time(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "HH:mm"))
  .replace(/{{\s*title\s*}}/g, tp.file.title);
tR += content;
%>
