---
type: Hub
---

## Définition

Page **centrale de navigation** (MOC) qui regroupe les liens vers un ensemble de notes.

## Caractéristiques

Contient surtout des liens et des vues (Dataview, Bases), peu de contenu propre.

## Propriétés

Template d'application : `templates/type_Hub.md`.

- `type: Hub`
- `topic:` lien(s) vers le ou les Topics concernés

Corps : vue `![[Relations.base]]` (notes rattachées au Hub, groupées par type ; vues *Projects*, *Meetings*, *Ops*, *Knowledge* accessibles depuis l'intégration).

## Différence avec les autres types

Un **Topic** est un sujet suivi ; un Hub est un point d'entrée de navigation.
