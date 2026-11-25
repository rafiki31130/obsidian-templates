
Valeur « Disponible » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.disponible`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
(formula.patrimoine - formula.bloque).round(0)
```
