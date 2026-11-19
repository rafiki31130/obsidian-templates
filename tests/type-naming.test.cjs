const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { test } = require("node:test");

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const root = path.resolve(__dirname, "..");
const executionBlock = /<%\*([\s\S]*?)-?%>/g;

// Test local : les API Obsidian/Templater sont simulées, aucun vault n'est touché.
async function applyType(type, { title = "Sans titre", frontmatter = {}, renameError } = {}) {
  const source = await fs.readFile(path.join(root, "templates", `type_${type}.md`), "utf8");
  const file = { basename: title };
  const result = { prompts: [], renames: [], notices: [], frontmatter: { ...frontmatter } };
  const tp = {
    config: { target_file: file },
    system: {
      async prompt(...args) {
        result.prompts.push(args);
        return "Titre saisi";
      },
    },
    date: {
      now(format) {
        assert.equal(format, "YYYY-MM-DD HH[h]mm", "mm doit représenter les minutes");
        return "2026-11-16 14h05";
      },
    },
    file: {
      async rename(name) {
        result.renames.push(name);
        if (renameError) throw new Error(renameError);
        file.basename = name;
      },
    },
  };
  const app = {
    fileManager: {
      async processFrontMatter(target, update) {
        assert.equal(target, file);
        update(result.frontmatter);
      },
    },
  };
  class Notice {
    constructor(message, duration) {
      result.notices.push({ message, duration });
    }
  }
  for (const match of source.matchAll(executionBlock)) {
    await new AsyncFunction("tp", "app", "Notice", match[1])(tp, app, Notice);
  }
  result.rendered = source.replace(executionBlock, "");
  return result;
}

for (const type of ["Log", "Meeting"]) {
  test(`${type} : nom horodaté exact, sans prompt`, async () => {
    const result = await applyType(type);
    assert.deepEqual(result.prompts, [], "le titre ne doit plus être demandé");
    assert.deepEqual(result.renames, ["2026-11-16 14h05 - "]);
    assert.deepEqual(result.notices, []);
  });

  for (const title of ["2026-10-01 08h09 - ", "2026-10-01 08h09 -", "2026-10-01 08h09 - Sujet existant"]) {
    test(`${type} : ne renomme pas un titre déjà horodaté (${JSON.stringify(title)})`, async () => {
      const result = await applyType(type, { title });
      assert.deepEqual(result.prompts, []);
      assert.deepEqual(result.renames, [], "réappliquer le type doit conserver le titre et l'heure");
    });
  }

  test(`${type} : ne reprend pas l'ancien titre après l'horodatage`, async () => {
    const result = await applyType(type, { title: "Ancien titre" });
    assert.deepEqual(result.prompts, []);
    assert.deepEqual(result.renames, ["2026-11-16 14h05 - "]);
  });

  test(`${type} : conserve la hiérarchie du titre en propriété parent`, async () => {
    const result = await applyType(type, { title: "Projet @ Sous-projet @ Sans titre" });
    assert.equal(result.frontmatter.parent, "[[Projet @ Sous-projet]]");
    assert.deepEqual(result.renames, ["2026-11-16 14h05 - "]);
  });

  test(`${type} : préserve un parent déjà renseigné`, async () => {
    const result = await applyType(type, {
      title: "Projet @ Sans titre",
      frontmatter: { parent: "[[Parent existant]]", topic: ["[[Sujet]]"] },
    });
    assert.deepEqual(result.frontmatter, { parent: "[[Parent existant]]", topic: ["[[Sujet]]"] });
  });

  test(`${type} : signale une erreur de renommage (collision simulée)`, async () => {
    const result = await applyType(type, { renameError: "Le fichier existe déjà" });
    assert.deepEqual(result.notices, [{
      message: `${type} : renommage impossible (Le fichier existe déjà)`,
      duration: 6000,
    }]);
    assert.deepEqual(result.renames, ["2026-11-16 14h05 - "]);
  });

  test(`${type} : préserve les propriétés et le corps du template`, async () => {
    const result = await applyType(type);
    const frontmatter = `---\ntype: ${type}\nparent:\ndate: "[[{{date:YYYY-MM-DD}}]]"\ntopic:\nperson:\nrating:\ntags:\n---\n`;
    assert.ok(result.rendered.startsWith(frontmatter));
    const body = result.rendered.slice(frontmatter.length);
    if (type === "Meeting") {
      assert.equal(body.trim(), "## Ordre du jour\n\n\n## Échanges\n\n\n## Décisions\n\n\n## Actions\n- [ ]");
    } else {
      assert.equal(body.trim(), "");
    }
  });
}
