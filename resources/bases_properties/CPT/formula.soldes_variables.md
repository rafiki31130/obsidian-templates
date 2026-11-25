
Valeur « Bunq + Perso » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.soldes_variables`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Decomptes`.

## Formule actuelle

### Comptes.Decomptes

```text
(if(DB_CTE_SLD_bunq_cc.isEmpty(), 0, DB_CTE_SLD_bunq_cc) + if(DB_CTE_SLD_sum_cc.isEmpty(), 0, DB_CTE_SLD_sum_cc)).round(2)
```

