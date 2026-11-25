
Valeur « Écart vs total saisi » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.controle_total`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_HST_total_soldes.isEmpty(), null, formula.patrimoine - DB_CTE_HST_total_soldes)
```
