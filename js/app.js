/* ═══════════════════════════════════════════
   WOLVES OF MAYHEM — App JS
   ═══════════════════════════════════════════ */
'use strict';

let currentUser = null;
let availableLogos = []; // populated from logos/manifest.json on load

/* ── ROUTER ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) { t.classList.add('active'); window.scrollTo(0,0); }
  if (id === 'page-roster')   renderRoster();
  if (id === 'page-settings') renderSettings();
}

function scrollToAbout() {
  document.getElementById('about-section')?.scrollIntoView({ behavior:'smooth' });
}

/* ── LOGO MANIFEST ── */
async function loadLogoManifest() {
  try {
    const res = await fetch('logos/manifest.json?_=' + Date.now());
    if (!res.ok) throw new Error('manifest not found');
    const data = await res.json();
    availableLogos = data.logos || [];
  } catch (e) {
    console.warn('logos/manifest.json not loaded, using fallback', e);
    availableLogos = [
      { file: 'patch.png', label: 'Full Patch',  description: 'Full club patch' },
      { file: 'wolf.png',  label: 'Wolf Head',   description: 'Wolf head logo'  },
    ];
  }
}

/* ── LOGO RENDERING ── */
function renderLogos() {
  const src = `logos/${CFG.club.activeLogo}`;
  document.querySelectorAll('[data-logo-slot]').forEach(el => {
    const which  = el.dataset.logoSlot;
    const size   = which === 'hero' ? '240px' : '100%';
    const radius = which === 'hero' ? '8px'   : '50%';
    el.innerHTML = `<img src="${src}" alt="WOM Logo" style="width:${size};height:${size};object-fit:contain;border-radius:${radius};" onerror="this.style.opacity=0.3" />`;
  });
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg) aboutImg.src = src;
}

/* ── LANDING ── */
function renderLanding() {
  document.querySelectorAll('[data-name]').forEach(el     => el.textContent = CFG.club.name);
  document.querySelectorAll('[data-motto]').forEach(el    => el.textContent = CFG.club.motto);
  document.querySelectorAll('[data-location]').forEach(el => el.textContent = CFG.club.location);
  document.querySelectorAll('[data-founded]').forEach(el  => el.textContent = CFG.club.founded);
  document.querySelectorAll('[data-about]').forEach(el    => el.textContent = CFG.club.about);
  renderLogos();
}

/* ── AUTH ── */
function handleLogin() {
  const u   = document.getElementById('login-user')?.value.trim().toLowerCase();
  const p   = document.getElementById('login-pass')?.value;
  const err = document.getElementById('login-err');

  const member = CFG.members.find(m => m.username === u && m.password === p);
  if (!member) {
    err.classList.add('show');
    document.getElementById('login-pass').value = '';
    return;
  }
  err.classList.remove('show');
  currentUser = member;

  if (member.access === 'admin') {
    showPage('page-dashboard');
    renderDashboard();
  } else {
    showPage('page-roster');
  }
}

function handleLogout() {
  currentUser = null;
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  showPage('page-landing');
}

/* ── DASHBOARD ── */
function renderDashboard() {
  const el = document.getElementById('dash-name');
  if (el) el.textContent = currentUser?.name || '—';
  const grid = document.getElementById('dash-grid');
  if (!grid) return;

  const icons = {
    roster:    `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    finances:  `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    inventory: `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    events:    `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    settings:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  };

  const mods = Object.entries(CFG.modules)
    .sort((a,b) => a[1].order - b[1].order)
    .filter(([,m]) => m.enabled);

  grid.innerHTML = mods.map(([id, m]) => {
    const hasAccess = m.access.includes(currentUser.access);
    return `
      <div class="dash-tile ${hasAccess?'':'locked'}"
           ${hasAccess ? `onclick="showPage('${m.page}')"` : 'title="Access restricted"'}>
        <span class="tile-icon">${icons[id]||icons.settings}</span>
        <span class="tile-label">${m.label}</span>
        ${!hasAccess ? `<span class="tile-lock"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>` : ''}
      </div>`;
  }).join('');
}

/* ── ROSTER ── */
function renderRoster() {
  const tbody = document.getElementById('roster-tbody');
  const count = document.getElementById('roster-count');
  if (!tbody) return;

  const members = CFG.members.filter(m => m.access !== 'view');
  if (count) count.textContent = members.length;

  tbody.innerHTML = members.map(m => {
    const tic = timeInClub(m.joined);
    const joinFmt = m.joined ? new Date(m.joined).toLocaleDateString('en-CA') : '—';
    return `
      <tr>
        <td><span class="rank-badge">${esc(m.rank||'Member')}</span></td>
        <td class="name-cell">${esc(m.name)}</td>
        <td>${esc(m.discord||'—')}</td>
        <td class="mono">${esc(m.discordId||'—')}</td>
        <td class="mono">${esc(m.cid||'—')}</td>
        <td>${joinFmt}</td>
        <td class="tic">${tic}</td>
      </tr>`;
  }).join('');
}

