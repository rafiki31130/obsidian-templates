Test sync Tell [[2026-05-31]]
# Conventions du vault Obsidian

> Document de référence. Toute écriture manuelle ou automatisée (MCP, scripts) doit respecter ces conventions.
> Mis à jour : 2026-11-16.

---
## Structure du vault

```
vault/
├── pages/       ← notes libres, projets, documentations
├── journals/    ← daily notes (YYYY-MM-DD.md)
├── fleeting/    ← notes éphémères (FLT-YYYY.MM.DDThh.mm.ss.md)
├── templates/   ← templates Obsidian (lecture seule)
├── templater/   ← scripts Templater (lecture seule)
├── properties/  ← valeurs autorisées par propriété (lecture seule)
└── resources/   ← vues globales Tasks, Bases (lecture seule)
```

### Dossier `pages/`

Toutes les notes libres et projets. Pas de sous-dossiers obligatoires — la hiérarchie est exprimée par convention de nommage ou frontmatter.

### Dossier `journals/`

Daily notes uniquement. Nommage strict : `YYYY-MM-DD.md`. **Pas de frontmatter** dans les journals — le dossier les identifie.

### Dossier `fleeting/`

Notes éphémères — captures rapides, idées, fragments à trier plus tard. Nommage strict : `FLT-YYYY.MM.DDThh.mm.ss.md` (timestamp pour garantir l'unicité). Création canonique via le tool MCP custom `create_fleeting_note(content, tags=[])` — frontmatter `aliases` + `tags`.

### Concept "inbox note"

**N'existe pas dans ce workflow.** Il n'y a pas de dossier inbox ni de note inbox. Les tâches rapides vont dans le journal du jour. Les notes libres vont dans `pages/`.

---

## Hiérarchie des notes

Deux conventions équivalentes (choisir l'une ou l'autre par note) :

**Convention de nommage :**
```
Parent @ Enfant
Maison @ Cuisine @ Crédence
MCP Obsidian @ Phase 4 MVP
```

**Frontmatter :**
```yaml
parent: "[[Nom du parent]]"
```

La base `🛠️Projets.base` affiche tous les projets groupés par statut. La vue `pages/` du vault et les scripts `child-pages.js` / `related-projects.js` exploitent cette hiérarchie.

### Créer une page enfant sans `Parent @` dans son titre

Depuis la note parente, en mode édition, lancer **Templater: Open insert template modal**, puis choisir `Bloc-CreateChildPage`. On peut aussi associer un raccourci à la commande d’insertion de ce modèle dans les réglages Templater. Ne pas utiliser la commande de création de note à partir du modèle : le lanceur s’exécute dans la note parente et crée lui-même la note enfant.

1. Saisir le titre de la note enfant. Échap ou un titre vide annule la création.
2. Choisir le type. Échap crée la note enfant sans type, comme dans le sélecteur habituel.
3. La note s’ouvre avec la disposition de `Page-DynHierarchy` et un `parent:` au format `[[Nom de la note parente.md]]`, sans chemin de dossier. Le titre reste celui saisi ; pour Log et Meeting, il devient par exemple `2026-11-19 14h05 - Point d’équipe`. Un titre déjà horodaté n’est pas préfixé une seconde fois.

Le lanceur ne rajoute rien au texte de la note parente. `Bloc-ChildPager` (lien `Parent @ Enfant`) et `Ctrl+N` ne changent pas.

---

## Modèle de tâches

### Lieu de création par défaut

**Toujours dans le journal du jour** : `journals/YYYY-MM-DD.md`, sous le titre `## Tasks`, via le bouton `button-quicktask`. Jamais dans la page projet directement.

### Format minimal obligatoire

```markdown
- [ ] #Todo description de la tâche
```

### Tags de priorité

| Tag | Sens | Limite |
|-----|------|--------|
| `#BigThree` | Priorité absolue du jour | ≤ 3 par jour |
| `#Next` | Important, pas urgent — à faire quand possible | ~10 max |

### Dates (obligatoirement en fin de ligne)

> **Important** : les dates placées ailleurs que **en fin de ligne** causent un bug d'affichage dans le plugin Tasks. Toujours les mettre après la description et les liens.

| Format | Signification |
|--------|---------------|
| `📅 YYYY-MM-DD` | Due date (échéance) |
| `⏳ YYYY-MM-DD` | Scheduled date (planifiée) |

### Lien projet (si applicable)

Ajouter `[[nom-du-projet]]` si la tâche est liée à une note/projet. Particulièrement important pour les projets.

### Exemple complet

```markdown
- [ ] #Todo #Next Description de la tâche [[nom-du-projet]] 📅 2026-05-30
- [ ] #Todo #BigThree Tâche prioritaire du jour ⏳ 2026-05-24 📅 2026-05-25
- [ ] #Todo Tâche simple sans échéance
```

### Statuts de tâche

| Symbole | Statut | Signification |
|---------|--------|---------------|
| `[ ]` | Open | À faire |
| `[x]` | Done | Terminée |
| `[-]` | Cancelled | Annulée |
| `[f]` | Blocked | Bloquée par dépendance |
| `[>]` | Delegated | Déléguée à quelqu'un |
| `[I]` | Idea | Idée (pas encore une tâche) |

---

## Distinction tâches vs checklists

### Tâche (`- [ ] #Todo`)

Un **élément de rappel** : quelque chose qui **doit** être fait, sous conditions (échéance, priorité, suivi). Visible dans `✅Tasks.md` et filtrable dans toutes les vues Tasks.

```markdown
- [ ] #Todo #Next Acheter matériel pour le projet [[Projet XYZ]] 📅 2026-06-01
```

### Checklist locale (sans `#Todo`)

Une **liste de travail contextuelle** : étapes d'un projet, idées à explorer, liste de courses. N'apparaît pas dans les vues Tasks globales. Reste locale à la note.

```markdown
- [ ] Étape 1 du processus
- [ ] Étape 2 du processus
- [x] Étape déjà réalisée
```

### Checklists thématiques avec `#list/`

Pour les checklists réutilisables ou distribuées sur plusieurs notes, utiliser le tag `#list/Contexte`. Permet de regrouper toutes les checklists d'un même contexte depuis différentes pages.

```markdown
- [ ] Sac de couchage #list/MatosCamping
- [ ] Gourde #list/MatosCamping
- [ ] Perceuse #list/LeroyMerlin
- [ ] Chevilles 8mm #list/LeroyMerlin
```

Rechercher `#list/LeroyMerlin` dans le vault affiche toutes les listes de ce contexte, même réparties sur plusieurs notes de projets différents.

---

## Frontmatter

**Principe** : tout type de page est créé à partir d'un template (via le bouton de sélection de type disponible dans toute page classique, ou directement via Templater). Les templates sont la source de vérité pour le frontmatter — ne pas créer de frontmatter manuellement.

Les **valeurs autorisées** par propriété sont documentées dans `properties/`. Ne pas dupliquer ces valeurs ici : consulter les fichiers sous `properties/` pour connaître les valeurs valides par champ.

### Note projet (`type: Projet`)

Toujours créer via le template `type_Props-Projet.md` (bouton de sélection de type ou commande Templater). Le frontmatter est pré-rempli par le template.

Champs principaux : `type`, `statut`, `relations`, `tags`. Valeurs autorisées → `properties/type/Projet.md` et `properties/statut/`.

### Note classique (pages libres)

**Pas de frontmatter obligatoire.** Ajouter uniquement ce qui est utile : `tags`, `relations`, titre personnalisé. Le template `Page-DynHierarchy` est appliqué par défaut par Templater à toute nouvelle page classique. Il propose systématiquement le choix du type (même action que le bouton `button-applytype` / `Script_ApplyType`) : les propriétés du template `type_*` choisi sont fusionnées avec `parent:` dans un frontmatter unique. Échap = page sans type.

### Journal (`journals/YYYY-MM-DD.md`)

**Aucun frontmatter.** Le dossier `journals/` identifie suffisamment le type.

### Archivage

Appliquer le template `Props-Archived` (ajoute `tags: [archived]` en frontmatter). Cela masque la note des vues actives sans la supprimer.

### Rattachement au journal

Bouton `button-addjournal` (« Add to journal », présent sur les pages enfant via `Page-DynHierarchy`) : applique le template `Props-AddToJournal`, qui ajoute `date: "[[YYYY-MM-DD]]"` (date du jour) en frontmatter.

### Templates de type (`type_*`)

Un template `templates/type_<Type>.md` par type ; sa fiche `properties/type/<Type>.md` décrit les mêmes propriétés et le même corps (les deux restent alignés). Principe : **structurer juste assez**. Chaque type ne porte que les propriétés qui servent une vue ou une recherche :

- `topic:` (liens vers des Topics) sur presque tous les types ;
- `parent:` lien facultatif vers le projet, dossier logique, système ou application de rattachement. Proposé sur Changement, Deadline, Documentation, EntretienTech, Etude, Hub, Incident, Learning, Log, Meeting, Memento, Procedure, Projet, Reference, Scratch et les quatre types Splunk. Les types autonomes (Briefing, Concepts, Journal, Pensées, Person, Recette et Topic) ne proposent pas ce champ par défaut ; il peut être renseigné si la note est explicitement créée comme enfant. La création ordinaire ne reprend jamais automatiquement la page active ; elle conserve la convention `Parent @ Enfant`.
- `date: "[[YYYY-MM-DD]]"` (lien vers le journal du jour) sur les types datés : Briefing, Changement, EntretienTech, Incident, Journal, Log, Meeting, Pensées, Scratch ;
- `person:` (liens) seulement là où il y a des interlocuteurs : Meeting, EntretienTech (et Person, qui se référence elle-même) ;
- propriétés propres : Deadline (`next_due`, `recurrence`, `notice_days`, `action`), Projet (`statut`, `relations`), Recette (`DB_CUI_REC_*`), Splunk* (`external reference`), Learning (`rating` de 1 à 7), Person (`Anniversaire`).

Les templates `type_*` sont rendus par Templater (`tp.file.include`) avant fusion : ils peuvent donc contenir du code Templater. Dans le parcours ordinaire, `type_Log` et `type_Meeting` renomment automatiquement la page en `YYYY-MM-DD HHhmm - `, sans prompt de nommage ni reprise de l'ancien titre ; le suffixe reste vide, à compléter manuellement. Le parent éventuel du titre est conservé en propriété et une page déjà horodatée n'est pas renommée, même si son suffixe est encore vide. `Bloc-CreateChildPage` crée directement la note avec le titre saisi après l’horodatage. Ces templates s'appliquent via *Définir le type* ou à la création de page, pas via l'insertion de modèle du plugin de base.

Le corps éventuel du template (sections à remplir, vues intégrées) est placé par `Page-DynHierarchy` en bas de page, avant `## Notes`, curseur sous la première section à remplir ; `Script_ApplyType` l'insère au curseur.

Le script Templater `Script_GenerateTypeTemplates` crée `type_<Type>.md` pour chaque valeur de `type:` du vault qui n'a pas encore de template (aucun template existant n'est écrasé), dans le dossier du plugin de base « Modèles » (`templates/`). Contenu de départ minimal, à personnaliser : `type` (text) et `topic` (liens, multitext).

