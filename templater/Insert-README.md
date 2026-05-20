# Insert Link + Silent Note Creation

Deux templates Templater qui créent une note cible **sans l'ouvrir** et insèrent un lien vers elle dans la note courante.

## Prérequis

- Plugin **Templater** installé et activé.
- Dossier des templates configuré dans `Paramètres > Templater > Template folder location`.

## Fichiers

### `Insert-Fleeting-Link.md`

Crée une note "fleeting" horodatée (`FLT-YYYYMMDDHHmmss`) dans `Inbox/Fleetings`, sans interaction. Frontmatter pré-rempli : `type: fleeting`, `created`, `source` (back-référence vers la note d'origine), `status: raw`, `ttl: 7d`.

Cas d'usage : capture rapide pendant la rédaction, sans rompre le flux.

### `Insert-Linked-Note.md`

Variante interactive : prompt pour le nom, suggester pour le dossier cible (`Inbox`, `Inbox/Fleetings`, `Permanent`, `Project` — à adapter). Annulation propre si l'utilisateur abandonne le prompt.

Cas d'usage : création nommée volontairement, pas de timestamp imposé.

## Configuration recommandée

Dans `Paramètres > Templater` :

1. **Template folder location** : `Templates` (ou ton chemin existant).
2. **Template Hotkeys** : associer chaque template à un raccourci clavier dédié pour insertion en une frappe.
3. **Trigger Templater on new file creation** : laisser désactivé sauf besoin spécifique — ces templates sont conçus pour insertion manuelle.

## Points techniques

- `tp.file.create_new(content, name, false, folder)` : le 3ᵉ argument `false` empêche l'ouverture de la nouvelle note. C'est le point central.
- `await` obligatoire : sinon le lien s'insère avant que le fichier existe → risque de doublon au clic.
- `tR += ...` : écriture explicite dans le buffer de sortie depuis un bloc `<%* %>`.
- `tp.file.title` à l'intérieur du template renvoie le titre **de la note d'origine** car le script s'exécute dans son contexte ; le contenu de la nouvelle note est passé en chaîne pré-interpolée.
- `-%>` (avec tiret) à la fin : supprime le saut de ligne final, évite une ligne vide parasite après le lien.

## Adaptations probables

- Changer le préfixe `FLT-` dans `Insert-Fleeting-Link.md` selon ta convention (`EPH-`, `SCR-`, etc.).
- Modifier la liste `folders` dans `Insert-Linked-Note.md`.
- Ajouter des champs frontmatter (tags, projet, contexte) selon ton schéma Nexus Properties.
- Si tu veux que les notes fleeting soient détectables par Dataview pour purge automatique : la combinaison `type: fleeting` + `ttl` + `created` suffit pour une requête de type "fleetings expirés".

## Exemple de requête Dataview pour purge

```dataview
TABLE created, ttl, status
FROM "Inbox/Fleetings"
WHERE type = "fleeting"
  AND date(created) + dur(ttl) < date(today)
SORT created ASC
```
