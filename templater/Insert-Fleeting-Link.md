<%*
// Insère un lien vers une nouvelle note "fleeting" créée à la volée,
// sans ouvrir cette note. Back-référence vers la note d'origine incluse.
//
// Prérequis : plugin Templater activé.
// Emplacement recommandé : Templates/Insert-Fleeting-Link.md
// Usage : commande "Templater: Insert template" → choisir ce fichier.
//         Ou raccourci clavier dédié dans Paramètres > Templater > Template Hotkeys.

const folder = "Inbox/Fleetings";          // adapter au vault
const prefix = "FLT-";                      // préfixe de nommage
const stamp  = tp.date.now("YYYYMMDDHHmmss");
const name   = prefix + stamp;
const originator = tp.file.title;

const content = `---
type: fleeting
created: ${tp.date.now("YYYY-MM-DD HH:mm")}
source: "[[${originator}]]"
status: raw
ttl: 7d
---

# ${name}

`;

await tp.file.create_new(content, name, false, folder);
tR += `[[${name}]]`;
-%>
