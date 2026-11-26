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
const target = tp.config.target_file ?? app.workspace.getActiveFile();

// Fusion des propriétés dans le frontmatter de la page courante.
// Un `---` inséré au curseur ne serait pas un frontmatter : on passe par processFrontMatter.
//  - clé absente            → ajoutée
//  - clé présente mais vide → remplie par la valeur du template
//  - clé présente et remplie → conservée (listes : union des valeurs)
if (fmMatch) {
  const tplProps = tp.obsidian.parseYaml(fmMatch[1]) ?? {};
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

// Corps : ajouté en fin de page, dans le fichier, après le frontmatter fusionné.
// Ne pas l'insérer au curseur (tR) : dans une page neuve le curseur est en position 0,
// et le corps se retrouvait AVANT le frontmatter que processFrontMatter vient d'écrire.
// Rien n'est ajouté si le corps est déjà présent dans la page.
const bodyText = body.replace(/^(?:[ \t]*\r?\n)+/, "").replace(/\s+$/, "");
if (bodyText !== "") {
  await app.vault.process(target, data => {
    if (data.includes(bodyText)) return data;
    const sep = data.trim() === "" ? "" : (data.endsWith("\n\n") ? "" : data.endsWith("\n") ? "\n" : "\n\n");
    return data + sep + bodyText + "\n";
  });
}
-%>
