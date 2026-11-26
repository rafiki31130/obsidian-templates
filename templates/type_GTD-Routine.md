---
type: GTD-Routine
gtd_domaine:
gtd_statut_routine: 1.en_essai
gtd_frequence: hebdomadaire
gtd_projet: []
topic:
---

> [!info]- Rappel GTD : la routine
> - **C'est** : un geste répété qui tient le niveau d'un domaine. Elle n'a pas de fin ; on la garde tant qu'elle sert.
> - **Bonne routine** : rattachée à un domaine, déclencheur clair, geste minimal faisable même un mauvais jour, critère d'efficacité écrit.
> - **L'installer** : un projet si cela demande plusieurs actions (critère de fin : tenue N semaines), référencé dans `gtd_projet` ; une seule habitude à la fois.
> - **Ce n'est pas** : un projet (résultat avec une fin), une action unique, une intention sans fréquence.
> - **Revue** : chaque mois, au Portefeuille : est-elle faite ? sert-elle encore ? garder, ajuster ou abandonner.

## Pourquoi


## Déclencheur et geste minimal

- **Déclencheur** : 
- **Geste minimal** : 

## Critère d'efficacité


## Tâche récurrente

- [ ] #Todo  🔁 every week

## Réalisation

```dataviewjs
// Lecture seule : taux de réalisation de la tâche récurrente sur les 28 derniers jours.
const days = 28;
const since = dv.date("today").minus({ days });
const tasks = dv.current().file.tasks.where(t => t.text.includes("🔁"));
const done = tasks.where(t => t.completed && t.completion && t.completion >= since).length;
const freq = String(dv.current().gtd_frequence ?? "");
const expected = freq === "quotidienne" ? days : freq === "hebdomadaire" ? 4 : freq === "mensuelle" ? 1 : null;
dv.paragraph(expected
  ? `**${done} / ${expected}** réalisation(s) attendue(s) sur ${days} jours (${Math.round(100 * done / expected)} %).`
  : `**${done}** réalisation(s) sur ${days} jours. Fréquence non renseignée.`);
```

## Journal des revues

| Mois | Taux | Décision (garder, ajuster, abandonner) | Ajustement |
|---|---|---|---|
|  |  |  |  |