### Vues intégrées (Bases)

Comme dans le système de Kepano, les pages affichent les notes connexes par des vues Bases intégrées. Une vue précise s'intègre avec `![[Fichier.base#Nom de la vue]]` ; sans `#`, c'est la première vue. Dans ces vues, `this` désigne la page qui intègre la base.

| Base | Vue | Contenu | Intégrée dans |
|------|-----|---------|---------------|
| `Relations.base` | *All* (défaut) | notes qui pointent vers la page par `parent`, `author`, `relations`, `topic`, `person` ou `date`, groupées par type | Topic, Hub, Person (Liens), journal du jour (`Page-Journal`) |
| `Relations.base` | *Meetings* | Meetings et EntretienTech liés, par date | Person (Rencontres) |
| `Relations.base` | *Projects*, *Ops*, *Knowledge* | projets ; incidents, changements, logs ; notes de connaissance | au choix, via le sélecteur de vue de l'intégration |
| `Deadlines.base` | *Topic* | échéances dont `topic:` contient la page, avec jours restants | Topic (Échéances) |
| `Splunk.base` | *Application* | fiches Splunk dont `parent:` est la page | SplunkApplication |
| `Splunk.base` | *Related* | fiches Splunk liées à la page dans un sens ou dans l'autre | SplunkDashboard, SplunkLookup, SplunkSavedsearch |
| `Splunk.base` | *All* | toutes les fiches Splunk, par type | — |

