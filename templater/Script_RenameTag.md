<%*
// ─── Script_RenameTag ─────────────────────────────────────────────────────────
// Renomme toutes les occurrences d'un tag dans le vault :
//   - corps des notes : `#oldtag` → `#newtag`
//   - frontmatter : valeurs sous la propriété `tags:` (scalar, inline list, bloc list)
// Cascade : renommer `foo` propage aussi sur `foo/bar` (sous-tags).
// Casse-sensible : `#Todo` ≠ `#todo` (le matching distingue la casse).

// ─── 1. Lister les tags existants ─────────────────────────────────────────────
const tagCounts = app.metadataCache.getTags(); // { "#tag": count }
const tagNames = Object.keys(tagCounts)
  .map(t => t.replace(/^#/, ""))
  .sort((a, b) => a.localeCompare(b));

if (tagNames.length === 0) {
  new Notice("Aucun tag trouvé dans le vault.");
  return;
}

// ─── 2. Choisir le tag à renommer ─────────────────────────────────────────────
const oldTag = await tp.system.suggester(
  tagNames.map(t => `#${t}  (${tagCounts["#" + t]})`),
  tagNames,
  false,
  "Quel tag renommer ?"
);
if (!oldTag) return;

// ─── 3. Saisir le nouveau nom ─────────────────────────────────────────────────
const newTagRaw = await tp.system.prompt(`Renommer #${oldTag} en #...`, oldTag);
if (newTagRaw == null) return;
const newTag = String(newTagRaw).replace(/^#/, "").trim();
if (!newTag || newTag === oldTag) {
  new Notice("Nom inchangé ou vide — abandon.");
  return;
}
if (!/^[\w/-]+$/.test(newTag)) {
  new Notice("Nom invalide (autorisé : lettres, chiffres, _ - /).");
  return;
}

// ─── 4. Confirmer ─────────────────────────────────────────────────────────────
const confirm = await tp.system.suggester(
  [`Oui, remplacer #${oldTag} → #${newTag}`, "Annuler"],
  [true, false],
  false,
  `Confirmer le renommage dans tout le vault ?`
);
if (!confirm) return;

// ─── 5. Préparation des regex ─────────────────────────────────────────────────
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Corps : `#oldtag` non suivi de caractère de tag (lettre/chiffre/_/-).
//         Le `/` n'est PAS exclu → cascade sur les sous-tags.
const bodyRe = new RegExp(`#${escapeRegex(oldTag)}(?![\\w-])`, "g");

// Frontmatter : `oldtag` (sans #) non précédé/suivi de caractère de tag.
//               Le `/` n'est pas exclu en suffixe (cascade).
//               Préfixe : on exclut `\w-/` pour éviter de matcher au milieu d'une string.
const fmValueRe = new RegExp(
  `(?<![\\w/-])${escapeRegex(oldTag)}(?![\\w-])`,
  "g"
);

// ─── 6. Réécriture du frontmatter ─────────────────────────────────────────────
// Approche line-by-line : on remplace uniquement dans le bloc `tags:` (qu'il
// soit scalar, inline list, ou bloc list), pas ailleurs dans le YAML.
function rewriteFrontmatter(fm) {
  const lines = fm.split("\n");
  let inTagsBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tagsKey = line.match(/^(\s*)tags\s*:(.*)$/);
    if (tagsKey) {
      inTagsBlock = true;
      // Remplacement sur la suite de la ligne (scalar ou inline list)
      lines[i] = `${tagsKey[1]}tags:${tagsKey[2].replace(fmValueRe, newTag)}`;
      continue;
    }
    if (inTagsBlock) {
      // Item de liste indenté
      if (/^\s*-\s/.test(line)) {
        lines[i] = line.replace(fmValueRe, newTag);
        continue;
      }
      // Nouvelle clé YAML de premier niveau → fin du bloc tags
      if (/^\S.*:/.test(line)) {
        inTagsBlock = false;
      }
      // Ligne vide ou commentaire : on reste (sans toucher)
    }
  }
  return lines.join("\n");
}

// ─── 7. Réécriture du contenu complet ─────────────────────────────────────────
function rewriteContent(content) {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) {
    return content.replace(bodyRe, `#${newTag}`);
  }
  const open = fmMatch[1];
  const fm = fmMatch[2];
  const close = fmMatch[3];
  const rest = content.slice(open.length + fm.length + close.length);
  return open + rewriteFrontmatter(fm) + close + rest.replace(bodyRe, `#${newTag}`);
}

// ─── 8. Itération ─────────────────────────────────────────────────────────────
const files = app.vault.getMarkdownFiles();
let modified = 0;
const errors = [];

for (const f of files) {
  try {
    const content = await app.vault.read(f);
    const next = rewriteContent(content);
    if (next !== content) {
      await app.vault.modify(f, next);
      modified++;
    }
  } catch (e) {
    errors.push(`${f.path}: ${e.message}`);
  }
}

const summary = `#${oldTag} → #${newTag} : ${modified} fichier(s) modifié(s)`;
if (errors.length > 0) {
  console.error("Script_RenameTag — erreurs :", errors);
  new Notice(`${summary}\n${errors.length} erreur(s) — voir console.`, 8000);
} else {
  new Notice(summary, 5000);
}
%>
