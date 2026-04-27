/* ═══════════════════════════════════════════
   WOLVES OF MAYHEM — App JS v5
   ═══════════════════════════════════════════ */
'use strict';

let currentUser    = null;
let availableLogos = [];

/* ══════════════════════════════════════════
   ROUTER
   ══════════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) { t.classList.add('active'); window.scrollTo(0,0); }
  if (id === 'page-roster')         renderRoster();
  if (id === 'page-settings')       renderSettings();
  if (id === 'page-events') {
    const logoutBtn = document.getElementById('events-logout-btn');
    if (logoutBtn) logoutBtn.style.display = currentUser ? '' : 'none';
    renderEventsPage();
  }
  if (id === 'page-public-events')  renderPublicEventsPage();
  if (id === 'page-landing')        renderLandingEvents();
}

function scrollToAbout() {
  document.getElementById('about-section')?.scrollIntoView({ behavior:'smooth' });
}

/* ══════════════════════════════════════════
   LOGO MANIFEST
   ══════════════════════════════════════════ */
async function loadLogoManifest() {
  try {
    const res = await fetch('logos/manifest.json?_=' + Date.now());
    if (!res.ok) throw new Error('manifest not found');
    const data = await res.json();
    availableLogos = data.logos || [];
  } catch(e) {
    console.warn('logos/manifest.json not loaded, using fallback', e);
    availableLogos = [
      { file: 'Full_Patch_Kutte.png', label: 'Full Patch',  description: 'Full club patch' },
      { file: 'Full_Patch_2.png',     label: 'Patch',       description: 'Club patch' },
      { file: 'Enhanced_Center.png',  label: 'Wolf Head',   description: 'Wolf head logo' },
    ];
  }
}

/* ══════════════════════════════════════════
   LOGO RENDERING
   ══════════════════════════════════════════ */
function logoSrc(slot) {
  return `logos/${CFG.club.logos[slot] || availableLogos[0]?.file || ''}`;
}

function renderLogos() {
  /* Each [data-logo-slot] gets the right image for its slot */
  document.querySelectorAll('[data-logo-slot]').forEach(el => {
    const slot = el.dataset.logoSlot;
    const src  = logoSrc(slot);
    const isHero = slot === 'hero';
    const size   = isHero ? '240px' : '100%';
    const radius = isHero ? '8px'   : '50%';
    const editAttr = (currentUser?.access === 'admin')
      ? `onclick="openLogoPicker('${slot}')" title="Click to change logo" style="cursor:pointer;"`
      : '';
    el.innerHTML = `<img src="${src}" alt="WOM Logo"
      style="width:${size};height:${size};object-fit:contain;border-radius:${radius};"
      onerror="this.style.opacity=0.25" ${editAttr} />`;
  });

  /* About section static img */
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg) {
    aboutImg.src = logoSrc('about');
    if (currentUser?.access === 'admin') {
      aboutImg.style.cursor = 'pointer';
      aboutImg.onclick = () => openLogoPicker('about');
      aboutImg.title   = 'Click to change logo';
    } else {
      aboutImg.style.cursor = '';
      aboutImg.onclick = null;
    }
  }
}

