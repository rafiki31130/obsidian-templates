
Ajouts à reporter dans `r_templates/CONVENTIONS.md` (le fichier complet n'est pas recopié pour ne pas écraser d'autres modifications).

## 1. Section « Typage des BDD », tableau des types

Après la ligne `GTD-ProjetMonolithe`, insérer :

```markdown
| `GTD-Routine` | routine |
```

## 2. Section « Règles GTD et saisie »

Après la puce « Une étape peut être partagée… », insérer :

```markdown
- Une routine (`GTD-Routine`) tient le niveau d’un domaine : `gtd_domaine` obligatoire, `gtd_statut_routine` et `gtd_frequence` (`quotidienne`, `hebdomadaire`, `mensuelle`). Le projet ou monolithe qui l’installe se référence dans `gtd_projet` ; une routine n’est pas une étape et ne compte ni au Sprint ni dans les plafonds. Elle porte sa tâche récurrente `#Todo 🔁` dans sa fiche (exception au journal du jour). Sa revue a lieu chaque mois au Portefeuille, sans propriété de date ni de verdict : la décision se consigne dans le journal des revues de la fiche.
```

## 3. Section « Format des statuts modernes »

Après la phrase sur les Recettes, ajouter :

```markdown
Routines : `1.en_essai`, `2.active`, `3.en_pause`, `9.abandonnee`.
```

## 4. Section « Pages de pilotage GTD »

Après la phrase sur [[GTD - Portefeuille]], ajouter :

```markdown
Le Portefeuille intègre aussi la vue `Revue mensuelle` de `GTD.Routines.base` (routines non abandonnées, groupées par domaine). Les contrôles des routines (domaine, fréquence, tâche récurrente ouverte) figurent dans [[GTD - Contrôles des objectifs et domaines]] ; une routine en essai ou active compte comme engagement de son domaine.
```
