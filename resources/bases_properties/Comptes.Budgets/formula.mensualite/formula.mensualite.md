
Valeur « Mensualité » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.mensualite`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Budgets/Comptes.Budgets|Comptes.Budgets]].

## Formule actuelle

```text
if(DB_CTE_BDG_periodicite.isEmpty(), DB_CTE_BDG_montant, DB_CTE_BDG_montant / DB_CTE_BDG_periodicite).round(2)
```
