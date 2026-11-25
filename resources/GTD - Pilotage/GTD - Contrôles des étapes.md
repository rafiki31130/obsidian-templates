
[[GTD - Contrôles]] · [[GTD - Portefeuille]] · [[GTD - Sprint]]

Vérifier les projets parents. Une étape partagée peut être en cours dès qu’au moins un de ses projets est actif. Les monolithes utilisent leur propre statut projet.

## Signalements

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "etapes" });
```

## Notes de revue



## Dépendances

Les contrôles signalent les liens de prédécesseurs invalides, les auto-dépendances et les cycles ; un prédécesseur simplement non fait n'est pas signalé. Une étape déclarée prête, en cours, déléguée ou en validation avec des prédécesseurs non terminés est à revoir.

![[GTD.Etapes.base#Dépendances]]
