
Base : [[r_templates/resources/bases/GTD.Etapes.base|GTD.Etapes]] · [[r_templates/resources/bases_properties/bases_properties|Catalogue des propriétés]]

## Modèles

- [[r_templates/templates/type_GTD-Etape|type_GTD-Etape]]
- [[r_templates/templates/type_GTD-ProjetMonolithe|type_GTD-ProjetMonolithe]]

## Propriétés

| Propriété | Type attendu | Libellé |
|---|---|---|
| [[r_templates/resources/bases_properties/GTD.Etapes/type/type|type]] | Texte | Objet GTD |
| [[r_templates/resources/bases_properties/GTD.Etapes/gtd_domaine/gtd_domaine|gtd_domaine]] | Texte ou liste de liens | gtd_domaine |
| [[r_templates/resources/bases_properties/GTD.Etapes/gtd_echeance/gtd_echeance|gtd_echeance]] | Date | Échéance |
| [[r_templates/resources/bases_properties/GTD.Etapes/gtd_objectif/gtd_objectif|gtd_objectif]] | Texte ou liste de liens | gtd_objectif |
| [[r_templates/resources/bases_properties/GTD.Etapes/gtd_projet/gtd_projet|gtd_projet]] | Liste | Projet |
| [[r_templates/resources/bases_properties/GTD.Etapes/gtd_statut_etape/gtd_statut_etape|gtd_statut_etape]] | Texte | Statut étape |
| [[r_templates/resources/bases_properties/GTD.Etapes/gtd_statut_projet/gtd_statut_projet|gtd_statut_projet]] | Texte | gtd_statut_projet |
| [[r_templates/resources/bases_properties/GTD.Etapes/topic/topic|topic]] | Liste | Sujets |
| [[r_templates/resources/bases_properties/GTD.Etapes/file.name/file.name|file.name]] | Fichier (lecture seule) | Nom |
| [[r_templates/resources/bases_properties/GTD.Etapes/formula.projet_actif/formula.projet_actif|formula.projet_actif]] | Calculée (lecture seule) | Projet actif |

Les pages de valeurs reproduisent le modèle `properties/<propriété>/<valeur>.md` : frontmatter avec la propriété et sa valeur, puis définition. Les valeurs observées sont distinguées des vocabulaires prévus. Les propriétés de fichier et formules sont en lecture seule.
