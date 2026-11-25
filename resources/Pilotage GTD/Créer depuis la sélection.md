
## Utilisation

1. Dans une note en mode édition, sélectionne le texte à transformer.
2. Lance la commande Templater d’insertion `Script_SelectionVersGTD` depuis la palette. Si elle n’apparaît pas encore, recharge Templater ou Obsidian. Le modèle est aussi accessible par `Templater: Open insert template modal`.
3. Vérifie le titre proposé, puis valide. Le texte devient un lien ; la nouvelle fiche contient le texte sélectionné et un lien vers son origine.

Tu restes sur la page source. Clique sur le lien pour ouvrir la fiche. Pour un raccourci clavier, associe la commande d’insertion à une touche dans les réglages Obsidian. Ne lance pas cette commande par « Create new note from template ».

## Détection du contexte

- Depuis un projet GTD ouvert : création d’une étape rattachée au projet.
- Depuis une étape déjà rattachée, ou une page située dans un dossier projet : création d’une autre étape du même projet. Si plusieurs projets sont proposés, choisis ceux à conserver.
- Depuis un domaine ou un objectif : création d’un projet avec ce rattachement.
- Dans les autres cas, notamment un projet monolithe : choix Projet ou Étape. Pour une étape, sélectionne ensuite un projet GTD ouvert.

Les projets terminés, abandonnés ou archivés ne sont pas proposés comme parents. Un monolithe ne reçoit pas d’étapes. Un projet créé hors domaine ou objectif reste à rattacher ; les contrôles existants le signalent.

## Modèles et rangement

Les modèles `type_GTD-Projet` et `type_GTD-Etape` sont exécutés directement. Leurs statuts initiaux et leurs champs restent ceux des modèles ; aucun prédécesseur n’est inventé.

Un projet est créé dans `pages/1. Projets/<titre>/<titre>.md`. Une étape rejoint le dossier de son projet lorsque celui-ci possède une note de dossier du même nom ; sinon elle va dans `bases/GTD.Etapes/`.

Pour une tâche sur une seule ligne, la case, les étiquettes initiales et les dates Tasks restent sur la ligne source. Un bloc multiligne est conservé dans la nouvelle fiche et remplacé à son emplacement par un lien court.

## Annulation et erreurs

Annuler conserve le texte et rétablit la sélection. Un titre déjà utilisé est refusé, sans écraser la note existante. Si la source change pendant l’opération, elle n’est pas remplacée. Une fiche créée avant un échec de finalisation reste disponible pour récupération ; la notification le précise.

Les tests automatisés couvrent les contextes, les modèles réels, les annulations, les tâches et les modifications concurrentes. Le premier essai dans l’interface Obsidian reste à faire.
