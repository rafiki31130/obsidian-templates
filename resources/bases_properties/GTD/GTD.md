
[[r_templates/resources/bases_properties/bases_properties|Catalogue des schémas]]

Définitions communes du schéma **GTD**. Chaque propriété est définie une seule fois, quel que soit le nombre de bases qui l’affichent.

Champs génériques : [[r_templates/resources/bases_properties/Commun/Commun|Schéma commun]].

Bases : `GTD.Domaines`, `GTD.Etapes`, `GTD.Objectifs`, `GTD.Projets`, `GTD.ProjetsMonolithes`, `GTD.RaisonsDetre`, `GTD.Routines`, `GTD.Visions`.

## Propriétés

| Propriété | Type attendu |
|---|---|
| [[r_templates/resources/bases_properties/GTD/gtd_predecesseurs|gtd_predecesseurs]] | **Liste de liens** |
| [[r_templates/resources/bases_properties/GTD/formula.nombre_predecesseurs_bloquants|formula.nombre_predecesseurs_bloquants]] | **Calculée (lecture seule)** |
| [[r_templates/resources/bases_properties/GTD/formula.projet_actif|formula.projet_actif]] | **Calculée (lecture seule)** |
| [[r_templates/resources/bases_properties/GTD/gtd_domaine|gtd_domaine]] | **Texte ou liste de liens** |
| [[r_templates/resources/bases_properties/GTD/gtd_echeance|gtd_echeance]] | **Date** |
| [[r_templates/resources/bases_properties/GTD/gtd_frequence|gtd_frequence]] | **Texte** |
| [[r_templates/resources/bases_properties/GTD/gtd_horizon|gtd_horizon]] | **Nombre** |
| [[r_templates/resources/bases_properties/GTD/gtd_objectif|gtd_objectif]] | **Texte ou liste de liens** |
| [[r_templates/resources/bases_properties/GTD/gtd_projet|gtd_projet]] | **Liste** |
| [[r_templates/resources/bases_properties/GTD/gtd_raison_detre|gtd_raison_detre]] | **Texte ou liste de liens** |
| [[r_templates/resources/bases_properties/GTD/gtd_statut_etape/gtd_statut_etape|gtd_statut_etape]] | **Texte** |
| [[r_templates/resources/bases_properties/GTD/gtd_statut_objectif/gtd_statut_objectif|gtd_statut_objectif]] | **Texte** |
| [[r_templates/resources/bases_properties/GTD/gtd_statut_projet/gtd_statut_projet|gtd_statut_projet]] | **Texte** |
| [[r_templates/resources/bases_properties/GTD/gtd_statut_routine/gtd_statut_routine|gtd_statut_routine]] | **Texte** |
| [[r_templates/resources/bases_properties/GTD/gtd_vision|gtd_vision]] | **Texte ou liste de liens** |
| [[r_templates/resources/bases_properties/GTD/type/type|type]] | **Texte** |

Une propriété sans pages enfants est une fiche directe. Un dossier et une note de dossier ne sont conservés que lorsqu’il existe des fiches enfants de valeurs fixes du schéma. Aucune valeur personnelle n’est cataloguée.
