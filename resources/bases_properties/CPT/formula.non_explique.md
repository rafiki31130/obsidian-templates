
Valeur « Non expliqué » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.non_explique`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Decomptes`.

## Formule actuelle

### Comptes.Decomptes

```text
if(DB_CTE_DCT_av_budget.isEmpty(), null, (formula.dispo_cc - formula.attendu).round(2))
```

