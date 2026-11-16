<%*
// ─── Script_GenerateTypeTemplates ─────────────────────────────────────────────
// Parcourt tout le vault, relève toutes les valeurs de la propriété `type:`
// et crée un template `type_<Type>.md` pour chaque type qui n'en a pas
// encore. N'écrase JAMAIS un template existant.
//
// Dossier de destination : détecté automatiquement, c'est le dossier configuré
// dans le plugin de base « Modèles » (Templates), d'où les type_* sont insérés.
// S'il n'est pas configuré ou introuvable : abandon avec un message.
//
// Anti-doublon : tout fichier `type_*` du vault, où qu'il soit, compte comme
// template existant pour son `type:`.
//
// Un type est considéré comme « déjà couvert » si :
//   - le fichier cible `type_<Type>.md` existe déjà, ou
//   - un template `type_*` existant déclare déjà ce `type:` dans son frontmatter
//     (comparaison insensible à la casse).
//
// Contenu par défaut d'un template généré :
//   type:   <valeur relevée>   [text]
//   topic:                     [links → multitext]
//   person:                    [links → multitext]
//   rating:                    [int   → number]
//   tags:                      [tags]
//
// Les types de propriétés Obsidian sont déclarés seulement si la propriété
// n'a pas encore de type (aucun type existant n'est modifié).
//
// Les templates générés apparaissent ensuite dans « Définir le type »
// (Script_ApplyType) et à la création de page (Page-DynHierarchy).


// Propriétés par défaut et leur type Obsidian
// (Obsidian n'a pas de type « links » ni « int » : liste de liens = multitext,
//  entier = number)
const DEFAULT_PROPS = [
  { key: "type",   obsidianType: "text" },
  { key: "topic",  obsidianType: "multitext" },
  { key: "person", obsidianType: "multitext" },
  { key: "rating", obsidianType: "number" },
  { key: "tags",   obsidianType: "tags" },
];

// ─── 1. Normalisation d'une valeur de type ───────────────────────────────────
// Accepte "Projet", "[[Projet]]", "[[Projet|alias]]", ou une liste de ces formes.
function normalizeTypeValues(raw) {
  const list = Array.isArray(raw) ? raw : [raw];
  const out = [];
  for (const v of list) {
    if (v == null) continue;
    let s = String(v).trim();
    const link = s.match(/^\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]$/);
    if (link) s = link[1].trim();
    // Ignore les valeurs vides ou non résolues (placeholders de templates)
    // (balises Templater écrites en morceaux : un "%" suivi de ">" littéral fermerait ce script)
    if (!s || s.includes("{{") || s.includes("<" + "%") || s.includes("%" + ">")) continue;
    out.push(s);
  }
  return out;
}

function frontmatterOf(file) {
  return app.metadataCache.getFileCache(file)?.frontmatter ?? null;
}

// ─── 2. Localiser le dossier des templates type_* ────────────────────────────
const files = app.vault.getMarkdownFiles();
// Dossier des templates : celui du plugin de base « Modèles » (Templates),
// d'où les type_* sont insérés ("" = non configuré → tout le vault)
const tplRoot = String(
  app.internalPlugins?.getPluginById?.("templates")?.instance?.options?.folder
  ?? app.internalPlugins?.plugins?.templates?.instance?.options?.folder
  ?? ""
).trim().replace(/^\/+|\/+$/g, "");
// Tous les type_* du vault (anti-doublon), où qu'ils soient
const typeFiles = files.filter(f => f.basename.startsWith("type_"));
const typeFilePaths = new Set(typeFiles.map(f => f.path));

const TEMPLATE_DIR = tplRoot;
if (!TEMPLATE_DIR || !app.vault.getAbstractFileByPath(TEMPLATE_DIR)) {
  new Notice(
    "Dossier des modèles introuvable : configurez-le dans Réglages → Modèles " +
    "(plugin de base Templates) → Emplacement du dossier des modèles.", 8000);
  return;
}

// ─── 3. Relever tous les types utilisés dans le vault ────────────────────────
const usedTypes = new Map(); // clé minuscule → { value, count }

for (const f of files) {
  if (typeFilePaths.has(f.path)) continue; // ne pas compter les templates type_* eux-mêmes
  const fm = frontmatterOf(f);
  if (!fm || !("type" in fm)) continue;
  for (const t of normalizeTypeValues(fm.type)) {
    const key = t.toLowerCase();
    const entry = usedTypes.get(key);
    if (entry) entry.count++;
    else usedTypes.set(key, { value: t, count: 1 });
  }
}

if (usedTypes.size === 0) {
  new Notice("Aucune propriété `type:` trouvée dans le vault.");
  return;
}

