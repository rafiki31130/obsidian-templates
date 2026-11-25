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
    const isActiveProject = p => isProject(p) && !archived(p) && ['2.actif','4.delegation_agent'].includes(p.gtd_statut_projet);
    const isOpen = p => !['8.termine', '9.abandonne'].includes(p.gtd_statut_projet);
    const stepOpen = p => !['8.faite', '9.abandonnee'].includes(p.gtd_statut_etape);
    const projects = all.filter(isProject);
    const steps = all.filter(isStep);
    const liveProjects = projects.filter(p => !archived(p));
    const liveSteps = steps.filter(p => !archived(p));
    const children = new Map(projects.map(p => [path(p), []]));
    for (const s of steps) for (const parent of targets(s, 'gtd_projet').filter(isProject)) children.get(path(parent)).push(s);
    const activeParents = s => s.type === 'GTD-ProjetMonolithe' ? (isActiveProject(s) ? [s] : []) : targets(s, 'gtd_projet').filter(p => p.type === 'GTD-Projet' && isActiveProject(p));
    const issues = [];
    const add = (id, category, title, page, detail) => issues.push({id, category, title, page, detail});
    for (const p of liveProjects) {
        if (!clean(p.gtd_domaine).length && !clean(p.gtd_objectif).length) add('projet_sans_rattachement','projets','Projets sans domaine ni objectif',p,'Renseigner au moins un domaine ou un objectif. Les deux sont possibles.');
        if (p.type === 'GTD-Projet' && isOpen(p) && !children.get(path(p)).length) add('projet_sans_etape','projets','Projets sans étape',p,'Créer une étape ou utiliser le type GTD-ProjetMonolithe.');
        if (p.type === 'GTD-Projet' && p.gtd_statut_projet === '8.termine') {
            const pending = children.get(path(p)).filter(stepOpen);
            if (pending.length) add('projet_termine_etapes_ouvertes','projets','Projets terminés avec étapes ouvertes',p,pending.map(s => s.file.name).join(' · '));
        }
        if (p.type === 'GTD-ProjetMonolithe' && p.gtd_statut_etape === '8.faite' && p.gtd_statut_projet !== '8.termine') add('monolithe_cloture','projets','Monolithes à clôturer au portefeuille',p,'L’étape est faite ; revoir le statut projet.');
        for (const field of ['gtd_domaine', 'gtd_objectif']) for (const link of links(p, field)) {
            if (link.page && /(^|\/)3\. Ressources\//.test(path(link.page)) && !['GTD-Domaine','GTD-Objectif'].includes(link.page.type)) add('projet_ressource','projets','Projets rattachés à une ressource',p,field + ' → ' + link.page.file.name + '. Un lien topic vers une ressource reste autorisé.');
        }
    }
    // Dependencies are separate from structural parent links and never mutate statuses.
    const stepLike = [...steps, ...projects.filter(p => p.type === 'GTD-ProjetMonolithe')];
    const graph = new Map(stepLike.map(s => [path(s), []]));
    for (const s of stepLike) {
        const edges = links(s, 'gtd_predecesseurs');
        const predecessors = [];
        for (const edge of edges) {
            if (!edge.page) {
                if (!archived(s)) add('predecesseur_introuvable','etapes','Prédécesseurs introuvables',s,edge.raw);
            } else if (!['GTD-Etape','GTD-ProjetMonolithe'].includes(edge.page.type)) {
                if (!archived(s)) add('predecesseur_type_incorrect','etapes','Prédécesseurs de type incorrect',s,edge.page.file.name + ' : une étape ou un monolithe est attendu.');
            } else if (path(edge.page) === path(s)) {
                if (!archived(s)) add('predecesseur_soi','etapes','Étapes qui dépendent d’elles-mêmes',s,'Retirer le lien vers cette même fiche.');
            } else if (!predecessors.includes(edge.page)) predecessors.push(edge.page);
        }
        graph.set(path(s),predecessors.map(path));
        if (archived(s) || !stepOpen(s)) continue;
        const pending = predecessors.filter(p => p.gtd_statut_etape !== '8.faite');
        const unresolved = edges.some(e => !e.page || !['GTD-Etape','GTD-ProjetMonolithe'].includes(e.page.type) || path(e.page) === path(s));
        if (pending.length) add('predecesseurs_non_termines','etapes','Étapes avec prédécesseurs à terminer',s,pending.map(p => p.file.name + ' (' + (p.gtd_statut_etape || 'sans statut') + ')').join(' · '));
        if ((pending.length || unresolved) && ['2.prete','3.en_cours','5.delegation_agent','6.delegue','7.validation'].includes(s.gtd_statut_etape)) add('etape_prete_avant_predecesseurs','etapes','Étapes prêtes ou engagées avant leurs prédécesseurs',s,'Terminer les prédécesseurs ou revoir les dépendances et le statut. Un abandon ne lève pas automatiquement la dépendance.');
    }
    // Strongly connected components detect every member of a cycle, including overlapping cycles.
    const indices = new Map(), low = new Map(), stack = [], onStack = new Set(), cycles = new Set();
    let nextIndex = 0;
    const visit = id => {
        indices.set(id,nextIndex); low.set(id,nextIndex++); stack.push(id); onStack.add(id);
        for (const dependency of graph.get(id) || []) {
            if (!indices.has(dependency)) { visit(dependency); low.set(id,Math.min(low.get(id),low.get(dependency))); }
            else if (onStack.has(dependency)) low.set(id,Math.min(low.get(id),indices.get(dependency)));
        }
        if (low.get(id) === indices.get(id)) {
            const component = []; let item;
            do { item = stack.pop(); onStack.delete(item); component.push(item); } while (item !== id);
            if (component.length > 1) component.forEach(p => cycles.add(p));
        }
    };
    for (const id of graph.keys()) if (!indices.has(id)) visit(id);
    for (const s of stepLike) if (!archived(s) && cycles.has(path(s))) add('cycle_predecesseurs','etapes','Cycles entre prédécesseurs',s,'Revoir les liens pour que les dépendances ne reviennent pas à une étape déjà rencontrée.');
    for (const s of liveSteps) {
        if (!targets(s,'gtd_projet').some(p => p.type === 'GTD-Projet')) add('etape_sans_projet','etapes','Étapes sans projet valide',s,'Renseigner un lien vers un projet existant. Un monolithe porte ses actions lui-même, sans étape enfant.');
    }
    for (const s of [...liveSteps, ...liveProjects.filter(p => p.type === 'GTD-ProjetMonolithe')]) {
        if (['3.en_cours','5.delegation_agent','6.delegue','7.validation'].includes(s.gtd_statut_etape) && !activeParents(s).length) add('etape_sans_parent_actif','etapes','Étapes en cours sans projet actif',s,'Activer un projet parent ou remettre l’étape en préparation/prête. Un seul parent actif suffit pour une étape partagée.');
    }
    for (const goal of all.filter(p => p.type === 'GTD-Objectif' && !archived(p))) {
        if (goal.gtd_statut_objectif === '2.actif' && !projects.some(p => isActiveProject(p) && targets(p,'gtd_objectif').includes(goal))) add('objectif_sans_projet','horizons','Objectifs actifs sans projet actif',goal,'Lancer un projet contributif ou revoir le statut de l’objectif.');
    }
    for (const domain of all.filter(p => p.type === 'GTD-Domaine')) {
        const active = projects.filter(p => isActiveProject(p) && targets(p,'gtd_domaine').includes(domain));
        const goals = all.filter(p => p.type === 'GTD-Objectif' && !archived(p) && p.gtd_statut_objectif === '2.actif' && targets(p,'gtd_domaine').includes(domain));
        if (!archived(domain) && !active.length && !goals.length) add('domaine_sans_engagement','horizons','Domaines sans objectif ni projet actif',domain,'Vérifier pendant la revue si la responsabilité est suffisamment entretenue.');
        if (archived(domain) && active.length) add('domaine_archive_actif','horizons','Domaines archivés avec projets actifs',domain,active.map(p => p.file.name).join(' · '));
    }
    const fields = {gtd_raison_detre:'GTD-RaisonDetre',gtd_vision:'GTD-Vision',gtd_objectif:'GTD-Objectif',gtd_domaine:'GTD-Domaine',gtd_projet:'GTD-Projet',gtd_etape:['GTD-Etape','GTD-ProjetMonolithe']};
    const statusValues = {gtd_statut_projet:['0.cadrage_agent','1.en_attente','2.actif','3.en_pause','4.delegation_agent','8.termine','9.abandonne'],gtd_statut_etape:['0.cadrage_agent','1.a_preparer','2.prete','3.en_cours','4.bloquee','5.delegation_agent','6.delegue','7.validation','8.faite','9.abandonnee'],gtd_statut_objectif:['1.propose','2.actif','3.en_pause','8.atteint','9.abandonne']};
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
    const activeObjectives = all.filter(p => p.type === 'GTD-Objectif' && !archived(p) && p.gtd_statut_objectif === '2.actif');
    const activeProjects = projects.filter(isActiveProject);
    const sprint = [...liveSteps, ...liveProjects.filter(p => p.type === 'GTD-ProjetMonolithe')].filter(s => activeParents(s).length);
    const running = sprint.filter(s => ['3.en_cours','5.delegation_agent','6.delegue','7.validation'].includes(s.gtd_statut_etape));
    const runningAll = [...liveSteps, ...liveProjects.filter(p => p.type === 'GTD-ProjetMonolithe')].filter(s => ['3.en_cours','5.delegation_agent','6.delegue','7.validation'].includes(s.gtd_statut_etape));
    return {issues,activeObjectives,activeProjects,sprint,running,runningAll,projectLimit:5,stepLimit:3};
}

