# CLAUDE.md — Charte d'usage du repo `obsidian-git`

> Destinataire : **toute instance de Claude** qui clone ou ouvre ce dépôt.
> Ce fichier est la **source de vérité** sur la structure, les zones d'écriture et le workflow git.
> En cas de divergence avec une mémoire locale, **ce fichier prévaut** (il évolue avec le repo).

---

## 1. Nature du repo

`christian/obsidian-git` est un **vault Obsidian multi-documentation** :

- Christian l'édite via Obsidian sur Ragnarok (Windows) — sync via plugin obsidian-git + LiveSync (CouchDB).
- Les instances Claude l'éditent via CLI (Markdown brut + git classique).

La racine du repo héberge **deux familles de contenu** :

| Famille | Emplacement | Qui écrit | Statut pour Claude |
| --- | --- | --- | --- |
| Documentations partagées | `documentations/XX-Nom/` | Christian **et** Claude | ✅ Zone d'écriture |
| Plomberie Obsidian | Dossiers racine en `minuscules` (sauf `documentations/`) | Christian uniquement (via l'app) | ⛔ **Interdit** |
| Méta-docs du repo | `README.md`, `CLAUDE.md`, `.gitignore` à la racine | Christian **et** Claude | ✅ Zone d'écriture (avec discussion pour changements structurels) |

---

## 2. ⛔ Zones interdites (règle absolue)

**Ne jamais éditer, créer, supprimer, ni `git add` quoi que ce soit dans :**

- `.obsidian/` — config Obsidian + plugins installés
- `properties/` — définitions de propriétés du vault
- `resources/` — ressources partagées
- `scripts/` — scripts Dataview / JS embarqués
- `templater/` — templates Templater
- `templates/` — templates Obsidian natifs

**Règle généralisée** : **tout dossier racine en minuscules est interdit**, à **une seule exception** : `documentations/` (cf. §3).

**Pourquoi** : ces dossiers sont gérés par Christian via l'app Obsidian sur Ragnarok. Toute modification CLI :
- déclenche des conflits LiveSync (CouchDB ↔ Obsidian) ;
- casse ses workflows (templates, vues Dataview, propriétés des notes) ;
- introduit des fichiers que Christian n'a pas créés et qui polluent son interface.

**Exception encadrée** : si Christian te demande explicitement de modifier l'un de ces dossiers (ex. « ajoute ce template Templater »), tu peux le faire **dans le strict périmètre de cette demande**. Hors de ce cadre, intouchable.

Si tu repères un bug ou une amélioration souhaitable dans cette plomberie sans qu'on te l'ait demandé, **écris une note dans la doc parc info** (`documentations/10-Parc Informatique/40-Pieges-connus/` ou `90-Meta/`) plutôt que d'éditer toi-même.

---

## 3. ✅ Zones d'écriture

### `documentations/` — zone partagée principale

Tu peux lire, créer et modifier librement tout fichier sous `documentations/XX-Nom/`. C'est la **seule** arborescence dédiée à la collaboration sur la doc.

À l'intérieur d'une documentation donnée, **suis ses propres conventions** : lis son `README.md` racine et son éventuel `00-Commencer-ici/` avant d'écrire. Chaque documentation a sa propre structure, son propre style de frontmatter et ses propres règles.

### Méta-docs racine

Tu peux modifier les fichiers méta à la racine du repo : ce `CLAUDE.md`, le `README.md` racine, le `.gitignore`. Les **changements de structure ou de convention** doivent être discutés avec Christian avant d'être commités.

---

## 4. Convention de nommage des nouvelles documentations

Pour ajouter un nouveau domaine de documentation (sur demande explicite de Christian) :

1. Créer un dossier `documentations/XX-Nom/` :
   - **Préfixe numérique** : incréments de 10. Pris : `10-Parc Informatique`. Réserver `00-` pour de la doc transverse au vault entier.
   - **Nom** : majuscule initiale après le préfixe. Espaces autorisés (mais penser à quoter en shell).
2. Y placer **obligatoirement** un `README.md` qui sert d'index.
3. Idéalement, prévoir un `00-Commencer-ici/` interne avec les conventions propres à cette doc.
4. Mettre à jour le tableau « Documentations hébergées » du `README.md` racine.

---

## 5. Workflow git obligatoire

### Au début de chaque session impliquant le repo

```bash
cd <chemin-vers-clone>
git pull --ff-only            # ou --rebase si divergence avec Christian
```

### Pendant le travail

- Édite uniquement en Markdown sous `documentations/` ou dans les méta-docs racine.
- Suis les conventions du dossier de doc visé (frontmatter, wiki-links, sections type, changelog…).

### À la fin

```bash
# Toujours add CIBLÉ — jamais "git add -A" sans relire :
# Obsidian peut avoir touché des dossiers minuscules en parallèle
# (LiveSync, plugin obsidian-git côté Ragnarok), tu risques d'inclure
# leurs modifications dans ton commit, créant des conflits.
git status                                          # relire scrupuleusement
git add <fichiers explicites>                       # paths exacts uniquement
git commit -m "<scope>: <description concise>"
git push origin main
```

### Identité git

Configure `user.name` et `user.email` propres à ton instance pour distinguer tes commits de ceux de Christian (qui commit comme `rafiki31130 <github@anjuere.eu>` côté Ragnarok). Cette config relève de la mémoire locale de chaque instance Claude, pas de ce repo.

### Historique linéaire

En cas de divergence (Christian a poussé pendant ton travail) : `git pull --rebase origin main` plutôt que `git pull` (qui crée un merge commit). Si conflit Markdown, garder le contenu de Christian par défaut — il édite plus souvent et est plus susceptible d'avoir la version à jour.

---

## 6. Authentification

Détails techniques (URL SSH, clé, comptes Forgejo, génération de tokens API) dans la fiche service vGit :

→ [`documentations/10-Parc Informatique/20-Services/20-git-interne.md`](documentations/10-Parc%20Informatique/20-Services/20-git-interne.md)

Aucun secret ne doit jamais être commité dans ce repo (cf. règle universelle « no credentials »).

---

## 7. Documentation au fil de l'eau (obligation)

Toute intervention non triviale (déploiement, changement de config, nouveau service, dépannage avec root cause identifiée, découverte d'un piège) **doit** se conclure par une mise à jour de la documentation pertinente, dans la même session — pas « plus tard ».

- Nouvelle VM/service → fiche dans `documentations/<doc>/20-Services/`
- Piège résolu → fiche dans `documentations/<doc>/40-Pieges-connus/`
- Procédure répétable → fiche dans `documentations/<doc>/30-Procedures/`
- Entrée datée dans `documentations/<doc>/90-Meta/90-changelog.md` (antichronologique)

L'oubli est garanti si on attend la « fin du projet ». Documenter immédiatement.
