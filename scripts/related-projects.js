/**
 * related-projects.js
 *
 * Affiche les projets liés à la page courante :
 *   - descendants de la page courante (via `parent` ou convention `@`)
 *   - projets dont la propriété `relations` pointe vers la page courante
 *     OU vers l'un de ses descendants
 *
 * Filtre : seulement `type = "Projet"`, exclut les projets taggués `archived`.
 * Pas de propagation d'état (chaque projet conserve son propre statut).
 *
 * Rendu : liste plate, regroupée par statut.
 *   - Statuts actifs : chacun en <h3>, ordre numérique
 *   - Statuts inactifs : précédés d'un <hr>, chacun en <h3>
 *
 * Option `showMentions: true` → ajoute une section "Mentions" (italique) qui
 * liste les projets mentionnant la page courante via un lien dans leur corps,
 * MAIS qui ne sont ni descendants ni dans `relations`. Matching strict sur la
 * page courante uniquement (les descendants ont leur propre vue Mentions).
 * Sert à repérer les liens implicites à formaliser.
 *   Invocation : dv.view("scripts/related-projects", { showMentions: true })
 */

// ─── Configuration ────────────────────────────────────────────────────────────

// Statuts considérés inactifs (= regroupés sous "Clos" dans le rendu).
// Doit refléter les statuts d'état "inactif" listés dans properties/statut/*.md.
const STATUTS_INACTIFS = ["8. Terminé", "9. Abandonné"];

// Tag d'archivage : SANS le `#` préfixe — `hasTag` strippe le `#` à la comparaison.
const TAG_ARCHIVED = "archived";

// Option d'invocation : afficher la section Mentions (activée par défaut)
const opts = (typeof input === "object" && input) || {};
const showMentions = opts.showMentions !== false;

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

function isArchived(p) {
  return hasTag(p, TAG_ARCHIVED);
}

function isDescendantOfCurrent(p, curName, curN) {
  const fileN = normalizeAt(p.file.name);
  const parentName = p.parent ? getLinkName(p.parent) : null;
  const parentN = parentName ? normalizeAt(parentName) : null;
  return (parentN && (parentN === curN || parentN.startsWith(curN + "@")))
      || fileN.startsWith(curN + "@");
}

// ─── Contexte courant ─────────────────────────────────────────────────────────

const current = dv.current();
const curName = current.file.name;
const curN = normalizeAt(curName);

// ─── Ensemble {courant ∪ descendants} pour le matching exact des relations ───

const descendants = dv.pages("").where(p => {
  if (p.file.path === current.file.path) return false;
  // pré-filtre grossier
  const parentName = p.parent ? getLinkName(p.parent) : null;
  if (!(parentName && parentName.includes(curName)) && !p.file.name.includes(curName)) {
    return false;
  }
  return isDescendantOfCurrent(p, curName, curN);
});

const relevantNames = new Set([curName, ...descendants.map(p => p.file.name)]);

// ─── Collecte des projets liés ────────────────────────────────────────────────

const projects = dv.pages("").where(p => {
  if (p.type !== "Projet") return false;
  if (p.file.path === current.file.path) return false;
  if (isArchived(p)) return false;

  // Cas 1 : descendant
  if (isDescendantOfCurrent(p, curName, curN)) return true;

  // Cas 2 : relations pointe vers la courante ou un descendant
  if (p.relations) {
    const rels = Array.isArray(p.relations) ? p.relations : [p.relations];
    for (const r of rels) {
      const name = getLinkName(r);
      if (name && relevantNames.has(name)) return true;
    }
  }
  return false;
});

// ─── Groupement par statut ────────────────────────────────────────────────────

const byStatut = new Map();
for (const p of projects) {
  const s = p.statut || "(sans statut)";
  if (!byStatut.has(s)) byStatut.set(s, []);
  byStatut.get(s).push(p);
}

// Tri par numéro de statut (préfixe "N. ")
function statutKey(s) {
  const m = String(s).match(/^(\d+)\./);
  return m ? parseInt(m[1], 10) : 999;
}
const sortedStatuts = [...byStatut.keys()].sort((a, b) => statutKey(a) - statutKey(b));
const statutsActifs   = sortedStatuts.filter(s => !STATUTS_INACTIFS.includes(s));
const statutsInactifs = sortedStatuts.filter(s =>  STATUTS_INACTIFS.includes(s));

// ─── Rendu ────────────────────────────────────────────────────────────────────

function renderProjectList(pages) {
  const ul = document.createElement("ul");
  const sorted = [...pages].sort((a, b) => a.file.name.localeCompare(b.file.name));
  for (const p of sorted) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("internal-link");
    a.dataset.href = p.file.name;
    a.href = p.file.name;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = p.file.name;
    li.appendChild(a);
    ul.appendChild(li);
  }
  return ul;
}

function renderStatutSection(statut, level) {
  const pages = byStatut.get(statut);
  if (!pages || pages.length === 0) return;
  const h = document.createElement(`h${level}`);
  h.textContent = statut;
  dv.container.appendChild(h);
  dv.container.appendChild(renderProjectList(pages));
}

// Statuts actifs : chacun en h3
for (const s of statutsActifs) {
  renderStatutSection(s, 3);
}

// Statuts inactifs : précédés d'un séparateur horizontal, chacun en h3
if (statutsInactifs.length > 0) {
  dv.container.appendChild(document.createElement("hr"));
  for (const s of statutsInactifs) {
    renderStatutSection(s, 3);
  }
}

// ─── Section Mentions (optionnelle) ───────────────────────────────────────────
// Projets qui mentionnent la courante (strict — pas ses descendants) via un
// outlink, MAIS qui ne sont ni descendants ni dans `relations` — déjà affichés
// sinon. Les mentions des descendants apparaîtront dans leur propre vue.

if (showMentions) {
  const projectPaths = new Set(projects.map(p => p.file.path));

  const mentioning = dv.pages("").where(p => {
    if (p.type !== "Projet") return false;
    if (p.file.path === current.file.path) return false;
    if (isArchived(p)) return false;
    if (STATUTS_INACTIFS.includes(p.statut)) return false;
    if (projectPaths.has(p.file.path)) return false;
    const outlinks = p.file.outlinks ? Array.from(p.file.outlinks) : [];
    return outlinks.some(link => getLinkName(link) === curName);
  });

  if (mentioning.length > 0) {
    const title = document.createElement("p");
    const titleEm = document.createElement("em");
    titleEm.textContent = "Mentions";
    title.appendChild(titleEm);
    dv.container.appendChild(title);

    // Liste avec liens en italique (signal "lien implicite, à valider")
    const ul = document.createElement("ul");
    const sorted = [...mentioning].sort((a, b) => a.file.name.localeCompare(b.file.name));
    for (const p of sorted) {
      const li = document.createElement("li");
      const em = document.createElement("em");
      const a = document.createElement("a");
      a.classList.add("internal-link");
      a.dataset.href = p.file.name;
      a.href = p.file.name;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = p.file.name;
      em.appendChild(a);
      li.appendChild(em);
      ul.appendChild(li);
    }
    dv.container.appendChild(ul);
  }
}
