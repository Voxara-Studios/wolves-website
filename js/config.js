/* ═══════════════════════════════════════════════════
   WOLVES OF MAYHEM — Site Configuration
   All site-wide settings live here.
   Admins edit this via the Config panel (saved to
   localStorage so changes persist across sessions).
   ═══════════════════════════════════════════════════ */

const DEFAULT_CONFIG = {

  /* ── CLUB IDENTITY ── */
  club: {
    name:    'Wolves of Mayhem',
    nameShort: 'WOM',
    motto:   'Born to Ride. Built to Last.',
    founded: '2034',
    chapter: 'Main Chapter',
    logoUrl: '',          // base64 or URL; empty = use SVG patch
  },

  /* ── THEME COLORS ── */
  colors: {
    accent:     '#b20702',   // primary red
    accentDark: '#8a0502',   // hover state
    bgBlack:    '#0a0a0a',
    bgDark:     '#111111',
    bgCard:     '#161616',
    bgCard2:    '#1c1c1c',
    textPrimary:   '#e8e6e0',
    textSecondary: '#9a9590',
    textMuted:     '#5a5550',
  },

  /* ── HERO STATS BAR ── */
  stats: [
    { num: '31',  label: 'Active Members' },
    { num: '2',   label: 'Years Running'  },
    { num: '1',   label: 'Chapter'        },
    { num: '∞',   label: 'Brotherhood'    },
  ],

  /* ── SOCIAL / CONTACT ── */
  social: {
    facebook:  '',
    instagram: '',
    email:     '',
    phone:     '',
  },

  /* ── MODULES ──
     enabled: true/false controls whether the module
     appears in the dashboard for users with access.
     order: controls display order in the grid.        */
  modules: {
    roster:    { label: 'Roster',    enabled: true,  order: 1, icon: 'icon-roster',    access: ['all','standard','finances'], page: 'page-roster',    desc: 'Member directory and ranks'    },
    finances:  { label: 'Finances',  enabled: true,  order: 2, icon: 'icon-finances',  access: ['all','finances'],            page: 'page-finances',  desc: 'Club treasury & dues'          },
    inventory: { label: 'Inventory', enabled: true,  order: 3, icon: 'icon-inventory', access: ['all','standard'],            page: 'page-inventory', desc: 'Gear, merch & equipment'       },
    events:    { label: 'Events',    enabled: true,  order: 4, icon: 'icon-events',    access: ['all','standard','finances'], page: 'page-events',    desc: 'Rides, rallies & meetings'     },
    settings:  { label: 'Config',    enabled: true,  order: 5, icon: 'icon-settings',  access: ['all'],                       page: 'page-config',    desc: 'Site settings & management'    },
  },

  /* ── MEMBERS ──
     Credentials managed via Config panel.
     access levels: 'all' | 'finances' | 'standard'   */
  members: [
    { username: 'prez',      password: 'mayhem2024', role: 'President',         name: 'Road King',   access: 'all'      },
    { username: 'vp',        password: 'chapter1',   role: 'Vice President',    name: 'Iron Cross',  access: 'all'      },
    { username: 'treasurer', password: 'ledger99',   role: 'Treasurer',         name: 'Cash Money',  access: 'finances' },
    { username: 'sergeant',  password: 'patch01',    role: 'Sergeant at Arms',  name: 'Knuckles',    access: 'standard' },
    { username: 'member',    password: 'wolf',       role: 'Member',            name: 'Prospect',    access: 'standard' },
  ],

};

/* ═══════════════════════════════════════════════════
   CONFIG MANAGER
   Merges saved localStorage config over defaults.
   ═══════════════════════════════════════════════════ */
const ConfigManager = (() => {
  const STORAGE_KEY = 'wom_config';

  function deepMerge(target, source) {
    const result = Object.assign({}, target);
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return deepMerge(DEFAULT_CONFIG, JSON.parse(saved));
    } catch (e) { /* fall through */ }
    return deepMerge({}, DEFAULT_CONFIG);
  }

  function save(cfg) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    return deepMerge({}, DEFAULT_CONFIG);
  }

  return { load, save, reset };
})();

/* Live config instance — all code reads from this */
let CFG = ConfigManager.load();

/* Apply CSS variables from config colors */
function applyTheme(colors) {
  const r = document.documentElement.style;
  r.setProperty('--club-red',        colors.accent);
  r.setProperty('--club-red-dark',   colors.accentDark);
  r.setProperty('--bg-black',        colors.bgBlack);
  r.setProperty('--bg-dark',         colors.bgDark);
  r.setProperty('--bg-card',         colors.bgCard);
  r.setProperty('--bg-card2',        colors.bgCard2);
  r.setProperty('--text-primary',    colors.textPrimary);
  r.setProperty('--text-secondary',  colors.textSecondary);
  r.setProperty('--text-muted',      colors.textMuted);
  /* Derived */
  const toRgba = (hex, a) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  };
  r.setProperty('--club-red-glow',   toRgba(colors.accent, 0.25));
  r.setProperty('--club-red-faint',  toRgba(colors.accent, 0.12));
  r.setProperty('--club-red-border', toRgba(colors.accent, 0.40));
}
