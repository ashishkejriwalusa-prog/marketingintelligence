const STORAGE_KEY = 'scalewiseCompetitorIntelV1';
const today = new Date().toISOString().slice(0, 10);

const demoData = {
  competitors: [
    {
      id: crypto.randomUUID(), companyName: 'Entigrity', website: 'https://www.entigrity.com', industry: 'CPA Outsourcing', targetGeo: 'USA', primaryMarket: 'CPA firms', priority: 'High', threatLevel: 'High', status: 'In Progress', mainQuestion: 'How did Entigrity build its CPA outsourcing marketing engine from inception to today?', createdAt: today
    },
    {
      id: crypto.randomUUID(), companyName: 'TOA Global', website: 'https://www.toaglobal.com', industry: 'Offshore Accounting', targetGeo: 'USA, Australia', primaryMarket: 'Accounting firms', priority: 'High', threatLevel: 'High', status: 'Not Started', mainQuestion: 'How does TOA Global position offshore accounting talent for accounting firms?', createdAt: today
    }
  ],
  evidence: [],
  scores: [],
  actions: []
};

demoData.actions = [
  { id: crypto.randomUUID(), competitorId: demoData.competitors[0].id, category: 'SEO', priority: 'High', status: 'Not Started', dueDate: '', owner: 'ScaleWise', actionText: 'Build a CPA tax-season outsourcing landing page with clear pain points, deliverables, security controls, and consultation CTA.', expectedImpact: 'Capture high-intent CPA firm searches before tax season.', createdAt: today },
  { id: crypto.randomUUID(), competitorId: demoData.competitors[1].id, category: 'LinkedIn', priority: 'High', status: 'In Progress', dueDate: '', owner: 'Ashish', actionText: 'Launch founder-led LinkedIn series on why CPA firms need offshore capacity without losing quality control.', expectedImpact: 'Build trust and premium authority before outbound outreach.', createdAt: today }
];

let state = loadState();
let currentView = 'dashboard';

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return structuredClone(demoData);
  }
  try { return JSON.parse(raw); } catch { return structuredClone(demoData); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderAll(); }
function $(id) { return document.getElementById(id); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])); }
function competitorName(id) { return state.competitors.find(c => c.id === id)?.companyName || 'Unassigned'; }
function badge(value) { const cls = String(value || 'unknown').toLowerCase(); return `<span class="badge ${cls}">${escapeHtml(value || 'Unknown')}</span>`; }
function avg(nums) { const clean = nums.map(Number).filter(n => !Number.isNaN(n)); return clean.length ? (clean.reduce((a,b)=>a+b,0) / clean.length).toFixed(1) : '0.0'; }

const titles = {
  dashboard: ['Dashboard', 'Reverse-engineer offshore/KPO competitor marketing strategies and convert them into ScaleWise actions.'],
  competitors: ['Competitors', 'Create and manage the companies you want to research.'],
  evidence: ['Evidence Repository', 'Store public-source evidence and separate facts from strategic inference.'],
  scorecard: ['Scorecard', 'Rate each competitor’s marketing maturity and threat level.'],
  actions: ['ScaleWise Actions', 'Turn competitor insights into execution tasks.'],
  report: ['Report Builder', 'Generate a boardroom-style competitor strategy report.'],
  playbook: ['Research Playbook', 'Follow a repeatable research process for every KPO/offshore competitor.']
};

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  $(view).classList.add('active-view');
  document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
  $('pageTitle').textContent = titles[view][0];
  $('pageSubTitle').textContent = titles[view][1];
}

document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
document.querySelectorAll('[data-open-view]').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.openView)));
$('quickAddCompetitor').addEventListener('click', () => switchView('competitors'));

function renderDropdowns() {
  const options = state.competitors.map(c => `<option value="${c.id}">${escapeHtml(c.companyName)}</option>`).join('');
  ['evidenceCompetitor','scoreCompetitor','actionCompetitor','reportCompetitor'].forEach(id => { $(id).innerHTML = options || '<option value="">Add a competitor first</option>'; });
}

