<%*
// À insérer depuis la note parente (ne pas utiliser « Créer une note à partir d'un modèle »).
const source = tp.config.target_file;
const active = app.workspace.activeEditor;
if (source?.extension !== "md" || !active?.editor || active.file?.path !== source.path) {
  new Notice("Ouvre la note parente en mode édition avant de lancer ce modèle.");
  return tR;
}
// Une insertion Templater remplace la sélection, même quand le modèle ne produit aucun texte.
if (active.editor.somethingSelected()) active.editor.setCursor(active.editor.getCursor("to"));

let title = (await tp.system.prompt("Titre de la page enfant"))?.trim();
if (!title) return tR;
if (/[\x00-\x1f\\/:*?"<>|#^\[\]]/.test(title) || title.endsWith(".")) {
  new Notice("Le titre doit être un nom de note valide, sans chemin.");
  return tR;
}

const sibling = name => app.vault.getFileByPath(tp.config.template_file.path.replace(/[^/]+$/, name));
const selector = sibling("Inline-ChoosePageType.md");
const layout = sibling("Page-DynHierarchy.md");
if (!selector || !layout) {
  new Notice("Modèles manquants : Inline-ChoosePageType ou Page-DynHierarchy.");
  return tR;
}
const typePath = (await tp.file.include(selector)).trim();
const type = typePath ? app.vault.getFileByPath(typePath)?.basename : null;
// Créer directement sous le nom final : le type n'a pas à renommer une note déjà créée.
if ((type === "type_Log" || type === "type_Meeting") && !/^\d{4}-\d{2}-\d{2} \d{2}h\d{2} -(?: |$)/.test(title)) {
  title = `${tp.date.now("YYYY-MM-DD HH[h]mm")} - ${title}`;
}

// Passage de données au moteur du modèle enfant, sans laisser de délimiteur Templater dans le JSON.
const context = JSON.stringify({ parent: `[[${source.name}]]`, typePath })
  .replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
const bootstrap = "<" + `%* const childPageContext = ${context}; %` + ">";
const layoutSource = await app.vault.read(layout);
const child = await tp.file.create_new(bootstrap + layoutSource, title, false);
if (child) {
  // Laisser Templater terminer l'insertion dans la note source avant de changer d'onglet.
  tp.hooks.on_all_templates_executed(async () => {
    try {
      await app.workspace.getLeaf(false).openFile(child, { state: { mode: "source" } });
      app.commands.executeCommandById("templater-obsidian:jump-to-next-cursor-location");
    } catch (error) {
      new Notice(`La note a été créée, mais n’a pas pu être ouverte : ${error.message}`);
    }
  });
}
-%>
