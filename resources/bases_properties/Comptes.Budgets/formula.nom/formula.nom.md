
Valeur « Poste » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.nom`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Budgets/Comptes.Budgets|Comptes.Budgets]].

## Formule actuelle

```text
file.name.replace("Comptes @ Budget @ ", "").replace("Comptes @ BA @ ", "").replace("Comptes @ Frais M @ ", "")
```
