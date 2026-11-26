
Revue hebdomadaire du travail concret. Ce tableau contient les étapes liées à au moins un projet actif ou délégué et les monolithes actifs ou délégués.

[[GTD - Pilotage]] · [[GTD - Portefeuille]] · [[GTD - Contrôles#Étapes]] · [[GTD - Contrôles#Rattachements et statuts]]

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "contexte_projets" });
```

## Kanban des étapes

![[GTD.Etapes.base#Sprint]]

## Charge et points à revoir

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "sprint" });
```

## Revue hebdomadaire

- [ ] Relire les étapes des projets actifs et nommer les résultats manquants.
- [ ] Pour une étape prête, écrire les prochaines actions et rendre le premier geste évident.
- [ ] Garder la charge (projets engagés + étapes en charge) sous le seuil d'alerte ; voir [[GTD - Régler le seuil d'alerte]].
- [ ] Renseigner dans la page ce qui bloque les étapes bloquées.
- [ ] Examiner [[GTD - Contrôles#Étapes]] et [[GTD - Contrôles#Rattachements et statuts]].
- [ ] Quand un projet passe en pause, remettre ses étapes en cours à « prête », sauf si un autre projet parent reste actif.
- [ ] Reprendre les prochaines actions dans le suivi quotidien.

Une étape partagée apparaît une seule fois. Les prédécesseurs sont visibles sur les cartes ; `6.delegue` distingue une délégation à une personne de `5.delegation_agent`. Les deux délégations et `7.validation` comptent dans la charge. Une étape en validation reste ouverte jusqu’à `8.terminee`. « Faite » sur un monolithe ne clôture pas automatiquement son statut au portefeuille.

## Notes de revue


