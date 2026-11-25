
Nom calculé pour l’affichage ; sa formule dépend de la base. Ce n’est pas une propriété à saisir dans les fiches.

## Type et rôle

- Propriété : `formula.nom`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Budgets`, `Comptes.Charges`.

## Formules par base

### Comptes.Budgets

```text
file.name.replace("Comptes @ Budget @ ", "").replace("Comptes @ BA @ ", "").replace("Comptes @ Frais M @ ", "")
```

### Comptes.Charges

```text
file.name.replace("Comptes @ Charge @ ", "")
```

