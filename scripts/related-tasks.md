---
type: doc-script
script: "[[related-tasks.js]]"
descriptor: "[[related-tasks.query.json]]"
---

> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-projects")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-tasks")
>```


# `related-tasks` — README

Documentation commune à deux implémentations qui **ne partagent plus la même logique** :

- **`related-tasks.js`** — script Dataview affiché dans Obsidian. But : donner à l'humain une vue agrégée des tâches qui concernent la page courante (locales `#Todo` + enfantes + externes qui linkent). Cf. section "Logique JS" plus bas.
- **`related-tasks.query.json`** — descripteur consommé par le moteur `obsidian-mcp` (Python), invoqué via `get_project_tasks(project_name)`. But : retourner au LLM **uniquement ce qu'il ne peut pas dériver lui-même** en lisant la hiérarchie. Cf. section "Logique MCP" plus bas.

La divergence est volontaire : un LLM peut lire la page projet et ses enfants directement quand il en a besoin — le tool n'a donc pas à les ré-extraire. En revanche il ne peut pas, sans scan complet du vault, repérer les tâches qui le mentionnent depuis ailleurs ni les pages qui le déclarent en `relations`. C'est ce que retourne le tool.

---

## Logique MCP — `get_project_tasks(project_name)`

### Ce que le tool retourne

```json
{
  "distant_tasks": {
    "journals/2026-05-25.md": [
      {"line": "- [ ] #Todo tâche [[MonProjet]] ...", "source": "journals/2026-05-25.md"}
    ],
    "pages/AutrePage.md": [
      {"line": "- [ ] tâche [[MonProjet @ Phase 1]]", "source": "pages/AutrePage.md"}
    ]
  },
  "related_pages": [
    {"path": "pages/MonProjet @ Phase 1.md", "relation": "child"},
    {"path": "pages/MonProjet @ Phase 2.md", "relation": "child"},
    {"path": "pages/Doc Méthode.md", "relation": "relations_frontmatter"}
  ]
}
```

### Ce que le tool **ne** retourne **pas** (et pourquoi)

| Non retourné | Pourquoi |
|---|---|
| Les tâches de la page projet elle-même (`pages/{project_name}.md`) | Le LLM peut la lire directement avec `vault_read` — pas besoin de la dupliquer. |
| Les tâches des pages enfantes (basename `project_name @ ...`) | Idem : leurs chemins sont listés dans `related_pages`, le LLM va les chercher s'il en a besoin. |
| Les tâches des pages avec `parent: [[project_name]]` en frontmatter | Idem. Note : cette convention n'est **pas** détectée par `related_pages` actuellement — seules les conventions `basename @` et `relations` le sont (cf. limitations). |
| Le contexte hiérarchique d'une tâche (bullet parent éventuel) | Trop coûteux à reconstruire pour un usage LLM ; le LLM peut lire la ligne dans le fichier source si besoin. |

### `distant_tasks` — détail

**Scan** : `journals/` + `pages/`.

**Filtre fichier** : exclut la page cible, les pages enfantes par nommage (`project_name @ ...`), et celles avec `parent: [[project_name]]`.

**Filtre ligne** : tâche ouverte (`- [ ]`) **et** contenant un wikilink commençant par `project_name`. Cela inclut donc à la fois :
- `[[project_name]]` (lien direct vers la page projet)
- `[[project_name @ Phase 1]]` (lien vers un enfant)

C'est volontaire : si quelqu'un, dans un journal, écrit une tâche pointant vers un sous-projet, elle remonte aussi.

### `related_pages` — détail

**Scan** : `pages/` uniquement.

**Règles** (mutuellement exclusives — première qui matche gagne) :
1. `relation: "child"` — basename commence par `project_name @` (convention de nommage hiérarchique).
2. `relation: "relations_frontmatter"` — frontmatter `relations:` contient `[[project_name]]`.

### Exclusions globales

```json
"exclude": {
  "tags": ["archived"],
  "statut": ["8. Terminé", "9. Abandonné"]
}
```

S'applique aux deux sections, sur le frontmatter du fichier scanné. Les journaux (pas de frontmatter) ne sont jamais exclus par ce filtre.

### Invocation

```python
mcp.get_project_tasks(project_name="MonProjet")
mcp.get_project_tasks(project_name="MonProjet @ Phase 1")  # works recursively
```

Le moteur charge `scripts/related-tasks.query.json` depuis le vault, substitue `{{project_name}}`, et exécute les deux sections en parallèle conceptuel.

### Structure du descripteur (v3)

```json
{
  "version": 3,
  "parameters": { "project_name": { "type": "string", "required": true } },
  "exclude": { "tags": [...], "statut": [...] },
  "sections": {
    "distant_tasks": {
      "type": "tasks",
      "scan": { "folders": [...] },
      "match_file": { "none_of": [...] },
      "filter": { "content_link_starts_with": "{{project_name}}" }
    },
    "related_pages": {
      "type": "pages",
      "scan": { "folders": [...] },
      "rules": [
        { "relation": "...", "match_file": { ... } },
        ...
      ]
    }
  }
}
```

