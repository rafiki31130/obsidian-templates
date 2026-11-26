/**
 * related-tasks.js
 *
 * Affiche les tâches non terminées liées à la page courante, depuis trois sources :
 *   1. Tâches locales à la page courante.
 *   2. Pages enfants (via champ `parent` ou convention de nommage "Parent @ Enfant").
 *   3. Tâches dans n'importe quelle page contenant un lien vers la page courante ou ses enfants.
 * Dans les trois cas, seules les tâches taguées `#Todo` remontent : les simples cases
 * à cocher (checklists de notes) restent dans le corps de leur note.
 * Groupées par page pertinente (h3), puis par page référençante (h4) pour les références.
 */

// ─── Configuration ──────────────────────────────────────────────────────────────────────────

// Statuts à exclure : statuts inactifs (Terminé/Abandonné) + En pause
// (les tâches d'un projet en pause ne doivent pas remonter dans les vues actives).
const STATUTS_EXCLUS = ["5. En pause", "8. Terminé", "9. Abandonné"];

// Tags à exclure : SANS le `#` préfixe — `hasTag` strippe le `#` à la comparaison.
// Ex: pour exclure le tag "#archived", écrire "archived".
const TAGS_EXCLUS = ["archived"];

// Tag requis sur une tâche, quelle que soit sa page, pour qu'elle remonte dans cette vue.
// Sensible à la casse — doit matcher exactement le tag écrit dans les tâches.
const TAG_TODO = "Todo";

// ─── Contexte courant ─────────────────────────────────────────────────────────────────────────

const current = dv.current();
const curName = current.file.name;
const curN = curName.replace(/\s*@\s*/g, "@");

// ─── Fonctions utilitaires ────────────────────────────────────────────────────────────────────

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

function taskHasTag(task, tag) {
  if (!task.tags) return false;
  for (const t of task.tags) {
    if (String(t).replace(/^#/, "") === tag) return true;
  }
  return false;
}

// Tâche à afficher : ouverte et taguée #Todo.
function isOpenTodo(task) {
  return !task.completed && taskHasTag(task, TAG_TODO);
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

// ─── Pages enfants ───────────────────────────────────────────────────────────────────────────

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

// Page courante
const currentTodos = [...current.file.tasks].filter(isOpenTodo);
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
    ownTasks: [...p.file.tasks].filter(isOpenTodo),
    ownListsByLine: Object.fromEntries([...p.file.lists].map(l => [l.line, l])),
    refs: new Map()
  });
}

// ─── Références externes ──────────────────────────────────────────────────────────────────

const linksRelevant = t =>
  t.outlinks && [...t.outlinks].some(link => relevantNames.has(getLinkName(link)));

const referencing = dv.pages("").where(p => {
  if (estExclue(p)) return false;
  if (p.file.path === current.file.path) return false;
  if (filteredPaths.has(p.file.path)) return false;
  return [...p.file.tasks].some(t => isOpenTodo(t) && linksRelevant(t));
});

for (const p of referencing) {
  const listsByLine = Object.fromEntries([...p.file.lists].map(l => [l.line, l]));
  const relevantTasks = [...p.file.tasks].filter(t => isOpenTodo(t) && linksRelevant(t));

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

// ─── Affichage ──────────────────────────────────────────────────────────────────────────

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
