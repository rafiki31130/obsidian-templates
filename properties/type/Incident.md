---
type: Incident
---

## Définition

**Incident** : perturbation imprévue d'un service ou d'un système.

## Caractéristiques

Décrit symptômes, impact, chronologie, cause et résolution.

## Propriétés

Template d'application : `templates/type_Incident.md`.

- `type: Incident`
- `parent:` lien facultatif vers le projet ou système concerné
- `date:` lien vers le journal du jour de création (`"[[YYYY-MM-DD]]"`) (jour de l'incident)
- `topic:` lien(s) vers le ou les Topics concernés

Corps : Symptômes · Impact · Chronologie (horodatée) · Cause · Résolution.

## Différence avec les autres types

Un **Changement** est planifié ; un Incident est subi.
