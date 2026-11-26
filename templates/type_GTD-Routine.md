---
type: GTD-Routine
gtd_domaine:
gtd_objectif:
gtd_projet: []
gtd_statut_routine: 1.en_essai
topic:
---

> [!info]- Rappel GTD : la routine
> - **C'est** : un geste répété qui tient le niveau d'un domaine. Elle n'a pas de fin ; on la garde tant qu'elle sert.
> - **Bonne routine** : rattachée à un domaine, déclencheur clair, geste minimal faisable même un mauvais jour, critère d'efficacité écrit.
> - **Rattachement** : domaine obligatoire ; objectif facultatif ; projet ou monolithe qui l'installe dans `gtd_projet`. Une seule habitude à installer à la fois.
> - **Fréquence** : portée par la tâche récurrente 🔁 de la fiche, pas par une propriété.
> - **Ce n'est pas** : un projet (résultat avec une fin), une action unique, une intention sans récurrence.
> - **Revue** : chaque mois, au Portefeuille : est-elle faite ? sert-elle encore ? garder, ajuster ou abandonner.

## Pourquoi


## Déclencheur et geste minimal

- **Déclencheur** : 
- **Geste minimal** : 

## Critère d'efficacité


## Tâche récurrente

%% - [ ] #Todo  🔁 every week%%

## Réalisation

```dataviewjs
// Lecture seule : taux de réalisation sur 28 jours, déduit de la récurrence 🔁 de la tâche (pas de propriété de fréquence).
const days = 28;
const since = dv.date("today").minus({ days });
const tasks = dv.current().file.tasks.where(t => t.text.includes("🔁"));
const done = tasks.where(t => t.completed && t.completion && t.completion >= since).length;
const unit = { day: 1, weekday: 1.4, week: 7, month: 30, year: 365 };
const m = tasks.map(t => /🔁\s*every\s+(\d+\s+)?(day|weekday|week|month|year)s?/i.exec(t.text)).find(Boolean);
const period = m ? (parseInt(m[1] || "1", 10) * unit[m[2].toLowerCase()]) : null;
const expected = period ? Math.max(1, Math.round(days / period)) : null;
dv.paragraph(expected
  ? `**${done} / ${expected}** réalisation(s) attendue(s) sur ${days} jours (${Math.round(100 * done / expected)} %).`
  : `**${done}** réalisation(s) sur ${days} jours. Aucune récurrence 🔁 lisible dans la fiche.`);
```

## Journal des revues

| Mois | Taux | Décision (garder, ajuster, abandonner) | Ajustement |
|---|---|---|---|
|  |  |  |  |
