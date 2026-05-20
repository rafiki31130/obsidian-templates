---
color: "#E6E6FA"
sticker: emoji//1f6a9
---

Default filter:
`path regex does not match /template[rs]/`

---
[[Tests de tâches]]

## Big Three
``` tasks
not done
tag includes BigThree
```
## Next
``` tasks
not done
tag includes Next
```

## Overdued
``` tasks
not done
((has scheduled date) AND (scheduled on or before today)) OR ((has due date) AND (due on or before today))
```

## With deadlines
``` tasks
not done
((starts on or before today) OR (no start date)) AND (due on or after today)
```

## Blocked 'f'
``` tasks
not done
filter by function task.status.symbol === 'f'
```

## Backlog
``` tasks
not done
(no start date) OR ((has start date) AND (starts on or before today) AND (no due date))
```

## Delegated '>'
``` tasks
not done
filter by function task.status.symbol === '>'
```

## Planned in the future
``` tasks
not done
(scheduled after today) OR ((has start date) AND (starts after today))
```

## Ideas 'I'
``` tasks
not done
filter by function task.status.symbol === 'I'
```

## All active tasks
``` tasks
not done
```


## All active tasks
``` tasks
not done
tag includes Projet
group by status.name
show tree
```


