Test sync Tell [[2026-05-31]]
# Conventions du vault Obsidian

> Document de référence. Toute écriture manuelle ou automatisée (MCP, scripts) doit respecter ces conventions.
> Mis à jour : 2026-11-26.

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

## Typage des BDD

Décision du 25/11/2026 — projet [[Nouvelle structure Projets]]. Cette section fait référence pour les objets migrés et remplace les anciens exemples de classification `BDD`, `gtd_type`, `DB_SRC_type` et `Recette` décrits dans les sections historiques ci-dessous. Les projets historiques `type: Projet` ne sont pas convertis implicitement ; leur reprise reste progressive.

### Identifiant unique

Le champ texte `type` contient `<PREFIXE>-<SousType>` : préfixe de **trois lettres majuscules**, tiret, sous-type en PascalCase sans accent. Il identifie à la fois la famille de BDD et l’objet. Exemples : `GTD-Projet`, `GTD-Etape`, `RCT-Recette`, `CPT-PosteBudgetaire`, `SRC-Livre`.

`type: BDD` n’est plus utilisé pour les objets migrés. `gtd_type` et `DB_SRC_type` sont supprimés des fiches, des modèles et des requêtes actives. Le type est une valeur unique ; un domaine `GTD-Domaine` peut aussi jouer le rôle de topic sans ajouter `type: Topic`.

| Type | Objet |
|---|---|
| `GTD-RaisonDetre` | raison detre |
| `GTD-Vision` | vision |
| `GTD-Objectif` | objectif |
| `GTD-Domaine` | domaine |
| `GTD-Projet` | projet |
| `GTD-Etape` | etape |
| `GTD-ProjetMonolithe` | projet monolithe |
| `GTD-Routine` | routine |
| `RCT-Recette` | recette |
| `CPT-BudgetAnnuel` | budget annuel |
| `CPT-PosteBudgetaire` | poste du budget mensuel |
| `CPT-FraisMensuels` | frais mensuels |
| `CPT-Charges` | Comptes.Charges |
| `CPT-Decomptes` | Comptes.Decomptes |
| `SRC-Livre` | livre |
| `SRC-Chapitre` | chapitre |
| `SRC-Article` | article |
| `SRC-ArticlePresse` | article-presse |
| `SRC-These` | these |
| `SRC-Rapport` | rapport |
| `SRC-Norme` | norme |
| `SRC-Document` | document |
| `SRC-SiteWeb` | site-web |
| `SRC-Billet` | billet |
| `SRC-Forum` | forum |
| `SRC-Film` | film |
| `SRC-Serie` | serie |
| `SRC-Documentaire` | documentaire |
| `SRC-Emission` | emission |
| `SRC-Video` | video |
| `SRC-Podcast` | podcast |
| `SRC-Audio` | audio |
| `SRC-Formation` | formation |
| `SRC-Cours` | cours |
| `SRC-Conference` | conference |
| `SRC-Entretien` | entretien |
| `SRC-Logiciel` | logiciel |
| `SRC-OeuvreArt` | oeuvre-art |
| `SRC-Autre` | autre |

Les propriétés métier sont conservées : liens `gtd_domaine`, `gtd_objectif`, `gtd_projet`, statuts `gtd_statut_*`, dates, auteurs, etc. Les catégories budgétaires sont désormais intégrées au champ `type` : `CPT-BudgetAnnuel`, `CPT-PosteBudgetaire` et `CPT-FraisMensuels`. L’ancien champ `DB_CTE_BDG_type` est retiré des fiches, modèles et requêtes ; aucune seconde classification de BDD n’est maintenue.

### Modèles et bases

Les modèles sont la source du frontmatter. Chaque sous-type de source possède un modèle complet `r_templates/templates/type_SRC-<SousType>.md` ; le choix d’un livre, article, cours, etc. se fait par le modèle sélectionné. `Fiche-Source.md` reste un modèle générique de compatibilité, classé `SRC-Autre`.

Les bases sont centralisées sous `r_templates/resources/bases/` et filtrent la classification sur `type`, indépendamment de l’emplacement physique des fiches. La base Sources sélectionne le préfixe `SRC-`, puis ses vues filtrent les types précis. Les projets monolithes restent inclus dans le portefeuille des projets et le sprint des étapes.

