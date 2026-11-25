
Valeur « Non expliqué » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.non_explique`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (formula.dispo_cc - formula.attendu).round(2))
```
