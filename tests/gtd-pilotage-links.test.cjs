const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

// Garde-fou contre un renommage des pages ou du dossier de pilotage GTD : les liens écrits
// en dur dans gtd-review.js et les wikiliens des pages doivent viser des pages existantes.
const root = path.join(__dirname, "..");
const resources = path.join(root, "resources");
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.name === ".git" ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const basenames = new Map();
for (const f of walk(root).filter(f => /\.(md|base)$/.test(f))) {
  const name = f.endsWith(".md") ? path.basename(f, ".md") : path.basename(f);
  basenames.set(name, [...(basenames.get(name) ?? []), f]);
}
// Dossier de pilotage : celui qui contient les pages appelant la section « summary ».
const pilotage = [...new Set(walk(resources)
  .filter(f => f.endsWith(".md") && /gtd-review", \{ section: "summary" \}/.test(fs.readFileSync(f, "utf8")))
  .map(f => path.dirname(f)))];

test("le dossier de pilotage GTD est identifié", () => {
  assert.equal(pilotage.length, 1, `dossiers candidats : ${pilotage.join(", ")}`);
});

test("gtd-review.js : chaque page de contrôle liée existe, sans chemin de dossier figé", () => {
  const script = fs.readFileSync(path.join(root, "scripts", "gtd-review.js"), "utf8");
  const literal = script.match(/const links = (\{[^}]*\});/);
  assert.ok(literal, "table des liens introuvable dans gtd-review.js");
  const links = Function(`return ${literal[1]}`)();
  assert.match(script, /dv\.fileLink\(links\[key\],false,title\)/);
  assert.doesNotMatch(script, /resources\/[^'"]*\/' \+ links/);
  for (const [key, name] of Object.entries(links)) {
    const found = basenames.get(name) ?? [];
    assert.equal(found.length, 1, `${key} → « ${name}.md » : ${found.length} page(s) trouvée(s)`);
    assert.equal(path.dirname(found[0]), pilotage[0], `${name}.md hors du dossier de pilotage`);
  }
});

test("pages de pilotage GTD : les wikiliens sont résolus", () => {
  for (const file of fs.readdirSync(pilotage[0]).filter(n => n.endsWith(".md"))) {
    const text = fs.readFileSync(path.join(pilotage[0], file), "utf8");
    for (const [, target] of text.matchAll(/(?<!!)\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
      const name = target.trim();
      assert.ok(basenames.has(name), `${file} : lien [[${name}]] sans page correspondante`);
    }
  }
});
