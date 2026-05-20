---
title: obsidian-git — Vault de documentation partagé
audience: both
last_updated: 2026-05-17
tags: [accueil, index, racine]
---

# obsidian-git

> **Tu es une instance de Claude qui découvre ce repo ?** Lis [`CLAUDE.md`](./CLAUDE.md) **avant** toute écriture.

Ce dépôt est un **vault Obsidian multi-documentation** partagé entre :

- **Christian** — qui édite via Obsidian sur Ragnarok (Windows), synchronisé via le plugin **obsidian-git** + LiveSync (CouchDB).
- **Les instances Claude** — qui éditent via CLI (Markdown brut + git).

Toute la doc partagée vit sous **`documentations/XX-Nom/`**. Tout le reste à la racine (dossiers en minuscules) est de la **plomberie Obsidian** gérée exclusivement par Christian.

## Arborescence racine

```
obsidian-git/
├── README.md                  ← tu es ici
├── CLAUDE.md                  ← charte pour les instances Claude (LIRE EN PREMIER)
├── .gitignore
│
├── documentations/            ← ✅ zone d'écriture partagée
│   └── 10-Parc Informatique/  ← doc parc info (infra, services, procédures, pièges)
│       └── README.md          →  index propre de cette doc
│   (futures docs ajoutées ici : 20-Nom, 30-Nom, …)
│
├── .obsidian/                 ← config Obsidian + plugins                ⛔ NE PAS TOUCHER
├── properties/                ← définitions de propriétés Obsidian       ⛔ NE PAS TOUCHER
├── resources/                 ← ressources partagées du vault            ⛔ NE PAS TOUCHER
├── scripts/                   ← scripts Dataview / JS                    ⛔ NE PAS TOUCHER
├── templater/                 ← templates Templater                      ⛔ NE PAS TOUCHER
└── templates/                 ← templates Obsidian natifs                ⛔ NE PAS TOUCHER
```

**Règle universelle** : tout dossier racine en **minuscules** est de la plomberie Obsidian → géré par Christian via l'app, intouchable en CLI. **Seule exception** : `documentations/`, qui est la zone partagée.

## Documentations hébergées

| Dossier | Sujet | Index |
| --- | --- | --- |
| `documentations/10-Parc Informatique/` | Infrastructure de Christian (Proxmox, pfSense, services, procédures, pièges connus) | [README](documentations/10-Parc%20Informatique/README.md) |

> Pour ajouter une nouvelle documentation : créer un dossier `documentations/XX-Nom` avec préfixe numérique libre (incréments de 10), et un `README.md` interne. Voir `CLAUDE.md` §4.

## Pour Christian (édition côté Obsidian)

Aucun changement de workflow : ouvrir le vault dans Obsidian, éditer, le plugin obsidian-git pousse automatiquement. La racine du vault = la racine de ce repo.

## Pour les instances Claude (édition côté CLI)

Lire **[`CLAUDE.md`](./CLAUDE.md)** intégralement avant d'écrire. Résumé en deux phrases :

1. Tu n'écris **que** sous `documentations/XX-Nom/` (ou dans les méta-docs racine).
2. Tu ne touches **jamais** aux dossiers en minuscules (sauf `documentations/`) — ils appartiennent à Obsidian/Christian.
