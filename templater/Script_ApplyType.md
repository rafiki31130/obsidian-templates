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

// Le template est rendu par Templater (un type_* peut contenir du code Templater,
// ex. type_Log qui renomme la page), puis la syntaxe du plugin « Modèles »
// ({{date}}, {{time}}, {{title}}), que Templater n'interprète pas, est résolue ici.
let content = await tp.file.include(chosen);
const now = window.moment();
content = content
  .replace(/{{\s*date(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "YYYY-MM-DD"))
  .replace(/{{\s*time(?::([^}]+))?\s*}}/g, (_, f) => now.format(f || "HH:mm"))
  .replace(/{{\s*title\s*}}/g, tp.file.title);

// Séparation frontmatter / corps du template
const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
const body = fmMatch ? content.slice(fmMatch[0].length) : content;

// Fusion des propriétés dans le frontmatter de la page courante.
// Un `---` inséré au curseur ne serait pas un frontmatter : on passe par processFrontMatter.
//  - clé absente            → ajoutée
//  - clé présente mais vide → remplie par la valeur du template
//  - clé présente et remplie → conservée (listes : union des valeurs)
if (fmMatch) {
  const tplProps = tp.obsidian.parseYaml(fmMatch[1]) ?? {};
  const target = tp.config.target_file ?? app.workspace.getActiveFile();
  const isEmpty = v => v == null || v === "" || (Array.isArray(v) && v.length === 0);
  await app.fileManager.processFrontMatter(target, fm => {
    for (const [k, v] of Object.entries(tplProps)) {
      if (!(k in fm) || isEmpty(fm[k])) {
        fm[k] = v;
      } else if (Array.isArray(fm[k]) && Array.isArray(v)) {
        for (const item of v) if (!fm[k].includes(item)) fm[k].push(item);
      }
    }
  });
}

// Corps : inséré au curseur, sauf s'il est déjà présent dans la page
const current = await app.vault.read(tp.config.target_file ?? app.workspace.getActiveFile());
if (body.trim() !== "" && !current.includes(body.trim())) tR += body;
%>
