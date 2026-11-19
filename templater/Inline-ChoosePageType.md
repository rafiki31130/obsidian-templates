<%*
// Helper de Page-DynHierarchy et Bloc-CreateChildPage : renvoie le chemin du type choisi.
// Dossier du plugin « Modèles » ("" = non configuré → tout le vault).
const tplRoot = String(
  app.internalPlugins?.getPluginById?.("templates")?.instance?.options?.folder
  ?? app.internalPlugins?.plugins?.templates?.instance?.options?.folder
  ?? ""
).trim().replace(/^\/+|\/+$/g, "");
const typeFiles = app.vault.getMarkdownFiles()
  .filter(f => f.basename.startsWith("type_") && (tplRoot === "" || f.path.startsWith(tplRoot + "/")))
  .sort((a, b) => a.basename.localeCompare(b.basename));
if (typeFiles.length > 0) {
  const labels = typeFiles.map(f => f.basename.replace(/^type_Props-/, "").replace(/^type_/, ""));
  const chosen = await tp.system.suggester(labels, typeFiles, false, "Quel type appliquer ?");
  tR += chosen?.path ?? "";
}
-%>
