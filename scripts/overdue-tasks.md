---
type: doc-script
descriptor: "[[overdue-tasks.query.json]]"
---

# `overdue-tasks` — README

Descripteur pour le moteur `obsidian-mcp` (Python), invoqué via `get_overdue_tasks(types?)`.

## Objectif

Lister toutes les tâches ouvertes dont l'échéance, la date prévue ou la date de début est **passée ou atteinte** (≤ aujourd'hui). Cible les workflows GTD/Obsidian-Tasks où chaque tâche porte une ou plusieurs dates emoji.

## Conventions de date

Trois types de dates, identifiés par emoji :

| Type | Emoji | Sens |
|---|---|---|
| `due` | 📅 | Date d'échéance (deadline ferme) |
| `scheduled` | ⏳ | Date prévue de réalisation (objectif souple) |
| `start` | 🛫 | Date à partir de laquelle la tâche devient actionnable |

## Formats de date supportés

Pour chaque emoji, deux formats sont reconnus :

- **Plain ISO** : `📅 2026-05-24` ou `📅 2026.05.24`
- **Wikilink** : `📅 [[2026.05.24]]` (lien vers une note journal)

Exemples valides dans une tâche :
```
- [ ] Payer la facture 📅 2026-05-24
- [ ] Réviser le draft ⏳ [[2026.05.30]]
- [ ] Commencer la doc 🛫 2026.06.01
- [ ] Tâche multi-dates 🛫 2026-05-20 📅 2026-05-25
```

## Logique du filtre

Une tâche est retournée si **au moins une** de ses dates emoji satisfait :
```
date <= aujourd'hui
```

L'opérateur (`<=`) et la référence (`today`) sont déclarés dans le descripteur :
```json
"date_conditions": {
  "due":       { "emoji": "📅", "operator": "<=", "value": "today" },
  "scheduled": { "emoji": "⏳", "operator": "<=", "value": "today" },
  "start":     { "emoji": "🛫", "operator": "<=", "value": "today" }
}
```

## Paramètres

| Paramètre | Type | Défaut | Sens |
|---|---|---|---|
| `types` | `array<"due"\|"scheduled"\|"start">` | `["due", "scheduled", "start"]` | Sous-ensemble de types de dates à vérifier |

Pour ne récupérer que les tâches en retard d'échéance ferme :
```python
mcp.get_overdue_tasks(types=["due"])
```

## Scan

Dossiers parcourus : `journals/`, `pages/` (fichiers `*.md`).

## Sortie

Groupée par `date_type`, puis par fichier source :
```json
{
  "due": {
    "pages/MonProjet.md": [
      { "line": "- [ ] Payer la facture 📅 2026-05-24",
        "date": "2026-05-24",
        "source": "pages/MonProjet.md" }
    ]
  },
  "scheduled": { ... },
  "start": { ... }
}
```

## Limitations connues

1. **Pas d'exclusion par statut/tag** : contrairement à `related-tasks`, ce descripteur ne déclare pas de bloc `exclude`. Une tâche en retard remonte même si la page parente est `8. Terminé` ou taguée `#archived`. À ajouter si besoin.

2. **Pas de support pour les dates sans emoji** : Obsidian-Tasks supporte aussi le format `due:2026-05-24` sans emoji ; non géré ici.

3. **Aucun distinct entre "atteinte aujourd'hui" et "en retard"** : un `📅 2026-05-25` aujourd'hui-même est traité comme un `📅 2026-04-01` en retard de plusieurs semaines. À distinguer côté affichage si besoin.
