---
type: doc-script
script: "[[child-pages.js]]"
---

> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-projects")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-tasks")
>```


# `child-pages.js` — README

## Objectif

Afficher l'**arborescence** des pages descendantes de la page courante, jusqu'à n'importe quelle profondeur, avec gestion explicite des états (Actif / Archivé / Clos).

Remplace les blocs Dataview "Pages enfantes" embarqués dans plusieurs notes : une seule logique centralisée à maintenir.

## Invocation

```dataviewjs
dv.view("r_templates/scripts/child-pages")
```

Aucun argument à passer.

## Configuration (en tête du fichier)

```js
const STATUTS_CLOS = ["8. Terminé", "9. Abandonné"];
const TAG_ARCHIVED = "archived";
```

- **`STATUTS_CLOS`** : valeurs de `statut` qui font basculer une page en section "Clos". Aligné avec les statuts d'état "inactif" listés dans `properties/statut/*.md`.
- **`TAG_ARCHIVED`** : tag d'archivage. **Sans le `#`** — le helper `hasTag` strippe le `#` éventuel sur `file.tags` avant comparaison (cf. gotchas).

## Logique

### 1. Collecte des descendants
Une page est descendante de la courante si :
- son `parent` (normalisé sur `@`) est la page courante, **ou** commence par `<courant>@`
- **ou** son nom de fichier (normalisé) commence par `<courant>@`

→ matche **tous les descendants**, à toute profondeur, via la convention `@` ou la propriété `parent`.

### 2. Construction de l'arbre
Pour chaque descendant, on calcule sa **chaîne d'ancêtres** depuis la page courante :
- Via la convention `@` : on découpe `Maison @ Cuisine @ Crédence` → `["Maison @ Cuisine", "Maison @ Cuisine @ Crédence"]`
- Sinon via la propriété `parent` : on remonte de proche en proche jusqu'à atteindre la page courante

Si un nœud intermédiaire de la chaîne **n'existe pas** comme note (ex: `Maison @ Cuisine` absent alors que `Maison @ Cuisine @ Crédence` existe), un **placeholder** est créé pour préserver la cohérence visuelle. Il s'affichera comme un lien non résolu (rouge), cliquable pour créer la note manquante.

### 3. Marquage propre de chaque page
- **Archivé** : la page possède le tag `archived`
- **Clos** : `statut ∈ {"8. Terminé", "9. Abandonné"}`
- **Actif** : sinon (ownMarking = null)

**Cas de double marquage** (tag archived ET statut clos) : Archivé l'emporte (geste explicite > effet de bord).

### 4. Propagation de l'état effectif
Chaque nœud reçoit un `effective` = son `ownMarking` s'il est défini, sinon hérité de l'ancêtre marqué le plus proche.

Conséquence : si un intermédiaire est Archivé/Clos, **toute sa descendance hérite** — sauf un sous-nœud explicitement marqué qui ressort dans sa propre section.

### 5. Rendu en 3 sections
Pour chaque état (Actif, Archivé, Clos) :
- Identifier les "racines de section" : nœuds dont le parent immédiat a un état effectif **différent** (ou est la page courante elle-même)
- Construire l'arborescence imbriquée des descendants partageant le même état effectif

→ Une page Archivée explicite sous un parent Clos ressort comme **racine d'arbre dans la section Archivés** (sans ses ancêtres Clos en contexte).

Les titres de section "Archivés" et "Clos" sont rendus en `<h3>`. La section Actifs est sans titre.

## Structure de sortie

```html
<!-- Section Actifs : sans titre, affichée en premier -->
- Maison @ Cuisine
  - Maison @ Cuisine @ Crédence
  - Maison @ Cuisine @ PlaqueDeCuisson
- Maison @ RDC
  - Maison @ RDC @ Sols

**Archivés**
- Maison @ Devanture
  - Maison @ Devanture @ Truc   ← descendance héritée

**Clos**
- Maison @ Cuisine @ Évier
- Maison @ SalleDeBain @ Sol
```

Une section vide n'apparaît pas (pas de titre orphelin).

## Fonctions

| Fonction | Rôle |
|---|---|
| `normalizeAt(s)` | Supprime les espaces autour des `@` |
| `getLinkName(val)` | Extrait le nom de fichier d'une valeur (link, string ou objet) |
| `getOwnMarking(p)` | Retourne `"archived"`, `"clos"` ou `null` selon les marquages propres de p |
| `computePath(p)` | Reconstruit la chaîne d'ancêtres de la courante jusqu'à p |
| `propagate(node, inh)` | Calcule `effective` récursivement (DFS top-down) |
| `collectRoots(...)` | Trouve les nœuds qui ouvrent une nouvelle racine dans une section |
| `buildSubtree(...)` | Construit le `<li><ul>...</ul></li>` imbriqué pour une section |
| `renderSection(...)` | Émet la section complète dans le DOM |

## Limitations connues

1. **`STATUTS_CLOS` maintenu à la main** : la liste vit en dur dans le script. La catégorisation officielle "actif/inactif" est dans le **corps** des `properties/statut/*.md` (champ `**État**`), donc non queryable directement. À mettre à jour si un nouveau statut "inactif" est ajouté.

2. **Pas de cache** : à chaque rendu, le script reparcourt `dv.pages("")` deux fois (index par nom + collecte des descendants).

3. **Profondeur non bornée** : sur un sous-arbre très profond, la sortie peut devenir longue. Pas de paramètre de profondeur max pour l'instant.

## Évolutions possibles

- Paramétrer `STATUTS_CLOS` et `TAG_ARCHIVED` via `dv.view("r_templates/scripts/child-pages", { statutsClos, tagArchived })`.
- Option `maxDepth` pour limiter la profondeur affichée.
- Option `directOnly: true` pour ne montrer que les enfants directs (1 niveau).
- Bascule éventuelle sur résolution `statut` → fichier de référence pour lire l'état dynamiquement.
