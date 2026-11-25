
Valeur « Projet actif » calculée par la base. Ne pas la saisir dans le frontmatter.

## Type et rôle

- Propriété : `formula.projet_actif`.
- Type attendu : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/GTD/GTD|GTD]].

Utilisée par : `GTD.Etapes`.

## Formule actuelle

### GTD.Etapes

```text
if(type == "GTD-ProjetMonolithe", (gtd_statut_projet == "2.actif" || gtd_statut_projet == "4.delegation_agent"), list(gtd_projet).filter(file(value) && file(value).properties.type == "GTD-Projet" && (file(value).properties.gtd_statut_projet == "2.actif" || file(value).properties.gtd_statut_projet == "4.delegation_agent") && !file(value).inFolder("pages/4. Archives") && !file(value).hasTag("archived")).length > 0)
```

