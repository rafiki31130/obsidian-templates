const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

// Exécute Script_RenameProperty avec les API Obsidian/Templater simulées.
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const source = fs.readFileSync(path.join(__dirname, "..", "templater", "Script_RenameProperty.md"), "utf8");
const body = source.match(/<%\*([\s\S]*?)%>/)[1];

async function run(notes, answers, { types = {} } = {}) {
  const files = Object.keys(notes).map(p => ({ path: p, basename: path.posix.basename(p, ".md") }));
  const fms = structuredClone(notes);
  const notices = [];
  const prompts = [];
  let written = null;
  const queue = [...answers];
  const next = (kind, labels, values, placeholder) => {
    prompts.push({ kind, labels, values, placeholder });
    assert.ok(queue.length > 0, `réponse manquante pour ${kind} « ${placeholder} »`);
    const answer = queue.shift();
    return typeof answer === "function" ? answer({ labels, values }) : answer;
  };
  const app = {
    vault: {
      getMarkdownFiles: () => files,
      adapter: {
        read: async () => JSON.stringify({ types }),
        write: async (_, data) => { written = JSON.parse(data); },
      },
    },
    metadataCache: { getFileCache: f => (fms[f.path] ? { frontmatter: structuredClone(fms[f.path]) } : null) },
    fileManager: { processFrontMatter: async (f, fn) => { fn(fms[f.path]); } },
  };
  const tp = {
    system: {
      suggester: async (labels, values, _strict, placeholder) => next("suggester", labels, values, placeholder),
      prompt: async (placeholder, value) => next("prompt", [value], [value], placeholder),
    },
  };
  class Notice { constructor(message) { notices.push(message); } }
  await new AsyncFunction("tp", "app", "Notice", body)(tp, app, Notice);
  assert.equal(queue.length, 0, "toutes les réponses prévues doivent être consommées");
  return { fms, notices, prompts, written };
}

const notes = () => ({
  "pages/A.md": { type: "Projet", statut: "En cours", tags: ["alpha", "beta"] },
  "pages/B.md": { type: "Projet", statut: "Terminé", tags: ["beta"] },
  "pages/C.md": { type: "Log", statut: "En cours", tags: "beta" },
  "pages/D.md": { type: "Log", rating: 3 },
});

test("renomme une valeur scalaire dans toutes les notes concernées", async () => {
  const { fms, notices, prompts } = await run(notes(), ["statut", "value", "En cours", "3. En cours", true]);
  assert.equal(fms["pages/A.md"].statut, "3. En cours");
  assert.equal(fms["pages/C.md"].statut, "3. En cours");
  assert.equal(fms["pages/B.md"].statut, "Terminé");
  assert.deepEqual(fms["pages/D.md"], { type: "Log", rating: 3 });
  // Les valeurs sont proposées avec le nombre de notes concernées
  assert.deepEqual(prompts[2].labels, ["En cours  (2)", "Terminé  (1)"]);
  assert.match(notices.at(-1), /"statut" : "En cours" → "3\. En cours" : 2 note\(s\) modifiée\(s\)/);
});

test("renomme un élément de liste et une valeur scalaire de la même propriété", async () => {
  const { fms } = await run(notes(), ["tags", "value", "beta", "gamma", true]);
  assert.deepEqual(fms["pages/A.md"].tags, ["alpha", "gamma"]);
  assert.deepEqual(fms["pages/B.md"].tags, ["gamma"]);
  assert.equal(fms["pages/C.md"].tags, "gamma");
});

test("fusionne sans doublon lorsque la nouvelle valeur existe déjà dans la liste", async () => {
  const { fms, prompts } = await run(notes(), ["tags", "value", "beta", "alpha", true]);
  assert.deepEqual(fms["pages/A.md"].tags, ["alpha"]);
  assert.deepEqual(fms["pages/B.md"].tags, ["alpha"]);
  assert.match(prompts.at(-1).labels[0], /fusion avec la valeur existante/);
});

test("conserve le type nombre lorsque la nouvelle valeur est numérique", async () => {
  const { fms } = await run(notes(), ["rating", "value", "3", "4", true]);
  assert.strictEqual(fms["pages/D.md"].rating, 4);
});

test("correspondance exacte : ne touche ni les sous-chaînes ni une autre casse", async () => {
  const data = { "pages/E.md": { topic: ["[[Maison]]", "[[Maison @ Cuisine]]", "maison"] } };
  const { fms } = await run(data, ["topic", "value", "[[Maison]]", "[[Domicile]]", true]);
  assert.deepEqual(fms["pages/E.md"].topic, ["[[Domicile]]", "[[Maison @ Cuisine]]", "maison"]);
});

test("annulation, valeur vide ou inchangée : aucune note modifiée", async () => {
  for (const answers of [
    ["statut", "value", "En cours", "3. En cours", false],
    ["statut", "value", "En cours", null],
    ["statut", "value", "En cours", "  "],
    ["statut", "value", "En cours", "En cours"],
    ["statut", "value", null],
  ]) {
    const { fms } = await run(notes(), answers);
    assert.deepEqual(fms, notes(), JSON.stringify(answers));
  }
});

test("ne modifie pas types.json lors d'un renommage de valeur", async () => {
  const { written } = await run(notes(), ["statut", "value", "Terminé", "8. Terminé", true], { types: { statut: "text" } });
  assert.equal(written, null);
});

test("le renommage de clé existant reste inchangé", async () => {
  const { fms, written } = await run(notes(), ["statut", "rename", "etat", true], { types: { statut: "text" } });
  assert.equal(fms["pages/A.md"].etat, "En cours");
  assert.ok(!("statut" in fms["pages/A.md"]));
  assert.deepEqual(written.types, { etat: "text" });
});
