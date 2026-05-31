<%*
const folder = "fleeting";
const prefix = "FLT-";
const stamp  = tp.date.now("YYYY.MM.DDTHH.mm.ss");
const name   = prefix + stamp;

const alias = await tp.system.prompt("Alias de la note");
if (!alias) { return; }

const templateTFile = tp.file.find_tfile("r_templates/templater/Page-FleetingNote.md");
let content = await app.vault.read(templateTFile);

content = content.replace(/^aliases:\s*$/m, `aliases:\n  - ${alias}`);

await tp.file.create_new(content, name, false, folder);
tR += `[[${name}|${alias}]]`;
-%>
