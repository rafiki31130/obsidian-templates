
[[r_templates/resources/bases_properties/bases_properties|Catalogue des schémas]]

Définitions communes du schéma **RCT**. Chaque propriété est définie une seule fois, quel que soit le nombre de bases qui l’affichent.

Champs génériques : [[r_templates/resources/bases_properties/Commun/Commun|Schéma commun]].

Bases : `Recettes`.

## Propriétés

| Propriété | Type attendu |
|---|---|
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_actif_min|DB_CUI_REC_actif_min]] | **Nombre** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_note|DB_CUI_REC_note]] | **Nombre** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_portions|DB_CUI_REC_portions]] | **Nombre** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_prerequis|DB_CUI_REC_prerequis]] | **Texte** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_saison|DB_CUI_REC_saison]] | **Liste** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_source|DB_CUI_REC_source]] | **Texte** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_statut/DB_CUI_REC_statut|DB_CUI_REC_statut]] | **Texte** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_technique|DB_CUI_REC_technique]] | **Texte** |
| [[r_templates/resources/bases_properties/RCT/DB_CUI_REC_total_min|DB_CUI_REC_total_min]] | **Nombre** |
| [[r_templates/resources/bases_properties/RCT/formula.Heures|formula.Heures]] | **Calculée (lecture seule)** |
| [[r_templates/resources/bases_properties/RCT/type/type|type]] | **Texte** |

Une propriété sans pages enfants est une fiche directe. Un dossier et une note de dossier ne sont conservés que lorsqu’il existe des fiches enfants de valeurs fixes du schéma. Aucune valeur personnelle n’est cataloguée.
