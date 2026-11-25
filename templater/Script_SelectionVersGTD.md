<%*
// Commande d'insertion uniquement : la sélection est conservée jusqu'à la création réussie.
const source = tp.config.target_file;
const active = app.workspace.activeEditor;
if (source?.extension !== "md" || !active?.editor || active.file?.path !== source.path) {
  new Notice("Ouvre la note source en mode édition pour transformer une sélection.");
  return tR;
}
const editor = active.editor;
const original = editor.getValue();
const selections = editor.listSelections().map(r => ({ anchor: { ...r.anchor }, head: { ...r.head } }));
const from = { ...editor.getCursor("from") };
const to = { ...editor.getCursor("to") };
const selection = String(tp.file.selection() ?? "");
let outcome = null;
let created = null;

// Templater insère son résultat dans la sélection courante. La réduire évite toute perte
// sur annulation ; le hook remplace la plage d'origine après la fin de l'insertion vide.
editor.setCursor(to);
tp.hooks.on_all_templates_executed(async () => {
  const stillSource = app.workspace.activeEditor?.editor === editor && app.workspace.activeEditor?.file?.path === source.path;
  if (!stillSource || editor.getValue() !== original) {
    if (outcome) new Notice("La note a été créée. La source ayant changé, le texte sélectionné n’a pas été remplacé.");
    return;
  }
  if (!outcome) {
    editor.setSelections(selections);
    return;
  }
  const offset = editor.posToOffset(from);
  editor.replaceRange(outcome, from, to);
  editor.setCursor(editor.offsetToPos(offset + outcome.length));
  new Notice("Sélection transformée en lien vers la nouvelle note.");
});

