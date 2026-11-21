---
DB_CTE_SLD_bpoc_cc:
DB_CTE_SLD_bpoc_cj:
DB_CTE_SLD_bpoc_ldd:
DB_CTE_SLD_bpoc_parts:
DB_CTE_SLD_ftno_cc:
DB_CTE_SLD_ftno_la:
DB_CTE_SLD_sum_cc:
DB_CTE_SLD_sum_chg_ann:
DB_CTE_SLD_sum_frs_ann:
DB_CTE_SLD_sum_epargne:
DB_CTE_SLD_sum_budgets:
DB_CTE_SLD_bunq_cc:
DB_CTE_SLD_ntx_pee:
DB_CTE_SLD_ntx_per:
DB_CTE_DCT_av_budget: 1355
DB_CTE_DCT_av_cartes:
DB_CTE_DCT_av_virements: 0
DB_CTE_DCT_reserve: 1000
DB_CTE_DCT_report_cc:
DB_CTE_DCT_report_variables:
DB_CTE_DCT_tricount_solde:
DB_CTE_DCT_raz_variables: true
DB_CTE_DCT_lst_percus: []
DB_CTE_DCT_lst_imprevus: []
DB_CTE_DCT_affectation:
DB_CTE_DCT_note:
---
> [!info] Saisie — [[Comptes#How to]] · [[Comptes @ Dispositif]]
> - `report_cc` et `report_variables` : recopier les colonnes « → report… suivant » de la note précédente (vue *Mois*).
> - `tricount_solde` : solde à l'équilibre, **+ on me doit / − je dois**.
> - `lst_percus` / `lst_imprevus` : une entrée par ligne, « montant libellé » (`173.5 Urssaf`). La base additionne le premier nombre de chaque entrée.
> - Règlement Tricount reçu ou versé ce mois-ci : une ligne dans `lst_percus` (`+120 Tricount` / `-80 Tricount`).
> - `raz_variables` : `true` si Bunq et Perso sont vidés vers BPOC à la clôture, `false` pour les laisser courir.

> [!abstract]- Références pré-remplies (valeurs au 2026-11-21 — à corriger ici et dans le template si le budget change)
> | Propriété | Valeur | Source |
> | --- | --: | --- |
> | `av_budget` | 1 355 | Poste *Charges Mensuelles* = total « Ma part » de la vue *Mensuelles* |
> | `av_virements` | 0 | Provisions déjà parties au relevé de fin de mois ; total des provisions si elles ne sont pas encore passées : 2 110,14 |
> | `reserve` | 1 000 | Matelas du CC |
>
> | Budget | Montant |
> | --- | --: |
> | Salaire | 3 105 |
> | Remboursement est. Julie | 365 |
> | Charges mensuelles | −1 355 |
> | Frais mensuels communs (Bunq) | −800 |
> | Dépenses (Perso) | −450 |
> | Épargne | −500 |
> | Frais annuels (BA) | −300 |
> | Charges annuelles | −60,14 |
> | **Solde** | **+4,86** |

## Suivis
### Remboursement effectué


### A Annuler


### Modifier le compte de prélèvement


### A optimiser


### A vérifier dans Tricount


## Notes

