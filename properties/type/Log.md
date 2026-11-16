---
type: Log
---

## Définition

**Journal de bord** chronologique d'un sujet précis (entrées datées successives).

## Caractéristiques

Chaque entrée est datée ; le contenu s'accumule dans le temps.

Nommage automatique, commun avec Meeting : `YYYY-MM-DD HHhmm - ` (ex. `2026-11-16 14h05 - ` ; `:` est interdit dans un nom de fichier). À l'application du type (création de page ou *Définir le type*), la page est renommée avec la date et l'heure du moment, sans prompt de nommage et sans reprendre son ancien titre. Le suffixe après ` - ` reste vide, à compléter manuellement. Un titre `Parent @ …` est conservé en `parent:`. Une page déjà horodatée conserve son titre et son heure, même si le suffixe est encore vide.

## Propriétés

Template d'application : `templates/type_Log.md` (contient du code Templater : l'appliquer via *Définir le type* ou à la création de page, pas via l'insertion de modèle du plugin de base).

- `type: Log`
- `date:` lien vers le journal du jour de création (`"[[YYYY-MM-DD]]"`)
- `topic:` lien(s) vers le ou les Topics concernés
- `person:` lien(s) vers les personnes concernées
- `rating:` note de 1 à 7
- `tags:`

Corps : aucun (page libre, section Notes).

## Différence avec les autres types

Le **Journal** suit une journée ; un Log suit un sujet sur plusieurs jours.
