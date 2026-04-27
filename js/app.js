/* ═══════════════════════════════════════════════════
   WOLVES OF MAYHEM — App Core
   Handles routing, auth, and dashboard rendering.
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── SVG ICON LIBRARY ─── */
const ICONS = {
  'icon-roster': `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  'icon-finances': `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  'icon-inventory': `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  'icon-events': `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  'icon-settings': `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  'icon-lock': `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
};

/* ─── STATE ─── */
let currentUser = null;

/* ═══════════════════════════════════════════════════
   PAGE ROUTER
   ═══════════════════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

/* ═══════════════════════════════════════════════════
   LANDING PAGE — dynamic content
   ═══════════════════════════════════════════════════ */
function renderLanding() {
  const c = CFG;

  /* Club name */
  document.querySelectorAll('[data-club-name]').forEach(el => {
    el.innerHTML = c.club.name.replace(' ', ' <span>') + '</span>';
  });
  document.querySelectorAll('[data-club-motto]').forEach(el => {
    el.textContent = c.club.motto;
  });

  /* Logo */
  refreshLogo();

  /* Stats */
  const statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    statsBar.innerHTML = c.stats.map(s => `
      <div class="stat-item">
        <div class="stat-num">${s.num}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  /* Social links */
  const socialBar = document.getElementById('social-links');
  if (socialBar) {
    const links = [];
    if (c.social.facebook)  links.push(`<a href="${c.social.facebook}"  target="_blank" rel="noopener" class="social-link">Facebook</a>`);
    if (c.social.instagram) links.push(`<a href="${c.social.instagram}" target="_blank" rel="noopener" class="social-link">Instagram</a>`);
    if (c.social.email)     links.push(`<a href="mailto:${c.social.email}" class="social-link">Email</a>`);
    if (c.social.phone)     links.push(`<a href="tel:${c.social.phone}" class="social-link">${c.social.phone}</a>`);
    socialBar.innerHTML = links.join('');
    socialBar.style.display = links.length ? 'flex' : 'none';
  }
}

function refreshLogo() {
  document.querySelectorAll('[data-logo]').forEach(el => {
    if (CFG.club.logoUrl) {
      el.innerHTML = `<img src="${CFG.club.logoUrl}" alt="${CFG.club.name} logo" style="width:100%;height:100%;object-fit:contain;border-radius:50%;" />`;
    } else {
      el.innerHTML = SVG_PATCH;
    }
  });
}

/* Inline SVG patch — used when no logo uploaded */
const SVG_PATCH = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <polygon points="100,10 130,35 185,35 155,65 168,118 100,90 32,118 45,65 15,35 70,35"
           fill="#1a0000" stroke="var(--club-red)" stroke-width="2.5"/>
  <polygon points="100,22 124,42 171,42 147,66 158,112 100,87 42,112 53,66 29,42 76,42"
           fill="none" stroke="var(--club-red)" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
  <g fill="var(--club-red)" opacity="0.9">
    <ellipse cx="100" cy="68" rx="22" ry="18"/>
    <ellipse cx="100" cy="83" rx="14" ry="10"/>
    <path d="M78,60 Q70,48 72,42 Q80,52 88,55Z"/>
    <path d="M122,60 Q130,48 128,42 Q120,52 112,55Z"/>
    <circle cx="92" cy="63" r="3" fill="#0a0000"/>
    <circle cx="108" cy="63" r="3" fill="#0a0000"/>
    <path d="M92,72 Q100,78 108,72" fill="none" stroke="#0a0000" stroke-width="1.5"/>
  </g>
  <text x="100" y="108" text-anchor="middle" font-family="'Black Ops One',serif" font-size="9" fill="var(--text-primary)" letter-spacing="2">WOLVES</text>
  <text x="100" y="120" text-anchor="middle" font-family="'Black Ops One',serif" font-size="7" fill="var(--club-red)" letter-spacing="3">OF MAYHEM</text>
  <path d="M60,128 Q100,138 140,128" fill="none" stroke="var(--club-red)" stroke-width="1" opacity="0.5"/>
</svg>`;

/* ═══════════════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════════════ */
function handleLogin() {
  const uEl = document.getElementById('username');
  const pEl = document.getElementById('password');
  const errEl = document.getElementById('login-error');

  const u = uEl.value.trim().toLowerCase();
  const p = pEl.value;

  const member = CFG.members.find(m => m.username === u && m.password === p);

  if (!member) {
    errEl.classList.add('show');
    pEl.value = '';
    pEl.focus();
    return;
  }

  errEl.classList.remove('show');
  currentUser = member;
  renderDashboard(member);
  showPage('page-dashboard');
}

function handleLogout() {
  currentUser = null;
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  showPage('page-landing');
}

/* ═══════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════ */
function renderDashboard(member) {
  const nameEl = document.getElementById('dash-username');
  const roleEl = document.getElementById('dash-role');
  if (nameEl) nameEl.textContent = member.name;
  if (roleEl) roleEl.textContent = member.role;

  const grid = document.getElementById('dash-modules');
  if (!grid) return;

  /* Sort modules by order, filter enabled */
  const mods = Object.entries(CFG.modules)
    .map(([id, m]) => ({ id, ...m }))
    .sort((a, b) => a.order - b.order);

  grid.innerHTML = mods.map(mod => {
    /* Skip disabled modules entirely (unless admin viewing config) */
    if (!mod.enabled && mod.id !== 'settings') return '';

    const hasAccess = mod.access.includes(member.access);
    const iconSvg   = ICONS[mod.icon] || ICONS['icon-settings'];
    const lockIcon  = !hasAccess ? `<span class="module-lock">${ICONS['icon-lock']}</span>` : '';
    const lockedCls = !hasAccess ? ' locked' : '';
    const clickAttr = hasAccess
      ? `onclick="showPage('${mod.page}')" role="button" tabindex="0"`
      : `title="Access restricted — ${mod.access.join(', ')} only"`;

    /* Badge for disabled modules (admin sees them greyed) */
    const disabledBadge = !mod.enabled
      ? `<span class="module-disabled-badge">Disabled</span>`
      : '';

    return `
      <div class="dash-module${lockedCls}" ${clickAttr}>
        <span class="module-icon">${iconSvg}</span>
        <div class="module-name">${mod.label} ${disabledBadge}</div>
        <div class="module-desc">${mod.desc}</div>
        ${lockIcon}
      </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL HELPER
   ═══════════════════════════════════════════════════ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════
   KEYBOARD HANDLING
   ═══════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const active = document.querySelector('.page.active');
    if (active?.id === 'page-login') {
      if (document.activeElement?.id === 'username') {
        document.getElementById('password')?.focus();
      } else {
        handleLogin();
      }
    }
  }
  if (e.key === 'Escape') {
    const active = document.querySelector('.page.active');
    if (active?.id === 'page-login') showPage('page-landing');
  }
});

/* ═══════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(CFG.colors);
  renderLanding();
  showPage('page-landing');
});