Chaque dossier de données possède une note Markdown du même nom, qui intègre la base correspondante. Cette note de dossier ne porte pas le type des données et n’apparaît pas dans les tableaux. Les chemins actuels choisis par l’utilisateur sont conservés ; un projet et ses étapes peuvent être rangés ensemble dans un dossier de projet sous `pages/`.

### Règles GTD et saisie

- Domaines et objectifs sont des liens fonctionnels, sans hiérarchie parent-enfant obligatoire.
- Un projet ou projet monolithe doit avoir au moins un domaine **ou** un objectif ; les deux sont autorisés. La revue signale l’absence des deux.
- Une étape peut être partagée entre plusieurs projets ; le lien `gtd_projet` accepte une liste.
- Une routine (`GTD-Routine`) tient le niveau d’un domaine : `gtd_domaine` obligatoire, `gtd_objectif` facultatif, `gtd_statut_routine`. Elle ne porte ni fréquence, ni échéance, ni prédécesseurs, ni statut de projet ou d’étape : sa fréquence est celle de sa tâche récurrente. Le projet ou monolithe qui l’installe se référence dans `gtd_projet` ; une routine n’est pas une étape et ne compte ni au Sprint ni dans la charge. Elle porte sa tâche récurrente `#Todo 🔁` dans sa fiche (exception au journal du jour). Sa revue a lieu chaque mois au Portefeuille, sans propriété de date ni de verdict : la décision se consigne dans le journal des revues de la fiche.
- La règle du rattachement GTD unique vise les notes ordinaires, pas les liens propres aux objets GTD.
- Les critères de fin restent en texte et les dates ne changent pas. Les statuts modernes suivent le format numéro.description_snake_case défini ci-dessous.
- Le type natif Obsidian de la propriété `type` est Texte, configuré une seule fois pour le vault.
- Le corps d’une page commence par une ligne vide, après le frontmatter s’il existe. Chaque titre garde une ligne vide avant lui et une ligne prête à saisir après lui (vide, liste ou case à cocher suivant le cas).

La compatibilité des outils MCP avec ce schéma reste à adapter ; leur ancien contrat ne doit pas recréer les champs de classification supprimés.

## Frontmatter

**Principe** : tout type de page est créé à partir d'un template (via le bouton de sélection de type disponible dans toute page classique, ou directement via Templater). Les templates sont la source de vérité pour le frontmatter — ne pas créer de frontmatter manuellement.

Les **valeurs autorisées** des propriétés historiques sont documentées dans `properties/`. Pour les familles de BDD codifiées, les définitions et valeurs fixes sont centralisées par schéma dans `r_templates/resources/bases_properties/`. Ne pas dupliquer ces valeurs ici : consulter les fichiers sous `properties/` pour connaître les valeurs valides par champ.

### Note projet historique (`type: Projet`)

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

## Pages de pilotage GTD

Les pages sont regroupées dans `r_templates/resources/GTD - Pilotage/` ; la note `GTD - Pilotage.md` sert de note de dossier et de point d’entrée. Chaque page a un rôle unique : [[GTD - OnePager]] pour lire, [[GTD - Sprint]] et [[GTD - Portefeuille]] pour décider, [[GTD - Contrôles]] pour le détail des signalements. [[GTD - Portefeuille]] contient le kanban des projets (revue mensuelle), [[GTD - Sprint]] le kanban des étapes et monolithes liés à un projet actif (revue hebdomadaire). Le regroupement est fait sur les propriétés de statut éditables afin que le déplacement d’une carte mette à jour la fiche.

