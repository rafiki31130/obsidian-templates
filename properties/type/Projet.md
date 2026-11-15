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
