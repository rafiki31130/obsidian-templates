const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

// Exécute buildGtdReview (partie calcul de gtd-review.js) sur des pages Dataview simulées.
const script = fs.readFileSync(path.join(__dirname, "..", "scripts", "gtd-review.js"), "utf8");
const buildGtdReview = Function(`${script.slice(0, script.indexOf("const review ="))}; return buildGtdReview;`)();

const page = (name, props) => ({ file: { path: `pages/${name}.md`, name, tags: [] }, ...props });
const resolve = target => `pages/${target}.md`;
const vault = (stepStatus, predecessorStatus) => [
  page("Projet", { type: "GTD-Projet", gtd_statut_projet: "2.actif", gtd_domaine: "[[Domaine]]" }),
  page("Domaine", { type: "GTD-Domaine" }),
  page("Accès MCP", { type: "GTD-Etape", gtd_projet: "[[Projet]]", gtd_statut_etape: predecessorStatus }),
  page("Prise en charge", { type: "GTD-Etape", gtd_projet: "[[Projet]]", gtd_statut_etape: stepStatus, gtd_predecesseurs: ["[[Accès MCP]]"] }),
];
const ids = (pages, name) => buildGtdReview(pages, resolve).issues.filter(i => i.page.file.name === name).map(i => i.id);

test("un prédécesseur non fait n'est pas signalé en lui-même", () => {
  assert.deepEqual(ids(vault("1.a_preparer", "1.a_preparer"), "Prise en charge"), []);
});

test("une étape prête ou engagée avant ses prédécesseurs reste signalée", () => {
  for (const status of ["2.prete", "3.en_cours", "7.validation"]) {
    assert.deepEqual(ids(vault(status, "1.a_preparer"), "Prise en charge"), ["etape_prete_avant_predecesseurs"], status);
  }
});

test("un prédécesseur fait lève la dépendance", () => {
  assert.deepEqual(ids(vault("3.en_cours", "8.faite"), "Prise en charge"), []);
});

test("un prédécesseur introuvable reste signalé", () => {
  const pages = vault("1.a_preparer", "1.a_preparer");
  pages[3].gtd_predecesseurs = ["[[Inexistante]]"];
  assert.deepEqual(ids(pages, "Prise en charge"), ["predecesseur_introuvable"]);
});
