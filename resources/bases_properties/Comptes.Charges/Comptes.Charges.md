
Base : [[r_templates/resources/bases/Comptes.Charges.base|Comptes.Charges]] · [[r_templates/resources/bases_properties/bases_properties|Catalogue des propriétés]]

## Modèles

- [[r_templates/templater/Page-Comptes_Charges|Page-Comptes_Charges]]

## Propriétés

| Propriété | Type attendu | Libellé |
|---|---|---|
| [[r_templates/resources/bases_properties/Comptes.Charges/type/type|type]] | Texte | type |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_categorie/DB_CTE_CHG_categorie|DB_CTE_CHG_categorie]] | Texte | Catégorie |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_compte/DB_CTE_CHG_compte|DB_CTE_CHG_compte]] | Texte | Compte |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_echeance/DB_CTE_CHG_echeance|DB_CTE_CHG_echeance]] | Date | Échéance |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_etat/DB_CTE_CHG_etat|DB_CTE_CHG_etat]] | Texte | État |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_labels/DB_CTE_CHG_labels|DB_CTE_CHG_labels]] | Liste | Labels |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_moyen/DB_CTE_CHG_moyen|DB_CTE_CHG_moyen]] | Texte | Paiement |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_partagee/DB_CTE_CHG_partagee|DB_CTE_CHG_partagee]] | Case à cocher | Partagée |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_recurrence/DB_CTE_CHG_recurrence|DB_CTE_CHG_recurrence]] | Nombre | Récurrence (mois) |
| [[r_templates/resources/bases_properties/Comptes.Charges/DB_CTE_CHG_tarif/DB_CTE_CHG_tarif|DB_CTE_CHG_tarif]] | Nombre | Tarif |
| [[r_templates/resources/bases_properties/Comptes.Charges/file.name/file.name|file.name]] | Fichier (lecture seule) | file.name |
| [[r_templates/resources/bases_properties/Comptes.Charges/formula.nom/formula.nom|formula.nom]] | Calculée (lecture seule) | Charge |
| [[r_templates/resources/bases_properties/Comptes.Charges/formula.lisse/formula.lisse|formula.lisse]] | Calculée (lecture seule) | Lissé / mois |
| [[r_templates/resources/bases_properties/Comptes.Charges/formula.ma_part/formula.ma_part|formula.ma_part]] | Calculée (lecture seule) | Ma part / mois |

Les pages de valeurs reproduisent le modèle `properties/<propriété>/<valeur>.md` : frontmatter avec la propriété et sa valeur, puis définition. Les valeurs observées sont distinguées des vocabulaires prévus. Les propriétés de fichier et formules sont en lecture seule.
