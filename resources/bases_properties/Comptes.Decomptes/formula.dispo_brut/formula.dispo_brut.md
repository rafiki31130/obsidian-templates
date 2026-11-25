
Valeur « Dispo CC brut » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.dispo_brut`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (DB_CTE_SLD_bpoc_cc - formula.a_venir - if(DB_CTE_DCT_reserve.isEmpty(), 1000, DB_CTE_DCT_reserve)).round(2))
```
