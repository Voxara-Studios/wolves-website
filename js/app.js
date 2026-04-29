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
  setNavHomeActive(id === 'page-landing');
  /* Clear portal button active state whenever leaving portal */
  if (id !== 'page-portal') {
    const portalBtn = document.getElementById('portal-nav-btn');
    if (portalBtn) portalBtn.classList.remove('nav-btn-active');
  }
  if (id === 'page-settings') renderSettings();
  if (id === 'page-events')   renderPublicEventsPage();
  if (id === 'page-landing')  renderLandingEvents();
  if (id === 'page-about')    { renderAboutPage(); updateNav(); }
  if (id === 'page-portal')   renderPortalPage();
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
    /* about-page slot uses the 'about' logo config key */
    const cfgKey = slot === 'about-page' ? 'about' : slot;
    const src  = `logos/${CFG.club.logos[cfgKey] || availableLogos[0]?.file || ''}`;
    const isHero = slot === 'hero';
    const isAboutPage = slot === 'about-page';
    const size   = isHero ? '240px' : isAboutPage ? '160px' : '100%';
    const radius = (isHero || isAboutPage) ? '8px' : '50%';
    const editAttr = (currentUser?.access === 'admin')
      ? `onclick="openLogoPicker('${cfgKey}')" title="Click to change logo" style="cursor:pointer;"`
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
  document.querySelectorAll('[data-name]').forEach(el      => el.textContent = CFG.club.name);
  document.querySelectorAll('[data-motto]').forEach(el     => el.textContent = CFG.club.motto);
  document.querySelectorAll('[data-location]').forEach(el  => el.textContent = CFG.club.location);
  document.querySelectorAll('[data-founded]').forEach(el   => el.textContent = CFG.club.founded);
  document.querySelectorAll('[data-about]').forEach(el     => el.textContent = CFG.club.about);
  document.querySelectorAll('[data-history]').forEach(el   => el.textContent = CFG.club.history   || el.textContent);
  document.querySelectorAll('[data-mission]').forEach(el   => el.textContent = CFG.club.mission   || el.textContent);
  document.querySelectorAll('[data-community]').forEach(el => el.textContent = CFG.club.community || el.textContent);
  renderLogos();
  updateNav();
  renderLandingEvents();
}

/* navBtnClick — routes to portal or dashboard depending on login state */
function navBtnClick() {
  if (currentUser) goToPortal();
  else showPage('page-portal');
}

function updateNav() {
  const loggedIn = !!currentUser;
  const label    = loggedIn ? 'Member Portal' : 'Member Login';

  /* Build welcome HTML: "Welcome, <span red>Rank Name</span>" */
  let welcomeHtml = '';
  if (loggedIn) {
    const nameDisplay = currentUser.roadName || currentUser.name || currentUser.username;
    const rank        = currentUser.rank ? currentUser.rank + ' ' : '';
    welcomeHtml = `Welcome, <span class="welcome-name">${esc(rank)}${esc(nameDisplay)}</span>`;
  }

  /* Update all nav buttons + welcome text across every page */
  const navDefs = [
    { btnId: 'nav-login-btn',    welcomeId: 'nav-welcome-text'    },
    { btnId: 'about-login-btn',  welcomeId: 'about-welcome-text'  },
    { btnId: 'pub-ev-login-btn', welcomeId: 'ev-welcome-text'     },
    { btnId: 'portal-nav-btn',   welcomeId: 'portal-welcome-text' },
  ];
  navDefs.forEach(({ btnId, welcomeId }) => {
    const btn = document.getElementById(btnId);
    const wel = document.getElementById(welcomeId);
    if (btn) {
      btn.textContent = label;
      btn.classList.toggle('is-portal', loggedIn);
    }
    if (wel) {
      wel.innerHTML     = welcomeHtml;
      wel.style.display = loggedIn ? '' : 'none';
    }
  });

  /* Update hero button on landing page */
  const heroBtn = document.getElementById('hero-login-btn');
  if (heroBtn) heroBtn.textContent = label;

  /* Render footer discord buttons */
  renderFooterDiscord();
}

/* Bold + underline the Home link when on the landing page */
function setNavHomeActive(active) {
  const el = document.getElementById('nav-home-link');
  if (!el) return;
  if (active) el.classList.add('nav-link-active');
  else        el.classList.remove('nav-link-active');
}

function goToPortal() {
  showPage('page-portal');
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
  renderLogos();
  showPage('page-portal');
}

function handleLogout() {
  currentUser = null;
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  updateNav();
  renderLogos();
  /* Reset portal to login view */
  const loginView  = document.getElementById('portal-login-view');
  const memberView = document.getElementById('portal-member-view');
  if (loginView)  loginView.style.display  = '';
  if (memberView) memberView.style.display = 'none';
  showPage('page-landing');
}

