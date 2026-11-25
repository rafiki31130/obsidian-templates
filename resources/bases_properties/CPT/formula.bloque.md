
Valeur « Bloqué (PEE, PER, parts) » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.bloque`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Decomptes`.

## Formule actuelle

### Comptes.Decomptes

```text
[DB_CTE_SLD_bpoc_parts, DB_CTE_SLD_ntx_pee, DB_CTE_SLD_ntx_per, DB_CTE_SLD_natixis].filter(value.isTruthy()).reduce(acc + value, 0).round(0)
```

