/* ═══════════════════════════════════════════
   WOLVES OF MAYHEM — Main JavaScript
   ═══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   MEMBER DATABASE
   In a real deployment, authentication would
   be handled server-side. This is a front-end
   demo using hardcoded credentials.
   ───────────────────────────────────────── */
const MEMBERS = [
  {
    username:  'prez',
    password:  'mayhem2024',
    role:      'President',
    name:      'Road King',
    access:    'all'
  },
  {
    username:  'vp',
    password:  'chapter1',
    role:      'Vice President',
    name:      'Iron Cross',
    access:    'all'
  },
  {
    username:  'treasurer',
    password:  'ledger99',
    role:      'Treasurer',
    name:      'Cash Money',
    access:    'finances'
  },
  {
    username:  'sergeant',
    password:  'patch01',
    role:      'Sergeant at Arms',
    name:      'Knuckles',
    access:    'standard'
  },
  {
    username:  'member',
    password:  'wolf',
    role:      'Member',
    name:      'Prospect',
    access:    'standard'
  }
];

/* ─────────────────────────────────────────
   MODULE DEFINITIONS
   access array defines which roles can see
   each module: 'all', 'finances', 'standard'
   ───────────────────────────────────────── */
const MODULES = [
  {
    id:     'roster',
    name:   'Roster',
    desc:   'Member directory and ranks',
    icon:   'icon-roster',
    access: ['all', 'standard', 'finances'],
    page:   'page-roster'
  },
  {
    id:     'finances',
    name:   'Finances',
    desc:   'Club treasury & dues',
    icon:   'icon-finances',
    access: ['all', 'finances'],
    page:   'page-finances'
  },
  {
    id:     'inventory',
    name:   'Inventory',
    desc:   'Gear, merch & equipment',
    icon:   'icon-inventory',
    access: ['all', 'standard', 'finances'],
    page:   'page-inventory'
  },
  {
    id:     'events',
    name:   'Events',
    desc:   'Rides, rallies & meetings',
    icon:   'icon-events',
    access: ['all', 'standard', 'finances'],
    page:   'page-events'
  },
  {
    id:     'settings',
    name:   'Settings',
    desc:   'Manage members & access',
    icon:   'icon-settings',
    access: ['all'],
    page:   'page-settings'
  }
];

/* ─────────────────────────────────────────
   SVG ICON TEMPLATES
   ───────────────────────────────────────── */
const ICONS = {
  'icon-roster': `
    <svg class="module-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>`,
  'icon-finances': `
    <svg class="module-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>`,
  'icon-inventory': `
    <svg class="module-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>`,
  'icon-events': `
    <svg class="module-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`,
  'icon-settings': `
    <svg class="module-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`,
  'icon-lock': `
    <svg class="module-lock" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`
};

/* ─────────────────────────────────────────
   STATE
   ───────────────────────────────────────── */
let currentUser = null;

/* ─────────────────────────────────────────
   PAGE NAVIGATION
   ───────────────────────────────────────── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

/* ─────────────────────────────────────────
   AUTH — LOGIN
   ───────────────────────────────────────── */
function handleLogin() {
  const usernameEl = document.getElementById('username');
  const passwordEl = document.getElementById('password');
  const errorEl    = document.getElementById('login-error');

  const u = usernameEl.value.trim().toLowerCase();
  const p = passwordEl.value;

  const member = MEMBERS.find(m => m.username === u && m.password === p);

  if (!member) {
    errorEl.classList.add('show');
    passwordEl.value = '';
    passwordEl.focus();
    return;
  }

  errorEl.classList.remove('show');
  currentUser = member;

  renderDashboard(member);
  showPage('page-dashboard');
}

/* ─────────────────────────────────────────
   AUTH — LOGOUT
   ───────────────────────────────────────── */
function handleLogout() {
  currentUser = null;
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  showPage('page-landing');
}

/* ─────────────────────────────────────────
   DASHBOARD RENDERING
   ───────────────────────────────────────── */
function renderDashboard(member) {
  // Update header
  const nameEl = document.getElementById('dash-username');
  const roleEl = document.getElementById('dash-role');
  if (nameEl) nameEl.textContent = member.name;
  if (roleEl) roleEl.textContent = member.role;

  // Render module grid
  const grid = document.getElementById('dash-modules');
  if (!grid) return;

  grid.innerHTML = MODULES.map(mod => {
    const hasAccess = mod.access.includes(member.access);
    const lockIcon  = !hasAccess ? ICONS['icon-lock'] : '';
    const lockedClass = !hasAccess ? ' locked' : '';
    const clickHandler = hasAccess
      ? `onclick="showPage('${mod.page}')" title="Open ${mod.name}"`
      : `title="Access restricted"`;

    return `
      <div class="dash-module${lockedClass}" ${clickHandler}>
        ${ICONS[mod.icon]}
        <div class="module-name">${mod.name}</div>
        <div class="module-desc">${mod.desc}</div>
        ${lockIcon}
      </div>
    `;
  }).join('');
}

/* ─────────────────────────────────────────
   SMOOTH SCROLL (landing page anchors)
   ───────────────────────────────────────── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ─────────────────────────────────────────
   KEYBOARD SHORTCUTS
   ───────────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    // Allow Enter to submit login from either field
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-login') {
      const focused = document.activeElement;
      if (focused && focused.id === 'username') {
        document.getElementById('password').focus();
      } else {
        handleLogin();
      }
    }
  }

  // Escape to go back
  if (e.key === 'Escape') {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-login') {
      showPage('page-landing');
    }
  }
});

/* ─────────────────────────────────────────
   INIT
   ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  // Start on landing page
  showPage('page-landing');

  // Focus username on login page when it becomes active
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.classList && node.classList.contains('active') && node.id === 'page-login') {
          setTimeout(() => {
            const u = document.getElementById('username');
            if (u) u.focus();
          }, 100);
        }
      });
    });
  });
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
});
