/**
 * related-tasks.js
 *
 * Affiche les tâches non terminées liées à la page courante, depuis trois sources :
 *   1. Tâches locales à la page courante — UNIQUEMENT celles taguées `#Todo`
 *      (les autres tâches locales sont déjà visibles dans le corps de la note ;
 *      le tag `#Todo` signale "à remonter dans cette vue").
 *   2. Pages enfants (via champ `parent` ou convention de nommage "Parent @ Enfant") :
 *      toutes leurs tâches non terminées.
 *   3. Tâches dans n'importe quelle page contenant un lien vers la page courante ou ses enfants.
 * Groupées par page pertinente (h3), puis par page référençante (h4) pour les références.
 */

// ─── Configuration ────────────────────────────────────────────────────────────

// Statuts à exclure : statuts inactifs (Terminé/Abandonné) + En pause
// (les tâches d'un projet en pause ne doivent pas remonter dans les vues actives).
const STATUTS_EXCLUS = ["5. En pause", "8. Terminé", "9. Abandonné"];

// Tags à exclure : SANS le `#` préfixe — `hasTag` strippe le `#` à la comparaison.
// Ex: pour exclure le tag "#archived", écrire "archived".
const TAGS_EXCLUS = ["archived"];

// Tag requis sur les tâches LOCALES de la page courante pour qu'elles remontent
// dans cette vue (les autres tâches locales sont déjà visibles dans le corps).
// Sensible à la casse — doit matcher exactement le tag écrit dans les tâches.
const TAG_TODO_LOCAL = "Todo";

// ─── Contexte courant ─────────────────────────────────────────────────────────

const current = dv.current();
const curName = current.file.name;
const curN = curName.replace(/\s*@\s*/g, "@");

// ─── Fonctions utilitaires ────────────────────────────────────────────────────

function normalizeAt(s) {
  return String(s).replace(/\s*@\s*/g, "@");
}

function getLinkName(val) {
  if (!val) return null;
  if (typeof val === "object" && val.path)
    return val.path.split("/").pop().replace(/\.md$/, "");
  return String(val);
}

function dvContains(fieldVal, name) {
  if (!fieldVal) return false;
  const arr = Array.isArray(fieldVal) ? fieldVal : [fieldVal];
  return arr.some(v => (getLinkName(v) ?? String(v)).includes(name));
}

function hasTag(p, tag) {
  if (!p || !p.file.tags) return false;
  for (const t of p.file.tags) {
    if (String(t).replace(/^#/, "") === tag) return true;
  }
  return false;
}

function estExclue(p) {
  if (STATUTS_EXCLUS.includes(p.statut)) return true;
  if (TAGS_EXCLUS.some(t => hasTag(p, t))) return true;
  return false;
}

function getGroups(tasks, listsByLine) {
  const groups = new Map();
  for (const task of tasks) {
    const parentItem = task.parent != null ? listsByLine[task.parent] : null;
    const bullet = (parentItem && !parentItem.task) ? parentItem.text : null;
    if (!groups.has(bullet)) groups.set(bullet, []);
    groups.get(bullet).push(task);
  }
  return groups;
}

function afficherGroups(groups) {
  for (const [bullet, bulletTasks] of groups) {
    if (bullet !== null) dv.paragraph(`— ${bullet}`);
    dv.taskList(dv.array(bulletTasks), false);
  }
}

// ─── Pages enfants ────────────────────────────────────────────────────────────

const filtered = dv.pages("").where(p => {
  if (estExclue(p)) return false;
  if (!dvContains(p.parent, curName) && !p.file.name.includes(curName))
    return false;

  const parentRaw = p.parent
    ? getLinkName((Array.isArray(p.parent) ? p.parent : [p.parent])[0])
    : null;
  const fileN = normalizeAt(p.file.name);
  const parentN = parentRaw ? normalizeAt(parentRaw) : null;

  return (
    (parentN && (parentN === curN || parentN.startsWith(curN + "@"))) ||
    fileN.startsWith(curN + "@")
  );
});

const relevantNames = new Set([curName, ...filtered.map(p => p.file.name)]);
const filteredPaths = new Set(filtered.map(p => p.file.path));

// ─── Construction de la structure unifiée ─────────────────────────────────────
// Map<refName, { ownTasks, ownListsByLine, refs: Map<pageName, { tasks, listsByLine }> }>

const unified = new Map();

// Page courante : on ne remonte QUE les tâches taguées `#Todo` (les autres
// tâches locales sont déjà rendues nativement dans le corps de la note).
function taskHasTag(task, tag) {
  if (!task.tags) return false;
  for (const t of task.tags) {
    if (String(t).replace(/^#/, "") === tag) return true;
  }
  return false;
}

const currentTodos = [...current.file.tasks].filter(
  t => !t.completed && taskHasTag(t, TAG_TODO_LOCAL)
);
if (currentTodos.length > 0) {
  unified.set(curName, {
    ownTasks: currentTodos,
    ownListsByLine: Object.fromEntries([...current.file.lists].map(l => [l.line, l])),
    refs: new Map()
  });
}

// Pages enfants
for (const p of filtered) {
  unified.set(p.file.name, {
    ownTasks: [...p.file.tasks].filter(t => !t.completed),
    ownListsByLine: Object.fromEntries([...p.file.lists].map(l => [l.line, l])),
    refs: new Map()
  });
}

// ─── Références externes ──────────────────────────────────────────────────────

const referencing = dv.pages("").where(p => {
  if (estExclue(p)) return false;
  if (p.file.path === current.file.path) return false;
  if (filteredPaths.has(p.file.path)) return false;
  return [...p.file.tasks].some(t =>
    !t.completed &&
    t.outlinks &&
    [...t.outlinks].some(link => relevantNames.has(getLinkName(link)))
  );
});

for (const p of referencing) {
  const listsByLine = Object.fromEntries([...p.file.lists].map(l => [l.line, l]));
  const relevantTasks = [...p.file.tasks].filter(t =>
    !t.completed &&
    t.outlinks &&
    [...t.outlinks].some(link => relevantNames.has(getLinkName(link)))
  );

  for (const task of relevantTasks) {
    const refName = [...task.outlinks]
      .map(getLinkName)
      .find(n => relevantNames.has(n)) ?? curName;

    if (!unified.has(refName)) {
      unified.set(refName, { ownTasks: [], ownListsByLine: {}, refs: new Map() });
    }
    const entry = unified.get(refName);
    if (!entry.refs.has(p.file.name)) entry.refs.set(p.file.name, { tasks: [], listsByLine });
    entry.refs.get(p.file.name).tasks.push(task);
  }
}

// ─── Affichage ────────────────────────────────────────────────────────────────

for (const [refName, { ownTasks, ownListsByLine, refs }] of unified) {
  if (ownTasks.length === 0 && refs.size === 0) continue;

  dv.header(3, refName);

  if (ownTasks.length > 0) {
    afficherGroups(getGroups(ownTasks, ownListsByLine));
  }

  for (const [pageName, { tasks, listsByLine }] of refs) {
    dv.header(4, pageName);
    afficherGroups(getGroups(tasks, listsByLine));
  }
}