### Pages Topic (`Script_CreateTopicPages`)

Le script Templater `Script_CreateTopicPages` relève toutes les valeurs de la propriété `topic:` du vault, puis :
- crée dans `pages/` une page `type: Topic` (template `type_Topic`) pour chaque topic sans page. Un topic dont le lien `[[Topic]]` se résout déjà vers un fichier, où qu'il soit, n'est pas recréé ;
- convertit en liens les valeurs écrites en texte brut (`topic: Vehicules` → `topic: "[[Vehicules]]"`).

Aucune page existante n'est écrasée ; les dossiers de templates sont ignorés.

---

## Conventions MCP / usage LLM

Cette section documente les comportements et contraintes spécifiques à l'utilisation du MCP `obsidian-vault` (plugin Local REST API v4.1.0, serveur MCP HTTP sur port 27125).

### Règle générale

Toute note créée ou modifiée via MCP **doit respecter les conventions de ce fichier** : frontmatter correct, tâches dans le journal, liens projets, dates en fin de ligne.

### Sync LiveSync après écriture

Le plugin LiveSync ne détecte pas automatiquement les fichiers créés via l'API REST (inotify non déclenché depuis l'extérieur du container Docker). Après toute écriture MCP, déclencher la sync manuellement :

```
command_execute: obsidian-livesync:livesync-scan-files
command_execute: obsidian-livesync:livesync-replicate
```

### Zone d'écriture MCP

