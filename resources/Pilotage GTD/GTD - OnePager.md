
Vue d'ensemble de ce qui est engagé, en une page : objectifs actifs, projets engagés, travail en cours, blocages, prochaines étapes et actions ouvertes. Pour décider et réorganiser, passer par [[GTD - Portefeuille]], [[GTD - Sprint]] et [[GTD - Contrôles]].

```dataviewjs
// Lecture seule : aucune propriété n'est modifiée par cette vue.
const EXCL = /^(r_templates|r_wiki|r_knowledge_base_pro|\.trash|journals)\/|(^|\/)4\. Archives\//;
const ENGAGED_P = ["2.actif", "4.delegation_agent"];
const CHARGE_E = ["3.en_cours", "5.delegation_agent", "6.delegue", "7.validation"];
const arr = v => v == null ? [] : Array.isArray(v) ? v : (v.array ? v.array() : [v]);
const archived = p => arr(p.tags).some(t => String(t).replace(/^#/, "") === "archived");
const ok = p => p && !EXCL.test(p.file.path) && !archived(p);
const page = l => {
  if (!l) return null;
  const path = l.path ?? String(l).replace(/^\[\[|\]\]$/g, "").split("|")[0];
  return dv.page(path);
};
const links = v => arr(v).map(page).filter(ok);
const show = v => { const l = links(v).map(x => x.file.link); return l.length ? l : "—"; };
const date = v => v ? v : "—";

const all = dv.pages().where(p => String(p.type ?? "").startsWith("GTD-") && ok(p));
const byType = t => all.where(p => p.type === t);

// Projets et monolithes engagés
const projets = all
  .where(p => ["GTD-Projet", "GTD-ProjetMonolithe"].includes(p.type) && ENGAGED_P.includes(p.gtd_statut_projet))
  .sort(p => p.gtd_statut_projet + p.file.name);
const engaged = new Set(projets.where(p => p.type === "GTD-Projet").map(p => p.file.path).array());
const etapesDe = proj => byType("GTD-Etape").where(e => links(e.gtd_projet).some(x => x.file.path === proj.file.path));

// Travail : étapes rattachées à un projet engagé, et monolithes engagés
const etapes = byType("GTD-Etape").where(e => links(e.gtd_projet).some(x => engaged.has(x.file.path)));
const travail = etapes.concat(projets.where(p => p.type === "GTD-ProjetMonolithe"));
const parent = p => p.type === "GTD-ProjetMonolithe" ? "monolithe" : show(p.gtd_projet);
const bloquants = p => {
  const l = links(p.gtd_predecesseurs).filter(x => x.gtd_statut_etape !== "8.faite").map(x => x.file.link);
  return l.length ? l : "—";
};
const enCours = travail.where(p => CHARGE_E.includes(p.gtd_statut_etape)).sort(p => p.gtd_statut_etape + p.file.name);
const bloquees = travail.where(p => p.gtd_statut_etape === "4.bloquee").sort(p => p.file.name);
const pretes = travail.where(p => p.gtd_statut_etape === "2.prete").sort(p => p.file.name);

dv.paragraph(`**Projets engagés : ${projets.length} / 5** · **Étapes en charge : ${enCours.length} / 3** · Bloquées : ${bloquees.length} · Prêtes : ${pretes.length}`);

dv.header(2, "Objectifs actifs");
const objectifs = byType("GTD-Objectif").where(o => o.gtd_statut_objectif === "2.actif").sort(o => o.file.name);
if (objectifs.length) await dv.table(["Objectif", "Domaine", "Échéance", "Projets engagés"],
  objectifs.map(o => [o.file.link, show(o.gtd_domaine), date(o.gtd_echeance),
    projets.where(p => links(p.gtd_objectif).some(x => x.file.path === o.file.path)).length]));
else dv.paragraph("Aucun objectif actif.");

dv.header(2, "Projets engagés");
if (projets.length) await dv.table(["Projet", "Statut", "Domaine", "Objectif", "Échéance", "Avancement"],
  projets.map(p => {
    let avancement;
    if (p.type === "GTD-ProjetMonolithe") avancement = "monolithe · " + (p.gtd_statut_etape ?? "—");
    else {
      const e = etapesDe(p);
      const ouvertes = e.where(x => !["8.faite", "9.abandonnee"].includes(x.gtd_statut_etape)).length;
      avancement = `${e.where(x => x.gtd_statut_etape === "8.faite").length} faite(s) · ${ouvertes} ouverte(s) / ${e.length}`;
    }
    return [p.file.link, p.gtd_statut_projet, show(p.gtd_domaine), show(p.gtd_objectif), date(p.gtd_echeance), avancement];
  }));
else dv.paragraph("Aucun projet engagé.");

dv.header(2, "En cours, délégué ou en validation");
if (enCours.length) await dv.table(["Étape", "Projet", "Statut", "Prédécesseurs non faits", "Échéance"],
  enCours.map(p => [p.file.link, parent(p), p.gtd_statut_etape, bloquants(p), date(p.gtd_echeance)]));
else dv.paragraph("Rien en cours.");

dv.header(2, "Bloqué");
if (bloquees.length) await dv.table(["Étape", "Projet", "Prédécesseurs non faits"],
  bloquees.map(p => [p.file.link, parent(p), bloquants(p)]));
else dv.paragraph("Aucun blocage déclaré.");

dv.header(2, "Prêt à démarrer");
if (pretes.length) await dv.table(["Étape", "Projet", "Prédécesseurs non faits"],
  pretes.map(p => [p.file.link, parent(p), bloquants(p)]));
else dv.paragraph("Aucune étape prête.");

dv.header(2, "Actions ouvertes du travail en cours");
const actions = enCours.file.tasks.where(t => !t.completed && t.status !== "-" && String(t.text).trim() && String(t.text).trim() !== "#");
if (actions.length) await dv.taskList(actions, true);
else dv.paragraph("Aucune action ouverte dans les étapes en cours.");

dv.header(2, "Domaines");
const domaines = byType("GTD-Domaine").sort(d => d.file.name);
if (domaines.length) await dv.table(["Domaine", "Projets engagés", "Objectifs actifs"],
  domaines.map(d => [d.file.link,
    projets.where(p => links(p.gtd_domaine).some(x => x.file.path === d.file.path)).length,
    objectifs.where(o => links(o.gtd_domaine).some(x => x.file.path === d.file.path)).length]));
else dv.paragraph("Aucun domaine.");
```
