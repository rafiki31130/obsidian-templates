<%*
let path = await tp.system.prompt("Chemin du fichier");
if (!path) { return; }

path = path.trim().replace(/^["']|["']$/g, "");

const basename = path.split(/[\\/]/).pop();
const display = basename.replace(/\.[^.]+$/, "");

const url = "file:///" + path.replace(/\\/g, "/").replace(/ /g, "%20");

tR += `[${display}](${url})`;
-%>
