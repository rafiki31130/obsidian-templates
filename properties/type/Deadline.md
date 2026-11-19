---
type: Deadline
---

## Définition

**Échéance** datée à ne pas manquer (démarche, renouvellement, paiement…).

## Caractéristiques

Listée dans `resources/Deadlines.base` (vue *Upcomming* : échéances dans la fenêtre de préavis). À chaque échéance traitée, avancer `next_due` d'une `recurrence`.

## Propriétés

Template d'application : `templates/type_Deadline.md`.

- `type: Deadline`
- `parent:` lien facultatif vers le projet ou le dossier auquel l’échéance se rattache
- `next_due:` prochaine échéance (date)
- `recurrence:` périodicité en texte libre (`1 an`, `6 mois`…), vide si unique
- `notice_days:` préavis en jours (30 par défaut) : l'échéance remonte dans `Deadlines.base` quand `next_due` est à moins de `notice_days` jours
- `action:` ce qu'il faut faire à l'échéance
- `topic:` lien(s) vers le ou les Topics concernés

Corps : aucun (page libre, section Notes).

## Différence avec les autres types

Un **Projet** a un objectif et des actions ; une Deadline est un jalon daté unique.
