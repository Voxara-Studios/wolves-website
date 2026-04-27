/* ═══════════════════════════════════════════════════
   WOLVES OF MAYHEM — Config Panel Module
   Admin-only. Renders the full settings UI and
   handles saving back to localStorage via ConfigManager.
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── RENDER THE FULL CONFIG PANEL ─── */
function renderConfigPanel() {
  const el = document.getElementById('config-panel-body');
  if (!el) return;

  const c = CFG;

  el.innerHTML = `

    <!-- ── TABS ── -->
    <div class="cfg-tabs" id="cfg-tabs">
      <button class="cfg-tab active" onclick="switchTab('identity')">Identity</button>
      <button class="cfg-tab" onclick="switchTab('colors')">Colors</button>
      <button class="cfg-tab" onclick="switchTab('stats')">Stats</button>
      <button class="cfg-tab" onclick="switchTab('social')">Social</button>
      <button class="cfg-tab" onclick="switchTab('modules')">Modules</button>
      <button class="cfg-tab" onclick="switchTab('members')">Members</button>
    </div>

    <!-- ══ TAB: IDENTITY ══ -->
    <div class="cfg-section active" id="tab-identity">
      <div class="cfg-row">
        <label class="cfg-label">Club Name</label>
        <input class="cfg-input" id="cfg-club-name" type="text" value="${esc(c.club.name)}" placeholder="Wolves of Mayhem" />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Short Name / Abbreviation</label>
        <input class="cfg-input" id="cfg-club-short" type="text" value="${esc(c.club.nameShort)}" placeholder="WOM" />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Motto / Tagline</label>
        <input class="cfg-input" id="cfg-club-motto" type="text" value="${esc(c.club.motto)}" placeholder="Born to Ride. Built to Last." />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Founded Year</label>
        <input class="cfg-input" id="cfg-club-founded" type="text" value="${esc(c.club.founded)}" placeholder="2012" style="max-width:120px;" />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Chapter Name</label>
        <input class="cfg-input" id="cfg-club-chapter" type="text" value="${esc(c.club.chapter)}" placeholder="Main Chapter" />
      </div>

      <div class="cfg-row cfg-row--col">
        <label class="cfg-label">Club Logo / Patch Image</label>
        <div class="cfg-logo-preview" id="logo-preview-wrap">
          ${c.club.logoUrl
            ? `<img src="${c.club.logoUrl}" alt="Club logo" style="width:80px;height:80px;object-fit:contain;border-radius:50%;border:2px solid var(--club-red);" />`
            : `<div class="cfg-logo-placeholder">No logo uploaded<br><span>Using default SVG patch</span></div>`}
        </div>
        <div class="cfg-logo-actions">
          <label class="btn btn-ghost cfg-file-btn" for="cfg-logo-upload">Upload Image</label>
          <input type="file" id="cfg-logo-upload" accept="image/*" style="display:none;" onchange="handleLogoUpload(event)" />
          <button class="btn btn-ghost" onclick="removeLogo()">Remove Logo</button>
        </div>
        <p class="cfg-hint">Recommended: square image, PNG or JPG. Will replace the default wolf patch.</p>
      </div>
    </div>

    <!-- ══ TAB: COLORS ══ -->
    <div class="cfg-section" id="tab-colors">
      <p class="cfg-hint" style="margin-bottom:1.5rem;">Changes apply instantly. Save to make them permanent.</p>

      ${colorRow('Accent / Primary Color',  'cfg-color-accent',      c.colors.accent)}
      ${colorRow('Accent Dark (hover)',      'cfg-color-accent-dark', c.colors.accentDark)}
      ${colorRow('Background Black',         'cfg-color-bg-black',    c.colors.bgBlack)}
      ${colorRow('Background Dark',          'cfg-color-bg-dark',     c.colors.bgDark)}
      ${colorRow('Card Background',          'cfg-color-bg-card',     c.colors.bgCard)}
      ${colorRow('Card Background (hover)',  'cfg-color-bg-card2',    c.colors.bgCard2)}
      ${colorRow('Text Primary',             'cfg-color-text-primary',   c.colors.textPrimary)}
      ${colorRow('Text Secondary',           'cfg-color-text-secondary', c.colors.textSecondary)}
      ${colorRow('Text Muted',               'cfg-color-text-muted',     c.colors.textMuted)}

      <div class="cfg-row" style="margin-top:1.5rem;">
        <button class="btn btn-ghost" onclick="resetColors()">Reset to Club Defaults</button>
      </div>
    </div>

    <!-- ══ TAB: STATS ══ -->
    <div class="cfg-section" id="tab-stats">
      <p class="cfg-hint" style="margin-bottom:1.5rem;">Up to 4 stats shown in the landing page banner.</p>
      <div id="stats-editor">
        ${c.stats.map((s, i) => statRow(s, i)).join('')}
      </div>
      <button class="btn btn-ghost" onclick="addStat()" style="margin-top:1rem;" ${c.stats.length >= 4 ? 'disabled' : ''}>+ Add Stat</button>
    </div>

    <!-- ══ TAB: SOCIAL ══ -->
    <div class="cfg-section" id="tab-social">
      <div class="cfg-row">
        <label class="cfg-label">Facebook URL</label>
        <input class="cfg-input" id="cfg-social-fb" type="url" value="${esc(c.social.facebook)}" placeholder="https://facebook.com/yourclub" />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Instagram URL</label>
        <input class="cfg-input" id="cfg-social-ig" type="url" value="${esc(c.social.instagram)}" placeholder="https://instagram.com/yourclub" />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Contact Email</label>
        <input class="cfg-input" id="cfg-social-email" type="email" value="${esc(c.social.email)}" placeholder="contact@yourclub.com" />
      </div>
      <div class="cfg-row">
        <label class="cfg-label">Phone Number</label>
        <input class="cfg-input" id="cfg-social-phone" type="tel" value="${esc(c.social.phone)}" placeholder="+1 555 000 0000" />
      </div>
    </div>

    <!-- ══ TAB: MODULES ══ -->
    <div class="cfg-section" id="tab-modules">
      <p class="cfg-hint" style="margin-bottom:1.5rem;">Toggle modules on/off. Disabled modules are hidden from the dashboard. Drag to reorder (future update).</p>
      <div class="cfg-module-list">
        ${Object.entries(c.modules).map(([id, m]) => moduleToggleRow(id, m)).join('')}
      </div>
    </div>

    <!-- ══ TAB: MEMBERS ══ -->
    <div class="cfg-section" id="tab-members">
      <p class="cfg-hint" style="margin-bottom:1rem;">Manage member credentials and access levels. Changes take effect immediately.</p>
      <div id="members-editor">
        ${c.members.map((m, i) => memberRow(m, i)).join('')}
      </div>
      <button class="btn btn-ghost" onclick="addMember()" style="margin-top:1rem;">+ Add Member</button>
    </div>

    <!-- ── SAVE / RESET BAR ── -->
    <div class="cfg-actions">
      <button class="btn btn-primary" onclick="saveConfig()">Save All Changes</button>
      <button class="btn btn-ghost" onclick="confirmReset()">Factory Reset</button>
      <span class="cfg-save-msg" id="cfg-save-msg"></span>
    </div>
  `;

  /* Wire up live color preview */
  document.querySelectorAll('.cfg-color-input').forEach(inp => {
    inp.addEventListener('input', livePreviewColors);
  });
}

