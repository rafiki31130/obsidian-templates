---
type: Journal
---

## Définition

Note **journalière** : ce qui s'est passé, ce qui a été fait ou décidé ce jour-là.

## Caractéristiques

Les journaux quotidiens (`journals/YYYY-MM-DD`) sont créés via le template `Page-Journal` et n'ont **pas** de frontmatter. `type_Journal` ne sert qu'à typer une note journalière rangée ailleurs. Les autres notes se rattachent à un jour via `date: "[[YYYY-MM-DD]]"` (bouton *Add to journal*).

## Propriétés

Template d'application : `templates/type_Journal.md`.

- `type: Journal`
- `date:` lien vers le journal du jour de création (`"[[YYYY-MM-DD]]"`)

Corps : aucun (page libre, section Notes).

## Différence avec les autres types

Un **Log** suit un sujet dans le temps ; le Journal suit une journée.
