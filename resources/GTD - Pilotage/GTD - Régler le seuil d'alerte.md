
[[GTD - Pilotage]] · [[GTD - Portefeuille]] · [[GTD - Sprint]]

Comment changer le seuil d'alerte de la charge GTD.

## Ce que mesure la charge

Un seul nombre, affiché dans [[GTD - Pilotage]], [[GTD - Portefeuille]], [[GTD - Sprint]] et [[GTD - OnePager]] :

- projets et monolithes engagés (`gtd_statut_projet` en `2.actif` ou `4.delegation_agent`) ;
- plus les étapes en charge (`gtd_statut_etape` en `3.en_cours`, `5.delegation_agent`, `6.delegue` ou `7.validation`).

Un monolithe compte une seule fois, comme projet. Les routines, les états de cadrage `0` et les objets archivés ne comptent pas. Au-delà du seuil, la ligne de charge est précédée de ⚠️ ; aucun statut n'est changé.

## Changer le seuil

1. Ouvrir [[GTD - Pilotage]].
2. Dans ses propriétés, modifier `seuil_charge_gtd` (nombre entier, 10 par défaut).
3. Rouvrir ou rafraîchir la page consultée : Dataview relit la valeur à chaque affichage.

Si la propriété est absente, vide ou non numérique, le seuil revient à 10. Le réglage est unique : `r_templates/scripts/gtd-review.js` et [[GTD - OnePager]] lisent tous deux cette propriété, il n'y a aucune autre valeur à modifier.

## Si la note de pilotage est renommée

Les scripts cherchent la note par son nom `GTD - Pilotage`. En cas de renommage, mettre à jour `dv.page('GTD - Pilotage')` dans `gtd-review.js` et dans le bloc du OnePager.