const review = buildGtdReview(dv.pages().array(), (target, source) => app.metadataCache.getFirstLinkpathDest(target, source)?.path || null);
const section = input?.section || 'summary';
const categories = {projets:'Projets',etapes:'Étapes',horizons:'Objectifs et domaines',rattachements:'Rattachements et statuts'};
const links = {projets:'Contrôles des projets',etapes:'Contrôles des étapes',horizons:'Contrôles des objectifs et domaines',rattachements:'Contrôles des rattachements'};
if (section === 'contexte_projets' || section === 'contexte_objectifs') {
    const projects = section === 'contexte_projets';
    const items = [...(projects ? review.activeProjects : review.activeObjectives)].sort((a,b) => a.file.name.localeCompare(b.file.name, 'fr'));
    const compactLinks = items.map(p => String(p.file.link));
    dv.paragraph('**' + (projects ? 'Projets en cours' : 'Objectifs en cours') + '** : ' + (compactLinks.length ? compactLinks.join(' · ') : 'aucun'));
} else if (section === 'portefeuille' || section === 'sprint') {
    const portfolio = section === 'portefeuille';
    const count = portfolio ? review.activeProjects.length : review.runningAll.length;
    const max = portfolio ? review.projectLimit : review.stepLimit;
    dv.paragraph((count > max ? '⚠️ ' : '') + '**' + count + (portfolio ? ' projet(s) actif(s)' : ' étape(s) en cours') + '** — plafond de ' + max + '. Repère : ' + (portfolio ? '3 à 5 projets actifs.' : '2 à 3 étapes en cours.') + (portfolio ? ' Délégations incluses.' : ' Délégations et validation incluses.'));
    if (!portfolio) dv.paragraph(review.sprint.length + ' étape(s) ou monolithe(s) liés à un projet actif. Une étape partagée compte une seule fois.');
    const relevant = review.issues.filter(i => portfolio ? i.category === 'projets' : i.category === 'etapes');
    if (relevant.length) dv.table(['À revoir','Fiche'], relevant.map(i => [i.title,i.page.file.link]));
    else dv.paragraph('Aucune anomalie détectée pour ce tableau.');
} else if (section === 'summary') {
    dv.paragraph('**' + review.issues.length + ' signalement(s)** à examiner. Les contrôles sont en lecture seule.');
    dv.table(['Contrôles','Signalements'],Object.entries(categories).map(([key,title]) => [dv.fileLink('r_templates/resources/Pilotage GTD/' + links[key] + '.md',false,title),review.issues.filter(i => i.category === key).length]));
    if (review.activeProjects.length > review.projectLimit || review.runningAll.length > review.stepLimit) dv.paragraph('⚠️ Capacité dépassée : ' + review.activeProjects.length + ' projets actifs / 5 ; ' + review.runningAll.length + ' étapes en cours / 3.');
} else {
    const rows = review.issues.filter(i => i.category === section);
    if (!rows.length) dv.paragraph('Aucune anomalie détectée pour ces contrôles.');
    for (const title of [...new Set(rows.map(i => i.title))]) {
        dv.header(3,title);
        dv.table(['Fiche','À examiner'],rows.filter(i => i.title === title).map(i => [i.page.file.link,i.detail]));
    }
}
