---
type: doc-script
descriptor: "[[active-projects.query.json]]"
---

# `active-projects` — README

Descripteur pour le moteur `obsidian-mcp` (Python), invoqué via `get_active_projects(statut?)`.

## Objectif

Lister les notes de type **Projet** dont le statut n'est pas terminal, avec possibilité de filtrer sur un statut précis.

## Logique du filtre

### Inclusion stricte

Une note est retournée si **toutes** ces conditions sont vraies :
- frontmatter `type: Projet` (égalité stricte de chaîne)
- frontmatter `statut` ∉ statuts exclus
- frontmatter ne contient pas un des tags exclus
- si paramètre `statut` fourni : frontmatter `statut` == valeur fournie

### Statuts exclus par défaut

```json
"statut": ["8. Terminé", "9. Abandonné"]
```

Ce sont les statuts **terminaux**. Note : contrairement à `related-tasks`, `5. En pause` n'est pas exclu ici — un projet en pause est toujours un projet actif à surveiller.

### Tags exclus par défaut

```json
"tags": ["archived"]
```

## Paramètres

| Paramètre | Type | Requis | Sens |
|---|---|---|---|
| `statut` | `string` | non | Filtre exact sur un statut (ex: `"3. En cours"`). Absent → tous les statuts non exclus. |

Exemples :
```python
mcp.get_active_projects()                  # tous les projets actifs
mcp.get_active_projects(statut="3. En cours")  # uniquement les "En cours"
```

> **Implémentation du filtre `statut`** : la valeur passée à `get_active_projects(statut=…)` est appliquée par le `QueryEngine` Python directement (lecture de `params.get('statut')`), **pas** via une clé du descripteur. Une ancienne clé `statut_filter: "{{statut}}"` a existé dans le bloc `filter` du `.query.json` — elle était inerte (dead key non lue par le moteur) et a été retirée le 2026-05-25.

## Scan

Dossier parcouru : `pages/` uniquement (les projets n'ont pas leur place dans `journals/`).

## Sortie

Champs retournés par note : `name`, `path`, `statut`, `relations`.

Groupée par `statut`, triée par préfixe numérique du statut (`1.`, `2.`, …) :
```json
{
  "3. En cours": [
    { "name": "MonProjet",
      "path": "pages/MonProjet.md",
      "statut": "3. En cours",
      "relations": ["[[Client A]]", "[[Salle de bain]]"] }
  ],
  "5. En pause": [ ... ]
}
```

## Convention frontmatter attendue

```yaml
---
type: Projet
statut: 3. En cours
relations:
  - "[[Client A]]"
  - "[[Salle de bain]]"
tags: []
---
```

Le champ `relations` peut être absent — il sera retourné comme `[]`.

## Limitations connues

1. **Statuts exclus codés en dur** : `8. Terminé` et `9. Abandonné` sont listés dans le descripteur. Si un nouveau statut terminal apparaît (ex: `10. Annulé`), penser à l'ajouter.

2. **Pas de filtre sur les dates** : un projet `3. En cours` sans activité depuis 6 mois remonte au même titre qu'un projet actif. Croisement à faire avec `overdue-tasks` ou un script "projets stagnants" si besoin.

3. **`type: Projet` sensible à la casse et à l'orthographe** : `type: projet` ou `type: Project` ne matchent pas. Aligné avec la convention vault.
