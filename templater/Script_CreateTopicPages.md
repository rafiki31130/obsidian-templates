<%*
// ─── Script_CreateTopicPages ──────────────────────────────────────────────────
// Parcourt tout le vault et relève les topics référencés dans la propriété
// `topic:` des notes, puis :
//   1. crée dans `pages/` une page (type: Topic) pour chaque topic qui n'a pas
//      encore de page ;
//   2. convertit en lien `[[Topic]]` les valeurs de `topic:` écrites en texte
//      brut (ex. `topic: Vehicules` → `topic: "[[Vehicules]]"`).
//
// Un topic est considéré comme existant si un lien [[Topic]] se résout déjà vers
// un fichier du vault, où qu'il soit (pas de doublon), ou si `pages/<Topic>.md`
// existe. Aucune page existante n'est modifiée ni écrasée.
//
// Contenu d'une page créée : le template `type_Topic` du dossier du plugin de
// base « Modèles » (variables {{title}}, {{date}}, {{time}} remplacées).
// Garanti dans tous les cas : `type: Topic` et `topic:` contenant le lien vers
// la page elle-même ([[Nom de la page]]). Repli si le template est introuvable :
// ces deux propriétés seules.
//
// Les fichiers des dossiers de templates (Modèles et Templater) sont ignorés.

const TOPIC_PROPS    = ["topic"];      // propriétés lues comme références de topic
const TOPIC_DIR      = "pages";        // dossier de création des pages manquantes
const TOPIC_TEMPLATE = "type_Topic";   // template appliqué aux pages créées
const TOPIC_TYPE     = "Topic";

// ─── 1. Dossiers de templates (exclus du scan) ───────────────────────────────
const cleanDir = (s) => String(s ?? "").trim().replace(/^\/+|\/+$/g, "");
const tplRoot = cleanDir(
  app.internalPlugins?.getPluginById?.("templates")?.instance?.options?.folder
  ?? app.internalPlugins?.plugins?.templates?.instance?.options?.folder
);
const templaterRoot = cleanDir(app.plugins?.plugins?.["templater-obsidian"]?.settings?.templates_folder);
const isTemplateFile = (f) => [tplRoot, templaterRoot].some(r => r && f.path.startsWith(r + "/"));

if (!app.vault.getAbstractFileByPath(TOPIC_DIR)) {
  new Notice(`Dossier « ${TOPIC_DIR}/ » introuvable — abandon.`, 6000);
  return;
}

