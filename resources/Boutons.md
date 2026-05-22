
`button-applytype` `button-archive`


> [!abstract]+ [[🛠️Projets.base|Projets liés]] (js)
> ``` dataviewjs
dv.view("scripts/related-projects")
>```

> [!info]+ Pages enfant (js)
> ``` dataviewjs
dv.view("scripts/child-pages")
>```

> [!success]+ Tâches liées (js)
> ``` dataviewjs
dv.view("scripts/related-tasks")
>```
## Notes

```button
name Définir le type
type append command
action Templater: Insert Script_ApplyType
```
^button-applytype

```button
name Archiver
type append template
action Props-Archived
```
^button-archive

```button
name Add log
type append command
action Templater: Insert Bloc-TimeLog
```
^button-addlog

```button
name Quick Task
type append command
action Templater: Insert Bloc-NewTask
```
^button-quicktask


