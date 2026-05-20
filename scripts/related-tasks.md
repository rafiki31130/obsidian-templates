---
type: doc-script
script: "[[related-tasks.js]]"
---

> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("scripts/related-projects")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("scripts/related-tasks")
>```


# `related-tasks.js` — README

## Objectif

Afficher dans une page les **tâches non terminées** qui la concernent. Sources :
- les tâches **locales à la page courante taguées `#Todo`** (les autres tâches locales restent visibles dans le corps de la note mais ne sont pas dupliquées ici — le tag `#Todo` est l'opt-in pour qu'une tâche locale remonte dans cette vue)
- ses pages enfants (selon la hiérarchie `parent` ou la convention `Parent @ Enfant`) — **toutes** leurs tâches non terminées
- toute autre page qui contient un lien vers la page courante ou ses enfants

Remplace plusieurs blocs Dataview embarqués par un appel unique à un script centralisé : si la logique change, on n'édite qu'**un seul fichier**.

## Invocation

Dans n'importe quelle note où tu veux la liste des tâches liées :

````markdown
> [!success]+ Related tasks
> ```dataviewjs
> dv.view("scripts/related-tasks")
> ```
````

Aucun argument à passer — le script se base sur la page courante (`dv.current()`).

## Configuration (en tête du fichier)

```js
const STATUTS_EXCLUS  = ["5. En pause", "8. Terminé", "9. Abandonné"];
const TAGS_EXCLUS     = ["archived"];
const TAG_TODO_LOCAL  = "Todo";
```

- **`STATUTS_EXCLUS`** : valeurs de `statut` qui font qu'une page (et ses tâches) sont ignorées. Inclut les inactifs (`8. Terminé`, `9. Abandonné`) **et** `5. En pause` (les tâches d'un projet en pause ne doivent pas remonter dans les vues actives). Format `N. Nom` aligné avec l'arbo `properties/statut/`.
- **`TAGS_EXCLUS`** : tags qui font qu'une page est ignorée. Sans le `#` — le helper `hasTag` strippe le `#` éventuel sur `file.tags` avant comparaison (cf. gotchas).
- **`TAG_TODO_LOCAL`** : tag requis sur les tâches **de la page courante** pour qu'elles apparaissent dans la vue. Sans le `#`. Le filtrage se fait via `taskHasTag(task, tag)` qui inspecte `task.tags` (avec ou sans `#`). Ne s'applique pas aux tâches des pages enfants ni aux références externes.

## Logique en 3 étapes

### 1. Identifier les pages pertinentes
- La page courante
- Toutes les pages dont `parent` pointe vers la page courante (ou qui suivent la convention `<NomCourant> @ Suite` dans leur nom de fichier)
- On filtre celles qui ont un statut exclu ou un tag exclu

→ produit un `Set` de noms de pages "pertinentes" (`relevantNames`).

### 2. Collecter les tâches
Page courante :
- Tâches non terminées **filtrées sur `#Todo`** (`taskHasTag(t, TAG_TODO_LOCAL)`) — les autres tâches locales sont déjà visibles dans le corps, on ne les duplique pas ici
- Si aucune tâche locale ne porte `#Todo`, l'entrée `curName` n'est pas pré-insérée ; elle peut tout de même être créée à la volée par §3 si une page externe la référence

Pages enfants pertinentes :
- **Toutes** leurs tâches non terminées (`ownTasks`)
- Le map ligne→item de toutes les listes de la page (`ownListsByLine`), nécessaire pour retrouver le bullet parent d'une tâche

### 3. Trouver les références externes
Toutes les autres pages du vault sont scannées : si l'une d'elles contient une tâche dont un `outlink` pointe vers une page pertinente (courante ou enfant), cette tâche est rattachée à la page pertinente correspondante. Stockées dans `refs: Map<pageRéférençante, {tasks, listsByLine}>`.

## Structure de sortie

Pour chaque page pertinente ayant au moins une tâche :

```
### <nom de la page pertinente>             (h3)
— <bullet parent éventuel>
- [ ] tâche locale 1
- [ ] tâche locale 2

#### <page externe qui référence>           (h4)
— <bullet parent éventuel dans la page externe>
- [ ] tâche externe 1
```

Le **bullet parent** (préfixé par `—`) est affiché si la tâche est un sous-item d'une liste non-tâche : utile pour donner du contexte (ex: `— Salle de bain` puis tâches sous ce bullet).

## Fonctions utilitaires

| Fonction | Rôle |
|---|---|
| `normalizeAt(s)` | Supprime les espaces autour des `@` pour comparer les noms hiérarchiques (`Maison @ Cuisine` ↔ `Maison@Cuisine`) |
| `getLinkName(val)` | Extrait le nom de fichier d'une valeur (link, string ou objet) — robuste aux 3 formats |
| `dvContains(field, name)` | Test inclusion tolérant aux scalaires/listes |
| `estExclue(p)` | Filtre statut/tag (au niveau page) |
| `taskHasTag(task, tag)` | True si la tâche porte le tag (compare avec/sans `#`) |
| `hasTag(p, tag)` | True si la page porte le tag (compare avec/sans `#`) |
| `getGroups(tasks, lists)` | Regroupe les tâches par bullet parent |
| `afficherGroups(groups)` | Rend chaque groupe avec son bullet en `paragraph` puis la `taskList` |

## Limitations connues

1. **`STATUTS_EXCLUS` maintenu à la main** : la liste des statuts à exclure est codée en dur. La catégorisation officielle "actif/inactif" vit dans le **corps** des fichiers `properties/statut/*.md` (champ `**État**`), donc non queryable directement. Si un nouveau statut "inactif" est ajouté (ex: futur `10. Annulé`), penser à mettre à jour `STATUTS_EXCLUS`.

2. **Pas de cache** : à chaque rendu, le script reparcourt l'intégralité de `dv.pages("")`. Sur un vault qui grossit, le coût peut devenir sensible.

## Évolutions possibles

- Paramétrer `STATUTS_EXCLUS` et `TAGS_EXCLUS` via `input` à `dv.view("...", { statutsExclus, tagsExclus })`.
- Distinguer visuellement les tâches locales / héritées des enfants / venues de l'extérieur (icône, couleur).
- Option `expandSubBullets: true` pour afficher également la sous-arborescence d'un bullet parent. 


