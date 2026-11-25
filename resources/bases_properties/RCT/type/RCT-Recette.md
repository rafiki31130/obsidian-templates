---
type: RCT-Recette
---

## Définition

**Recette** de cuisine ou de préparation (boissons fermentées…).

## Caractéristiques

Rangée dans `bases/Recettes/`, nommage `Recettes @ <Nom>`. Ingrédients, étapes, notes d'essais.

## Propriétés

Template d'application : `templates/type_RCT-Recette.md`.

- `type: RCT-Recette`
- `tags:` `cuisine`, `recette`
- propriétés `DB_CUI_REC_*` : voir *Convention de fiche* ci-dessous (`DB_CUI_REC_note` tient lieu de `rating` ; `DB_CUI_REC_statut` vaut `à-tester` à la création)

Corps : Tableau (HTML) · Notes d'exécution · Journal.

## Régimes

**Piloté par l'opérateur** — le temps est celui de la main. Le résultat dépend de la technique et de la température de cuisson, la durée est bornée et reproductible. Erreur typique : sous-estimer la mise en place.

**Piloté par une transformation physique** — repos, refroidissement, marinade, prise. Le temps est incompressible mais prévisible : une pâte détend en 30 min, pas en 10.

**Piloté par une culture vivante** — fermentation. La durée n'est pas une consigne mais un intervalle sous surveillance, et l'indicateur d'arrêt est physique, pas horaire.
- [[Recettes @ Ginger bug|Ginger bug]] — levain sauvage, indicateur : effervescence à l'agitation
- [[Recettes @ Ginger beer|Ginger beer]] — indicateur : rigidité de la bouteille PET
- [[Recettes @ Kéfir de fruits|Kéfir de fruits]] — grains permanents, indicateur : remontée de la figue en surface

## Convention de fiche

Une fiche = une recette, `type: RCT-Recette`, propriétés préfixées `DB_CUI_REC_` (toutes présentes dans le template).

| Propriété                | Valeurs                                       |
| ------------------------ | --------------------------------------------- |
| `DB_CUI_REC_portions`    | entier                                        |
| `DB_CUI_REC_actif_min`   | minutes de présence effective                 |
| `DB_CUI_REC_total_min`   | minutes du début à la consommation            |
| `DB_CUI_REC_technique`   | fermentation, rôtissage, émulsion…            |
| `DB_CUI_REC_statut`      | à-tester, testé, validé, abandonné            |
| `DB_CUI_REC_note`        | 1 à 5                                         |
| `DB_CUI_REC_saison`      | liste                                         |
| `DB_CUI_REC_prerequis`   | wikilink vers une autre fiche                 |
| `DB_CUI_REC_source`      | texte libre                                   |

`DB_CUI_REC_prerequis` porte la seule relation métier : elle encode les dépendances entre recettes (levain → boisson, fond → sauce) et répond à « quelles recettes dépendent d'un levain actif ».

Corps de fiche en trois sections fixes : **Tableau** (notation tabulaire, ingrédients entiers en colonne 1, préparations explicites en colonne 2, fusions vers la droite), **Notes d'exécution** (points de contrôle et échecs observés), **Journal** (une ligne datée par fournée). Le tableau exige du HTML brut : le Markdown ne connaît ni `rowspan` ni `colspan`.

## Différence avec les autres types

À ne pas confondre avec le statut `6. Recette` (phase de validation d'un projet).


[[r_templates/resources/bases_properties/RCT/type/type|Définition de la propriété]]
