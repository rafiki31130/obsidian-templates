
Valeur « À venir » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.a_venir`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (if(DB_CTE_DCT_av_budget.isEmpty(), 0, DB_CTE_DCT_av_budget) + if(DB_CTE_DCT_av_cartes.isEmpty(), 0, DB_CTE_DCT_av_cartes) + if(DB_CTE_DCT_av_virements.isEmpty(), 0, DB_CTE_DCT_av_virements)).round(2))
```
