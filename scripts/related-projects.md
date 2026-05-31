---
type: doc-script
script: "[[related-projects.js]]"
---

> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("public/scripts/related-projects")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("public/scripts/related-tasks")
>```


# `related-projects.js` — README

## Objectif

Afficher dans une page tous les **projets liés** à elle, où "lié" signifie :
- soit **descendant** de la page courante (via `parent` ou convention `@`)
- soit possède une **`relations`** pointant vers la page courante **ou** vers l'un de ses descendants

Cas d'usage : depuis une note objet ou MOC (ex: `Maison`), voir tous les projets qui s'y rattachent, y compris ceux liés à une sous-page (ex: un projet rattaché à `Maison @ SdB` remonte aussi sur `Maison`).

## Invocation

Mode standard (Mentions inclus) :
```dataviewjs
dv.view("public/scripts/related-projects")
```

Sans la section Mentions :
```dataviewjs
dv.view("public/scripts/related-projects", { showMentions: false })
```

## Configuration (en tête du fichier)

```js
const STATUTS_INACTIFS = ["8. Terminé", "9. Abandonné"];
const TAG_ARCHIVED = "archived";
```

- **`STATUTS_INACTIFS`** : valeurs de `statut` regroupées sous "Clos" dans le rendu. Aligné avec les statuts d'état "inactif" listés dans `properties/statut/*.md`.
- **`TAG_ARCHIVED`** : tag qui exclut un projet de la vue. Sans le `#` — le helper `hasTag` strippe le `#` éventuel sur `file.tags` avant comparaison (cf. gotchas).

### Options d'invocation

| Option | Défaut | Effet |
|---|---|---|
| `showMentions` | `true` | Affiche la section Mentions en bas de la vue (cf. logique §6). Passer `false` pour désactiver. |

## Logique

### 1. Collecte des descendants
Identifie d'abord toutes les pages descendantes de la page courante (tous types, pas seulement projets) — sert à construire l'ensemble `{courant ∪ descendants}` utilisé pour le matching des relations.

### 2. Collecte des projets liés
Pour chaque page du vault :
- Garde si `type = "Projet"`
- Exclut si tagué `archived`
- Inclut si :
  - **descendant** de la courante (via `parent` ou convention `@`), **ou**
  - sa propriété `relations` contient un lien dont le nom est dans `{courant ∪ descendants}`

Le matching `relations` se fait par **nom exact** (pas par sous-chaîne) pour éviter les faux positifs (ex: `[[Maisonnette]]` qui matcherait `Maison`).

### 3. Filtre archivés
Les projets taggués `archived` sont **exclus** entièrement de la vue (pas de section dédiée). Le geste d'archivage est explicitement masquant dans ce contexte.

### 4. Pas de propagation d'état
Chaque projet conserve son propre statut, indépendamment de celui de ses ancêtres. Différence avec `child-pages.js` qui propage l'état des intermédiaires aux descendants.

### 5. Groupement et rendu
- Tri des statuts par numéro (préfixe `N.` extrait avec une regex)
- Statuts **actifs** présents → chacun en `<h3>` avec sa liste de projets
- Statuts **inactifs** présents → précédés d'un séparateur horizontal `<hr>`, chacun en `<h3>` (pas de titre "Clos" englobant — le séparateur suffit visuellement)
- Liste de projets : triée alphabétiquement
- Section vide → omise (pas de titre orphelin, pas de séparateur si aucun statut inactif)

### 6. Section Mentions (activée par défaut)

Une section "Mentions" est ajoutée en bas de la vue. Le titre est en **italique simple** (pas un header) pour signaler son statut secondaire. Les **liens listés sont aussi en italique** — la mise en forme italique généralisée suffit à signaler "lien implicite, à valider".

Elle liste les projets **actifs** qui possèdent un **outlink vers la page courante** (matching strict — pas vers ses descendants), **mais qui ne figurent pas déjà** dans les sections précédentes (descendants ou via `relations`).

Sont **exclus** :
- les projets archivés (tag `archived`)
- les projets aux statuts inactifs (`8. Terminé`, `9. Abandonné`) — la formalisation n'a plus d'intérêt sur un projet clos
- les projets déjà affichés en descendants ou via `relations`

Logique de la dédup stricte : Mentions = `{projets actifs avec outlink vers courante} \ {projets déjà affichés}`. Sert à détecter les liens implicites à formaliser sur des projets vivants.

**Pourquoi strict sur la courante** : les mentions des descendants apparaissent dans la vue "Projets liés" de chacun de ces descendants. Les remonter ici dupliquerait l'information et noierait le signal sur les pages MOC très ramifiées.

**Désactivation** : passer `{ showMentions: false }` quand le bruit est élevé sur une page (ex: notes très liées).

## Structure de sortie

```
### 1. A cadrer
- [[Projet A]]
- [[Projet B]]

### 2. A démarrer
- [[Projet C]]

### 3. En cours
- [[Projet D]]

(... un h3 par statut actif présent ...)

---
### 8. Terminé
- [[Projet E]]

### 9. Abandonné
- [[Projet F]]

*Mentions*
- *[[Projet G]]*
- *[[Projet H]]*
```

## Fonctions

| Fonction | Rôle |
|---|---|
| `normalizeAt(s)` | Supprime les espaces autour des `@` |
| `getLinkName(val)` | Extrait le nom de fichier d'une valeur (link, string ou objet) |
| `isArchived(p)` | True si la page possède le tag `archived` |
| `isDescendantOfCurrent(p, curName, curN)` | Test hiérarchique fin via `parent` ou `@` |
| `statutKey(s)` | Extrait le numéro du statut pour le tri (`"3. En cours"` → 3) |
| `renderProjectList(pages)` | Construit le `<ul>` avec liens internes |
| `renderStatutSection(statut, level)` | Émet un `<hN>` + sa liste |

## Limitations connues

1. **`STATUTS_INACTIFS` maintenu à la main** : la liste vit en dur dans le script. La catégorisation officielle "actif/inactif" est dans le **corps** des `properties/statut/*.md` (champ `**État**`), donc non queryable directement. À mettre à jour si un nouveau statut "inactif" est ajouté.

2. **Helpers dupliqués avec `child-pages.js`** : `normalizeAt`, `getLinkName`, la collecte des descendants — duplication assumée tant qu'on a 2 scripts. Si un 3ème script utilise les mêmes helpers, extraire dans un module commun (via plugin CustomJS ou un fichier d'inlining).

3. **Pas de cache** : à chaque rendu, le script reparcourt `dv.pages("")` deux fois (descendants + projets candidats).

4. **Statut absent** : un projet sans `statut` est rangé sous `"(sans statut)"` qui apparaîtra dans les actifs (numéro de tri 999, donc en fin de liste actifs). Sert de signal visuel pour repérer les projets non statuiés.

5. **Mentions sans filtrage du contexte** : la section Mentions compte un outlink où qu'il apparaisse dans le projet (corps, callout, blockquote, code block, commentaire). Pas de filtrage du bruit incidentel — un projet qui mentionne la page courante en passant ("voir aussi [[Maison]]") apparaîtra. À garder en tête si la section devient bruyante.

## Évolutions possibles

- Paramétrer `STATUTS_INACTIFS` et `TAG_ARCHIVED` via `dv.view("public/scripts/related-projects", { ... })`.
- Distinguer visuellement les projets descendants vs reliés via `relations` (ex: icône, classe CSS).
- Bidirectionnalité du matching `relations` : afficher aussi les projets que la page courante elle-même référence dans ses propres `relations`.
- Bascule sur résolution `statut` → fichier de référence pour lire l'état dynamiquement (élimine la maintenance de `STATUTS_INACTIFS`).
- **Filtrage du contexte des Mentions** : ne compter que les outlinks dans le corps "principal" (exclure callouts, blockquotes, code blocks). Nécessite parser la position des liens.