function renderDashboard() {
  $('metricCompetitors').textContent = state.competitors.length;
  $('metricEvidence').textContent = state.evidence.length;
  $('metricActions').textContent = state.actions.filter(a => a.status !== 'Done').length;
  $('metricThreats').textContent = state.competitors.filter(c => c.threatLevel === 'High').length;
  $('dashboardCompetitors').innerHTML = state.competitors.slice(0,5).map(c => `<div class="list-item"><strong>${escapeHtml(c.companyName)} ${badge(c.threatLevel)}</strong><p>${escapeHtml(c.industry)} • ${escapeHtml(c.primaryMarket)} • ${escapeHtml(c.status)}</p></div>`).join('') || '<p>No competitors yet.</p>';
  $('dashboardActions').innerHTML = state.actions.filter(a => a.status !== 'Done').slice(0,5).map(a => `<div class="list-item"><strong>${escapeHtml(a.actionText)}</strong><p>${escapeHtml(a.category)} • ${escapeHtml(a.priority)} • Source: ${escapeHtml(competitorName(a.competitorId))}</p></div>`).join('') || '<p>No open actions yet.</p>';
}

function renderCompetitors() {
  const q = ($('competitorSearch')?.value || '').toLowerCase();
  const rows = state.competitors.filter(c => Object.values(c).join(' ').toLowerCase().includes(q)).map(c => `<tr>
    <td><strong>${escapeHtml(c.companyName)}</strong><br><a href="${escapeHtml(c.website)}" target="_blank" rel="noopener">${escapeHtml(c.website)}</a></td>
    <td>${escapeHtml(c.industry)}<br><small>${escapeHtml(c.primaryMarket)}</small></td>
    <td>${escapeHtml(c.targetGeo)}</td><td>${badge(c.priority)}</td><td>${badge(c.threatLevel)}</td><td>${escapeHtml(c.status)}</td>
    <td class="row-actions"><button onclick="editCompetitor('${c.id}')">Edit</button><button onclick="deleteCompetitor('${c.id}')">Delete</button></td>
  </tr>`).join('');
  $('competitorTable').innerHTML = `<table><thead><tr><th>Company</th><th>Industry / Market</th><th>Geography</th><th>Priority</th><th>Threat</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No competitors found.</td></tr>'}</tbody></table>`;
}

window.editCompetitor = id => {
  const c = state.competitors.find(x => x.id === id); if (!c) return;
  ['competitorId','companyName','website','industry','targetGeo','primaryMarket','priority','threatLevel','status','mainQuestion'].forEach(k => $(k).value = c[k] || '');
  switchView('competitors');
};
window.deleteCompetitor = id => {
  if (!confirm('Delete this competitor and related scorecards/actions/evidence?')) return;
  state.competitors = state.competitors.filter(c => c.id !== id);
  state.evidence = state.evidence.filter(e => e.competitorId !== id);
  state.scores = state.scores.filter(s => s.competitorId !== id);
  state.actions = state.actions.filter(a => a.competitorId !== id);
  saveState();
};

$('competitorForm').addEventListener('submit', e => {
  e.preventDefault();
  const item = { id: $('competitorId').value || crypto.randomUUID(), companyName: $('companyName').value.trim(), website: $('website').value.trim(), industry: $('industry').value, targetGeo: $('targetGeo').value, primaryMarket: $('primaryMarket').value, priority: $('priority').value, threatLevel: $('threatLevel').value, status: $('status').value, mainQuestion: $('mainQuestion').value, createdAt: today };
  const idx = state.competitors.findIndex(c => c.id === item.id);
  idx >= 0 ? state.competitors[idx] = item : state.competitors.push(item);
  e.target.reset(); $('competitorId').value = '';
  saveState();
});
$('clearCompetitorForm').addEventListener('click', () => { $('competitorForm').reset(); $('competitorId').value = ''; });
$('competitorSearch').addEventListener('input', renderCompetitors);

