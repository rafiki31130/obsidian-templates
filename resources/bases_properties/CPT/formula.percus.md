
Valeur « Perçus » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.percus`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/CPT/CPT|CPT]].

Utilisée par : `Comptes.Decomptes`.

## Formule actuelle

### Comptes.Decomptes

```text
if(DB_CTE_DCT_lst_percus.isEmpty(), 0, DB_CTE_DCT_lst_percus.map(number(value.toString().trim().replace(",", ".").split(" ").slice(0, 1).join(""))).reduce(acc + value, 0)).round(2)
```