Le moteur (`query_engine.py`) dispatche sur la clé `sections` et exécute chaque section selon son `type` (`tasks` ou `pages`). Aucune logique métier dans le moteur — tout vient du descripteur.

---

## Logique JS — `related-tasks.js`

> Le script JS n'a pas été touché par la refonte MCP. Il garde la logique historique en 3 cas, pensée pour un affichage humain dans Obsidian.

### Objectif

Afficher dans une page Obsidian les **tâches non terminées** qui la concernent :
- les tâches **locales à la page courante taguées `#Todo`** (les autres tâches locales restent dans le corps de la note, pas dupliquées ici — `#Todo` est l'opt-in)
- ses pages enfantes (`parent: [[...]]` ou convention `Parent @ Enfant`) — **toutes** leurs tâches non terminées
- toute autre page qui contient un lien vers la page courante ou ses enfantes

### Invocation

````markdown
> [!success]+ Related tasks
> ```dataviewjs
> dv.view("r_templates/scripts/related-tasks")
> ```
````

Aucun argument à passer — le script se base sur `dv.current()`.

### Configuration (en tête du fichier)

```js
const STATUTS_EXCLUS  = ["5. En pause", "8. Terminé", "9. Abandonné"];
const TAGS_EXCLUS     = ["archived"];
const TAG_TODO_LOCAL  = "Todo";
```

- **`STATUTS_EXCLUS`** : valeurs de `statut` qui font qu'une page est ignorée. `5. En pause` est inclus côté JS (les projets en pause ne remontent pas dans les vues actives), pas côté descripteur MCP (à ajouter si besoin).
- **`TAGS_EXCLUS`** : tags qui font qu'une page est ignorée. Sans le `#`.
- **`TAG_TODO_LOCAL`** : tag requis sur les tâches **de la page courante** pour qu'elles apparaissent dans la vue.

### Sortie

```
### <nom de la page pertinente>             (h3)
— <bullet parent éventuel>
- [ ] tâche locale 1
- [ ] tâche locale 2

#### <page externe qui référence>           (h4)
— <bullet parent éventuel dans la page externe>
- [ ] tâche externe 1
```

Le bullet parent (préfixé par `—`) donne du contexte quand une tâche est sous-item d'une liste non-tâche.

### Fonctions utilitaires

| Fonction | Rôle |
|---|---|
| `normalizeAt(s)` | Supprime les espaces autour des `@` pour comparer les noms hiérarchiques |
| `getLinkName(val)` | Extrait le nom de fichier d'une valeur (link, string ou objet) |
| `dvContains(field, name)` | Test inclusion tolérant aux scalaires/listes |
| `estExclue(p)` | Filtre statut/tag (au niveau page) |
| `taskHasTag(task, tag)` | True si la tâche porte le tag (compare avec/sans `#`) |
| `hasTag(p, tag)` | True si la page porte le tag (compare avec/sans `#`) |
| `getGroups(tasks, lists)` | Regroupe les tâches par bullet parent |
| `afficherGroups(groups)` | Rend chaque groupe avec son bullet puis la `taskList` |

---

## Limitations connues

1. **MCP — `related_pages` ne détecte pas `parent: [[...]]`** : seules les conventions `basename @` et `relations frontmatter` sont matchées. Si une page utilise uniquement la convention `parent`, elle n'apparaîtra pas dans `related_pages`. À ajouter (`frontmatter_equals: { parent: ... }` comme 3e règle) si l'usage le justifie.

2. **MCP — pas de bullet parent** : seules les lignes de tâche brutes sont retournées dans `distant_tasks`. Le contexte hiérarchique est perdu. Le LLM peut le récupérer en lisant le fichier source si nécessaire.

3. **JS — `STATUTS_EXCLUS` maintenu à la main** : la liste des statuts à exclure est codée en dur. Si un nouveau statut "inactif" est ajouté, penser à mettre à jour les deux endroits (JS et descripteur MCP — pas symétriques aujourd'hui).

4. **Pas de cache (JS + MCP)** : à chaque rendu/appel, scan complet de `journals/` + `pages/`. Sur un vault qui grossit, le coût peut devenir sensible.

## Évolutions possibles

- MCP : 3e règle `related_pages` sur `frontmatter parent` pour aligner avec la convention historique.
- MCP : option de filtrage temporel sur `distant_tasks` (ex: ne remonter que les tâches des 30 derniers journaux).
- JS : paramétrer `STATUTS_EXCLUS` et `TAGS_EXCLUS` via `dv.view("...", { ... })`.
- JS : distinguer visuellement tâches locales / héritées / externes (icône, couleur).