function renderEvidence() {
  const q = ($('evidenceSearch')?.value || '').toLowerCase();
  const rows = state.evidence.filter(e => Object.values(e).join(' ').toLowerCase().includes(q)).map(e => `<tr>
    <td><strong>${escapeHtml(competitorName(e.competitorId))}</strong><br>${escapeHtml(e.sourceType)} • ${escapeHtml(e.strategyTag)}</td>
    <td>${escapeHtml(e.evidenceSummary)}<br><small>${escapeHtml(e.sourceUrl)}</small></td>
    <td>${escapeHtml(e.strategicSignal)}</td><td>${badge(e.confidence)}</td><td>${escapeHtml(e.funnelStage)}</td><td>${badge(e.relevance)}</td>
    <td class="row-actions"><button onclick="editEvidence('${e.id}')">Edit</button><button onclick="deleteEvidence('${e.id}')">Delete</button></td>
  </tr>`).join('');
  $('evidenceTable').innerHTML = `<table><thead><tr><th>Source</th><th>Evidence</th><th>Signal</th><th>Confidence</th><th>Funnel</th><th>Relevance</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No evidence captured yet.</td></tr>'}</tbody></table>`;
}
window.editEvidence = id => { const e = state.evidence.find(x => x.id === id); if (!e) return; const map = { evidenceId:'id', evidenceCompetitor:'competitorId', sourceType:'sourceType', sourceUrl:'sourceUrl', sourceDate:'sourceDate', confidence:'confidence', funnelStage:'funnelStage', relevance:'relevance', strategyTag:'strategyTag', evidenceSummary:'evidenceSummary', strategicSignal:'strategicSignal', scaleWiseAction:'scaleWiseAction' }; Object.entries(map).forEach(([field,key]) => $(field).value = e[key] || ''); switchView('evidence'); };
window.deleteEvidence = id => { if(confirm('Delete this evidence item?')) { state.evidence = state.evidence.filter(e => e.id !== id); saveState(); } };
$('evidenceForm').addEventListener('submit', e => { e.preventDefault(); const item = { id: $('evidenceId').value || crypto.randomUUID(), competitorId: $('evidenceCompetitor').value, sourceType: $('sourceType').value, sourceUrl: $('sourceUrl').value, sourceDate: $('sourceDate').value, confidence: $('confidence').value, funnelStage: $('funnelStage').value, relevance: $('relevance').value, strategyTag: $('strategyTag').value, evidenceSummary: $('evidenceSummary').value, strategicSignal: $('strategicSignal').value, scaleWiseAction: $('scaleWiseAction').value, createdAt: today }; const idx = state.evidence.findIndex(x => x.id === item.id); idx >= 0 ? state.evidence[idx] = item : state.evidence.push(item); e.target.reset(); $('evidenceId').value = ''; saveState(); });
$('clearEvidenceForm').addEventListener('click', () => { $('evidenceForm').reset(); $('evidenceId').value = ''; });
$('evidenceSearch').addEventListener('input', renderEvidence);

