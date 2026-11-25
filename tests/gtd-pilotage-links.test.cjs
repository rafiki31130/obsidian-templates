const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

// Garde-fou contre un renommage des pages de « Pilotage GTD » : les liens écrits
// en dur dans gtd-review.js et les wikiliens des pages doivent viser des fichiers existants.
const root = path.join(__dirname, "..");
const folder = path.join(root, "resources", "Pilotage GTD");
const pages = fs.readdirSync(folder).filter(n => n.endsWith(".md"));
const basenames = new Set(pages.map(n => n.slice(0, -3)));

test("gtd-review.js : chaque page de contrôle liée existe", () => {
  const script = fs.readFileSync(path.join(root, "scripts", "gtd-review.js"), "utf8");
  const literal = script.match(/const links = (\{[^}]*\});/);
  assert.ok(literal, "table des liens introuvable dans gtd-review.js");
  const links = Function(`return ${literal[1]}`)();
  assert.match(script, /dv\.fileLink\('r_templates\/resources\/Pilotage GTD\/' \+ links\[key\] \+ '\.md'/);
  for (const [key, name] of Object.entries(links)) {
    assert.ok(basenames.has(name), `${key} → « ${name}.md » absent de resources/Pilotage GTD/`);
  }
});

test("pages de Pilotage GTD : les wikiliens vers le dossier sont résolus", () => {
  for (const page of pages) {
    const text = fs.readFileSync(path.join(folder, page), "utf8");
    for (const [, target] of text.matchAll(/(?<!!)\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
      const name = target.trim();
      if (name.endsWith(".base")) continue;
      assert.ok(basenames.has(name), `${page} : lien [[${name}]] sans page correspondante`);
    }
  }
});
