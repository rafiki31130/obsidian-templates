---
type: SplunkDashboard
---

## Définition

Fiche d'un **dashboard Splunk** : objectif, panneaux, sources de données, utilisateurs.

## Caractéristiques

Rattachée à son application via `parent:` ou le nommage `Application @ Dashboard`.

## Propriétés

Template d'application : `templates/type_SplunkDashboard.md`.

- `type: SplunkDashboard`
- `parent:` lien facultatif vers l’application ou le projet de rattachement
- `topic:` lien(s) vers le ou les Topics concernés
- `external reference:` nom ou URL de l'objet dans Splunk

Corps : Summary · Data sources · Related `![[Splunk.base#Related]]` (objets Splunk liés dans un sens ou dans l'autre).
