---
type: Briefing
---

## Définition

Synthèse **quotidienne** préparée pour démarrer la journée : agenda, tâches en retard, points d'attention.

## Caractéristiques

Rangée dans `briefings/`, nommage `YYYY-MM-DD @ Briefing`, généralement produite par l'agent de briefing quotidien.

## Propriétés

Template d'application : `templates/type_Briefing.md`.

- `type: Briefing`
- `date:` lien vers le journal du jour de création (`"[[YYYY-MM-DD]]"`)

Corps : Agenda · Emails · Veille · Actions.

## Différence avec les autres types

Le **Journal** est la note du jour écrite au fil de l'eau ; le Briefing est une synthèse préparée en amont.
