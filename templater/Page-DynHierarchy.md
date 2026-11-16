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

if (typeFiles.length > 0) {
  const labels = typeFiles.map(f => f.basename.replace(/^type_Props-/, "").replace(/^type_/, ""));
  const chosen = await tp.system.suggester(labels, typeFiles, false, "Quel type appliquer ?");
  if (chosen) {
    // Rendu Templater du type_* (il peut contenir du code, ex. type_Log qui renomme
    // la page), puis résolution de la syntaxe du plugin « Modèles » ({{date}},
    // {{time}}, {{title}}), que Templater n'interprète pas (idem Script_ApplyType).
    const now = window.moment();
    const raw = (await tp.file.include(chosen))
      .replace(/{{\s*date(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "YYYY-MM-DD"))
      .replace(/{{\s*time(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "HH:mm"))
      .replace(/{{\s*title\s*}}/g, title);
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

// --- Corps du type : placé en bas de page (après les blocs dynamiques, avant « ## Notes »).
// Curseur sous le premier titre à remplir du corps (en fin de ligne si c'est une amorce
// de liste comme « - », « 1. » ou « - Email : ») ; les titres suivis d'une intégration
// (![[Vue.base#…]]) sont sautés. À défaut, curseur sous « ## Notes ».
const cursor = tp.file.cursor();
let bodyOut = typeBody.replace(/^(?:[ \t]*\n)+/, "").replace(/(?:\n[ \t]*)+$/, "");
let cursorPlaced = false;
if (bodyOut) {
  const lines = bodyOut.split("\n");
  const i = lines.findIndex((l, k) => /^#{2,6} /.test(l) && !/^!\[\[/.test(lines[k + 1] ?? ""));
  if (i !== -1) {
    const next = lines[i + 1];
    if (next !== undefined && /^\s*(?:[-*]|\d+\.)(?: \[ \])?(?: [^:]*:)?\s*$/.test(next)) {
      lines[i + 1] = next.replace(/\s*$/, " ") + cursor;
    } else {
      lines.splice(i + 1, 0, cursor);
    }
    cursorPlaced = true;
  }
  bodyOut = lines.join("\n") + "\n\n";
}
const hasNotes = /^## Notes\s*$/m.test(bodyOut);
const pageTail = bodyOut + (hasNotes ? "" : "## Notes\n\n") + (cursorPlaced ? "" : cursor);

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

<%* tR += pageTail; %><%* app.workspace.activeLeaf.view.editor.focus(); %>