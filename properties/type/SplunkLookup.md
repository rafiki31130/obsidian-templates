---
type: SplunkLookup
---

## Définition

Fiche d'un **lookup Splunk** (fichier CSV ou KV store) : contenu, champs, alimentation, usages.

## Caractéristiques

Indique comment le lookup est alimenté (manuel, recherche planifiée…) et quelles recherches l'utilisent.

## Propriétés

Template d'application : `templates/type_SplunkLookup.md`.

- `type: SplunkLookup`
- `topic:` lien(s) vers le ou les Topics concernés
- `external reference:` nom ou URL de l'objet dans Splunk

Corps : Summary · Fields (tableau) · Populated by · Related `![[Splunk.base#Related]]` (recherches et dashboards qui citent le lookup).