function scoreAverage(s) { return avg(['websiteScore','serviceScore','nicheScore','seoScore','linkedinScore','founderScore','videoScore','prScore','funnelScore','trustScore','salesScore','diffScore'].map(k => s[k])); }
function renderScores() {
  const rows = state.scores.map(s => `<tr><td><strong>${escapeHtml(competitorName(s.competitorId))}</strong></td><td><strong>${scoreAverage(s)} / 10</strong></td><td>${escapeHtml(s.bestCopy || '')}</td><td>${escapeHtml(s.weaknessExploit || '')}</td><td class="row-actions"><button onclick="editScore('${s.id}')">Edit</button><button onclick="deleteScore('${s.id}')">Delete</button></td></tr>`).join('');
  $('scoreTable').innerHTML = `<table><thead><tr><th>Competitor</th><th>Average</th><th>Best to Copy</th><th>Weakness to Exploit</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No scorecards yet.</td></tr>'}</tbody></table>`;
}
window.editScore = id => { const s = state.scores.find(x => x.id === id); if(!s) return; ['scoreId','scoreCompetitor','websiteScore','serviceScore','nicheScore','seoScore','linkedinScore','founderScore','videoScore','prScore','funnelScore','trustScore','salesScore','diffScore','bestCopy','weaknessExploit'].forEach(k => { const key = k === 'scoreId' ? 'id' : k === 'scoreCompetitor' ? 'competitorId' : k; $(k).value = s[key] ?? ''; }); switchView('scorecard'); };
window.deleteScore = id => { if(confirm('Delete this scorecard?')) { state.scores = state.scores.filter(s => s.id !== id); saveState(); } };
$('scoreForm').addEventListener('submit', e => { e.preventDefault(); const item = { id: $('scoreId').value || crypto.randomUUID(), competitorId: $('scoreCompetitor').value, websiteScore: $('websiteScore').value, serviceScore: $('serviceScore').value, nicheScore: $('nicheScore').value, seoScore: $('seoScore').value, linkedinScore: $('linkedinScore').value, founderScore: $('founderScore').value, videoScore: $('videoScore').value, prScore: $('prScore').value, funnelScore: $('funnelScore').value, trustScore: $('trustScore').value, salesScore: $('salesScore').value, diffScore: $('diffScore').value, bestCopy: $('bestCopy').value, weaknessExploit: $('weaknessExploit').value, createdAt: today }; const idx = state.scores.findIndex(s => s.id === item.id); idx >= 0 ? state.scores[idx] = item : state.scores.push(item); e.target.reset(); $('scoreId').value = ''; saveState(); });
$('clearScoreForm').addEventListener('click', () => { $('scoreForm').reset(); $('scoreId').value = ''; });

function renderActions() {
  const statuses = ['Not Started', 'In Progress', 'Done'];
  $('kanbanBoard').innerHTML = statuses.map(status => `<div class="kanban-col"><h3>${status}</h3>${state.actions.filter(a => a.status === status).map(a => `<div class="action-card"><h4>${escapeHtml(a.actionText)}</h4><p>${escapeHtml(a.expectedImpact || '')}</p><p><strong>${escapeHtml(a.category)}</strong> • ${escapeHtml(a.priority)} • ${escapeHtml(competitorName(a.competitorId))}</p><div class="row-actions"><button onclick="editAction('${a.id}')">Edit</button><button onclick="deleteAction('${a.id}')">Delete</button></div></div>`).join('') || '<p>No actions.</p>'}</div>`).join('');
}
window.editAction = id => { const a = state.actions.find(x => x.id === id); if(!a) return; const map = { actionId:'id', actionCompetitor:'competitorId', actionCategory:'category', actionPriority:'priority', actionStatus:'status', dueDate:'dueDate', owner:'owner', actionText:'actionText', expectedImpact:'expectedImpact' }; Object.entries(map).forEach(([field,key]) => $(field).value = a[key] || ''); switchView('actions'); };
window.deleteAction = id => { if(confirm('Delete this action?')) { state.actions = state.actions.filter(a => a.id !== id); saveState(); } };
$('actionForm').addEventListener('submit', e => { e.preventDefault(); const item = { id: $('actionId').value || crypto.randomUUID(), competitorId: $('actionCompetitor').value, category: $('actionCategory').value, priority: $('actionPriority').value, status: $('actionStatus').value, dueDate: $('dueDate').value, owner: $('owner').value, actionText: $('actionText').value, expectedImpact: $('expectedImpact').value, createdAt: today }; const idx = state.actions.findIndex(a => a.id === item.id); idx >= 0 ? state.actions[idx] = item : state.actions.push(item); e.target.reset(); $('actionId').value = ''; saveState(); });
$('clearActionForm').addEventListener('click', () => { $('actionForm').reset(); $('actionId').value = ''; });

