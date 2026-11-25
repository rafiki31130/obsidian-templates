// Vue Dataview partagée : calculs en lecture seule, aucun frontmatter n'est modifié.
function buildGtdReview(pages, resolvePath) {
    const array = v => v == null ? [] : Array.isArray(v) ? v : typeof v.array === 'function' ? v.array() : [v];
    const clean = v => array(v).filter(x => x != null && String(x).trim() !== '');
    const path = p => p.file.path;
    const archived = p => /(^|\/)4\. Archives(\/|$)/.test(path(p)) || clean(p.file.tags).some(t => String(t).replace(/^#/, '') === 'archived');
    const all = pages.filter(p => p.file && !/^(r_templates|\.trash|journals)\//.test(path(p)));
    const byPath = new Map(all.map(p => [path(p), p]));
    const links = (p, field) => clean(p[field]).map(v => {
        let raw = typeof v === 'object' && v.path ? v.path : String(v).replace(/^\[\[/, '').replace(/\]\]$/, '').split('|')[0];
        raw = raw.split('#')[0];
        const resolved = resolvePath(raw, path(p));
        return {raw, page: resolved ? byPath.get(resolved) : null};
    });
    const targets = (p, field) => links(p, field).map(l => l.page).filter(Boolean);
    const isProject = p => ['GTD-Projet', 'GTD-ProjetMonolithe'].includes(p.type);
    const isStep = p => p.type === 'GTD-Etape';
    const isActiveProject = p => isProject(p) && !archived(p) && p.gtd_statut_projet === '2_actif';
    const isOpen = p => !['8_termine', '9_abandonne'].includes(p.gtd_statut_projet);
    const stepOpen = p => !['8_faite', '9_abandonnee'].includes(p.gtd_statut_etape);
    const projects = all.filter(isProject);
    const steps = all.filter(isStep);
    const liveProjects = projects.filter(p => !archived(p));
    const liveSteps = steps.filter(p => !archived(p));
    const children = new Map(projects.map(p => [path(p), []]));
    for (const s of steps) for (const parent of targets(s, 'gtd_projet').filter(isProject)) children.get(path(parent)).push(s);
    const activeParents = s => s.type === 'GTD-ProjetMonolithe' ? (isActiveProject(s) ? [s] : []) : targets(s, 'gtd_projet').filter(isActiveProject);
    const issues = [];
    const add = (id, category, title, page, detail) => issues.push({id, category, title, page, detail});
    for (const p of liveProjects) {
        if (!clean(p.gtd_domaine).length && !clean(p.gtd_objectif).length) add('projet_sans_rattachement','projets','Projets sans domaine ni objectif',p,'Renseigner au moins un domaine ou un objectif. Les deux sont possibles.');
        if (p.type === 'GTD-Projet' && isOpen(p) && !children.get(path(p)).length) add('projet_sans_etape','projets','Projets sans étape',p,'Créer une étape ou utiliser le type GTD-ProjetMonolithe.');
        if (p.type === 'GTD-Projet' && p.gtd_statut_projet === '8_termine') {
            const pending = children.get(path(p)).filter(stepOpen);
            if (pending.length) add('projet_termine_etapes_ouvertes','projets','Projets terminés avec étapes ouvertes',p,pending.map(s => s.file.name).join(' · '));
        }
        if (p.type === 'GTD-ProjetMonolithe' && p.gtd_statut_etape === '8_faite' && p.gtd_statut_projet !== '8_termine') add('monolithe_cloture','projets','Monolithes à clôturer au portefeuille',p,'L’étape est faite ; revoir le statut projet.');
        for (const field of ['gtd_domaine', 'gtd_objectif']) for (const link of links(p, field)) {
            if (link.page && /(^|\/)3\. Ressources\//.test(path(link.page)) && !['GTD-Domaine','GTD-Objectif'].includes(link.page.type)) add('projet_ressource','projets','Projets rattachés à une ressource',p,field + ' → ' + link.page.file.name + '. Un lien topic vers une ressource reste autorisé.');
        }
    }
    for (const s of liveSteps) {
        if (!targets(s,'gtd_projet').some(isProject)) add('etape_sans_projet','etapes','Étapes sans projet valide',s,'Renseigner un lien vers un projet ou projet monolithe existant.');
    }
    for (const s of [...liveSteps, ...liveProjects.filter(p => p.type === 'GTD-ProjetMonolithe')]) {
        if (s.gtd_statut_etape === '3_en_cours' && !activeParents(s).length) add('etape_sans_parent_actif','etapes','Étapes en cours sans projet actif',s,'Activer un projet parent ou remettre l’étape en préparation/prête. Un seul parent actif suffit pour une étape partagée.');
    }
    for (const goal of all.filter(p => p.type === 'GTD-Objectif' && !archived(p))) {
        if (goal.gtd_statut_objectif === '2_actif' && !projects.some(p => isActiveProject(p) && targets(p,'gtd_objectif').includes(goal))) add('objectif_sans_projet','horizons','Objectifs actifs sans projet actif',goal,'Lancer un projet contributif ou revoir le statut de l’objectif.');
    }
    for (const domain of all.filter(p => p.type === 'GTD-Domaine')) {
        const active = projects.filter(p => isActiveProject(p) && targets(p,'gtd_domaine').includes(domain));
        const goals = all.filter(p => p.type === 'GTD-Objectif' && !archived(p) && p.gtd_statut_objectif === '2_actif' && targets(p,'gtd_domaine').includes(domain));
        if (!archived(domain) && !active.length && !goals.length) add('domaine_sans_engagement','horizons','Domaines sans objectif ni projet actif',domain,'Vérifier pendant la revue si la responsabilité est suffisamment entretenue.');
        if (archived(domain) && active.length) add('domaine_archive_actif','horizons','Domaines archivés avec projets actifs',domain,active.map(p => p.file.name).join(' · '));
    }
    const fields = {gtd_raison_detre:'GTD-RaisonDetre',gtd_vision:'GTD-Vision',gtd_objectif:'GTD-Objectif',gtd_domaine:'GTD-Domaine',gtd_projet:['GTD-Projet','GTD-ProjetMonolithe'],gtd_etape:['GTD-Etape','GTD-ProjetMonolithe']};
    const statusValues = {gtd_statut_projet:['1_en_attente','2_actif','3_en_pause','8_termine','9_abandonne'],gtd_statut_etape:['1_a_preparer','2_prete','3_en_cours','4_bloquee','8_faite','9_abandonnee'],gtd_statut_objectif:['1_propose','2_actif','3_en_pause','8_atteint','9_abandonne']};
    for (const p of all.filter(p => !archived(p))) {
        const gtd = String(p.type || '').startsWith('GTD-');
        const filled = Object.keys(fields).filter(k => clean(p[k]).length);
        if (!gtd && filled.length > 1) add('note_multirattachement','rattachements','Notes ordinaires avec plusieurs rattachements GTD',p,filled.join(' · '));
        for (const field of filled) for (const link of links(p,field)) {
            if (!link.page) add('lien_introuvable','rattachements','Liens GTD introuvables',p,field + ' → ' + link.raw);
            else if (!array(fields[field]).includes(link.page.type)) add('lien_type_incorrect','rattachements','Liens GTD de type incorrect',p,field + ' → ' + link.page.file.name + ' (' + (link.page.type || 'sans type') + ')');
        }
        if (!gtd) continue;
        const required = isProject(p) ? ['gtd_statut_projet', ...(p.type === 'GTD-ProjetMonolithe' ? ['gtd_statut_etape'] : [])] : isStep(p) ? ['gtd_statut_etape'] : p.type === 'GTD-Objectif' ? ['gtd_statut_objectif'] : [];
        for (const field of required) if (!statusValues[field].includes(p[field])) add('statut_invalide','rattachements','Statuts manquants ou inconnus',p,field + ' : ' + (p[field] || 'vide'));
    }
    const activeProjects = projects.filter(isActiveProject);
    const sprint = [...liveSteps, ...liveProjects.filter(p => p.type === 'GTD-ProjetMonolithe')].filter(s => activeParents(s).length);
    const running = sprint.filter(s => s.gtd_statut_etape === '3_en_cours');
    const runningAll = [...liveSteps, ...liveProjects.filter(p => p.type === 'GTD-ProjetMonolithe')].filter(s => s.gtd_statut_etape === '3_en_cours');
    return {issues,activeProjects,sprint,running,runningAll,projectLimit:5,stepLimit:3};
}

const review = buildGtdReview(dv.pages().array(), (target, source) => app.metadataCache.getFirstLinkpathDest(target, source)?.path || null);
const section = input?.section || 'summary';
const categories = {projets:'Projets',etapes:'Étapes',horizons:'Objectifs et domaines',rattachements:'Rattachements et statuts'};
const links = {projets:'Contrôles des projets',etapes:'Contrôles des étapes',horizons:'Contrôles des objectifs et domaines',rattachements:'Contrôles des rattachements'};
if (section === 'portefeuille' || section === 'sprint') {
    const portfolio = section === 'portefeuille';
    const count = portfolio ? review.activeProjects.length : review.runningAll.length;
    const max = portfolio ? review.projectLimit : review.stepLimit;
    dv.paragraph((count > max ? '⚠️ ' : '') + '**' + count + (portfolio ? ' projet(s) actif(s)' : ' étape(s) en cours') + '** — plafond de ' + max + '. Repère : ' + (portfolio ? '3 à 5 projets actifs.' : '2 à 3 étapes en cours.'));
    if (!portfolio) dv.paragraph(review.sprint.length + ' étape(s) ou monolithe(s) liés à un projet actif. Une étape partagée compte une seule fois.');
    const relevant = review.issues.filter(i => portfolio ? i.category === 'projets' : i.category === 'etapes');
    if (relevant.length) dv.table(['À revoir','Fiche'], relevant.map(i => [i.title,i.page.file.link]));
    else dv.paragraph('Aucune anomalie détectée pour ce tableau.');
} else if (section === 'summary') {
    dv.paragraph('**' + review.issues.length + ' signalement(s)** à examiner. Les contrôles sont en lecture seule.');
    dv.table(['Contrôles','Signalements'],Object.entries(categories).map(([key,title]) => [dv.fileLink('pages/3. Ressources/Pilotage GTD/' + links[key] + '.md',false,title),review.issues.filter(i => i.category === key).length]));
    if (review.activeProjects.length > review.projectLimit || review.runningAll.length > review.stepLimit) dv.paragraph('⚠️ Capacité dépassée : ' + review.activeProjects.length + ' projets actifs / 5 ; ' + review.runningAll.length + ' étapes en cours / 3.');
} else {
    const rows = review.issues.filter(i => i.category === section);
    if (!rows.length) dv.paragraph('Aucune anomalie détectée pour ces contrôles.');
    for (const title of [...new Set(rows.map(i => i.title))]) {
        dv.header(3,title);
        dv.table(['Fiche','À examiner'],rows.filter(i => i.title === title).map(i => [i.page.file.link,i.detail]));
    }
}
