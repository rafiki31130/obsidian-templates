<%*
// ─── Script_RenameProperty ────────────────────────────────────────────────────
// Renomme une propriété de frontmatter dans tout le vault, et/ou
// réapplique son type déclaré (text, multitext, number, checkbox, tags,
// aliases, date, datetime) en reformatant la valeur YAML.
//
// Utilise `app.fileManager.processFrontMatter()` → parsing/sérialisation YAML
// gérés par Obsidian (pas de regex YAML fragiles).
//
// Le type est lu/écrit dans `.obsidian/types.json` (cache Obsidian des types
// de propriétés). Renommer met aussi à jour cette entrée.

// ─── 1. Charger types.json ────────────────────────────────────────────────────
const TYPES_PATH = ".obsidian/types.json";
let typesJson;
try {
  typesJson = JSON.parse(await app.vault.adapter.read(TYPES_PATH));
} catch (e) {
  typesJson = { types: {} };
}
const declaredTypes = typesJson.types || {};

// ─── 2. Collecter toutes les propriétés vues dans le vault ───────────────────
const propSet = new Set(Object.keys(declaredTypes));
for (const f of app.vault.getMarkdownFiles()) {
  const fm = app.metadataCache.getFileCache(f)?.frontmatter;
  if (!fm) continue;
  for (const k of Object.keys(fm)) {
    if (k !== "position") propSet.add(k);
  }
}
const propNames = [...propSet].sort((a, b) => a.localeCompare(b));

if (propNames.length === 0) {
  new Notice("Aucune propriété trouvée.");
  return;
}

// ─── 3. Choisir la propriété ──────────────────────────────────────────────────
const prop = await tp.system.suggester(
  propNames.map(p => `${p}${declaredTypes[p] ? `  (${declaredTypes[p]})` : "  (—)"}`),
  propNames,
  false,
  "Quelle propriété ?"
);
if (!prop) return;

// ─── 4. Choisir l'action ──────────────────────────────────────────────────────
const ACTION_RENAME    = "rename";
const ACTION_RETYPE    = "retype";
const ACTION_BOTH      = "both";

const action = await tp.system.suggester(
  [
    `Renommer "${prop}"`,
    `Réappliquer le type${declaredTypes[prop] ? ` (${declaredTypes[prop]})` : " (à choisir)"}`,
    `Renommer + réappliquer le type`
  ],
  [ACTION_RENAME, ACTION_RETYPE, ACTION_BOTH],
  false,
  "Action ?"
);
if (!action) return;

// ─── 5. Saisir le nouveau nom (si rename) ─────────────────────────────────────
let newName = prop;
if (action === ACTION_RENAME || action === ACTION_BOTH) {
  const raw = await tp.system.prompt(`Renommer "${prop}" en…`, prop);
  if (raw == null) return;
  newName = String(raw).trim();
  if (!newName) {
    new Notice("Nom vide — abandon.");
    return;
  }
  if (newName === prop && action === ACTION_RENAME) {
    new Notice("Nom inchangé — abandon.");
    return;
  }
  if (!/^[A-Za-z_][\w-]*$/.test(newName)) {
    new Notice("Nom invalide (lettres/chiffres/_/-, doit commencer par une lettre ou _).");
    return;
  }
  if (newName !== prop && propSet.has(newName)) {
    const overwrite = await tp.system.suggester(
      [`Oui, fusionner dans "${newName}" (existe déjà)`, "Annuler"],
      [true, false],
      false,
      `"${newName}" existe déjà — fusionner ?`
    );
    if (!overwrite) return;
  }
}

// ─── 6. Choisir le type cible (si retype) ─────────────────────────────────────
const TYPE_OPTIONS = ["text", "multitext", "number", "checkbox", "date", "datetime", "tags", "aliases"];
let targetType = declaredTypes[newName] ?? declaredTypes[prop] ?? null;

if (action === ACTION_RETYPE || action === ACTION_BOTH) {
  const defaultIdx = targetType ? TYPE_OPTIONS.indexOf(targetType) : -1;
  const labels = TYPE_OPTIONS.map((t, i) =>
    i === defaultIdx ? `${t}  (actuel)` : t
  );
  const chosen = await tp.system.suggester(
    labels, TYPE_OPTIONS, false,
    `Type à appliquer pour "${newName}" ?`
  );
  if (!chosen) return;
  targetType = chosen;
}

