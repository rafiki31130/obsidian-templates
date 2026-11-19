---
type: Projet
---

## Définition

Note représentant un **projet** : un engagement borné dans le temps avec un objectif identifiable.

## Caractéristiques attendues

Une note de type Projet possède :
- Un **statut** (`statut:`) parmi les valeurs définies dans `properties/statut/`
- Des **relations** éventuelles vers d'autres pages ou projets (`relations:`)
- Des **actions suivies** (tâches Tasks avec `#Todo`) qui font progresser le projet vers son objectif

## Propriétés

Template d'application : `templates/type_Props-Projet.md`.

- `type: Projet`
- `parent:` lien facultatif vers le projet ou page de rattachement du sous-projet
- `statut:` valeur de `properties/statut/` (`1. A cadrer` à la création)
- `relations:` lien(s) vers les pages ou projets liés

Corps : aucun (blocs dynamiques de `Page-DynHierarchy` + section Notes).

## Différence avec une note classique

Une note classique (sans `type: Projet`) représente plutôt :
- Un **objet concret** (un véhicule, une pièce, une application…)
- Une **personne**
- Une **liste de référence**
- Une **réflexion** ou note de connaissance
- Une **procédure** ou documentation

Ces notes peuvent contenir des tâches locales mais ne sont pas pilotées par un avancement borné.

## Hiérarchie

Un projet peut être enfant d'un autre projet (sous-projet) ou d'une note classique (ex: `Maison @ Cuisine @ Crédence` = projet enfant de la note objet `Maison @ Cuisine`).

La hiérarchie passe par :
- la convention de nommage `Parent @ Enfant` dans le nom de fichier, ou
- la propriété `parent: "[[Nom]]"` en frontmatter

## Vue d'ensemble

La base `Projets.base` (à la racine du vault) liste tous les projets, groupés par statut.
