<%*
// Dossier des templates : lu dans les réglages de Templater ("" = tout le vault)
const tplRoot = String(app.plugins?.plugins?.["templater-obsidian"]?.settings?.templates_folder ?? "")
  .trim().replace(/^\/+|\/+$/g, "");
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

tR += await app.vault.read(chosen);
%>
