---
type: Topic
---

## Définition

**Sujet** suivi dans la durée, sans date de fin : domaine de responsabilité (Santé, Maison, Comptes, PRO…) ou thème d'intérêt (contenus glanés, astuces, articles).

Remplace les anciens types `Domain` et `Ressource`.

## Caractéristiques

- Créé via le template `Page-Domaine`.
- Rangé dans `pages/2. Domaines/` (responsabilités) ou `pages/3. Ressources/` (thèmes d'intérêt).
- Sert de parent aux projets et aux notes du sujet (convention `Parent @ Enfant` ou `parent: "[[Topic]]"`).
- Les autres notes y renvoient via la propriété `domain:`.

## Propriétés

Template d'application : `templates/type_Props-Topic.md` (généré par `Script_GenerateTypeTemplates`).

- `type: Topic`
- `domain:` liens vers le ou les Topics parents
- `people:` liens vers les personnes concernées
- `rating:` note (entier)
- `tags:`

## Différence avec les autres types

- Un **Projet** se termine ; un Topic est entretenu en permanence.
- Une **Reference** est une source de vérité maintenue ; un Topic rassemble tout ce qui touche à un sujet.
- Un **Hub** est un point d'entrée de navigation ; un Topic est le sujet lui-même.
