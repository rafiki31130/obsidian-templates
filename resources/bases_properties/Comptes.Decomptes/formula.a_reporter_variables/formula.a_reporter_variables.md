
Valeur « → report_variables suivant » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.a_reporter_variables`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (if(DB_CTE_DCT_tricount_solde.isEmpty(), 0, DB_CTE_DCT_tricount_solde) + if(DB_CTE_DCT_raz_variables, 0, formula.soldes_variables)).round(2))
```