// ─── 2. Analyse d'une valeur de topic ────────────────────────────────────────
// Renvoie { name, isLink } ou null si la valeur est vide / non exploitable.
function safeFileName(s) {
  return s.replace(/[\\/:*?"<>|#^\[\]]/g, "-").replace(/\s+/g, " ").trim();
}
function parseTopic(v) {
  if (v == null || typeof v === "object") return null;
  const s = String(v).trim();
  if (!s) return null;
  // placeholders de templates non résolus (balise Templater écrite en morceaux)
  if (s.includes("{{") || s.includes("<" + "%")) return null;
  const link = s.match(/^\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]$/);
  if (link) return { name: link[1].trim(), isLink: true };
  if (s.includes("[[") || s.includes("]]")) return null; // lien malformé : on n'y touche pas
  const name = safeFileName(s);
  return name ? { name, isLink: false } : null;
}
const asList = (v) => (Array.isArray(v) ? v : [v]);

// ─── 3. Relever les topics et les notes à corriger ───────────────────────────
const files = app.vault.getMarkdownFiles().filter(f => !isTemplateFile(f));
const topics = new Map();  // nom en minuscules → { name, refs }
const toFix = [];          // notes dont au moins une valeur n'est pas un lien

for (const f of files) {
  const fm = app.metadataCache.getFileCache(f)?.frontmatter;
  if (!fm) continue;
  let needsFix = false;
  for (const prop of TOPIC_PROPS) {
    if (!(prop in fm)) continue;
    for (const v of asList(fm[prop])) {
      const t = parseTopic(v);
      if (!t) continue;
      const key = t.name.toLowerCase();
      if (!topics.has(key)) topics.set(key, { name: t.name, refs: 0 });
      topics.get(key).refs++;
      if (!t.isLink) needsFix = true;
    }
  }
  if (needsFix) toFix.push(f);
}

if (topics.size === 0) {
  new Notice(`Aucun topic trouvé (propriété ${TOPIC_PROPS.join(", ")}).`, 5000);
  return;
}

// ─── 4. Topics sans page ──────────────────────────────────────────────────────
const pathFor = (name) => `${TOPIC_DIR}/${name}.md`;
const missing = [...topics.values()]
  .filter(t => !app.metadataCache.getFirstLinkpathDest(t.name, "") && !app.vault.getAbstractFileByPath(pathFor(t.name)))
  .sort((a, b) => a.name.localeCompare(b.name));

if (missing.length === 0 && toFix.length === 0) {
  new Notice(`${topics.size} topic(s) : toutes les pages existent et toutes les références sont des liens.`, 5000);
  return;
}

// ─── 5. Confirmer ─────────────────────────────────────────────────────────────
const parts = [];
if (missing.length) parts.push(`créer ${missing.length} page(s) : ${missing.map(t => t.name).join(", ")}`);
if (toFix.length) parts.push(`convertir en liens dans ${toFix.length} note(s)`);
const ok = await tp.system.suggester(
  [`Oui, ${parts.join(" ; ")}`, "Annuler"],
  [true, false],
  false,
  `${topics.size} topic(s) relevé(s) — appliquer ?`
);
if (!ok) return;

// ─── 6. Créer les pages manquantes ────────────────────────────────────────────
const tplFile = app.vault.getMarkdownFiles().find(f =>
  f.basename === TOPIC_TEMPLATE && (!tplRoot || f.path.startsWith(tplRoot + "/")));
const tplRaw = tplFile ? await app.vault.read(tplFile) : null;

// Variables du plugin de base « Modèles » ({{title}}, {{date[:FMT]}}, {{time[:FMT]}}) :
// remplacées ici, car la page est créée par script
const tplOpts = app.internalPlugins?.getPluginById?.("templates")?.instance?.options
  ?? app.internalPlugins?.plugins?.templates?.instance?.options ?? {};
const renderCoreVars = (raw, title) => raw
  .replace(/\{\{\s*title\s*\}\}/gi, title)
  .replace(/\{\{\s*date(?::([^}]*))?\s*\}\}/gi, (_, fmt) => moment().format((fmt || tplOpts.dateFormat || "YYYY-MM-DD").trim()))
  .replace(/\{\{\s*time(?::([^}]*))?\s*\}\}/gi, (_, fmt) => moment().format((fmt || tplOpts.timeFormat || "HH:mm").trim()));

// Le topic d'une page Topic est la page elle-même, au format lien
function selfTopic(fm, name) {
  if (!fm.type) fm.type = TOPIC_TYPE;
  const self = `[[${name}]]`;
  const list = (fm.topic == null || fm.topic === "") ? [] : asList(fm.topic).map(toLink);
  const has = list.some(v => parseTopic(v)?.name?.toLowerCase() === name.toLowerCase());
  fm.topic = has ? list : [self, ...list];
}

let created = 0;
const errors = [];
for (const t of missing) {
  const path = pathFor(t.name);
  try {
    if (app.vault.getAbstractFileByPath(path)) continue; // jamais d'écrasement
    const file = await app.vault.create(path, tplRaw ? renderCoreVars(tplRaw, t.name) : `---\ntype: ${TOPIC_TYPE}\n---\n`);
    await app.fileManager.processFrontMatter(file, fm => selfTopic(fm, t.name));
    created++;
  } catch (e) {
    errors.push(`${path}: ${e.message}`);
  }
}

// ─── 7. Convertir les valeurs texte en liens ─────────────────────────────────
function toLink(v) {
  const t = parseTopic(v);
  return t && !t.isLink ? `[[${t.name}]]` : v;
}
let fixed = 0;
for (const f of toFix) {
  try {
    await app.fileManager.processFrontMatter(f, fm => {
      for (const prop of TOPIC_PROPS) {
        if (!(prop in fm) || fm[prop] == null) continue;
        fm[prop] = Array.isArray(fm[prop]) ? fm[prop].map(toLink) : toLink(fm[prop]);
      }
    });
    fixed++;
  } catch (e) {
    errors.push(`${f.path}: ${e.message}`);
  }
}

// ─── 8. Récapitulatif ─────────────────────────────────────────────────────────
let summary = `${created} page(s) Topic créée(s) dans ${TOPIC_DIR}/, ${fixed} note(s) convertie(s) en liens.`;
if (!tplRaw && created) summary += `\n(Template ${TOPIC_TEMPLATE} introuvable : pages créées avec type et topic seuls.)`;
if (errors.length) {
  console.error("Script_CreateTopicPages — erreurs :", errors);
  new Notice(`${summary}\n${errors.length} erreur(s) — voir console.`, 8000);
} else {
  new Notice(summary, 6000);
}
%>