function generateReportText() {
  const id = $('reportCompetitor').value;
  const c = state.competitors.find(x => x.id === id);
  if (!c) return 'Add a competitor first.';
  const ev = state.evidence.filter(e => e.competitorId === id);
  const sc = state.scores.find(s => s.competitorId === id);
  const ac = state.actions.filter(a => a.competitorId === id);
  const byTag = tag => ev.filter(e => e.strategyTag === tag).map(e => `- Evidence: ${e.evidenceSummary}\n  - Source: ${e.sourceUrl || 'Source URL not added'}\n  - Inference: ${e.strategicSignal || 'Not added'}\n  - ScaleWise Action: ${e.scaleWiseAction || 'Not added'}`).join('\n') || '- No evidence captured yet.';
  return `# Competitor Marketing Strategy Report\n\n**Competitor:** ${c.companyName}\n**Website:** ${c.website}\n**Industry:** ${c.industry}\n**Target Geography:** ${c.targetGeo}\n**Primary Market:** ${c.primaryMarket}\n**Report Date:** ${today}\n\n## 1. Executive Summary\n\n${c.companyName} is being tracked as a ${c.priority.toLowerCase()} priority competitor with ${c.threatLevel.toLowerCase()} threat level. Main research question: ${c.mainQuestion || 'Not specified.'}\n\n## 2. Evidence Snapshot\n\nTotal evidence items captured: ${ev.length}\n\n## 3. Company Background\n\n- Company: ${c.companyName}\n- Website: ${c.website}\n- Industry: ${c.industry}\n- Market: ${c.primaryMarket}\n- Geography: ${c.targetGeo}\n\n## 4. Timeline From Inception\n\nUse archived pages, PR, founder posts, and hiring records to reconstruct early stage, growth stage, expansion stage, and mature stage.\n\n## 5. Website Evolution\n\n${byTag('Positioning')}\n\n## 6. Service Offering Evolution\n\n${byTag('Service Evolution')}\n\n## 7. Target Customer Strategy\n\n${byTag('Buyer Segment')}\n\n## 8. SEO Strategy\n\n${byTag('SEO')}\n\n## 9. LinkedIn Strategy\n\n${byTag('LinkedIn')}\n\n## 10. YouTube / Video Strategy\n\n${byTag('Video')}\n\n## 11. PR and Credibility Strategy\n\n${byTag('PR')}\n\n## 12. Hiring and Expansion Signals\n\n${byTag('Hiring')}\n\n## 13. Sales Funnel Reconstruction\n\n${byTag('Sales Funnel')}\n\n## 14. Marketing Maturity Scorecard\n\n${sc ? `Overall Average: ${scoreAverage(sc)} / 10\n\n- Website Positioning: ${sc.websiteScore}/10\n- Service Clarity: ${sc.serviceScore}/10\n- Niche Focus: ${sc.nicheScore}/10\n- SEO Strength: ${sc.seoScore}/10\n- LinkedIn Authority: ${sc.linkedinScore}/10\n- Founder Branding: ${sc.founderScore}/10\n- YouTube / Video: ${sc.videoScore}/10\n- PR Credibility: ${sc.prScore}/10\n- Lead Funnel: ${sc.funnelScore}/10\n- Trust Signals: ${sc.trustScore}/10\n- Sales Maturity: ${sc.salesScore}/10\n- Differentiation: ${sc.diffScore}/10\n\nBest thing to copy: ${sc.bestCopy || 'Not added'}\n\nBiggest weakness to exploit: ${sc.weaknessExploit || 'Not added'}` : 'No scorecard saved yet.'}\n\n## 15. SWOT Analysis\n\n### Strengths\n- Add based on evidence.\n\n### Weaknesses\n- Add based on evidence.\n\n### Opportunities for ScaleWise\n- Add based on evidence.\n\n### Threats\n- Add based on evidence.\n\n## 16. Copy / Improve / Avoid Matrix\n\n${ev.map(e => `- ${e.relevance}: ${e.scaleWiseAction || e.strategicSignal || e.evidenceSummary}`).join('\n') || '- No matrix items captured yet.'}\n\n## 17. 90-Day ScaleWise Action Plan\n\n${ac.map(a => `- [${a.status}] ${a.actionText}\n  - Category: ${a.category}\n  - Priority: ${a.priority}\n  - Impact: ${a.expectedImpact || 'Not added'}`).join('\n') || '- No actions added yet.'}\n\n## 18. Final Strategic Assessment\n\nFinal assessment should compare confirmed evidence against ScaleWise's positioning and identify what ScaleWise should execute first.`;
}
$('generateReport').addEventListener('click', () => $('reportOutput').value = generateReportText());
$('copyReport').addEventListener('click', () => navigator.clipboard.writeText($('reportOutput').value));
$('downloadReport').addEventListener('click', () => downloadFile('competitor-report.md', $('reportOutput').value, 'text/markdown'));

