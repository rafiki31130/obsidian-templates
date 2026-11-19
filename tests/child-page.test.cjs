const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const root = path.join(__dirname, "..");
const folder = "r_templates/templater/";
const launcher = folder + "Bloc-CreateChildPage.md";
const layout = folder + "Page-DynHierarchy.md";
const read = filePath => fs.readFileSync(path.join(root, filePath.replace(/^r_templates\//, "")), "utf8");
const file = filePath => ({ path: filePath, name: path.posix.basename(filePath), basename: path.posix.basename(filePath, ".md"), extension: "md" });

// Les blocs d'un même template partagent leur portée lexicale ; include lance un rendu séparé.
function render(source, { tp, app, Notice }) {
  let code = 'let tR = "";\n';
  let offset = 0;
  for (const match of source.matchAll(/<%\*([\s\S]*?)(-?)%>(?:[ \t]*\r?\n)?/g)) {
    code += `tR += ${JSON.stringify(source.slice(offset, match.index))};\n${match[1]}\n`;
    // Simuler la suppression de la première fin de ligne pour -%>, pas pour %>.
    offset = match.index + (match[2] ? match[0].length : match[0].indexOf("%>") + 2);
  }
  code += `return tR + ${JSON.stringify(source.slice(offset))};`;
  return new AsyncFunction("tp", "app", "Notice", "window", code)(tp, app, Notice, {
    moment: () => ({ format: () => "2026-11-19" }),
  });
}

function fixture({ sourcePath = 'pages/Projet "Nord" @ Phase 1.md', name = "Mon sujet", type = "Scratch", selection = true } = {}) {
  const source = sourcePath === null ? null : file(sourcePath);
  const calls = [];
  const children = [];
  const callbacks = [];
  const typeFiles = fs.readdirSync(path.join(root, "templates"))
    .filter(name => name.startsWith("type_"))
    .map(name => file("r_templates/templates/" + name));
  const editor = {
    somethingSelected: () => selection,
    getCursor: () => ({ line: 4, ch: 20 }),
    setCursor: () => { selection = false; },
    focus: () => {},
  };
  const app = {
    internalPlugins: { plugins: { templates: { instance: { options: { folder: "/r_templates/templates/" } } } } },
    fileManager: { processFrontMatter() { assert.fail("le lancement enfant ne doit pas modifier un frontmatter séparément"); } },
    vault: {
      getMarkdownFiles: () => [...typeFiles, file("autre/type_Leurre.md")],
      getFileByPath: filePath => typeFiles.find(f => f.path === filePath) ??
        (fs.existsSync(path.join(root, filePath.replace(/^r_templates\//, ""))) ? file(filePath) : null),
      read: async f => read(f.path),
    },
    workspace: {
      activeEditor: { file: source, editor }, activeLeaf: { view: { editor } },
      getLeaf: () => ({ openFile: async child => { calls.push(["open", child.basename]); } }),
    },
    commands: { executeCommandById: id => { calls.push(["cursor", id]); } },
  };
  class Notice { constructor(message) { calls.push(["notice", message]); } }
  function run(text, target, templateFile) {
    const tp = {
      config: { target_file: target, active_file: source, template_file: templateFile },
      hooks: { on_all_templates_executed: callback => { callbacks.push(callback); } },
      date: { now: format => {
        assert.equal(format, "YYYY-MM-DD HH[h]mm");
        return "2026-11-19 14h05";
      } },
      file: {
        title: target?.basename,
        cursor: () => "<CURSOR>",
        include: f => run(read(f.path), target, templateFile),
        rename: async title => { calls.push(["rename", title]); target.basename = title; },
        create_new: async (text, title, open) => {
          calls.push(["create", title, open]);
          const target = file(`pages/${title}.md`);
          const content = await run(text, target, undefined);
          children.push({ title: target.basename, content });
          return target;
        },
      },
      system: {
        prompt: async () => { calls.push(["prompt"]); return name; },
        suggester: async (labels, values) => {
          calls.push(["type"]);
          assert.ok(!labels.includes("Leurre"));
          return values[labels.indexOf(type)] ?? null;
        },
      },
    };
    return render(text, { tp, app, Notice });
  }
  return {
    calls, children,
    hasSelection: () => selection,
    launch: () => run(read(launcher), source, file(launcher)),
    finishInsertion: async () => { for (const callback of callbacks) await callback(); },
    direct: title => run(read(layout), file(`pages/${title}.md`), file(layout)),
  };
}

for (const [type, name, title] of [
  ["Scratch", "Piste à creuser", "Piste à creuser"],
  ["Log", "Mise à jour @ étape 1", "2026-11-19 14h05 - Mise à jour @ étape 1"],
  ["Meeting", "Point d’équipe", "2026-11-19 14h05 - Point d’équipe"],
  ["Log", "2026-11-10 09h30 - Historique", "2026-11-10 09h30 - Historique"],
]) {
  test(`${type} : crée et ouvre la note nommée et liée après les deux invites (${name})`, async () => {
    const f = fixture({ type, name });
    assert.equal(await f.launch(), "", "rien à insérer dans la note source");
    assert.deepEqual(f.calls, [["prompt"], ["type"], ["create", title, false]]);
    assert.equal(f.hasSelection(), false, "l'insertion vide ne doit pas effacer le texte sélectionné");
    assert.equal(f.children[0].title, title);
    const { content } = f.children[0];
    assert.equal(content.split("\n")[1], `parent: ${JSON.stringify('[[Projet "Nord" @ Phase 1.md]]')}`);
    assert.equal((content.match(/^parent:/gm) ?? []).length, 1);
    assert.ok(content.includes(`type: ${type}\n`));
    assert.ok(content.includes("## Notes"));
    assert.ok(content.includes("Pages enfant"));
    if (type === "Meeting") assert.match(content, /## Ordre du jour\n<CURSOR>[\s\S]*## Actions/);
    await f.finishInsertion();
    assert.deepEqual(f.calls.slice(3), [["open", title], ["cursor", "templater-obsidian:jump-to-next-cursor-location"]]);
  });
}

test("annuler le titre ne crée rien ; Échap au type crée une note enfant sans type", async () => {
  const cancelled = fixture({ name: null });
  assert.equal(await cancelled.launch(), "");
  assert.deepEqual(cancelled.calls, [["prompt"]]);
  assert.equal(cancelled.hasSelection(), false);
  assert.deepEqual(cancelled.children, []);
  const untyped = fixture({ type: null });
  await untyped.launch();
  assert.match(untyped.children[0].content, /^---\nparent: .*\n---/);
  assert.doesNotMatch(untyped.children[0].content, /^type: /m);
});

test("sans source Markdown ou avec un titre contenant un chemin, ne crée rien", async () => {
  for (const params of [{ sourcePath: null }, { name: "../Autre" }]) {
    const f = fixture(params);
    assert.equal(await f.launch(), "");
    assert.deepEqual(f.children, []);
    assert.ok(f.calls.some(([action]) => action === "notice"));
  }
});

test("le parcours normal ne récupère pas la page active ; la convention @ reste valable", async () => {
  const f = fixture({ type: "Scratch" });
  const standalone = await f.direct("Sans titre");
  assert.match(standalone, /^parent:\s*$/m);
  assert.doesNotMatch(standalone, /parent: "\[\[/);
  const legacy = await f.direct("Projet @ Enfant");
  assert.match(legacy, /^parent: "\[\[Projet\]\]"$/m);
  assert.equal((legacy.match(/^parent:/gm) ?? []).length, 1);
});

test("les types rattachables exposent un parent facultatif, aucun champ ajouté aux types autonomes", () => {
  const allowed = ["Changement", "Deadline", "Documentation", "EntretienTech", "Etude", "Hub", "Incident", "Learning", "Log", "Meeting", "Memento", "Procedure", "Props-Projet", "Reference", "Scratch", "SplunkApplication", "SplunkDashboard", "SplunkLookup", "SplunkSavedsearch"];
  const autonomous = ["Briefing", "Concepts", "Journal", "Pensées", "Person", "Recette", "Topic"];
  for (const type of [...allowed, ...autonomous]) {
    const properties = read(`templates/type_${type}.md`).split("---", 3)[1];
    assert.equal(/^parent:[ \t]*$/m.test(properties), allowed.includes(type), type);
  }
});
