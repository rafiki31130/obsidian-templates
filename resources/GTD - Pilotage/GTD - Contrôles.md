
[[GTD - Pilotage]] · [[GTD - Portefeuille]] · [[GTD - Sprint]]

Tous les signalements de cohérence, par famille. Ce sont des points à examiner en revue : les contrôles ne modifient aucune fiche et ne changent aucun statut. Les modèles et journaux sont exclus ; les objets archivés ne sont pas proposés comme travail actif, mais les incohérences d'archivage d'un domaine restent signalées. Les projets et monolithes en attente (`1.en_attente`) ou en pause (`3.en_pause`) ne sont pas signalés : ils seront revus à leur réactivation. Leurs étapes restent contrôlées.

## Projets

Un projet possède un domaine ou un objectif ; un projet non monolithe a une étape ; les clôtures sont cohérentes. Un lien topic vers une ressource reste autorisé.

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "projets" });
```

## Étapes

Une étape a un projet parent ; une étape partagée peut être en cours dès qu'un de ses projets est actif ; les monolithes utilisent leur propre statut projet. Les liens de prédécesseurs invalides, les auto-dépendances et les cycles sont signalés ; un prédécesseur simplement non fait ne l'est pas, sauf si l'étape est déjà prête, en cours, déléguée ou en validation.

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "etapes" });
```

![[GTD.Etapes.base#Dépendances]]

## Objectifs, domaines et routines

Un objectif actif est soutenu par un projet actif. Un domaine sans objectif, projet ni routine actifs est à examiner, comme un domaine archivé qui porte encore des engagements. Une routine a un domaine et, en essai ou active, une tâche récurrente 🔁 ouverte.

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "horizons" });
```

## Rattachements et statuts

Liens inexistants ou de mauvais type, statuts manquants ou inconnus. Le rattachement GTD unique concerne les notes ordinaires ; un projet peut avoir à la fois un domaine et un objectif.

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "rattachements" });
```

## Notes de revue