Le Portefeuille intègre aussi la vue `Revue mensuelle` de `GTD.Routines.base` (routines non abandonnées, groupées par domaine). Les contrôles des routines (domaine, tâche récurrente ouverte) figurent dans [[GTD - Contrôles#Objectifs, domaines et routines]] ; une routine en essai ou active compte comme engagement de son domaine.

Les bases restent centralisées dans `r_templates/resources/bases/`. Les vues de tableau antérieures restent disponibles avec le suffixe « — tableau ». Les projets monolithes participent aux deux kanbans ; une étape partagée figure une seule fois au sprint et reste éligible si au moins un parent est actif.

Charge : un seul nombre, projets et monolithes engagés plus étapes en charge ; un monolithe compte une fois, comme projet. Seuil d’alerte unique, 10 par défaut, réglé par la propriété `seuil_charge_gtd` de `GTD - Pilotage.md` (mode d’emploi : [[GTD - Régler le seuil d'alerte]]). Les dépassements sont signalés ; aucune limite ni transition de statut n’est appliquée automatiquement.

[[GTD - Contrôles]] regroupe sur une seule page les quatre familles de signalements (projets, étapes, objectifs, domaines et routines, rattachements et statuts) et utilise la vue Dataview en lecture seule `r_templates/scripts/gtd-review.js`. Le typage repose sur `type`, les rattachements sur les liens GTD explicites, et les objets archivés sont exclus du travail actif. Le contrôle des liens utilise la résolution de liens d’Obsidian, y compris les étapes partagées. Les modèles et journaux ne sont pas considérés comme des données à contrôler.


## Fiches de propriétés des bases

Le catalogue est [[r_templates/resources/bases_properties/bases_properties|Schémas de propriétés]]. Organisation par **schéma général** : `Commun`, `GTD`, `CPT`, `RCT`, `SRC`. Une propriété est définie une seule fois dans son schéma ; les bases et modèles qui l’utilisent s’y réfèrent. Les champs génériques sont définis dans `Commun`. Les fiches de types des familles codifiées sont centralisées dans le catalogue du schéma, sans copie parallèle dans `properties/type/` ; les types historiques hors BDD restent dans leur registre existant.

Une propriété sans pages enfants est une fiche directe `<Schéma>/<propriété>.md`. Un dossier `<Schéma>/<propriété>/` avec une note du même nom n’existe que lorsqu’il contient des pages enfants de valeurs fixes prévues par le schéma (types d’objets, statuts, supports de source). Aucun dossier supplémentaire n’est créé pour une simple fiche feuille.

Un sous-dossier propre à une base ne doit être créé qu’en présence d’une véritable extension spécifique non couverte par le schéma général. Une variante de formule d’affichage se documente dans la fiche commune de cette formule et ne justifie pas plusieurs définitions de la même propriété.

**Confidentialité : ne jamais créer de pages de valeurs propres à l’utilisateur.** Cela couvre notamment les comptes, catégories personnelles, moyens de paiement, personnes, libellés et autres valeurs relevées dans les données. Ne pas les collecter pour produire des exemples, listes observées ou suggestions dans les ressources. Les définitions structurelles des champs sont conservées ; leurs valeurs privées restent uniquement dans les données et réglages concernés.

Les pages de valeurs autorisées reproduisent le modèle existant : propriété et valeur fixe dans le frontmatter, puis définition. Les formules et propriétés de fichier sont en lecture seule. Le typage natif Obsidian reste un réglage global du vault ; la documentation ne le modifie pas.


## Format des statuts modernes

Les propriétés de statut modernes suivent `^\d+\.(?<description>[a-z_]+)$` : numéro, point littéral, description en minuscules sans accent avec underscores entre les mots. Exemples : `2.actif`, `3.en_cours`, `1.a_consulter`. Les clés de propriété restent inchangées.

Cette convention s’applique aux statuts GTD, Sources et Recettes, dans les données, modèles, fiches de valeurs, vues, kanbans et contrôles. Les champs historiques `statut` et `status` (ancien workflow/Operon) ainsi que `r_templates/properties/statut/` restent inchangés. Les champs métier privés qui ne sont pas des propriétés de statut, comme l’état d’une charge, ne sont pas recodés par cette migration.

Le numéro 0 sert au cadrage agent en GTD ; les états ouverts peuvent utiliser 1 à 7 selon le workflow, 8 une réussite et 9 un abandon. Sources : `1.a_consulter`, `2.en_cours`, `3.reference`, `8.termine`, `9.abandonne`. Recettes : `1.a_tester`, `2.en_test`, `3.teste`, `8.valide`, `9.abandonne`. Routines : `1.en_essai`, `2.active`, `3.en_pause`, `9.abandonnee`. La distinction entre un essai en cours et un essai terminé est conservée.

Les définitions et noms des fiches de valeurs suivent le même format, au niveau de leur schéma partagé. Aucun catalogue de valeurs privées n’est créé.


## Cadrage et délégation aux agents

Projets : ajout de `0.cadrage_agent` et `4.delegation_agent`. Étapes : ajout de `0.cadrage_agent` et `5.delegation_agent`. Les valeurs sont définies une seule fois dans les propriétés du schéma GTD.

Les projets `2.actif` et `4.delegation_agent` comptent dans la charge et dans les liens parents actifs du Sprint. Les étapes `3.en_cours`, `5.delegation_agent`, `6.delegue` et `7.validation` comptent dans la charge. Un seul parent engagé suffit pour une étape partagée. Les états de cadrage 0 ne comptent pas dans la charge. Aucun statut de fiche existante n’est changé automatiquement.

Le dossier de pilotage est `r_templates/resources/GTD - Pilotage/`. Une seule ligne de liens dynamiques rappelle les projets engagés au-dessus du kanban Sprint et les objectifs actifs au-dessus du kanban Portefeuille. Ces rappels excluent les objets archivés et ne recopient aucune valeur utilisateur dans des fiches de propriétés.


## Dépendances et délégation des étapes

`gtd_predecesseurs` est une liste de liens, configurée comme Liste dans Obsidian et ajoutée aux modèles d’étape et de monolithe. Les fiches existantes reçoivent une liste vide si le champ est absent ; aucun lien n’est inventé. Les cibles autorisées sont des `GTD-Etape` ou `GTD-ProjetMonolithe`, y compris dans d’autres projets. Ce sont des dépendances, pas des parents hiérarchiques.

Une dépendance est satisfaite quand le prédécesseur est `8.terminee`. Les abandons, liens invalides, auto-dépendances et cycles sont à revoir. Les contrôles ne signalent pas une dépendance ouverte en elle-même, seulement les étapes déclarées prêtes ou engagées trop tôt. Ils ne modifient jamais automatiquement les statuts. La propriété est définie une seule fois dans le schéma GTD, sans pages de valeurs privées.

Le statut d’étape `6.delegue` signifie délégué à une autre personne, de manière implicite. `5.delegation_agent` reste réservé aux agents. Les deux délégations comptent dans la charge en cours et nécessitent un projet parent actif ou délégué. Aucun statut de délégation humaine n’est ajouté aux projets ; les statuts historiques sont conservés.

La vue `Étapes du projet` de `GTD.Etapes.base` est un kanban par statut d’étape, avec le même filtre de rattachement au projet courant. L’ancienne vue reste disponible sous `Étapes du projet — tableau`. Les dépendances restent visibles sans masquer automatiquement les cartes bloquées.

## Création GTD depuis une sélection

La commande d’insertion `Script_SelectionVersGTD` exécute le modèle GTD Projet ou Étape puis transforme la sélection en lien. Détection selon la page courante : projet → étape enfant ; étape rattachée ou page dans un dossier projet → étape du même contexte ; domaine ou objectif → projet rattaché. Sans contexte fiable, proposer Projet ou Étape, puis le parent si nécessaire. Un monolithe ne devient pas parent d’étapes.

Les statuts initiaux restent ceux des modèles. Les projets sont des notes de dossier sous `pages/1. Projets/` ; les étapes rejoignent le dossier projet s’il existe, sinon `bases/GTD.Etapes/`. Un projet sans domaine ni objectif reste signalé par les contrôles. Ne pas inventer de prédécesseur.

La sélection est traitée comme du texte, jamais comme un modèle exécutable. Remplacer la source seulement après création réussie et si son contenu est inchangé. Annulation, doublon ou erreur ne doivent pas supprimer le texte. Conserver les marqueurs de tâche et dates sur une ligne source ; un bloc multiligne est transféré dans la fiche. Mode d’emploi : [[GTD - Créer depuis la sélection]].

## Validation des étapes

`7.validation` signifie résultat produit, en attente de validation avant `8.terminee`. Cette valeur appartient au schéma partagé `gtd_statut_etape`, y compris pour le volet étape des monolithes ; aucun statut projet n’est ajouté. Elle est placée entre `6.delegue` et `8.terminee` dans le Sprint et le kanban des étapes du projet.

Une étape en validation reste ouverte, compte dans la charge et nécessite au moins un projet parent actif ou délégué. Seule une étape `8.terminee` lève les dépendances. Les modèles gardent leurs statuts initiaux et aucune fiche existante ne change automatiquement de statut.