/* ══════════════════════════════════════════
   PORTAL PAGE — main hub
   ══════════════════════════════════════════ */
function renderPortalPage() {
  const loginView  = document.getElementById('portal-login-view');
  const memberView = document.getElementById('portal-member-view');

  if (!currentUser) {
    /* Show login, hide member area */
    if (loginView)  loginView.style.display  = '';
    if (memberView) memberView.style.display = 'none';
    renderLogos();
    updateNav();
    return;
  }

  /* Logged in — show member area */
  if (loginView)  loginView.style.display  = 'none';
  if (memberView) memberView.style.display = '';

  /* Update hero title with road name or full name */
  const heroTitle = document.getElementById('portal-hero-title');
  if (heroTitle) {
    const name = currentUser.roadName || currentUser.name || currentUser.username;
    heroTitle.textContent = name + "'s Clubhouse";
  }

  renderPortalTiles();
  renderLogos();
  updateNav();

  /* Light up the portal nav button while on this page */
  const portalBtn = document.getElementById('portal-nav-btn');
  if (portalBtn) portalBtn.classList.add('nav-btn-active');

  /* Open default tab — only if not already open */
  const panel = document.getElementById('portal-panel');
  const alreadyOpen = panel && panel.style.display !== 'none';
  if (!alreadyOpen) {
    const defaultTab = CFG.club.defaultPortalTab || 'roster';
    /* Check the member actually has access to the default tab */
    const defaultMod = CFG.modules[defaultTab];
    const hasAccess  = defaultMod && defaultMod.access.includes(currentUser.access);
    if (hasAccess) {
      openPortalPanel(defaultTab);
    } else {
      /* Fall back to first accessible tab */
      const EXCLUDE = ['events', 'mainsite'];
      const firstAccess = Object.entries(CFG.modules)
        .sort((a,b) => a[1].order - b[1].order)
        .filter(([id]) => !EXCLUDE.includes(id))
        .find(([, m]) => m.access.includes(currentUser.access));
      if (firstAccess) openPortalPanel(firstAccess[0]);
    }
  }
}

