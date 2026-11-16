<%*
const title = tp.file.title;
let parent = null;
let istree = null;

if (title.includes('@')) {
  istree = true;
  const parts = title.split('@');
  if (parts.length > 1) parent = parts.slice(0, -1).join('@').trim();
}

// --- Définir le type (même action que le bouton `button-applytype` / Script_ApplyType) ---
// Proposé systématiquement à la création de la page. Échap = pas de type.
let typeProps = [];   // lignes de frontmatter issues du template type_*
let typeBody = "";    // éventuel contenu hors frontmatter du template type_*

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

// Variables du plugin de base « Modèles » ({{title}}, {{date[:FMT]}}, {{time[:FMT]}}) :
// remplacées ici, car le contenu du template type_* est inséré par Templater
const tplOpts = app.internalPlugins?.getPluginById?.("templates")?.instance?.options
  ?? app.internalPlugins?.plugins?.templates?.instance?.options ?? {};
const renderCoreVars = (raw, title) => raw
  .replace(/\{\{\s*title\s*\}\}/gi, title)
  .replace(/\{\{\s*date(?::([^}]*))?\s*\}\}/gi, (_, fmt) => moment().format((fmt || tplOpts.dateFormat || "YYYY-MM-DD").trim()))
  .replace(/\{\{\s*time(?::([^}]*))?\s*\}\}/gi, (_, fmt) => moment().format((fmt || tplOpts.timeFormat || "HH:mm").trim()));

if (typeFiles.length > 0) {
  const labels = typeFiles.map(f => f.basename.replace(/^type_Props-/, "").replace(/^type_/, ""));
  const chosen = await tp.system.suggester(labels, typeFiles, false, "Quel type appliquer ?");
  if (chosen) {
    const raw = renderCoreVars(await app.vault.read(chosen), title);
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (fm) {
      typeProps = fm[1].split(/\r?\n/).filter(l => l.trim() !== "");
      typeBody = raw.slice(fm[0].length);
    } else {
      typeBody = raw;
    }
    // Le parent calculé depuis le titre prime sur un éventuel parent du template type
    if (parent) typeProps = typeProps.filter(l => !/^parent\s*:/.test(l));
  }
}

// --- Frontmatter unique : parent + propriétés du type ---
const hdFence = "---";
const props = [];
if (parent) props.push(`parent: "[[${parent}]]"`);
props.push(...typeProps);

if (props.length > 0) {
  tR += `${hdFence}\n${props.join("\n")}\n${hdFence}\n`;
}
if (typeBody.trim() !== "") {
  tR += typeBody.replace(/\s*$/, "\n");
}

%>
`button-applytype` `button-archive` `button-addjournal`

> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-projects")
>```

> [!info]+ Pages enfant (js)
> ``` dataviewjs
dv.view("r_templates/scripts/child-pages")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-tasks")
>```
## Notes

<% tp.file.cursor() %><%* app.workspace.activeLeaf.view.editor.focus(); %>