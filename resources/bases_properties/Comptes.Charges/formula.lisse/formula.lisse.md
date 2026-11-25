
Valeur « Lissé / mois » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.lisse`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Charges/Comptes.Charges|Comptes.Charges]].

## Formule actuelle

```text
(DB_CTE_CHG_tarif / DB_CTE_CHG_recurrence).round(3)
```