/* Render the module tab bar (excludes events + mainsite) */
function renderPortalTiles() {
  const grid = document.getElementById('portal-tile-grid');
  if (!grid) return;

  const EXCLUDE = ['events', 'mainsite'];

  const icons = {
    roster:    `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    finances:  `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    inventory: `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    settings:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  };

  const mods = Object.entries(CFG.modules)
    .sort((a,b) => a[1].order - b[1].order)
    .filter(([id]) => !EXCLUDE.includes(id));

  grid.innerHTML = mods.map(([id, m]) => {
    const hasAccess = m.access.includes(currentUser.access);
    const clickAttr = hasAccess ? `onclick="openPortalPanel('${id}')"` : `title="Access restricted"`;
    return `
      <button class="portal-tab-btn ${hasAccess ? '' : 'portal-tab-locked'}" id="ptab-${id}" ${clickAttr}>
        <span class="ptab-icon">${icons[id] || icons.settings}</span>
        <span class="ptab-label">${m.label}</span>
        ${!hasAccess ? `<span class="ptab-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>` : ''}
      </button>`;
  }).join('');
}

/* ── Accordion panel ── */
function openPortalPanel(moduleId) {
  const panel  = document.getElementById('portal-panel');
  const bodyEl = document.getElementById('portal-panel-body');
  if (!panel || !bodyEl) return;

  /* Highlight active tab, clear others */
  document.querySelectorAll('.portal-tab-btn').forEach(b => b.classList.remove('ptab-active'));
  const activeBtn = document.getElementById('ptab-' + moduleId);
  if (activeBtn) activeBtn.classList.add('ptab-active');

  /* If clicking the same tab while open, close it */
  if (panel.dataset.open === moduleId && panel.style.display !== 'none') {
    closePortalPanel();
    return;
  }
  panel.dataset.open = moduleId;

  bodyEl.innerHTML = getPortalPanelContent(moduleId);
  panel.style.display = '';

  /* Trigger slide-in animation */
  panel.classList.remove('panel-slide-in');
  void panel.offsetWidth; /* reflow */
  panel.classList.add('panel-slide-in');

  /* Render dynamic content after DOM is ready */
  if (moduleId === 'roster')   renderRoster();
  if (moduleId === 'settings') renderSettings();
}

function closePortalPanel() {
  const panel = document.getElementById('portal-panel');
  if (panel) { panel.style.display = 'none'; panel.dataset.open = ''; }
  document.querySelectorAll('.portal-tab-btn').forEach(b => b.classList.remove('ptab-active'));
}

/* Return HTML content for each module panel */
function getPortalPanelContent(moduleId) {
  switch (moduleId) {
    case 'roster':
      return `
        <div class="roster-meta">
          <div class="roster-count-badge">Members: <span id="roster-count">0</span></div>
        </div>
        <div class="table-wrap">
          <table class="roster-table">
            <thead><tr>
              <th>Rank</th><th>Name</th><th>Road Name</th>
              <th>Discord</th><th>Discord ID</th><th>CID</th>
              <th>Join Date</th><th>Time in Club</th>
            </tr></thead>
            <tbody id="roster-tbody"></tbody>
          </table>
        </div>`;
    case 'finances':
      return `<div class="placeholder-box">Finances module coming soon.<br>Club treasury, dues tracking, and expenses will live here.</div>`;
    case 'inventory':
      return `<div class="placeholder-box">Inventory module coming soon.<br>Gear, merchandise, and equipment tracking will live here.</div>`;
    case 'settings':
      return `<div id="settings-body"></div>`;
    default:
      return `<div class="placeholder-box">Module coming soon.</div>`;
  }
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
      <div class="s-row">
        <label class="s-label">Default Portal Tab</label>
        <select class="s-input s-select" id="si-default-tab" style="max-width:200px;">
          ${['roster','finances','inventory','settings'].map(t =>
            `<option value="${t}" ${(CFG.club.defaultPortalTab||'roster')===t?'selected':''}>${t.charAt(0).toUpperCase()+t.slice(1)}</option>`
          ).join('')}
        </select>
      </div>
      <div class="s-row s-row--col" style="gap:.5rem;margin-bottom:1.25rem;">
        <label class="s-label">Main Discord Button</label>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;">
          <input class="s-input" id="si-discord-main"       type="url"  value="${esc(CFG.club.discordMain||'')}"      placeholder="https://discord.gg/..." style="flex:2;min-width:200px;" />
          <input class="s-input" id="si-discord-main-label" type="text" value="${esc(CFG.club.discordMainLabel||'Join Immense Today!')}" placeholder="Button label" style="flex:1;min-width:140px;" />
          <div style="display:flex;align-items:center;gap:.35rem;flex-shrink:0;" title="Hover colour">
            <input type="color" id="si-discord-main-color-swatch" value="${esc(CFG.club.discordMainColor||'#ff44d4')}"
                   style="width:36px;height:36px;padding:2px 3px;border:1px solid var(--border);background:var(--bg1);cursor:pointer;flex-shrink:0;"
                   oninput="syncHexInput('si-discord-main-color','si-discord-main-color-swatch')" />
            <input class="s-input" id="si-discord-main-color" type="text" value="${esc(CFG.club.discordMainColor||'#ff44d4')}"
                   placeholder="#ff44d4" maxlength="7" style="width:80px;font-family:monospace;"
                   oninput="syncColorSwatch('si-discord-main-color','si-discord-main-color-swatch')" />
          </div>
        </div>
        <p class="s-hint">Leave URL empty to hide this button.</p>
      </div>
      <div class="s-row s-row--col" style="gap:.5rem;margin-bottom:1.25rem;">
        <label class="s-label">Club Discord Button</label>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;">
          <input class="s-input" id="si-discord-club"       type="url"  value="${esc(CFG.club.discordClub||'')}"      placeholder="https://discord.gg/..." style="flex:2;min-width:200px;" />
          <input class="s-input" id="si-discord-club-label" type="text" value="${esc(CFG.club.discordClubLabel||'Join Our Club')}"   placeholder="Button label" style="flex:1;min-width:140px;" />
          <div style="display:flex;align-items:center;gap:.35rem;flex-shrink:0;" title="Hover colour">
            <input type="color" id="si-discord-club-color-swatch" value="${esc(CFG.club.discordClubColor||'#b20702')}"
                   style="width:36px;height:36px;padding:2px 3px;border:1px solid var(--border);background:var(--bg1);cursor:pointer;flex-shrink:0;"
                   oninput="syncHexInput('si-discord-club-color','si-discord-club-color-swatch')" />
            <input class="s-input" id="si-discord-club-color" type="text" value="${esc(CFG.club.discordClubColor||'#b20702')}"
                   placeholder="#b20702" maxlength="7" style="width:80px;font-family:monospace;"
                   oninput="syncColorSwatch('si-discord-club-color','si-discord-club-color-swatch')" />
          </div>
        </div>
        <p class="s-hint">Leave URL empty to hide this button.</p>
      </div>
      <div class="s-row s-row--col">
        <label class="s-label">About Blurb <span style="font-size:.65rem;color:var(--t3);font-weight:400;text-transform:none;letter-spacing:0;">(short version on landing page)</span></label>
        <textarea class="s-input s-textarea" id="si-about">${esc(CFG.club.about)}</textarea>
      </div>
      <div class="s-row s-row--col">
        <label class="s-label">Club History <span style="font-size:.65rem;color:var(--t3);font-weight:400;text-transform:none;letter-spacing:0;">(About Us page)</span></label>
        <textarea class="s-input s-textarea" id="si-history">${esc(CFG.club.history||'')}</textarea>
      </div>
      <div class="s-row s-row--col">
        <label class="s-label">Our Mission <span style="font-size:.65rem;color:var(--t3);font-weight:400;text-transform:none;letter-spacing:0;">(About Us page)</span></label>
        <textarea class="s-input s-textarea" id="si-mission">${esc(CFG.club.mission||'')}</textarea>
      </div>
      <div class="s-row s-row--col">
        <label class="s-label">Community Involvement <span style="font-size:.65rem;color:var(--t3);font-weight:400;text-transform:none;letter-spacing:0;">(About Us page)</span></label>
        <textarea class="s-input s-textarea" id="si-community">${esc(CFG.club.community||'')}</textarea>
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
        <div class="medit-field"><label>Full Name</label><input class="s-input" id="m-name-${i}"      value="${esc(m.name||'')}"/></div>
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
  CFG.club.location        = g('si-location')    || CFG.club.location;
  CFG.club.defaultPortalTab = g('si-default-tab') || CFG.club.defaultPortalTab;
  CFG.club.discordMain      = g('si-discord-main');
  CFG.club.discordMainLabel = g('si-discord-main-label') || CFG.club.discordMainLabel;
  CFG.club.discordMainColor = g('si-discord-main-color') || CFG.club.discordMainColor;
  CFG.club.discordClub      = g('si-discord-club');
  CFG.club.discordClubLabel = g('si-discord-club-label') || CFG.club.discordClubLabel;
  CFG.club.discordClubColor = g('si-discord-club-color') || CFG.club.discordClubColor;
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

  /* Sync all navs */
  updateNav();

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

/* updatePublicEventsNav merged into updateNav */

/* ══════════════════════════════════════════
   ABOUT PAGE
   ══════════════════════════════════════════ */
function renderAboutPage() {
  /* Populate all data-* attributes on the about page */
  document.querySelectorAll('[data-name]').forEach(el      => el.textContent = CFG.club.name);
  document.querySelectorAll('[data-motto]').forEach(el     => el.textContent = CFG.club.motto);
  document.querySelectorAll('[data-location]').forEach(el  => el.textContent = CFG.club.location);
  document.querySelectorAll('[data-founded]').forEach(el   => el.textContent = CFG.club.founded);
  document.querySelectorAll('[data-history]').forEach(el   => { if (CFG.club.history)   el.textContent = CFG.club.history; });
  document.querySelectorAll('[data-mission]').forEach(el   => { if (CFG.club.mission)   el.textContent = CFG.club.mission; });
  document.querySelectorAll('[data-community]').forEach(el => { if (CFG.club.community) el.textContent = CFG.club.community; });
  renderLogos();
}

/* ══════════════════════════════════════════
   FOOTER DISCORD BUTTONS
   ══════════════════════════════════════════ */
function renderFooterDiscord() {
  const el = document.getElementById('footer-discord');
  if (!el) return;

  const mainUrl   = CFG.club.discordMain      || '';
  const mainLabel = CFG.club.discordMainLabel || 'Join Our Discord';
  const mainColor = CFG.club.discordMainColor || '#5865f2';
  const clubUrl   = CFG.club.discordClub      || '';
  const clubLabel = CFG.club.discordClubLabel || 'Join Our Club';
  const clubColor = CFG.club.discordClubColor || '#b20702';

  if (!mainUrl && !clubUrl) { el.style.display = 'none'; return; }
  el.style.display = 'flex';

  const discordSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`;

  el.innerHTML = `
    ${mainUrl ? `<a href="${escAttr(mainUrl)}" target="_blank" rel="noopener"
        class="footer-discord-btn"
        style="--btn-hover-color:${escAttr(mainColor)};">
        ${discordSvg} ${esc(mainLabel)}
      </a>` : ''}
    ${clubUrl ? `<a href="${escAttr(clubUrl)}" target="_blank" rel="noopener"
        class="footer-discord-btn footer-discord-btn--custom"
        style="--btn-hover-color:${escAttr(clubColor)};">
        ${discordSvg} ${esc(clubLabel)}
      </a>` : ''}
  `;
}

/* ── Color swatch ↔ hex input sync ── */
function syncHexInput(textId, swatchId) {
  const swatch = document.getElementById(swatchId);
  const text   = document.getElementById(textId);
  if (swatch && text) text.value = swatch.value;
}
function syncColorSwatch(textId, swatchId) {
  const swatch = document.getElementById(swatchId);
  const text   = document.getElementById(textId);
  if (swatch && text && /^#[0-9a-fA-F]{6}$/.test(text.value)) {
    swatch.value = text.value;
  }
}
