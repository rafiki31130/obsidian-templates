---
type: SplunkApplication
---

## Définition

Fiche d'une **application Splunk** (app ou add-on) : rôle, version, objets fournis, déploiement.

## Caractéristiques

Parent naturel des fiches SplunkDashboard, SplunkLookup et SplunkSavedsearch qu'elle contient.

## Propriétés

Template d'application : `templates/type_SplunkApplication.md`.

- `type: SplunkApplication`
- `topic:` lien(s) vers le ou les Topics concernés
- `external reference:` nom ou URL de l'objet dans Splunk

Corps : Summary · Deployment · Objects `![[Splunk.base#Application]]` (fiches Splunk dont `parent:` est l'application, groupées par type).
