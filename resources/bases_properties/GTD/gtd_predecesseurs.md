
Étapes ou projets monolithes dont le résultat est nécessaire avant cette étape. Les liens peuvent viser des étapes d’autres projets.

## Type et rôle

- Propriété : `gtd_predecesseurs`.
- Type attendu et type natif : **Liste** de liens.
- Schéma : [[r_templates/resources/bases_properties/GTD/GTD|GTD]].
- Présente dans les modèles d’étape et de projet monolithe ; liste vide à la création.

## Règles

Un prédécesseur doit être `8.faite` pour lever la dépendance. Un prédécesseur abandonné, introuvable ou de mauvais type demande une revue ; un abandon n’autorise pas automatiquement le démarrage. Une étape ne peut pas se référencer elle-même et les cycles sont signalés.

Cette liste exprime des dépendances, pas un rattachement hiérarchique. Elle ne compte donc pas dans la règle du rattachement GTD unique. Les contrôles sont en lecture seule : aucun statut n’est changé automatiquement et aucune dépendance n’est inventée.

## Confidentialité

Les valeurs sont des liens vers les fiches de données de l’utilisateur. Aucune page de valeur ni liste de prédécesseurs personnels n’est créée dans les ressources.
