
Valeur « Ma part / mois » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.ma_part`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Charges/Comptes.Charges|Comptes.Charges]].

## Formule actuelle

```text
if(DB_CTE_CHG_partagee, DB_CTE_CHG_tarif / DB_CTE_CHG_recurrence / 2, DB_CTE_CHG_tarif / DB_CTE_CHG_recurrence).round(3)
```