try {
  if (selections.length !== 1 || !selection.trim()) {
    new Notice("Sélectionne un passage de texte avant de lancer la commande.");
    return tR;
  }
  const templateOpen = "<" + "%";
  const templateClose = "%" + ">";
  if (selection.includes(templateOpen) || selection.includes(templateClose) || selection.includes("\0")) {
    new Notice("Cette sélection contient des marqueurs de commande. Choisis du texte sans ces marqueurs.");
    return tR;
  }
  const array = value => value == null ? [] : Array.isArray(value) ? value : [value];
  const isData = file => !/^(r_templates|\.trash|journals)\//.test(file.path);
  const sourceMatch = original.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const sourceProps = sourceMatch ? tp.obsidian.parseYaml(sourceMatch[1]) ?? {} : {};
  const props = file => file.path === source.path ? sourceProps : app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  const archived = file => /(^|\/)4\. Archives(\/|$)/.test(file.path) || array(props(file).tags).some(v => String(v).replace(/^#/, "") === "archived");
  const eligibleProject = file => !!file && isData(file) && props(file).type === "GTD-Projet" && !archived(file) && !["8.termine", "9.abandonne"].includes(props(file).gtd_statut_projet);
  const resolve = (value, origin = source.path) => {
    const raw = typeof value === "object" && value?.path ? value.path : String(value ?? "").replace(/^\[\[/, "").replace(/\]\]$/, "").split("|")[0];
    return app.metadataCache.getFirstLinkpathDest(raw.split("#")[0], origin);
  };
  const wiki = (file, origin) => "[[" + app.metadataCache.fileToLinktext(file, origin, true) + "]]";
  const allProjects = app.vault.getMarkdownFiles().filter(eligibleProject).sort((a,b) => a.path.localeCompare(b.path, "fr"));
  const explicitParents = [...new Set(array(sourceProps.gtd_projet).map(v => resolve(v)).filter(eligibleProject))];
  let parents = [];
  let kind = null;
  if (eligibleProject(source)) {
    kind = "etape"; parents = [source];
  } else if (isData(source) && ["GTD-Domaine", "GTD-Objectif"].includes(sourceProps.type) && !archived(source)) {
    kind = "projet";
  } else if (explicitParents.length) {
    kind = "etape"; parents = explicitParents;
  } else if (sourceProps.type !== "GTD-ProjetMonolithe") {
    // Une note de dossier projet apporte aussi le contexte aux pages de travail voisines.
    let folder = source.parent;
    while (folder?.path) {
      const candidate = app.vault.getFileByPath(folder.path + "/" + folder.name + ".md");
      if (eligibleProject(candidate)) { kind = "etape"; parents = [candidate]; break; }
      folder = folder.parent;
    }
  }
  if (!kind) {
    kind = await tp.system.suggester(["Créer un projet", "Créer une étape"], ["projet", "etape"], false, "Transformer la sélection en…");
    if (!kind) return tR;
  }
  if (kind === "etape" && parents.length > 1) {
    parents = await tp.system.multi_suggester(file => file.basename + " — " + file.parent.path, allProjects, false, "Projet(s) de la nouvelle étape", undefined, parents);
    if (!parents?.length) return tR;
  } else if (kind === "etape" && !parents.length) {
    if (!allProjects.length) {
      new Notice("Aucun projet GTD ouvert ne peut recevoir cette étape. Crée d’abord un projet.");
      return tR;
    }
    const parent = await tp.system.suggester(file => file.basename + " — " + file.parent.path, allProjects, false, "Projet parent de l’étape");
    if (!parent) return tR;
    parents = [parent];
  }
  const templatePath = "r_templates/templates/type_GTD-" + (kind === "projet" ? "Projet" : "Etape") + ".md";
  const template = app.vault.getFileByPath(templatePath);
  if (!template) { new Notice("Le modèle GTD nécessaire est introuvable."); return tR; }
  const multiline = /[\r\n]/.test(selection.trim());
  const single = selection.trim();
  const taskPrefix = !multiline ? single.match(/^((?:[-*+]|\d+[.)])\s+(?:\[[^\]\r\n]\]\s+)?(?:#[^\s]+\s+)*)/)?.[1] ?? "" : "";
  const taskLine = !multiline && /^\s*(?:[-*+]|\d+[.)])\s+\[[^\]\r\n]\]\s+/.test(original.split(/\r?\n/)[from.line] ?? "");
  let caption = single.slice(taskPrefix.length);
  let taskTail = "";
  if (taskPrefix || taskLine) {
    const marker = caption.search(/\s+(?=(?:📅|⏳|🛫|➕|✅|❌|🔁|⏫|🔼|🔽|⏬|🔺)(?:\s|$))/u);
    if (marker !== -1) { taskTail = caption.slice(marker); caption = caption.slice(0,marker); }
  }
  const firstLine = (multiline ? single.split(/\r?\n/).find(v => v.trim()) : caption) ?? "";
  const suggested = firstLine.replace(/^\s*(?:#{1,6}\s+|(?:[-*+]|\d+[.)])\s+(?:\[[^\]]\]\s+)?(?:#\S+\s+)*)/, "").replace(/[\x00-\x1f\\/:*?"<>|#^\[\]]/g, " ").replace(/\s+/g, " ").trim().slice(0,100);
  const validTitle = title => title && !/[\x00-\x1f\\/:*?"<>|#^\[\]]/.test(title) && !/[. ]$/.test(title) && !/^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(title);
  let title = suggested;
  let folderPath;
  while (true) {
    const entered = await tp.system.prompt(kind === "projet" ? "Titre du nouveau projet" : "Titre de la nouvelle étape", title, false, false, true);
    if (entered == null || !entered.trim()) return tR;
    title = entered.trim().replace(/\.md$/i, "");
    if (!validTitle(title)) { new Notice("Choisis un titre de note valide, sans chemin."); continue; }
    if (app.vault.getMarkdownFiles().some(file => file.basename.toLocaleLowerCase("fr") === title.toLocaleLowerCase("fr"))) {
      new Notice("Une note de ce nom existe déjà. Choisis un autre titre pour éviter un doublon.");
      continue;
    }
    if (kind === "projet") folderPath = "pages/1. Projets/" + title;
    else {
      const dedicated = parents.filter(file => file.parent?.name === file.basename);
      const nearest = dedicated.find(file => source.parent.path === file.parent.path || source.parent.path.startsWith(file.parent.path + "/"));
      folderPath = (nearest ?? dedicated[0])?.parent.path ?? "bases/GTD.Etapes";
    }
    if (kind === "projet" && app.vault.getAbstractFileByPath(folderPath)) {
      new Notice("Un dossier de ce nom existe déjà. Choisis un autre titre.");
      continue;
    }
    break;
  }
  if (app.workspace.activeEditor?.editor !== editor || editor.getValue() !== original) {
    new Notice("La source a changé pendant la préparation. Relance la commande depuis la bonne sélection.");
    return tR;
  }
  const ensureFolder = async folder => {
    let current = "";
    for (const segment of folder.split("/")) {
      current = current ? current + "/" + segment : segment;
      if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
    }
  };
  await ensureFolder(folderPath);
  // Seul le modèle de confiance est exécuté ; la sélection n'est jamais un modèle Templater.
  created = await tp.file.create_new(template, title, false, folderPath);
  if (!created) { new Notice("La création n’a pas abouti ; le texte source est conservé."); return tR; }
  const expectedType = kind === "projet" ? "GTD-Projet" : "GTD-Etape";
  await app.fileManager.processFrontMatter(created, frontmatter => {
    if (frontmatter.type !== expectedType) throw new Error("Le modèle n’a pas produit le type GTD attendu.");
    if (kind === "etape") frontmatter.gtd_projet = parents.map(file => wiki(file,created.path));
    else {
      if (isData(source) && sourceProps.type === "GTD-Domaine" && !archived(source)) frontmatter.gtd_domaine = wiki(source,created.path);
      else {
        const domains = array(sourceProps.gtd_domaine).map(v => resolve(v)).filter(file => file && isData(file) && props(file).type === "GTD-Domaine" && !archived(file));
        if (domains.length) frontmatter.gtd_domaine = domains.length === 1 ? wiki(domains[0],created.path) : domains.map(file => wiki(file,created.path));
      }
      if (isData(source) && sourceProps.type === "GTD-Objectif" && !archived(source)) frontmatter.gtd_objectif = wiki(source,created.path);
      else {
        const goals = array(sourceProps.gtd_objectif).map(v => resolve(v)).filter(file => file && isData(file) && props(file).type === "GTD-Objectif" && !archived(file));
        if (goals.length) frontmatter.gtd_objectif = goals.length === 1 ? wiki(goals[0],created.path) : goals.map(file => wiki(file,created.path));
      }
    }
    const topics = array(sourceProps.topic).filter(value => typeof value === "string" && /^\[\[.+\]\]$/.test(value) && !value.includes(templateOpen) && !value.includes(templateClose));
    if (isData(source) && ["Topic","GTD-Domaine"].includes(sourceProps.type) && !archived(source)) topics.push(wiki(source,created.path));
    if (topics.length) frontmatter.topic = [...new Set(topics)];
  });
  // Pour une tâche sur une seule ligne, les marqueurs et dates restent dans la source.
  // Un bloc multiligne est transféré intégralement dans la nouvelle note.
  const capture = taskPrefix || taskLine ? caption : single;
  const origin = app.fileManager.generateMarkdownLink(source,created.path);
  await app.vault.process(created, current => current.replace(/\s*$/, "") + "\n\n## Origine\n\n" + origin + "\n\n## Texte source\n\n" + capture + "\n");
  const alias = multiline || /[\[\]|]/.test(caption) ? title : caption;
  const noteLink = app.fileManager.generateMarkdownLink(created,source.path,undefined,alias);
  const leading = selection.match(/^\s*/)?.[0] ?? "";
  const trailing = selection.match(/\s*$/)?.[0] ?? "";
  outcome = leading + (multiline ? "" : taskPrefix) + noteLink + (multiline ? "" : taskTail) + trailing;
} catch (error) {
  console.error("Sélection vers GTD",error);
  new Notice(created ? "La note a été créée, mais la conversion n’a pas pu être finalisée. La source est conservée." : "La conversion n’a pas abouti. La source est conservée.");
}
-%>
