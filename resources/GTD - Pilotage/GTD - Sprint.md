
Revue hebdomadaire du travail concret. Ce tableau contient les étapes liées à au moins un projet actif ou délégué et les monolithes actifs ou délégués.

[[GTD - Portefeuille]] · [[GTD - Contrôles des étapes]] · [[GTD - Contrôles des rattachements]] · [[GTD - Pilotage]]

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "contexte_projets" });
```

## Kanban des étapes

![[GTD.Etapes.base#Sprint]]

## Capacité et points à revoir

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "sprint" });
```

## Revue hebdomadaire

- [ ] Relire les étapes des projets actifs et nommer les résultats manquants.
- [ ] Pour une étape prête, écrire les prochaines actions et rendre le premier geste évident.
- [ ] Garder au plus trois étapes en cours, déléguées ou en validation, avec un repère de deux à trois.
- [ ] Renseigner dans la page ce qui bloque les étapes bloquées.
- [ ] Examiner [[GTD - Contrôles des étapes]] et [[GTD - Contrôles des rattachements]].
- [ ] Quand un projet passe en pause, remettre ses étapes en cours à « prête », sauf si un autre projet parent reste actif.
- [ ] Reprendre les prochaines actions dans le suivi quotidien.

Une étape partagée apparaît une seule fois. Les prédécesseurs sont visibles sur les cartes ; `6.delegue` distingue une délégation à une personne de `5.delegation_agent`. Les deux délégations et `7.validation` comptent dans la charge en cours. Une étape en validation reste ouverte jusqu’à `8.faite`. « Faite » sur un monolithe ne clôture pas automatiquement son statut au portefeuille.

## Notes de revue


