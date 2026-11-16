---
type: Meeting
---

## Définition

**Compte-rendu de réunion** : participants, ordre du jour, décisions, actions.

## Caractéristiques

Les participants vont dans `person:`. Les actions sont listées dans la section Actions ; ajouter `#Todo` à celles qui doivent remonter dans les vues Tasks.

## Propriétés

Template d'application : `templates/type_Meeting.md`.

- `type: Meeting`
- `date:` lien vers le journal du jour de création (`"[[YYYY-MM-DD]]"`)
- `topic:` lien(s) vers le ou les Topics concernés
- `person:` lien(s) vers les participants

Corps : Ordre du jour · Échanges · Décisions · Actions.

## Différence avec les autres types

Un **EntretienTech** est un échange technique ciblé ; un Meeting est une réunion de travail.
