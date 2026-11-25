
Valeur « Bunq + Perso » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.soldes_variables`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
(if(DB_CTE_SLD_bunq_cc.isEmpty(), 0, DB_CTE_SLD_bunq_cc) + if(DB_CTE_SLD_sum_cc.isEmpty(), 0, DB_CTE_SLD_sum_cc)).round(2)
```