/* ─── HELPERS ─── */
function esc(str = '') {
  return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function colorRow(label, id, value) {
  return `
    <div class="cfg-row cfg-row--color">
      <label class="cfg-label">${label}</label>
      <div class="cfg-color-wrap">
        <input type="color" class="cfg-color-swatch cfg-color-input" id="${id}-swatch" value="${value}" oninput="syncColorText('${id}')" />
        <input type="text"  class="cfg-input cfg-color-text  cfg-color-input" id="${id}-text"   value="${value}" maxlength="7" oninput="syncColorSwatch('${id}')" placeholder="#b20702" />
      </div>
    </div>`;
}

function statRow(s, i) {
  return `
    <div class="cfg-stat-row" id="stat-row-${i}">
      <input class="cfg-input" style="width:90px;" placeholder="Value" value="${esc(s.num)}" id="stat-num-${i}" />
      <input class="cfg-input" style="flex:1;"     placeholder="Label" value="${esc(s.label)}" id="stat-label-${i}" />
      <button class="cfg-del-btn" onclick="removeStat(${i})" title="Remove">&#10005;</button>
    </div>`;
}

function moduleToggleRow(id, m) {
  return `
    <div class="cfg-module-row">
      <label class="cfg-toggle-wrap">
        <input type="checkbox" class="cfg-toggle" id="mod-${id}" ${m.enabled ? 'checked' : ''} onchange="toggleModule('${id}', this.checked)" />
        <span class="cfg-toggle-slider"></span>
      </label>
      <div class="cfg-module-info">
        <span class="cfg-module-name">${m.label}</span>
        <span class="cfg-module-access">Access: ${m.access.join(', ')}</span>
      </div>
    </div>`;
}

function memberRow(m, i) {
  const accessOpts = ['all', 'finances', 'standard'].map(a =>
    `<option value="${a}" ${m.access === a ? 'selected' : ''}>${a}</option>`
  ).join('');

  return `
    <div class="cfg-member-row" id="member-row-${i}">
      <input class="cfg-input" placeholder="Username"    value="${esc(m.username)}" id="mem-user-${i}"  style="width:120px;" />
      <input class="cfg-input" placeholder="Password"    value="${esc(m.password)}" id="mem-pass-${i}"  style="width:120px;" type="password" />
      <input class="cfg-input" placeholder="Display name" value="${esc(m.name)}"   id="mem-name-${i}"  style="flex:1;" />
      <input class="cfg-input" placeholder="Role title"  value="${esc(m.role)}"    id="mem-role-${i}"  style="width:140px;" />
      <select class="cfg-input cfg-select" id="mem-access-${i}" style="width:110px;">${accessOpts}</select>
      <button class="cfg-del-btn" onclick="removeMember(${i})" title="Remove member">&#10005;</button>
    </div>`;
}

/* ─── TAB SWITCHING ─── */
function switchTab(name) {
  document.querySelectorAll('.cfg-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.cfg-section').forEach(s => s.classList.remove('active'));
  document.querySelector(`[onclick="switchTab('${name}')"]`)?.classList.add('active');
  document.getElementById(`tab-${name}`)?.classList.add('active');
}

/* ─── COLOR SYNC ─── */
function syncColorText(id) {
  const swatch = document.getElementById(`${id}-swatch`);
  const text   = document.getElementById(`${id}-text`);
  if (swatch && text) text.value = swatch.value;
  livePreviewColors();
}

function syncColorSwatch(id) {
  const swatch = document.getElementById(`${id}-swatch`);
  const text   = document.getElementById(`${id}-text`);
  if (swatch && text && /^#[0-9a-fA-F]{6}$/.test(text.value)) {
    swatch.value = text.value;
    livePreviewColors();
  }
}

function livePreviewColors() {
  const get = id => document.getElementById(id)?.value || '';
  applyTheme({
    accent:        get('cfg-color-accent-text')      || get('cfg-color-accent-swatch'),
    accentDark:    get('cfg-color-accent-dark-text')  || get('cfg-color-accent-dark-swatch'),
    bgBlack:       get('cfg-color-bg-black-text')     || get('cfg-color-bg-black-swatch'),
    bgDark:        get('cfg-color-bg-dark-text')      || get('cfg-color-bg-dark-swatch'),
    bgCard:        get('cfg-color-bg-card-text')      || get('cfg-color-bg-card-swatch'),
    bgCard2:       get('cfg-color-bg-card2-text')     || get('cfg-color-bg-card2-swatch'),
    textPrimary:   get('cfg-color-text-primary-text')   || get('cfg-color-text-primary-swatch'),
    textSecondary: get('cfg-color-text-secondary-text') || get('cfg-color-text-secondary-swatch'),
    textMuted:     get('cfg-color-text-muted-text')     || get('cfg-color-text-muted-swatch'),
  });
}

function resetColors() {
  const d = DEFAULT_CONFIG.colors;
  Object.entries({
    'cfg-color-accent':         d.accent,
    'cfg-color-accent-dark':    d.accentDark,
    'cfg-color-bg-black':       d.bgBlack,
    'cfg-color-bg-dark':        d.bgDark,
    'cfg-color-bg-card':        d.bgCard,
    'cfg-color-bg-card2':       d.bgCard2,
    'cfg-color-text-primary':   d.textPrimary,
    'cfg-color-text-secondary': d.textSecondary,
    'cfg-color-text-muted':     d.textMuted,
  }).forEach(([id, val]) => {
    const s = document.getElementById(`${id}-swatch`);
    const t = document.getElementById(`${id}-text`);
    if (s) s.value = val;
    if (t) t.value = val;
  });
  livePreviewColors();
}

/* ─── STATS CRUD ─── */
function addStat() {
  const editor = document.getElementById('stats-editor');
  const i = document.querySelectorAll('.cfg-stat-row').length;
  if (i >= 4) return;
  const div = document.createElement('div');
  div.innerHTML = statRow({ num: '', label: '' }, i);
  editor.appendChild(div.firstElementChild);
  /* Update add button */
  if (i + 1 >= 4) document.querySelector('[onclick="addStat()"]').disabled = true;
}

function removeStat(i) {
  document.getElementById(`stat-row-${i}`)?.remove();
  document.querySelector('[onclick="addStat()"]').disabled = false;
}

/* ─── MODULE TOGGLES ─── */
function toggleModule(id, enabled) {
  /* Live update CFG in memory — saved on Save */
  if (CFG.modules[id]) CFG.modules[id].enabled = enabled;
}

/* ─── MEMBER CRUD ─── */
function addMember() {
  const editor = document.getElementById('members-editor');
  const i = document.querySelectorAll('.cfg-member-row').length;
  const div = document.createElement('div');
  div.innerHTML = memberRow({ username:'', password:'', name:'', role:'Member', access:'standard' }, i);
  editor.appendChild(div.firstElementChild);
}

function removeMember(i) {
  document.getElementById(`member-row-${i}`)?.remove();
}

/* ─── LOGO UPLOAD ─── */
function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const dataUrl = ev.target.result;
    const preview = document.getElementById('logo-preview-wrap');
    if (preview) {
      preview.innerHTML = `<img src="${dataUrl}" alt="Club logo" style="width:80px;height:80px;object-fit:contain;border-radius:50%;border:2px solid var(--club-red);" />`;
    }
    CFG.club.logoUrl = dataUrl; // stage for save
    refreshLogo();
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  CFG.club.logoUrl = '';
  const preview = document.getElementById('logo-preview-wrap');
  if (preview) preview.innerHTML = `<div class="cfg-logo-placeholder">No logo uploaded<br><span>Using default SVG patch</span></div>`;
  refreshLogo();
}