const masterPrompt = `Act as ScaleWise's Competitive Marketing Intelligence Analyst.\n\nInput:\n- Company name\n- Website\n- Target market\n- Service category\n\nResearch all publicly available sources: current website, archived website pages, Google search results, SEO-visible pages, blogs, case studies, LinkedIn, founder profiles, YouTube, webinars, PR/news, job postings, review sites, awards, partnerships and events.\n\nFor every finding, separate:\n1. Confirmed evidence\n2. Strategic inference\n3. Recommended ScaleWise action\n\nProduce a detailed competitor marketing strategy report covering: executive summary, company background, timeline from inception, website evolution, positioning evolution, target customer strategy, service offering evolution, SEO strategy, LinkedIn strategy, YouTube/video strategy, PR/credibility, hiring/expansion signals, funnel reconstruction, sales strategy inference, SWOT, marketing maturity score, threat level, copy/improve/avoid matrix and 90-day ScaleWise action plan.\n\nRules: use evidence, cite sources, clearly label inference, avoid generic commentary, focus on practical ScaleWise actions.`;
$('masterPrompt').textContent = masterPrompt;
$('copyPrompt').addEventListener('click', () => navigator.clipboard.writeText(masterPrompt));

function renderChecklist() {
  const items = ['Current website','Archived website / Wayback pages','Google indexed pages','SEO service pages','Blog/resource library','Case studies/testimonials','LinkedIn company page','Founder/leadership LinkedIn','YouTube channel','Webinars/podcasts','PR/news/articles','Job postings/careers','Awards/certifications','Partnerships/events'];
  $('sourceChecklist').innerHTML = items.map(i => `<label><input type="checkbox"> ${i}</label>`).join('');
}

function downloadFile(filename, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
$('exportJson').addEventListener('click', () => downloadFile(`scalewise-competitor-intel-${today}.json`, JSON.stringify(state, null, 2), 'application/json'));
$('importJson').addEventListener('change', e => { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = () => { try { state = JSON.parse(reader.result); saveState(); alert('Import complete.'); } catch { alert('Invalid JSON file.'); } }; reader.readAsText(file); });
$('resetDemo').addEventListener('click', () => { if(confirm('Reset to demo data? This will overwrite local data.')) { state = structuredClone(demoData); saveState(); } });
$('exportEvidenceCsv').addEventListener('click', () => { const header = ['Company','Source Type','Source URL','Source Date','Confidence','Funnel Stage','Relevance','Strategy Tag','Evidence Summary','Strategic Signal','ScaleWise Action']; const rows = state.evidence.map(e => [competitorName(e.competitorId),e.sourceType,e.sourceUrl,e.sourceDate,e.confidence,e.funnelStage,e.relevance,e.strategyTag,e.evidenceSummary,e.strategicSignal,e.scaleWiseAction]); const csv = [header, ...rows].map(r => r.map(v => `"${String(v || '').replaceAll('"','""')}"`).join(',')).join('\n'); downloadFile(`evidence-${today}.csv`, csv, 'text/csv'); });

function renderAll() { renderDropdowns(); renderDashboard(); renderCompetitors(); renderEvidence(); renderScores(); renderActions(); renderChecklist(); }
renderAll();
