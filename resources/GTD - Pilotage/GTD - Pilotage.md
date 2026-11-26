---
seuil_charge_gtd: 10
---

Point d'entrée du pilotage GTD. Chaque page a un rôle unique :

- [[GTD - OnePager]] : lire, en une page, tout ce qui est engagé.
- [[GTD - Sprint]] : revue hebdomadaire des étapes.
- [[GTD - Portefeuille]] : revue mensuelle des projets et des routines.
- [[GTD - Contrôles]] : détail des signalements de cohérence.
- [[GTD - Régler le seuil d'alerte]] : changer le seuil de charge.
- [[GTD - Créer depuis la sélection]] : transformer un passage en projet ou étape.

## Points à revoir

```dataviewjs
await dv.view("r_templates/scripts/gtd-review", { section: "summary" });
```

## Cadence

- Chaque semaine : [[GTD - Sprint]], puis [[GTD - Contrôles#Étapes]] et [[GTD - Contrôles#Rattachements et statuts]].
- Chaque mois : [[GTD - Portefeuille]], puis [[GTD - Contrôles#Projets]] et [[GTD - Contrôles#Objectifs, domaines et routines]].