/* ─── SAVE ─── */
function saveConfig() {
  const get = id => document.getElementById(id)?.value?.trim() || '';

  /* Identity */
  CFG.club.name      = get('cfg-club-name')    || CFG.club.name;
  CFG.club.nameShort = get('cfg-club-short')   || CFG.club.nameShort;
  CFG.club.motto     = get('cfg-club-motto')   || CFG.club.motto;
  CFG.club.founded   = get('cfg-club-founded') || CFG.club.founded;
  CFG.club.chapter   = get('cfg-club-chapter') || CFG.club.chapter;

  /* Colors */
  CFG.colors = {
    accent:        get('cfg-color-accent-text')         || CFG.colors.accent,
    accentDark:    get('cfg-color-accent-dark-text')    || CFG.colors.accentDark,
    bgBlack:       get('cfg-color-bg-black-text')       || CFG.colors.bgBlack,
    bgDark:        get('cfg-color-bg-dark-text')        || CFG.colors.bgDark,
    bgCard:        get('cfg-color-bg-card-text')        || CFG.colors.bgCard,
    bgCard2:       get('cfg-color-bg-card2-text')       || CFG.colors.bgCard2,
    textPrimary:   get('cfg-color-text-primary-text')   || CFG.colors.textPrimary,
    textSecondary: get('cfg-color-text-secondary-text') || CFG.colors.textSecondary,
    textMuted:     get('cfg-color-text-muted-text')     || CFG.colors.textMuted,
  };

  /* Stats */
  const statRows = document.querySelectorAll('.cfg-stat-row');
  CFG.stats = Array.from(statRows).map((row, i) => ({
    num:   document.getElementById(`stat-num-${i}`)?.value?.trim()   || '',
    label: document.getElementById(`stat-label-${i}`)?.value?.trim() || '',
  })).filter(s => s.num || s.label);

  /* Social */
  CFG.social.facebook  = get('cfg-social-fb');
  CFG.social.instagram = get('cfg-social-ig');
  CFG.social.email     = get('cfg-social-email');
  CFG.social.phone     = get('cfg-social-phone');

  /* Members */
  const memberRows = document.querySelectorAll('.cfg-member-row');
  CFG.members = Array.from(memberRows).map((row, i) => ({
    username: document.getElementById(`mem-user-${i}`)?.value?.trim().toLowerCase() || '',
    password: document.getElementById(`mem-pass-${i}`)?.value || '',
    name:     document.getElementById(`mem-name-${i}`)?.value?.trim() || '',
    role:     document.getElementById(`mem-role-${i}`)?.value?.trim() || 'Member',
    access:   document.getElementById(`mem-access-${i}`)?.value || 'standard',
  })).filter(m => m.username && m.password);

  /* Modules already updated live via toggleModule() */

  /* Persist */
  ConfigManager.save(CFG);

  /* Re-render live site content */
  applyTheme(CFG.colors);
  renderLanding();
  renderDashboard(currentUser);

  /* Flash save message */
  const msg = document.getElementById('cfg-save-msg');
  if (msg) {
    msg.textContent = 'Saved!';
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2500);
  }
}

/* ─── FACTORY RESET ─── */
function confirmReset() {
  if (confirm('Reset ALL settings to factory defaults? This cannot be undone.')) {
    CFG = ConfigManager.reset();
    applyTheme(CFG.colors);
    renderLanding();
    renderConfigPanel();
  }
}
