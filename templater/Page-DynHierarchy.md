<%*
const title = tp.file.title;
let parent = null;
let istree = null;

if (title.includes('@')) {
  istree = true;
  const parts = title.split('@');
  if (parts.length > 1) parent = parts.slice(0, -1).join('@').trim();
}

const hdFence = "---";

if (parent) { tR += `${hdFence}
`; }
if (parent) { tR += `parent: "[[${parent}]]"
`; }
if (parent) { tR += `${hdFence}
`; }

%>
`button-applytype` `button-archive`

> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-projects")
>```

> [!info]+ Pages enfant (js)
> ``` dataviewjs
dv.view("r_templates/scripts/child-pages")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("r_templates/scripts/related-tasks")
>```
## Notes

<% tp.file.cursor() %><%* app.workspace.activeLeaf.view.editor.focus(); %>