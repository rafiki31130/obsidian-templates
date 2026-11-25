
Valeur « Attendu CC (perçus − imprévus) » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.attendu`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Decomptes`.

## Formule actuelle

### Comptes.Decomptes

```text
(formula.percus - formula.imprevus).round(2)
```

