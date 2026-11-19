---
type: SplunkSavedsearch
---

## Définition

Fiche d'une **recherche sauvegardée Splunk** (rapport, alerte, recherche planifiée).

## Caractéristiques

Décrit la requête SPL, la planification, les actions déclenchées et les lookups ou dashboards liés.

## Propriétés

Template d'application : `templates/type_SplunkSavedsearch.md`.

- `type: SplunkSavedsearch`
- `parent:` lien facultatif vers l’application ou le projet de rattachement
- `topic:` lien(s) vers le ou les Topics concernés
- `external reference:` nom ou URL de l'objet dans Splunk

Corps : Summary · Search (bloc SPL) · Schedule (cron, actions) · Related `![[Splunk.base#Related]]`.
