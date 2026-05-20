<%*
// Insère un lien vers une nouvelle note dont le nom est saisi par l'utilisateur,
// sans ouvrir la note créée. Choix du dossier au moment de l'insertion.
//
// Prérequis : plugin Templater activé.
// Emplacement recommandé : Templates/Insert-Linked-Note.md

const name = await tp.system.prompt("Nom de la note");
if (!name) { return; }

const folders = ["Inbox", "Inbox/Fleetings", "Permanent", "Project"];
const folder  = await tp.system.suggester(folders, folders, false, "Dossier cible");
if (!folder) { return; }

const originator = tp.file.title;

const content = `---
created: ${tp.date.now("YYYY-MM-DD HH:mm")}
source: "[[${originator}]]"
---

# ${name}

`;

await tp.file.create_new(content, name, false, folder);
tR += `[[${name}]]`;
-%>