/* ── SETTINGS ── */
function renderSettings() {
  const el = document.getElementById('settings-body');
  if (!el) return;

  /* Build logo dropdown from manifest */
  const logoOpts = availableLogos.map(l =>
    `<option value="${esc(l.file)}" ${CFG.club.activeLogo===l.file?'selected':''}>${esc(l.label)} — ${esc(l.file)}</option>`
  ).join('');

  /* Build logo preview grid from manifest */
  const logoPreviews = availableLogos.map(l => `
    <div class="logo-preview-card ${CFG.club.activeLogo===l.file?'logo-active':''}">
      <img src="logos/${esc(l.file)}" alt="${esc(l.label)}" onerror="this.style.opacity=0.2" />
      <span class="logo-preview-name">${esc(l.label)}</span>
      <span class="logo-preview-file">${esc(l.file)}</span>
      ${l.description ? `<span class="logo-preview-desc">${esc(l.description)}</span>` : ''}
    </div>`).join('');

  el.innerHTML = `
    <div class="stab-bar">
      <button class="stab active" onclick="switchStab(this,'stab-club')">Club Info</button>
      <button class="stab" onclick="switchStab(this,'stab-logo')">Logo</button>
      <button class="stab" onclick="switchStab(this,'stab-modules')">Modules</button>
      <button class="stab" onclick="switchStab(this,'stab-members')">Members</button>
    </div>

    <!-- CLUB INFO -->
    <div class="stab-panel active" id="stab-club">
      ${sRow('Club Name',  'si-name',     CFG.club.name)}
      ${sRow('Motto',      'si-motto',    CFG.club.motto)}
      ${sRow('Founded',    'si-founded',  CFG.club.founded)}
      ${sRow('Location',   'si-location', CFG.club.location)}
      <div class="s-row s-row--col">
        <label class="s-label">About Blurb</label>
        <textarea class="s-input s-textarea" id="si-about">${esc(CFG.club.about)}</textarea>
      </div>
    </div>

    <!-- LOGO -->
    <div class="stab-panel" id="stab-logo">
      <p class="s-hint" style="margin-bottom:1.5rem;">
        All <code>.png</code> files in the <code>logos/</code> folder are listed here automatically via <code>logos/manifest.json</code>.
        To add a new logo: drop the PNG into <code>logos/</code> and add a line to <code>manifest.json</code>.
      </p>

      <div class="s-row">
        <label class="s-label">Active Logo</label>
        <select class="s-input s-select" id="si-logo-active" onchange="previewLogoChange(this.value)">${logoOpts}</select>
      </div>

      <div class="logo-previews" id="logo-previews-grid">
        ${logoPreviews}
      </div>
    </div>

    <!-- MODULES -->
    <div class="stab-panel" id="stab-modules">
      <p class="s-hint" style="margin-bottom:1.5rem;">Toggle modules on/off. Disabled modules are hidden from all users.</p>
      <div class="module-toggle-list">
        ${Object.entries(CFG.modules).map(([id,m]) => `
          <div class="mod-row">
            <label class="s-toggle-wrap">
              <input type="checkbox" class="s-toggle-input" id="mod-${id}" ${m.enabled?'checked':''}/>
              <span class="s-toggle-track"><span class="s-toggle-thumb"></span></span>
            </label>
            <div class="mod-info">
              <span class="mod-name">${m.label}</span>
              <span class="mod-access">Access: ${m.access.join(', ')}</span>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- MEMBERS -->
    <div class="stab-panel" id="stab-members">
      <p class="s-hint" style="margin-bottom:1rem;">Define credentials and access for each member. View-only accounts (like gangteam) are hidden from the public roster.</p>
      <div id="members-list">
        ${CFG.members.map((m,i) => memberRow(m,i)).join('')}
      </div>
      <button class="s-add-btn" onclick="addMemberRow()">+ Add Member</button>
    </div>

    <!-- SAVE -->
    <div class="s-actions">
      <button class="btn-save" onclick="saveSettings()">Save All Changes</button>
      <button class="btn-reset" onclick="if(confirm('Factory reset everything?')){CFG=ConfigManager.reset();applyTheme(CFG.colors);renderLanding();renderSettings();}">Factory Reset</button>
      <span class="s-saved" id="s-saved-msg"></span>
    </div>
  `;
}

/* Live logo preview when dropdown changes */
function previewLogoChange(filename) {
  /* Highlight the selected card */
  document.querySelectorAll('.logo-preview-card').forEach(c => {
    c.classList.toggle('logo-active', c.querySelector('.logo-preview-file')?.textContent === filename);
  });
}

function sRow(label, id, val) {
  return `<div class="s-row"><label class="s-label">${label}</label><input class="s-input" id="${id}" type="text" value="${esc(val||'')}" /></div>`;
}

function memberRow(m, i) {
  const accessOpts = ['admin','member','view'].map(a =>
    `<option value="${a}" ${m.access===a?'selected':''}>${a}</option>`).join('');
  const rankOpts = ['President','Vice President','Sergeant at Arms','Road Captain','Treasurer','Secretary','Enforcer','Member','Prospect','Hangaround','Observer']
    .map(r => `<option value="${r}" ${m.rank===r?'selected':''}>${r}</option>`).join('');
  return `
    <div class="member-edit-card" id="medit-${i}">
      <div class="medit-header">
        <span class="medit-num">#${i+1}</span>
        <button class="medit-del" onclick="document.getElementById('medit-${i}').remove()" title="Remove">&#10005;</button>
      </div>
      <div class="medit-grid">
        <div class="medit-field"><label>Display Name</label><input class="s-input" id="m-name-${i}"      value="${esc(m.name||'')}"/></div>
        <div class="medit-field"><label>Rank</label><select class="s-input s-select" id="m-rank-${i}">${rankOpts}</select></div>
        <div class="medit-field"><label>Username</label><input class="s-input" id="m-user-${i}"          value="${esc(m.username||'')}" autocomplete="off"/></div>
        <div class="medit-field"><label>Password</label><input class="s-input" id="m-pass-${i}"          value="${esc(m.password||'')}" type="password" autocomplete="off"/></div>
        <div class="medit-field"><label>Discord</label><input class="s-input" id="m-discord-${i}"        value="${esc(m.discord||'')}"/></div>
        <div class="medit-field"><label>Discord ID</label><input class="s-input" id="m-discordid-${i}"   value="${esc(m.discordId||'')}"/></div>
        <div class="medit-field"><label>CID</label><input class="s-input" id="m-cid-${i}"                value="${esc(m.cid||'')}"/></div>
        <div class="medit-field"><label>Join Date</label><input class="s-input" id="m-joined-${i}"       value="${esc(m.joined||'')}" type="date"/></div>
        <div class="medit-field"><label>Portal Access</label><select class="s-input s-select" id="m-access-${i}">${accessOpts}</select></div>
      </div>
    </div>`;
}

function addMemberRow() {
  const list = document.getElementById('members-list');
  const i = document.querySelectorAll('.member-edit-card').length;
  const div = document.createElement('div');
  div.innerHTML = memberRow({name:'',rank:'Member',username:'',password:'',discord:'',discordId:'',cid:'',joined:'',access:'member'}, i);
  list.appendChild(div.firstElementChild);
}

function switchStab(btn, panelId) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.stab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId)?.classList.add('active');
}

function saveSettings() {
  const g = id => document.getElementById(id)?.value?.trim() || '';

  CFG.club.name       = g('si-name')      || CFG.club.name;
  CFG.club.motto      = g('si-motto')     || CFG.club.motto;
  CFG.club.founded    = g('si-founded')   || CFG.club.founded;
  CFG.club.location   = g('si-location')  || CFG.club.location;
  CFG.club.about      = document.getElementById('si-about')?.value || CFG.club.about;
  CFG.club.activeLogo = g('si-logo-active') || CFG.club.activeLogo;

  Object.keys(CFG.modules).forEach(id => {
    const cb = document.getElementById(`mod-${id}`);
    if (cb) CFG.modules[id].enabled = cb.checked;
  });

  const cards = document.querySelectorAll('.member-edit-card');
  CFG.members = Array.from(cards).map((_, i) => ({
    name:      g(`m-name-${i}`),
    rank:      g(`m-rank-${i}`)   || 'Member',
    username:  g(`m-user-${i}`).toLowerCase(),
    password:  document.getElementById(`m-pass-${i}`)?.value || '',
    discord:   g(`m-discord-${i}`),
    discordId: g(`m-discordid-${i}`),
    cid:       g(`m-cid-${i}`),
    joined:    g(`m-joined-${i}`),
    access:    g(`m-access-${i}`) || 'member',
  })).filter(m => m.username && m.password);

  ConfigManager.save(CFG);
  renderLanding();

  const msg = document.getElementById('s-saved-msg');
  if (msg) { msg.textContent = 'Saved!'; msg.classList.add('show'); setTimeout(()=>msg.classList.remove('show'),2500); }
}

/* ── HELPERS ── */
function esc(s='') { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const active = document.querySelector('.page.active');
  if (active?.id === 'page-portal') {
    if (document.activeElement?.id === 'login-user') document.getElementById('login-pass')?.focus();
    else handleLogin();
  }
});

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadLogoManifest();  // load manifest first so logos are ready
  applyTheme(CFG.colors);
  renderLanding();
  showPage('page-landing');
});