// ─── 4. Types déjà couverts par un template existant ─────────────────────────
const coveredTypes = new Set();
for (const f of typeFiles) {
  const fm = frontmatterOf(f);
  if (fm && "type" in fm) {
    for (const t of normalizeTypeValues(fm.type)) coveredTypes.add(t.toLowerCase());
  }
}

// Nom de fichier sûr (caractères interdits par Obsidian/OS remplacés)
function safeFileName(s) {
  return s.replace(/[\\/:*?"<>|#^\[\]]/g, "-").trim();
}

const toCreate = [];
const skipped = [];
for (const { value, count } of [...usedTypes.values()].sort((a, b) => a.value.localeCompare(b.value))) {
  const path = `${TEMPLATE_DIR}/type_${safeFileName(value)}.md`;
  if (coveredTypes.has(value.toLowerCase()) || app.vault.getAbstractFileByPath(path)) {
    skipped.push(value);
  } else {
    toCreate.push({ value, count, path });
  }
}

if (toCreate.length === 0) {
  new Notice(`Tous les types (${skipped.length}) ont déjà un template — rien à créer.`, 5000);
  return;
}

// ─── 5. Confirmer ─────────────────────────────────────────────────────────────
const preview = toCreate.map(t => `${t.value} (${t.count})`).join(", ");
const confirm = await tp.system.suggester(
  [`Oui, créer ${toCreate.length} template(s) : ${preview}`, "Annuler"],
  [true, false],
  false,
  `${toCreate.length} type(s) sans template — les créer dans ${TEMPLATE_DIR}/ ?`
);
if (!confirm) return;

// ─── 6. Création des templates ───────────────────────────────────────────────
// Valeur YAML : entre guillemets seulement si nécessaire
function yamlScalar(s) {
  return /^[\p{L}\p{N} _.\-()']+$/u.test(s) && !/^\s|\s$/.test(s) && !/^(true|false|null|yes|no|~|-?\d+(\.\d+)?)$/i.test(s)
    ? s
    : JSON.stringify(s);
}

function templateContent(typeValue) {
  const lines = DEFAULT_PROPS.map(p => p.key === "type" ? `type: ${yamlScalar(typeValue)}` : `${p.key}:`);
  return `---\n${lines.join("\n")}\n---\n`;
}

let created = 0;
const errors = [];
for (const t of toCreate) {
  try {
    // Double vérification juste avant l'écriture : jamais d'écrasement
    if (app.vault.getAbstractFileByPath(t.path)) { skipped.push(t.value); continue; }
    await app.vault.create(t.path, templateContent(t.value));
    created++;
  } catch (e) {
    errors.push(`${t.path}: ${e.message}`);
  }
}

// ─── 7. Déclarer les types de propriétés (sans rien écraser) ─────────────────
const typesDeclared = [];
const mtm = app.metadataTypeManager;
if (mtm && typeof mtm.setType === "function") {
  const assigned = (typeof mtm.getAssignedType === "function")
    ? (k) => mtm.getAssignedType(k)
    : (k) => mtm.types?.[k]?.type ?? mtm.types?.[k];
  for (const p of DEFAULT_PROPS) {
    if (!assigned(p.key)) {
      mtm.setType(p.key, p.obsidianType);
      typesDeclared.push(`${p.key}=${p.obsidianType}`);
    }
  }
} else {
  // Repli : écriture directe de .obsidian/types.json (comme Script_RenameProperty)
  const TYPES_PATH = ".obsidian/types.json";
  let typesJson;
  try { typesJson = JSON.parse(await app.vault.adapter.read(TYPES_PATH)); }
  catch (e) { typesJson = { types: {} }; }
  typesJson.types = typesJson.types || {};
  for (const p of DEFAULT_PROPS) {
    if (!typesJson.types[p.key]) {
      typesJson.types[p.key] = p.obsidianType;
      typesDeclared.push(`${p.key}=${p.obsidianType}`);
    }
  }
  if (typesDeclared.length > 0) {
    await app.vault.adapter.write(TYPES_PATH, JSON.stringify(typesJson, null, 2));
  }
}

// ─── 8. Notice récapitulative ────────────────────────────────────────────────
let summary = `${created} template(s) type_* créé(s) dans ${TEMPLATE_DIR}/, ${skipped.length} déjà existant(s).`;
if (typesDeclared.length > 0) summary += `\nTypes de propriétés déclarés : ${typesDeclared.join(", ")}`;
if (errors.length > 0) {
  console.error("Script_GenerateTypeTemplates — erreurs :", errors);
  new Notice(`${summary}\n${errors.length} erreur(s) — voir console.`, 8000);
} else {
  new Notice(summary, 6000);
}
%>
