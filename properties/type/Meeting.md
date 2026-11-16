---
type: Meeting
---

## Définition

**Compte-rendu de réunion** : participants, ordre du jour, décisions, actions.

## Caractéristiques

Les participants vont dans `person:`. Les actions sont listées dans la section Actions ; ajouter `#Todo` à celles qui doivent remonter dans les vues Tasks.

Nommage automatique, commun avec Log : `YYYY-MM-DD HHhmm - ` (ex. `2026-11-16 14h05 - ` ; `:` est interdit dans un nom de fichier). À l'application du type (création de page ou *Définir le type*), la page est renommée avec la date et l'heure du moment, sans prompt de nommage et sans reprendre son ancien titre. Le suffixe après ` - ` reste vide, à compléter manuellement. Un titre `Parent @ …` est conservé en `parent:`. Une page déjà horodatée conserve son titre et son heure, même si le suffixe est encore vide.

## Propriétés

Template d'application : `templates/type_Meeting.md` (contient du code Templater : l'appliquer via *Définir le type* ou à la création de page, pas via l'insertion de modèle du plugin de base).

- `type: Meeting`
- `date:` lien vers le journal du jour de création (`"[[YYYY-MM-DD]]"`)
- `topic:` lien(s) vers le ou les Topics concernés
- `person:` lien(s) vers les participants

Corps : Ordre du jour · Échanges · Décisions · Actions.

## Différence avec les autres types

Un **EntretienTech** est un échange technique ciblé ; un Meeting est une réunion de travail.
