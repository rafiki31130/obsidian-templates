---
type: Person
---

## Définition

Fiche d'une **personne** : coordonnées, rôle, contexte de la relation.

## Caractéristiques

Les autres notes la référencent via `person: [[Nom]]` ; elles apparaissent alors dans la vue Relations de la fiche.

## Propriétés

Template d'application : `templates/type_Person.md`.

- `type: Person`
- `person:` lien vers la fiche elle-même (`[[Nom]]`)
- `Anniversaire:` date de naissance
- `tags:`

Corps : Contact · Idées cadeaux · Rencontres `![[Relations.base#Meetings]]` (Meetings et EntretienTech où elle figure dans `person:`) · Liens `![[Relations.base]]` (toutes les notes qui la citent en propriété).