/* ── Logo Picker Modal ── */
function openLogoPicker(slot) {
  /* Remove any existing picker */
  document.getElementById('logo-picker-modal')?.remove();

  const slotLabels = { hero:'Hero Image', nav:'Nav Icon', about:'About Image', login:'Login Card' };
  const modal = document.createElement('div');
  modal.id = 'logo-picker-modal';
  modal.innerHTML = `
    <div class="lp-backdrop" onclick="closePicker()"></div>
    <div class="lp-card">
      <div class="lp-header">
        <span class="lp-title">Change Logo — ${slotLabels[slot]||slot}</span>
        <button class="lp-close" onclick="closePicker()">&#10005;</button>
      </div>
      <div class="lp-grid">
        ${availableLogos.map(l => `
          <div class="lp-item ${CFG.club.logos[slot]===l.file?'lp-active':''}"
               onclick="selectLogo('${slot}','${l.file}')">
            <img src="logos/${esc(l.file)}" alt="${esc(l.label)}" onerror="this.style.opacity=0.2" />
            <span class="lp-label">${esc(l.label)}</span>
            <span class="lp-file">${esc(l.file)}</span>
          </div>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function closePicker() {
  document.getElementById('logo-picker-modal')?.remove();
}

function selectLogo(slot, file) {
  CFG.club.logos[slot] = file;
  ConfigManager.save(CFG);
  closePicker();
  renderLogos();
}

/* ══════════════════════════════════════════
   LANDING / NAV
   ══════════════════════════════════════════ */
function renderLanding() {
  document.querySelectorAll('[data-name]').forEach(el     => el.textContent = CFG.club.name);
  document.querySelectorAll('[data-motto]').forEach(el    => el.textContent = CFG.club.motto);
  document.querySelectorAll('[data-location]').forEach(el => el.textContent = CFG.club.location);
  document.querySelectorAll('[data-founded]').forEach(el  => el.textContent = CFG.club.founded);
  document.querySelectorAll('[data-about]').forEach(el    => el.textContent = CFG.club.about);
  renderLogos();
  updateNav();
  renderLandingEvents();
}

function updateNav() {
  const loginBtn  = document.getElementById('nav-login-btn');
  const memberNav = document.getElementById('nav-member-area');

  if (currentUser) {
    const displayName = currentUser.roadName || currentUser.name || currentUser.username;
    if (loginBtn)  loginBtn.style.display  = 'none';
    const portalLi = document.getElementById('nav-portal-li');
    if (portalLi) portalLi.style.display = '';
    if (memberNav) {
      memberNav.style.display = 'flex';
      memberNav.innerHTML = `
        <span class="nav-member-name">${esc(displayName)}</span>
        <button class="nav-portal-btn" onclick="goToPortal()">Member Portal</button>
      `;
    }
  } else {
    if (loginBtn)  loginBtn.style.display  = '';
    const portalLi = document.getElementById('nav-portal-li');
    if (portalLi) portalLi.style.display = 'none';
    if (memberNav) {
      memberNav.style.display = 'none';
      memberNav.innerHTML = '';
    }
  }
}

function goToPortal() {
  if (!currentUser) { showPage('page-portal'); return; }
  if (currentUser.access === 'admin') {
    showPage('page-dashboard');
    renderDashboard();
  } else {
    showPage('page-roster');
  }
}

/* ══════════════════════════════════════════
   AUTH
   ══════════════════════════════════════════ */
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
  updateNav();
  renderLogos(); /* re-render so admin edit cursors appear */

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
  updateNav();
  renderLogos();
  showPage('page-landing');
}

