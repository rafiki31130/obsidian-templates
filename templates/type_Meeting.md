---
type: Meeting
date: "[[{{date:YYYY-MM-DD}}]]"
topic:
person:
rating:
tags:
---
<%*
// Même nommage que Log : « YYYY-MM-DD HHhmm - », sans prompt.
// Le titre peut ensuite être complété manuellement.
const meetingFile = tp.config.target_file;
const meetingTitle = meetingFile.basename;
const meetingAt = meetingTitle.lastIndexOf("@");
const meetingParent = meetingAt > -1 ? meetingTitle.slice(0, meetingAt).trim() : "";
const meetingBase = (meetingAt > -1 ? meetingTitle.slice(meetingAt + 1) : meetingTitle).trim();
if (!/^\d{4}-\d{2}-\d{2} \d{2}h\d{2} -(?: |$)/.test(meetingBase)) {
  // Le parent porté par le titre (« Parent @ … ») est conservé en propriété
  if (meetingParent) await app.fileManager.processFrontMatter(meetingFile, fm => { if (!fm.parent) fm.parent = `[[${meetingParent}]]`; });
  try { await tp.file.rename(`${tp.date.now("YYYY-MM-DD HH[h]mm")} - `); }
  catch (e) { new Notice(`Meeting : renommage impossible (${e.message})`, 6000); }
}
-%>

## Ordre du jour


## Échanges


## Décisions


## Actions
- [ ] 
