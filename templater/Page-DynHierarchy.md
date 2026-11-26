<%*
const title = tp.file.title;
// Le lanceur enfant passe ce contexte dans le même rendu, sans état global.
const child = typeof childPageContext === "undefined" ? null : childPageContext;
const parentTitle = !child && title.includes("@") ? title.slice(0, title.lastIndexOf("@")).trim() : "";
const parent = child?.parent ?? (parentTitle ? `[[${parentTitle}]]` : null);

// Le lanceur a déjà demandé le type ; le parcours standard conserve le même sélecteur.
let typeProps = [];   // lignes de frontmatter issues du template type_*
let typeBody = "";    // éventuel contenu hors frontmatter du template type_*
let typePath = child?.typePath ?? "";
if (!child) {
  const selectorPath = tp.config.template_file.path.replace(/[^/]+$/, "Inline-ChoosePageType.md");
  const selector = app.vault.getFileByPath(selectorPath);
  if (selector) typePath = (await tp.file.include(selector)).trim();
  else new Notice("Modèle manquant : Inline-ChoosePageType.");
}
const chosen = typePath ? app.vault.getFileByPath(typePath) : null;
if (chosen) {
  // Rendu Templater du type_*, puis résolution de la syntaxe du plugin « Modèles ».
  const now = window.moment();
  const raw = (await tp.file.include(chosen))
    .replace(/{{\s*date(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "YYYY-MM-DD"))
    .replace(/{{\s*time(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "HH:mm"))
    .replace(/{{\s*title\s*}}/g, () => title);
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fm) {
    typeProps = fm[1].split(/\r?\n/).filter(l => l.trim() !== "" && !(parent && /^parent\s*:/.test(l)));
    typeBody = raw.slice(fm[0].length);
  } else {
    typeBody = raw;
  }
}

// --- Frontmatter unique : parent + propriétés du type ---
const hdFence = "---";
const props = [];
if (parent) props.push(`parent: ${JSON.stringify(parent)}`);
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

<%* /* Vues désactivées : ce commentaire Templater n'est pas inséré dans la page.
   Pour les réactiver, sortir le bloc ci-dessous de ce commentaire.
> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-projects")
>```

> [!info]+ Pages enfant (js)
> ``` dataviewjs
dv.view("r_templates/scripts/child-pages")
>```
*/ -%>
> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-tasks")
>```

<%* tR += pageTail; if (!child) app.workspace.activeLeaf.view.editor.focus(); %>