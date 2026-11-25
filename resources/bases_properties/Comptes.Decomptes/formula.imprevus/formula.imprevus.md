
Valeur « Imprévus » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.imprevus`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/Comptes.Decomptes/Comptes.Decomptes|Comptes.Decomptes]].

## Formule actuelle

```text
if(DB_CTE_DCT_lst_imprevus.isEmpty(), 0, DB_CTE_DCT_lst_imprevus.map(number(value.toString().trim().replace(",", ".").split(" ").slice(0, 1).join(""))).reduce(acc + value, 0)).round(2)
```