| Dossier | Opérations autorisées |
|---------|----------------------|
| `pages/` | Créer, lire, modifier des notes et projets |
| `journals/` | Append uniquement (journal du jour) |
| `resources/` | Lecture ; modification des bases si nécessaire |
| Attachments | Écriture possible |
| Notes fleeting | Lecture et retouches possibles |
| `obsidian-templates/` | Lecture/écriture (sync git bidirectionnel — à configurer) |

### Arguments MCP corrects (plugin v4.1.0)

Différences par rapport à l'API REST standard :

**`vault_patch`**
```json
{
  "targetType": "heading",        // "heading", "block", ou "frontmatter"
  "target": "## Texte du titre",  // texte exact du heading cible
  "operation": "append",          // "replace", "prepend", ou "append"
  "content": "contenu à insérer"
}
```
Pas de `oldContent`/`newContent`.

> ⚠️ **`targetType: heading`, `operation: prepend`/`append`** : **non validé en v4.1.0** — comportement non fiable (insertion systématique en début de document, indépendamment du heading visé). Pour les insertions sous un heading, passer par le MCP custom (`create_task`, `log_to_daily`) qui applique un pattern read-modify-write côté serveur. `vault_patch` reste utile pour les autres usages (`targetType: frontmatter`, `targetType: block`).

**`vault_move`**
```json
{ "destination": "pages/nouveau-nom.md" }
```
Pas de `newPath`.

**`search_query`**
Le champ `query` est un **objet JsonLogic**, pas une string :
```json
{ "query": { ">=": [{"var": "stat.size"}, 1] } }
```

**`command_execute`**
```json
{ "commandId": "obsidian-livesync:livesync-scan-files" }
```
Arg obligatoire : `commandId` (pas `command`).

**`vault_get_document_map`** : non supporté (args inconnus en v4.1.0). Ne pas utiliser.

**`search_simple`** : fonctionne normalement avec une string.

### Créer une tâche via MCP

**Voie canonique** : tool `create_task` du **MCP custom `obsidian-mcp`** (port 27200, entrée `obsidian-custom` dans `~/.claude.json`). Il insère sous `### Overdued` du journal du jour avec un pattern read-modify-write fiable (le `vault_patch` natif avec `heading prepend` ciblant `### Overdued` insérait en début de document — voir ⚠️ ci-dessus).

Appel :

```json
{
  "description": "Texte de la tâche",
  "project": "nom-du-projet",         // optionnel — ajoute [[nom-du-projet]]
  "due_date": "YYYY-MM-DD",           // optionnel — ajoute 📅 YYYY-MM-DD en fin de ligne
  "tags": ["#Next"]                   // optionnel — #Todo est ajouté automatiquement
}
```

Structure cible du bloc `## Tasks` dans le journal :

```md
## Tasks
- [i] [[✅Tasks|All tasks]] / [[🛠️Projets.base|All projects]]
`button-quicktask`

### Overdued
- [ ] #Todo #Next Description [[lien-projet]] 📅 YYYY-MM-DD   ← inséré ici
### Next
```

Puis déclencher LiveSync (voir ci-dessus).

### Créer une note projet via MCP

**Ne jamais créer une note projet en écrivant le frontmatter manuellement.** Toujours utiliser le template `type_Props-Projet.md` (dossier `templates/`).

Depuis l'interface Obsidian, utiliser le bouton de sélection de type (disponible sur toute page classique) ou lancer la commande Templater. Si une création via MCP est nécessaire, créer d'abord un fichier vide, puis déclencher l'application du template via `command_execute`.

---

## Ressources clés

| Fichier | Rôle |
|---------|------|
| `resources/✅Tasks.md` | Vue globale de toutes les tâches `#Todo` |
| `resources/🛠️Projets.base` | Base Obsidian listant tous les projets par statut |
| `resources/📥Inbox.md` | *(non utilisé dans ce workflow)* |
| `templates/type_Props-Projet.md` | Template frontmatter projet |
| `templates/Props-Archived.md` | Template archivage |
| `templates/Props-AddToJournal.md` | Template « Add to journal » (`date:` du jour) |
| `templater/Script_GenerateTypeTemplates.md` | Génère les templates `type_*` manquants |
| `resources/Relations.base` | Notes connexes d'une page (vues *All*, *Projects*, *Meetings*, *Ops*, *Knowledge*) |
| `resources/Deadlines.base` | Échéances (vues *Upcomming*, *All*, *Topic*) |
| `resources/Splunk.base` | Fiches Splunk (vues *All*, *Application*, *Related*) |
| `templater/Script_CreateTopicPages.md` | Crée les pages Topic manquantes et convertit `topic:` en liens |
| `templates/Page-Journal.md` | Template journal quotidien |
| `properties/statut/` | Fichiers de définition des valeurs de statut |
| `properties/type/` | Fiches de définition des valeurs de `type` (une par type) |