/* ══════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════ */
function renderDashboard() {
  const el = document.getElementById('dash-name');
  if (el) el.textContent = currentUser?.roadName || currentUser?.name || '—';

  const grid = document.getElementById('dash-grid');
  if (!grid) return;

  const icons = {
    roster:    `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    finances:  `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    inventory: `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    events:    `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    settings:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    mainsite:  `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  };

  const mods = Object.entries(CFG.modules)
    .sort((a,b) => a[1].order - b[1].order)
    .filter(([,m]) => m.enabled);

  grid.innerHTML = mods.map(([id, m]) => {
    const hasAccess = m.access.includes(currentUser.access);
    return `
      <div class="dash-tile ${hasAccess?'':'locked'}"
           ${hasAccess ? `onclick="showPage('${m.page}')"` : `title="Access restricted"`}>
        <span class="tile-icon">${icons[id]||icons.settings}</span>
        <span class="tile-label">${m.label}</span>
        ${!hasAccess?`<span class="tile-lock"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>`:''}
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════
   ROSTER — sectioned view
   ══════════════════════════════════════════ */
function renderRoster() {
  const tbody = document.getElementById('roster-tbody');
  const count = document.getElementById('roster-count');
  if (!tbody) return;

  /* Members visible on roster (exclude view-only) */
  const members = CFG.members.filter(m => m.access !== 'view');
  if (count) count.textContent = members.length;

  /* Group members by section */
  const sections = getSortedSections();
  const grouped  = {};
  sections.forEach(s => { grouped[s.id] = []; });

  members.forEach(m => {
    const sec = sectionForRank(m.rank);
    if (!grouped[sec.id]) grouped[sec.id] = [];
    grouped[sec.id].push(m);
  });

  let html = '';
  sections.forEach(sec => {
    const rows = grouped[sec.id] || [];
    if (rows.length === 0) return; /* skip empty sections */

    /* Section header row */
    html += `
      <tr class="roster-section-header">
        <td colspan="8">
          <span class="section-label">${esc(sec.label)}</span>
          <span class="section-count">${rows.length}</span>
        </td>
      </tr>`;

    rows.forEach(m => {
      const tic     = timeInClub(m.joined);
      const joinFmt = m.joined ? new Date(m.joined).toLocaleDateString('en-CA') : '—';
      html += `
        <tr class="roster-member-row">
          <td><span class="rank-badge">${esc(m.rank||'Member')}</span></td>
          <td class="name-cell">${esc(m.name)}</td>
          <td class="road-name-cell">${esc(m.roadName||'—')}</td>
          <td>${esc(m.discord||'—')}</td>
          <td class="mono">${esc(m.discordId||'—')}</td>
          <td class="mono">${esc(m.cid||'—')}</td>
          <td>${joinFmt}</td>
          <td class="tic">${tic}</td>
        </tr>`;
    });
  });

  tbody.innerHTML = html || `<tr><td colspan="8" style="text-align:center;color:var(--t3);padding:2rem;">No members yet.</td></tr>`;
}

/* ══════════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════════ */
function renderSettings() {
  const el = document.getElementById('settings-body');
  if (!el) return;

  /* Logo slot selector rows */
  const slotDefs = [
    { slot: 'hero',  label: 'Hero Image (landing page)' },
    { slot: 'nav',   label: 'Nav Icon (top bar)' },
    { slot: 'about', label: 'About Section Image' },
    { slot: 'login', label: 'Login Card Icon' },
  ];

  const logoSlotRows = slotDefs.map(d => {
    const opts = availableLogos.map(l =>
      `<option value="${esc(l.file)}" ${CFG.club.logos[d.slot]===l.file?'selected':''}>${esc(l.label)} — ${esc(l.file)}</option>`
    ).join('');
    return `
      <div class="s-row logo-slot-row">
        <label class="s-label">${d.label}</label>
        <div class="logo-slot-preview">
          <img src="logos/${esc(CFG.club.logos[d.slot]||'')}" alt="" id="lsp-${d.slot}"
               style="width:40px;height:40px;object-fit:contain;" onerror="this.style.opacity=0.2" />
        </div>
        <select class="s-input s-select logo-slot-select" data-slot="${d.slot}"
                onchange="updateLogoSlotPreview(this)" style="max-width:260px;">${opts}</select>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="stab-bar">
      <button class="stab active" onclick="switchStab(this,'stab-club')">Club Info</button>
      <button class="stab" onclick="switchStab(this,'stab-logos')">Logos</button>
      <button class="stab" onclick="switchStab(this,'stab-sections')">Sections</button>
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

    <!-- LOGOS -->
    <div class="stab-panel" id="stab-logos">
      <p class="s-hint" style="margin-bottom:1.5rem;">
        Assign a logo from the <code>logos/</code> folder to each position on the site.
        You can also click any logo image on the landing page to change it directly.
      </p>
      ${logoSlotRows}
      <div class="logo-all-previews" style="margin-top:2rem;">
        <p class="s-label" style="margin-bottom:.75rem;">All available logos</p>
        <div class="logo-previews">
          ${availableLogos.map(l => `
            <div class="logo-preview-card">
              <img src="logos/${esc(l.file)}" alt="${esc(l.label)}" onerror="this.style.opacity=0.2" />
              <span class="logo-preview-name">${esc(l.label)}</span>
              <span class="logo-preview-file">${esc(l.file)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- SECTIONS -->
    <div class="stab-panel" id="stab-sections">
      <p class="s-hint" style="margin-bottom:1rem;">
        Drag sections to reorder. Edit section names and which ranks belong in each section.
        Rank names must match exactly what you use in the Members tab.
      </p>
      <div class="sections-list" id="sections-list">
        ${renderSectionRows()}
      </div>
      <button class="s-add-btn" onclick="addSection()" style="margin-top:1rem;">+ Add Section</button>
    </div>

    <!-- MODULES -->
    <div class="stab-panel" id="stab-modules">
      <p class="s-hint" style="margin-bottom:1.5rem;">Toggle modules on/off.</p>
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
      <p class="s-hint" style="margin-bottom:1rem;">
        Manage member credentials, ranks, and access. Road Name is shown on roster and in the nav when logged in.
      </p>
      <div id="members-list">
        ${CFG.members.map((m,i) => memberRow(m,i)).join('')}
      </div>
      <button class="s-add-btn" onclick="addMemberRow()">+ Add Member</button>
    </div>

    <!-- SAVE -->
    <div class="s-actions">
      <button class="btn-save" onclick="saveSettings()">Save All Changes</button>
      <button class="btn-reset" onclick="if(confirm('Factory reset all settings?')){CFG=ConfigManager.reset();applyTheme(CFG.colors);renderLanding();renderSettings();}">Factory Reset</button>
      <span class="s-saved" id="s-saved-msg"></span>
    </div>
  `;

  initSectionDrag();
}

/* ── Section rows HTML ── */
function renderSectionRows() {
  return getSortedSections().map((sec, i) => `
    <div class="section-edit-row" id="sec-row-${sec.id}" draggable="true" data-sec-id="${sec.id}">
      <div class="sec-drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6"  x2="16" y2="6"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="8" y1="18" x2="16" y2="18"/>
        </svg>
      </div>
      <div class="sec-fields">
        <input class="s-input sec-label-input" placeholder="Section name"
               value="${esc(sec.label)}" id="sec-label-${sec.id}" />
        <div class="sec-ranks-wrap">
          <label class="sec-ranks-label">Ranks in this section (one per line)</label>
          <textarea class="s-input sec-ranks-input" id="sec-ranks-${sec.id}"
                    rows="3" placeholder="President&#10;Vice President">${esc((sec.ranks||[]).join('\n'))}</textarea>
        </div>
      </div>
      <button class="medit-del sec-del" onclick="deleteSection('${sec.id}')" title="Delete section">&#10005;</button>
    </div>`).join('');
}

function addSection() {
  const id = 'sec_' + Date.now();
  const newSec = { id, label: 'New Section', order: CFG.sections.length + 1, ranks: [] };
  CFG.sections.push(newSec);
  document.getElementById('sections-list').innerHTML = renderSectionRows();
  initSectionDrag();
}

function deleteSection(id) {
  if (!confirm('Delete this section? Members with ranks assigned here will fall to the last section.')) return;
  CFG.sections = CFG.sections.filter(s => s.id !== id);
  document.getElementById('sections-list').innerHTML = renderSectionRows();
  initSectionDrag();
}

/* ── Drag-to-reorder sections ── */
function initSectionDrag() {
  const list = document.getElementById('sections-list');
  if (!list) return;
  let dragSrc = null;

  list.querySelectorAll('.section-edit-row').forEach(row => {
    row.addEventListener('dragstart', e => {
      dragSrc = row;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      list.querySelectorAll('.section-edit-row').forEach(r => r.classList.remove('drag-over'));
    });
    row.addEventListener('dragover', e => {
      e.preventDefault();
      if (row !== dragSrc) {
        list.querySelectorAll('.section-edit-row').forEach(r => r.classList.remove('drag-over'));
        row.classList.add('drag-over');
      }
    });
    row.addEventListener('drop', e => {
      e.preventDefault();
      if (dragSrc && dragSrc !== row) {
        const allRows = [...list.querySelectorAll('.section-edit-row')];
        const fromIdx = allRows.indexOf(dragSrc);
        const toIdx   = allRows.indexOf(row);
        if (fromIdx < toIdx) list.insertBefore(dragSrc, row.nextSibling);
        else                 list.insertBefore(dragSrc, row);
      }
      list.querySelectorAll('.section-edit-row').forEach(r => r.classList.remove('drag-over'));
    });
  });
}

/* ── Logo slot live preview ── */
function updateLogoSlotPreview(select) {
  const slot    = select.dataset.slot;
  const file    = select.value;
  const preview = document.getElementById(`lsp-${slot}`);
  if (preview) preview.src = `logos/${file}`;
}

/* ── Member row HTML ── */
function memberRow(m, i) {
  const accessOpts = ['admin','member','view'].map(a =>
    `<option value="${a}" ${m.access===a?'selected':''}>${a}</option>`).join('');

  /* Collect all rank names from sections for the datalist */
  const allRanks = [...new Set(CFG.sections.flatMap(s => s.ranks||[]))];
  const rankList = allRanks.map(r => `<option value="${esc(r)}">`).join('');

  return `
    <div class="member-edit-card" id="medit-${i}">
      <div class="medit-header">
        <span class="medit-num">#${i+1}</span>
        <button class="medit-del" onclick="document.getElementById('medit-${i}').remove()" title="Remove">&#10005;</button>
      </div>
      <div class="medit-grid">
        <div class="medit-field"><label>Display Name</label><input class="s-input" id="m-name-${i}"      value="${esc(m.name||'')}"/></div>
        <div class="medit-field"><label>Road Name</label><input class="s-input" id="m-roadname-${i}"     value="${esc(m.roadName||'')}"/></div>
        <div class="medit-field">
          <label>Rank</label>
          <input class="s-input" id="m-rank-${i}" value="${esc(m.rank||'Member')}" list="rank-datalist-${i}" autocomplete="off"/>
          <datalist id="rank-datalist-${i}">${rankList}</datalist>
        </div>
        <div class="medit-field"><label>Username</label><input class="s-input" id="m-user-${i}"          value="${esc(m.username||'')}" autocomplete="off"/></div>
        <div class="medit-field"><label>Password</label><input class="s-input" id="m-pass-${i}"          value="${esc(m.password||'')}" type="password" autocomplete="off"/></div>
        <div class="medit-field"><label>Discord</label><input class="s-input" id="m-discord-${i}"        value="${esc(m.discord||'')}"/></div>
        <div class="medit-field"><label>Discord ID</label><input class="s-input" id="m-discordid-${i}"   value="${esc(m.discordId||'')}"/></div>
        <div class="medit-field"><label>CID</label><input class="s-input" id="m-cid-${i}"                value="${esc(m.cid||'')}"/></div>
        <div class="medit-field"><label>Join Date</label><input class="s-input" id="m-joined-${i}"       value="${esc(m.joined||'')}" type="date"/></div>
        <div class="medit-field"><label>Portal Access</label><select class="s-input s-select" id="m-access-${i}">${accessOpts}</select></div>
        <div class="medit-field">
          <label>Timezone</label>
          <select class="s-input s-select" id="m-tz-${i}">
            ${TIMEZONES.map(tz => `<option value="${esc(tz.value)}" ${(m.timezone||'America/New_York')===tz.value?'selected':''}>${esc(tz.label)}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>`;
}

function addMemberRow() {
  const list = document.getElementById('members-list');
  const i    = document.querySelectorAll('.member-edit-card').length;
  const div  = document.createElement('div');
  div.innerHTML = memberRow({name:'',roadName:'',rank:'Member',username:'',password:'',discord:'',discordId:'',cid:'',joined:'',access:'member'}, i);
  list.appendChild(div.firstElementChild);
}

/* ── Save settings ── */
function saveSettings() {
  const g = id => document.getElementById(id)?.value?.trim() || '';

  /* Club info */
  CFG.club.name     = g('si-name')     || CFG.club.name;
  CFG.club.motto    = g('si-motto')    || CFG.club.motto;
  CFG.club.founded  = g('si-founded')  || CFG.club.founded;
  CFG.club.location = g('si-location') || CFG.club.location;
  CFG.club.about    = document.getElementById('si-about')?.value || CFG.club.about;

  /* Logo slots */
  document.querySelectorAll('.logo-slot-select').forEach(sel => {
    const slot = sel.dataset.slot;
    if (slot) CFG.club.logos[slot] = sel.value;
  });

  /* Sections — read from current DOM order (drag may have changed it) */
  const secRows = document.querySelectorAll('.section-edit-row');
  CFG.sections = Array.from(secRows).map((row, idx) => {
    const id    = row.dataset.secId;
    const label = document.getElementById(`sec-label-${id}`)?.value?.trim() || 'Section';
    const ranks = (document.getElementById(`sec-ranks-${id}`)?.value || '')
      .split('\n').map(r => r.trim()).filter(Boolean);
    return { id, label, order: idx + 1, ranks };
  });

  /* Modules */
  Object.keys(CFG.modules).forEach(id => {
    const cb = document.getElementById(`mod-${id}`);
    if (cb) CFG.modules[id].enabled = cb.checked;
  });

  /* Members */
  const cards = document.querySelectorAll('.member-edit-card');
  CFG.members = Array.from(cards).map((_, i) => ({
    name:      g(`m-name-${i}`),
    roadName:  g(`m-roadname-${i}`),
    rank:      g(`m-rank-${i}`)   || 'Member',
    username:  g(`m-user-${i}`).toLowerCase(),
    password:  document.getElementById(`m-pass-${i}`)?.value || '',
    discord:   g(`m-discord-${i}`),
    discordId: g(`m-discordid-${i}`),
    cid:       g(`m-cid-${i}`),
    joined:    g(`m-joined-${i}`),
    access:    g(`m-access-${i}`) || 'member',
    timezone:  g(`m-tz-${i}`)    || 'America/New_York',
  })).filter(m => m.username && m.password);

  ConfigManager.save(CFG);
  renderLanding();

  const msg = document.getElementById('s-saved-msg');
  if (msg) { msg.textContent = 'Saved!'; msg.classList.add('show'); setTimeout(()=>msg.classList.remove('show'), 2500); }
}

/* ── Shared helpers ── */
function sRow(label, id, val) {
  return `<div class="s-row"><label class="s-label">${label}</label><input class="s-input" id="${id}" type="text" value="${esc(val||'')}" /></div>`;
}

function switchStab(btn, panelId) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.stab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId)?.classList.add('active');
}

function esc(s='') {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Keyboard ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const active = document.querySelector('.page.active');
  if (active?.id === 'page-portal') {
    if (document.activeElement?.id === 'login-user') document.getElementById('login-pass')?.focus();
    else handleLogin();
  }
  if (e.key === 'Escape') closePicker();
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadLogoManifest();
  applyTheme(CFG.colors);
  renderLanding();
  showPage('page-landing');
});

/* ══════════════════════════════════════════
   LANDING PAGE — UPCOMING EVENTS STRIP
   ══════════════════════════════════════════ */
function renderLandingEvents() {
  const grid = document.getElementById('landing-events-grid');
  if (!grid) return;

  const isLoggedIn = !!currentUser;
  const tz         = getUserTz();
  const instances  = getUpcomingInstances(isLoggedIn).slice(0, 3);

  if (instances.length === 0) {
    grid.innerHTML = `<div class="les-empty">No upcoming events scheduled.</div>`;
    return;
  }

  grid.innerHTML = instances.map(inst => {
    const timeStr   = formatEventTimeShort(inst.instanceDate, tz);
    const privBadge = inst.visibility === 'private'
      ? `<span class="ev-private-badge">Members Only</span>` : '';
    const imgStyle  = inst.imageUrl
      ? `background-image:url('${escAttr(inst.imageUrl)}')`
      : '';
    const imgClass  = inst.imageUrl ? 'les-card-img' : 'les-card-img les-card-img--empty';

    return `
      <div class="les-card" onclick="openLandingEventDetail('${esc(inst.id)}','${esc(inst.instanceDate)}')">
        <div class="${imgClass}" style="${imgStyle}">
          ${!inst.imageUrl ? `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` : ''}
        </div>
        <div class="les-card-body">
          ${privBadge}
          <div class="les-card-title">${esc(inst.title)}</div>
          <div class="les-card-time">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${esc(timeStr)}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* Open event detail from landing page — uses the same modal */
function openLandingEventDetail(eventId, instanceDate) {
  openEventDetail(eventId, instanceDate);
}

/* ══════════════════════════════════════════
   PUBLIC EVENTS PAGE
   ══════════════════════════════════════════ */
function renderPublicEventsPage() {
  const container = document.getElementById('pub-events-container');
  if (!container) return;

  /* Sync the public events nav state */
  updatePublicEventsNav();

  const isLoggedIn = !!currentUser;
  const isAdmin    = currentUser?.access === 'admin';
  const tz         = getUserTz();
  const instances  = getUpcomingInstances(isLoggedIn);

  let html = '';

  if (isAdmin) {
    html += `<div class="events-toolbar"><button class="btn-create-event" onclick="openEventEditor()">+ Create Event</button></div>`;
  }

  if (instances.length === 0) {
    html += `<div class="events-empty">No upcoming events. Check back soon.</div>`;
  } else {
    html += `<div class="events-grid">`;
    instances.forEach(inst => {
      const timeStr   = formatEventTimeShort(inst.instanceDate, tz);
      const privBadge = inst.visibility === 'private'
        ? `<span class="ev-private-badge">Members Only</span>` : '';
      const recurBadge = inst.recurring && inst.recurring !== 'none'
        ? `<span class="ev-recur-badge">${inst.recurring}</span>` : '';
      const imgHtml = inst.imageUrl
        ? `<div class="ev-card-img" style="background-image:url('${escAttr(inst.imageUrl)}')"></div>`
        : `<div class="ev-card-img ev-card-img--placeholder"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;

      html += `
        <div class="ev-card" onclick="openEventDetail('${esc(inst.id)}','${esc(inst.instanceDate)}')">
          ${imgHtml}
          <div class="ev-card-body">
            <div class="ev-card-badges">${privBadge}${recurBadge}</div>
            <div class="ev-card-title">${esc(inst.title)}</div>
            <div class="ev-card-time">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${esc(timeStr)}
            </div>
            <div class="ev-card-tz">Showing in ${tz.replace(/_/g,' ')}</div>
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
}

/* Keep the public events page nav in sync with login state */
function updatePublicEventsNav() {
  const loginBtn  = document.getElementById('pub-ev-login-btn');
  const memberArea = document.getElementById('pub-ev-member-area');
  const portalLi  = document.getElementById('pub-ev-portal-li');

  if (currentUser) {
    const displayName = currentUser.roadName || currentUser.name || currentUser.username;
    if (loginBtn)   loginBtn.style.display   = 'none';
    if (portalLi)   portalLi.style.display   = '';
    if (memberArea) {
      memberArea.style.display = 'flex';
      memberArea.innerHTML = `
        <span class="nav-member-name">${esc(displayName)}</span>
        <button class="nav-portal-btn" onclick="goToPortal()">Member Portal</button>
      `;
    }
  } else {
    if (loginBtn)   loginBtn.style.display   = '';
    if (portalLi)   portalLi.style.display   = 'none';
    if (memberArea) { memberArea.style.display = 'none'; memberArea.innerHTML = ''; }
  }
}
