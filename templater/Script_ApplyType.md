<%*
const typeFiles = app.vault
  .getMarkdownFiles()
  .filter(f => f.path.startsWith("templates/type_"))
  .sort((a, b) => a.basename.localeCompare(b.basename));

if (typeFiles.length === 0) {
  new Notice("Aucun template type_* trouvé dans templates/");
  return;
}

const labels = typeFiles.map(f => f.basename.replace(/^type_Props-/, "").replace(/^type_/, ""));
const chosen = await tp.system.suggester(labels, typeFiles, false, "Quel type appliquer ?");
if (!chosen) return;

tR += await app.vault.read(chosen);
%>
