
Valeur « Lissé / mois » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.lisse`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Charges`.

## Formule actuelle

### Comptes.Charges

```text
(DB_CTE_CHG_tarif / DB_CTE_CHG_recurrence).round(3)
```

