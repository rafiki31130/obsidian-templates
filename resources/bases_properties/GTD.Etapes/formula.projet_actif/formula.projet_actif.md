
Valeur « Projet actif » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.projet_actif`.
- Type attendu : **Calculée (lecture seule)**.
- Base : [[r_templates/resources/bases_properties/GTD.Etapes/GTD.Etapes|GTD.Etapes]].

## Formule actuelle

```text
if(type == "GTD-ProjetMonolithe", gtd_statut_projet == "2_actif", list(gtd_projet).filter(file(value) && file(value).properties.type == "GTD-Projet" && file(value).properties.gtd_statut_projet == "2_actif" && !file(value).inFolder("pages/4. Archives") && !file(value).hasTag("archived")).length > 0)
```
