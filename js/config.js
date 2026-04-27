/* ═══════════════════════════════════════════
   WOLVES OF MAYHEM — Site Config v5
   ═══════════════════════════════════════════ */

const DEFAULT_CONFIG = {
  club: {
    name:       'Wolves of Mayhem',
    tag:        'MC',
    motto:      'Loyalty. Brotherhood. Mayhem.',
    founded:    '2022',
    location:   'Los Santos, San Andreas',
    about:      'The Wolves of Mayhem MC is a 1% outlaw motorcycle club based in Los Santos, San Andreas. Founded on the principles of brotherhood, loyalty, and riding free — we live by our own code. We are not a club you join. We are a family you earn.',
    /* Logo slots — each key maps to a position on the site.
       Value is the filename from logos/ folder.             */
    logos: {
      hero:  'Full_Patch_Kutte.png',   // large hero image on landing
      nav:   'Enhanced_Center.png',    // small circle in nav bar
      about: 'Enhanced_Center.png',    // image in the about section
      login: 'Enhanced_Center.png',    // login card logo
    },
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
    roster:    { label: 'Roster',    enabled: true,  order: 1, access: ['admin','view','member'], page: 'page-roster'    },
    finances:  { label: 'Finances',  enabled: true,  order: 2, access: ['admin'],                page: 'page-finances'  },
    inventory: { label: 'Inventory', enabled: true,  order: 3, access: ['admin','member'],        page: 'page-inventory' },
    events:    { label: 'Events',    enabled: true,  order: 4, access: ['admin','view','member'], page: 'page-events'    },
    settings:  { label: 'Settings',  enabled: true,  order: 5, access: ['admin'],                page: 'page-settings'  },
    mainsite:  { label: 'Main Site',  enabled: true,  order: 6, access: ['admin','member','view'],   page: 'page-landing'   },
  },

  /* ── ROSTER SECTIONS ──────────────────────────
     Each section has:
       id:     unique key (never changes)
       label:  display name (editable)
       order:  sort order (drag to reorder)
       ranks:  array of rank names that belong here
     Members are placed into a section based on their rank.
     If a rank isn't in any section it falls into "Members".
  ─────────────────────────────────────────────── */
  sections: [
    { id: 'command',     label: 'Command',                  order: 1, ranks: ['President', 'Vice President'] },
    { id: 'officers',    label: 'Officers',                 order: 2, ranks: ['Sergeant at Arms', 'Road Captain', 'Treasurer', 'Secretary'] },
    { id: 'subofficers', label: 'Sub-Officers',             order: 3, ranks: ['Enforcer'] },
    { id: 'senior',      label: 'Senior Members',           order: 4, ranks: ['Senior Member'] },
    { id: 'members',     label: 'Members',                  order: 5, ranks: ['Member'] },
    { id: 'trial_in',    label: 'Trial — Bled In (Plunge)', order: 6, ranks: ['Prospect (Bled In)', 'Prospect'] },
    { id: 'trial_out',   label: 'Trial — Not Bled In',      order: 7, ranks: ['Hangaround'] },
  ],

  /* access: 'admin' | 'member' | 'view' */
  members: [
    { username: 'prez',     password: 'mayhem2024', name: 'Road King',  roadName: 'Prez',     rank: 'President',       discord: '', discordId: '', cid: '', joined: '2022-01-01', access: 'admin'  },
    { username: 'vp',       password: 'chapter1',   name: 'Iron Cross', roadName: 'V.P.',     rank: 'Vice President',  discord: '', discordId: '', cid: '', joined: '2022-01-01', access: 'admin'  },
    { username: 'gangteam', password: 'immense2025',name: 'Gang Team',  roadName: '',         rank: 'Observer',        discord: '', discordId: '', cid: '', joined: '2025-01-01', access: 'view'   },
  ],
};

/* ── Config Manager ── */
const ConfigManager = (() => {
  const KEY = 'wom_cfg_v5';
  function deepMerge(t, s) {
    const r = Object.assign({}, t);
    for (const k in s) {
      if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) r[k] = deepMerge(t[k]||{}, s[k]);
      else r[k] = s[k];
    }
    return r;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const merged = deepMerge(DEFAULT_CONFIG, saved);
        /* Arrays (members, sections) always come from saved if present */
        if (saved.members)  merged.members  = saved.members;
        if (saved.sections) merged.sections = saved.sections;
        return merged;
      }
    } catch(e) {}
    return deepMerge({}, DEFAULT_CONFIG);
  }
  function save(cfg) { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch(e){} }
  function reset()   { try { localStorage.removeItem(KEY); } catch(e){} return deepMerge({}, DEFAULT_CONFIG); }
  return { load, save, reset };
})();

let CFG = ConfigManager.load();

/* Apply CSS vars */
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
  const hex2rgba = (h,a) => {
    const rv=parseInt(h.slice(1,3),16), gv=parseInt(h.slice(3,5),16), bv=parseInt(h.slice(5,7),16);
    return `rgba(${rv},${gv},${bv},${a})`;
  };
  s.setProperty('--red-faint',  hex2rgba(c.accent, 0.12));
  s.setProperty('--red-border', hex2rgba(c.accent, 0.40));
}

/* Time-in-club helper */
function timeInClub(joinedStr) {
  if (!joinedStr) return '—';
  const joined = new Date(joinedStr);
  const now    = new Date();
  let years  = now.getFullYear() - joined.getFullYear();
  let months = now.getMonth()    - joined.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years > 0)  return `${years}y ${months}m`;
  if (months > 0) return `${months}m`;
  const days = Math.floor((now - joined) / 86400000);
  return `${days}d`;
}

/* Get sorted sections */
function getSortedSections() {
  return [...CFG.sections].sort((a,b) => a.order - b.order);
}

/* Find which section a rank belongs to */
function sectionForRank(rank) {
  const sorted = getSortedSections();
  for (const sec of sorted) {
    if (sec.ranks && sec.ranks.includes(rank)) return sec;
  }
  return sorted.find(s => s.id === 'members') || sorted[sorted.length - 1];
}
