
Valeur « Dispo CC du mois » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.dispo_cc`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (formula.dispo_brut - if(DB_CTE_DCT_report_cc.isEmpty(), 0, DB_CTE_DCT_report_cc)).round(2))
```
