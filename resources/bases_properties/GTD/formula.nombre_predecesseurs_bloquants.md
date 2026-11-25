
Nombre de prédécesseurs non faits ou invalides, calculé dans les bases des étapes et monolithes.

## Type et rôle

- Propriété : `formula.nombre_predecesseurs_bloquants`.
- Type : **Calculée (lecture seule)**.
- Schéma : [[r_templates/resources/bases_properties/GTD/GTD|GTD]].

## Formule actuelle

```text
list(gtd_predecesseurs).filter(value && (!file(value) || (file(value).properties.type != "GTD-Etape" && file(value).properties.type != "GTD-ProjetMonolithe") || file(value).properties.gtd_statut_etape != "8.terminee")).length
```

Les liens absents ou de mauvais type comptent comme blocages ; seul `8.terminee` lève une dépendance. Les auto-dépendances et cycles sont contrôlés séparément.
