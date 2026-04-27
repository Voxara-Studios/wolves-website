/* ═══════════════════════════════════════════
   WOLVES OF MAYHEM — Site Config
   ═══════════════════════════════════════════ */

const DEFAULT_CONFIG = {
  club: {
    name:     'Wolves of Mayhem',
    tag:      'MC',
    motto:    'Loyalty. Brotherhood. Mayhem.',
    founded:  '2022',
    location: 'Los Santos, San Andreas',
    about:    'The Wolves of Mayhem MC is a 1% outlaw motorcycle club based in Los Santos, San Andreas. Founded on the principles of brotherhood, loyalty, and riding free — we live by our own code. We are not a club you join. We are a family you earn.',
    // Filename from the logos/ folder (e.g. "patch.png")
    activeLogo: 'patch.png',
  },
  colors: {
    accent:        '#b20702',
    accentDark:    '#8a0502',
    bgBlack:       '#0a0a0a',
    bgDark:        '#111111',
    bgCard:        '#161616',
    bgCard2:       '#1c1c1c',
    textPrimary:   '#e8e6e0',
    textSecondary: '#9a9590',
    textMuted:     '#5a5550',
  },
  modules: {
    roster:    { label: 'Roster',    enabled: true,  order: 1, access: ['admin','view','member'], page: 'page-roster'   },
    finances:  { label: 'Finances',  enabled: true,  order: 2, access: ['admin'],                page: 'page-finances' },
    inventory: { label: 'Inventory', enabled: true,  order: 3, access: ['admin','member'],        page: 'page-inventory'},
    events:    { label: 'Events',    enabled: true,  order: 4, access: ['admin','view','member'], page: 'page-events'   },
    settings:  { label: 'Settings',  enabled: true,  order: 5, access: ['admin'],                page: 'page-settings' },
  },
  /* Members — managed via settings panel.
     access: 'admin' | 'member' | 'view'           */
  members: [
    { username: 'prez',      password: 'mayhem2024', name: 'Road King',  rank: 'President',        discord: '',  discordId: '', cid: '',  joined: '2022-01-01', access: 'admin'  },
    { username: 'vp',        password: 'chapter1',   name: 'Iron Cross', rank: 'Vice President',   discord: '',  discordId: '', cid: '',  joined: '2022-01-01', access: 'admin'  },
    { username: 'gangteam',  password: 'immense2025',name: 'Gang Team',  rank: 'Observer',         discord: '',  discordId: '', cid: '',  joined: '2025-01-01', access: 'view'   },
  ],
};

/* ── Config Manager ── */
const ConfigManager = (() => {
  const KEY = 'wom_cfg_v3';
  function deepMerge(t, s) {
    const r = Object.assign({}, t);
    for (const k in s) {
      if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) r[k] = deepMerge(t[k]||{}, s[k]);
      else r[k] = s[k];
    }
    return r;
  }
  function load() {
    try { const s = localStorage.getItem(KEY); if (s) return deepMerge(DEFAULT_CONFIG, JSON.parse(s)); } catch(e){}
    return deepMerge({}, DEFAULT_CONFIG);
  }
  function save(cfg) { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch(e){} }
  function reset()   { try { localStorage.removeItem(KEY); } catch(e){} return deepMerge({}, DEFAULT_CONFIG); }
  return { load, save, reset };
})();

let CFG = ConfigManager.load();

/* Apply CSS vars from color config */
function applyTheme(c) {
  const s = document.documentElement.style;
  s.setProperty('--red',        c.accent);
  s.setProperty('--red-dark',   c.accentDark);
  s.setProperty('--bg0',        c.bgBlack);
  s.setProperty('--bg1',        c.bgDark);
  s.setProperty('--bg2',        c.bgCard);
  s.setProperty('--bg3',        c.bgCard2);
  s.setProperty('--t1',         c.textPrimary);
  s.setProperty('--t2',         c.textSecondary);
  s.setProperty('--t3',         c.textMuted);
  const hex2rgba = (h,a) => { const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; };
  s.setProperty('--red-faint',  hex2rgba(c.accent, 0.12));
  s.setProperty('--red-border', hex2rgba(c.accent, 0.40));
}

/* Time-in-club helper */
function timeInClub(joinedStr) {
  if (!joinedStr) return '—';
  const joined = new Date(joinedStr);
  const now = new Date();
  let years  = now.getFullYear() - joined.getFullYear();
  let months = now.getMonth()    - joined.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years > 0)  return `${years}y ${months}m`;
  if (months > 0) return `${months}m`;
  const days = Math.floor((now - joined) / 86400000);
  return `${days}d`;
}
