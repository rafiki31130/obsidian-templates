/**
 * child-pages.js
 *
 * Affiche l'arborescence des pages descendantes de la page courante.
 * Trois sections selon l'état effectif :
 *   - Actifs (sans titre, en premier, arborescence indentée)
 *   - Archivés (tag "archived")
 *   - Clos (statut inactif)
 *
 * Propagation : un descendant d'un nœud archivé/clos hérite de cet état,
 * sauf marquage propre (qui prime). En cas de double marquage propre
 * (tag archived + statut clos), Archivé l'emporte.
 *
 * La page courante elle-même n'est pas affichée.
 * Les nœuds intermédiaires manquants apparaissent comme liens non résolus
 * pour préserver la cohérence visuelle de l'arbre.
 */

// ─── Configuration ────────────────────────────────────────────────────────────

// Statuts considérés "Clos" : doit refléter les statuts d'état "inactif"
// listés dans properties/statut/*.md (cf. corps de chaque fichier de référence).
const STATUTS_CLOS = ["8. Terminé", "9. Abandonné"];

// Tag d'archivage : SANS le `#` préfixe — `hasTag` strippe le `#` à la comparaison.
const TAG_ARCHIVED = "archived";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeAt(s) {
  return String(s).replace(/\s*@\s*/g, "@");
}

function getLinkName(val) {
  if (!val) return null;
  if (typeof val === "object" && val.path)
    return val.path.split("/").pop().replace(/\.md$/, "");
  return String(val);
}

function hasTag(p, tag) {
  if (!p || !p.file.tags) return false;
  for (const t of p.file.tags) {
    if (String(t).replace(/^#/, "") === tag) return true;
  }
  return false;
}

function getOwnMarking(p) {
  if (!p) return null;
  if (hasTag(p, TAG_ARCHIVED)) return "archived";
  if (STATUTS_CLOS.includes(p.statut)) return "clos";
  return null;
}

// ─── Contexte courant ─────────────────────────────────────────────────────────

const current = dv.current();
const curName = current.file.name;
const curN = normalizeAt(curName);

// ─── Index des pages par nom (pour résolution des chaînes parent) ────────────

const pageByName = new Map();
const pageByNormName = new Map();
for (const p of dv.pages("")) {
  pageByName.set(p.file.name, p);
  pageByNormName.set(normalizeAt(p.file.name), p);
}

// ─── Collecte des descendants ─────────────────────────────────────────────────

const descendants = dv.pages("").where(p => {
  if (p.file.path === current.file.path) return false;
  const parentName = p.parent ? getLinkName(p.parent) : null;
  // Pré-filtre grossier (perf)
  if (!(parentName && parentName.includes(curName)) && !p.file.name.includes(curName)) {
    return false;
  }
  // Test hiérarchique fin
  const fileN = normalizeAt(p.file.name);
  const parentN = parentName ? normalizeAt(parentName) : null;
  return (parentN && (parentN === curN || parentN.startsWith(curN + "@")))
      || fileN.startsWith(curN + "@");
});

// ─── Calcul du chemin d'ancêtres (de current → p, exclu current) ──────────────

function computePath(p) {
  const fileN = normalizeAt(p.file.name);
  // Cas 1 : convention de nommage @ — chemin déduit du nom de fichier
  if (fileN.startsWith(curN + "@")) {
    const parts = p.file.name.split(/\s*@\s*/);
    const segments = [];
    for (let i = 1; i < parts.length; i++) {
      const normKey = parts.slice(0, i + 1).join("@");
      const actual = pageByNormName.get(normKey);
      segments.push(actual ? actual.file.name : normKey);
    }
    return segments;
  }
  // Cas 2 : chaîne via la propriété parent
  const chain = [p.file.name];
  let cursor = p;
  let safety = 50;
  while (safety-- > 0) {
    const parentName = cursor.parent ? getLinkName(cursor.parent) : null;
    if (!parentName) break;
    if (parentName === curName) return chain;
    chain.unshift(parentName);
    cursor = pageByName.get(parentName);
    if (!cursor) break;
  }
  // Fallback : enfant direct
  return [p.file.name];
}

// ─── Construction de l'arbre ──────────────────────────────────────────────────

const root = {
  name: curName,
  page: current,
  ownMarking: null,
  effective: null,
  children: new Map()
};

for (const p of descendants) {
  const path = computePath(p);
  let node = root;
  for (const segName of path) {
    if (!node.children.has(segName)) {
      const segPage = pageByName.get(segName) || null;
      node.children.set(segName, {
        name: segName,
        page: segPage,
        ownMarking: getOwnMarking(segPage),
        effective: null,
        children: new Map()
      });
    }
    node = node.children.get(segName);
  }
}

// ─── Propagation de l'état effectif ───────────────────────────────────────────
// Effective = ownMarking si défini, sinon hérité de l'ancêtre marqué le plus proche

function propagate(node, inheritedMarking) {
  node.effective = node.ownMarking ?? inheritedMarking;
  for (const child of node.children.values()) {
    propagate(child, node.effective);
  }
}
propagate(root, null);

// ─── Rendu ────────────────────────────────────────────────────────────────────

// Collecte les nœuds qui débutent une nouvelle "racine" dans la section donnée
// (i.e. leur parent n'a pas le même état effectif, ou leur parent est la racine de l'arbre)
function collectRoots(node, section, parentNode, roots) {
  if (node !== root) {
    const parentIsTreeRoot = parentNode === root;
    if (node.effective === section && (parentIsTreeRoot || parentNode.effective !== section)) {
      roots.push(node);
    }
  }
  for (const child of node.children.values()) {
    collectRoots(child, section, node, roots);
  }
}

// Construit récursivement un <li> + <ul> imbriqué pour les enfants de même section
function buildSubtree(node, section) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.classList.add("internal-link");
  if (!node.page) a.classList.add("is-unresolved");
  a.dataset.href = node.name;
  a.href = node.name;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = node.name;
  li.appendChild(a);

  const childLis = [];
  for (const child of node.children.values()) {
    if (child.effective === section) {
      childLis.push(buildSubtree(child, section));
    }
  }
  if (childLis.length > 0) {
    const ul = document.createElement("ul");
    for (const cli of childLis) ul.appendChild(cli);
    li.appendChild(ul);
  }
  return li;
}

function renderSection(state, label) {
  const roots = [];
  collectRoots(root, state, root, roots);
  if (roots.length === 0) return;
  if (label) {
    const h = document.createElement("h3");
    h.textContent = label;
    dv.container.appendChild(h);
  }
  const ul = document.createElement("ul");
  for (const r of roots) ul.appendChild(buildSubtree(r, state));
  dv.container.appendChild(ul);
}

renderSection(null, null);          // Actifs (sans titre)
renderSection("archived", "Archivés");
renderSection("clos", "Clos");