// ─── 7. Confirmer ─────────────────────────────────────────────────────────────
const summaryParts = [];
if (action === ACTION_RENAME || action === ACTION_BOTH) {
  summaryParts.push(`renommer "${prop}" → "${newName}"`);
}
if (action === ACTION_RETYPE || action === ACTION_BOTH) {
  summaryParts.push(`type → "${targetType}"`);
}
const confirm = await tp.system.suggester(
  [`Oui : ${summaryParts.join(" + ")}`, "Annuler"],
  [true, false],
  false,
  "Confirmer ?"
);
if (!confirm) return;

// ─── 8. Coercion par type ─────────────────────────────────────────────────────
function coerce(value, type) {
  if (value == null) return value;
  switch (type) {
    case "text":
    case "date":
    case "datetime":
      if (Array.isArray(value)) return value.length > 0 ? String(value[0]) : null;
      return typeof value === "string" ? value : String(value);
    case "multitext":
    case "tags":
    case "aliases":
      if (Array.isArray(value)) return value;
      return [value];
    case "number": {
      if (typeof value === "number") return value;
      const n = Number(String(value).replace(",", "."));
      return Number.isFinite(n) ? n : value;
    }
    case "checkbox":
      if (typeof value === "boolean") return value;
      const s = String(value).toLowerCase().trim();
      if (s === "true" || s === "yes" || s === "oui") return true;
      if (s === "false" || s === "no" || s === "non") return false;
      return value;
  }
  return value;
}

// ─── 9. Itération sur les fichiers ────────────────────────────────────────────
const files = app.vault.getMarkdownFiles();
let renamed = 0, retyped = 0;
const errors = [];

for (const f of files) {
  // Filtre rapide via metadataCache pour éviter d'ouvrir tous les fichiers
  const cache = app.metadataCache.getFileCache(f);
  const fm = cache?.frontmatter;
  if (!fm) continue;
  const hasOld = prop in fm;
  const hasNew = newName !== prop && newName in fm;
  if (!hasOld && !(action === ACTION_RETYPE && newName in fm)) continue;

  try {
    await app.fileManager.processFrontMatter(f, (front) => {
      let touched = false;
      let touchedRename = false;
      let touchedRetype = false;

      // Étape A : rename
      if ((action === ACTION_RENAME || action === ACTION_BOTH) && prop in front) {
        const v = front[prop];
        if (newName !== prop) {
          // Fusion : si newName existe déjà, on écrase (on prévient via confirm)
          front[newName] = v;
          delete front[prop];
        }
        touchedRename = true;
        touched = true;
      }

      // Étape B : retype (sur la clé finale = newName)
      if ((action === ACTION_RETYPE || action === ACTION_BOTH) && newName in front) {
        const before = front[newName];
        const after = coerce(before, targetType);
        // Comparaison structurelle simple
        const changed = JSON.stringify(before) !== JSON.stringify(after);
        if (changed) {
          front[newName] = after;
          touchedRetype = true;
          touched = true;
        }
      }

      if (touchedRename) renamed++;
      if (touchedRetype) retyped++;
    });
  } catch (e) {
    errors.push(`${f.path}: ${e.message}`);
  }
}

// ─── 10. Mise à jour de types.json ────────────────────────────────────────────
let typesChanged = false;
if (action === ACTION_RENAME || action === ACTION_BOTH) {
  if (newName !== prop && declaredTypes[prop]) {
    declaredTypes[newName] = declaredTypes[newName] ?? declaredTypes[prop];
    delete declaredTypes[prop];
    typesChanged = true;
  }
}
if (action === ACTION_RETYPE || action === ACTION_BOTH) {
  if (declaredTypes[newName] !== targetType) {
    declaredTypes[newName] = targetType;
    typesChanged = true;
  }
}
if (typesChanged) {
  typesJson.types = declaredTypes;
  await app.vault.adapter.write(TYPES_PATH, JSON.stringify(typesJson, null, 2));
}

// ─── 11. Notice récapitulative ────────────────────────────────────────────────
const parts = [];
if (action === ACTION_RENAME || action === ACTION_BOTH) {
  parts.push(`${renamed} renommé(s)`);
}
if (action === ACTION_RETYPE || action === ACTION_BOTH) {
  parts.push(`${retyped} retypé(s)`);
}
const summary = `"${prop}"${prop !== newName ? ` → "${newName}"` : ""} : ${parts.join(", ")}${typesChanged ? " — types.json mis à jour" : ""}`;

if (errors.length > 0) {
  console.error("Script_RenameProperty — erreurs :", errors);
  new Notice(`${summary}\n${errors.length} erreur(s) — voir console.`, 8000);
} else {
  new Notice(summary, 5000);
}
%>
