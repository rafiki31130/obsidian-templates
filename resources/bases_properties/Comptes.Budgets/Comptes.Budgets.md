
Base : [[r_templates/resources/bases/Comptes.Budgets.base|Comptes.Budgets]] · [[r_templates/resources/bases_properties/bases_properties|Catalogue des propriétés]]

## Modèles

- [[r_templates/templater/Page-Comptes_Budgets|Page-Comptes_Budgets]]

## Propriétés

| Propriété | Type attendu | Libellé |
|---|---|---|
| [[r_templates/resources/bases_properties/Comptes.Budgets/type/type|type]] | Texte | type |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_categorie/DB_CTE_BDG_categorie|DB_CTE_BDG_categorie]] | Texte | Catégorie |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_maj/DB_CTE_BDG_maj|DB_CTE_BDG_maj]] | Texte | Mise à jour |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_montant/DB_CTE_BDG_montant|DB_CTE_BDG_montant]] | Nombre | Montant |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_parent/DB_CTE_BDG_parent|DB_CTE_BDG_parent]] | Texte | DB_CTE_BDG_parent |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_periodicite/DB_CTE_BDG_periodicite|DB_CTE_BDG_periodicite]] | Nombre | DB_CTE_BDG_periodicite |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_solde/DB_CTE_BDG_solde|DB_CTE_BDG_solde]] | Nombre | Solde |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_solde_date/DB_CTE_BDG_solde_date|DB_CTE_BDG_solde_date]] | Date | Solde au |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_tag/DB_CTE_BDG_tag|DB_CTE_BDG_tag]] | Texte | Tag |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_type/DB_CTE_BDG_type|DB_CTE_BDG_type]] | Texte | DB_CTE_BDG_type |
| [[r_templates/resources/bases_properties/Comptes.Budgets/DB_CTE_BDG_virement/DB_CTE_BDG_virement|DB_CTE_BDG_virement]] | Case à cocher | Virement en place |
| [[r_templates/resources/bases_properties/Comptes.Budgets/file.name/file.name|file.name]] | Fichier (lecture seule) | file.name |
| [[r_templates/resources/bases_properties/Comptes.Budgets/formula.nom/formula.nom|formula.nom]] | Calculée (lecture seule) | Poste |
| [[r_templates/resources/bases_properties/Comptes.Budgets/formula.mensualite/formula.mensualite|formula.mensualite]] | Calculée (lecture seule) | Mensualité |

Les pages de valeurs reproduisent le modèle `properties/<propriété>/<valeur>.md` : frontmatter avec la propriété et sa valeur, puis définition. Les valeurs observées sont distinguées des vocabulaires prévus. Les propriétés de fichier et formules sont en lecture seule.
