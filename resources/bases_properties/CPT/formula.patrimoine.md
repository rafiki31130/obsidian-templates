
Valeur « Patrimoine » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.patrimoine`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Decomptes`.

## Formule actuelle

### Comptes.Decomptes

```text
[DB_CTE_SLD_bpoc_cc, DB_CTE_SLD_bpoc_cj, DB_CTE_SLD_bpoc_ldd, DB_CTE_SLD_bpoc_parts, DB_CTE_SLD_ftno_cc, DB_CTE_SLD_ftno_la, DB_CTE_SLD_sum_cc, DB_CTE_SLD_sum_chg_ann, DB_CTE_SLD_sum_frs_ann, DB_CTE_SLD_sum_epargne, DB_CTE_SLD_sum_budgets, DB_CTE_SLD_bunq_cc, DB_CTE_SLD_ntx_pee, DB_CTE_SLD_ntx_per, DB_CTE_SLD_ftno_lx, DB_CTE_SLD_revolut_cc, DB_CTE_SLD_compte_courant, DB_CTE_SLD_livret_dd, DB_CTE_SLD_livret_a, DB_CTE_SLD_revolut_bunq, DB_CTE_SLD_perso, DB_CTE_SLD_charge_an, DB_CTE_SLD_frais_an, DB_CTE_SLD_natixis].filter(value.isTruthy()).reduce(acc + value, 0).round(0)
```

