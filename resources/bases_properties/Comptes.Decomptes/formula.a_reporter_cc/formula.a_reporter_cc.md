
Valeur « → report_cc suivant » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.a_reporter_cc`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (formula.dispo_brut + if(DB_CTE_DCT_raz_variables, formula.soldes_variables, 0) - if(DB_CTE_DCT_affectation.isEmpty(), 0, DB_CTE_DCT_affectation)).round(2))
```
