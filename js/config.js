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
    inventory: { label: 'Inventory', enabled: true,  order: 3, access: ['admin'],        page: 'page-inventory' },
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
    { id: 'command',     label: 'Command',                  order: 1, ranks: ['Founder - President', 'Vice President', 'Sergeant at Arms', 'Secretary - Chaplain'] },
    { id: 'officers',    label: 'Officers',                 order: 2, ranks: ['Treasurer', 'Road Captain', 'Chaplain', 'Tail Gunner'] },
    { id: 'subofficers', label: 'Sub-Officers',             order: 3, ranks: ['Tail Gunner Secondary', 'Head Enforcer', 'Enforcer'] },
    { id: 'senior',      label: 'Senior Members',           order: 4, ranks: ['Senior Member'] },
    { id: 'members',     label: 'Members',                  order: 5, ranks: ['Member'] },
    { id: 'trial_in',    label: 'Trial — Bled In (Plunge)', order: 6, ranks: ['Prospect'] },
    { id: 'trial_out',   label: 'Trial — Not Bled In',      order: 7, ranks: ['Hangaround'] },
  ],

  /* access: 'admin' | 'member' | 'view' */
  members: [
    { username: 'WolfTx',        password: 'mayhem2024', name: 'Sully Wolfgang',        roadName: 'Wolf',         rank: 'Founder - President',     discord: 'WolfTx',        discordId: '278721410313093120', cid: 'DL31QKXH', joined: '2024-05-16', access: 'admin' },
    { username: 'Nakor7920',     password: 'mayhem2024', name: 'Buzz Ragnarsson',       roadName: 'Loki',         rank: 'Vice President',         discord: 'Nakor7920',     discordId: '244265125278777344', cid: 'SQ2Y3G0F', joined: '2024-05-23', access: 'admin' },
    { username: 'pandax06',      password: 'mayhem2024', name: 'Casper Diaz',           roadName: 'Pyro',         rank: 'Sgt At Arms',           discord: 'pandax06',      discordId: '618321795996712963', cid: 'YBXU1H37', joined: '2024-07-28', access: 'admin' },
    { username: 'bubbles2013',   password: 'mayhem2024', name: 'Ziva Diaz',            roadName: 'Frost',        rank: 'Secretary - Chaplain',  discord: 'bubbles2013',   discordId: '777037975527620609', cid: 'X42QJA10', joined: '2025-07-07', access: 'admin' },
    { username: '6anshee6ee6',   password: 'mayhem2024', name: 'Daisy Wolfgang',     roadName: 'El Gata',      rank: 'Treasurer',             discord: '6anshee6ee6',   discordId: '757022961755750420', cid: 'EVCAP8UQ', joined: '2024-05-18', access: 'admin' },
    { username: 'sukuna5181',    password: 'mayhem2024', name: 'Hector Diaz',      roadName: 'El Velvet',    rank: 'Road Captain',          discord: 'sukuna5181',    discordId: '299782412282363904', cid: 'M0H3Y972', joined: '2025-12-07', access: 'admin' },
    { username: 'cactusjack3352', password: 'mayhem2024', name: 'Maverick Dawson',     roadName: 'Mundo',        rank: 'Tail Gunner',           discord: 'cactusjack3352', discordId: '640138055239467008', cid: 'MZ871B5Q', joined: '2025-10-31', access: 'view' },
    { username: 'falsetalks',    password: 'mayhem2024', name: 'Kari Wolfgang Diaz',           roadName: '',             rank: 'Tail Gunner Secondary', discord: 'falsetalks',    discordId: '562675185329635328', cid: 'JHAU5OPJ', joined: '2024-05-18', access: 'view' },
    { username: 'miro8047',      password: 'mayhem2024', name: 'Vlad Andropov', roadName: 'Mother Bitch', rank: 'Head Enforcer',         discord: 'miro8047',      discordId: '374446660497178624', cid: 'ISN6RQJS', joined: '2024-10-07', access: 'view' },
    { username: 'fistoffury219', password: 'mayhem2024', name: 'Donnie Light',    roadName: 'Dirty Bird',   rank: 'Enforcer',              discord: 'fistoffury219', discordId: '249795337756213249', cid: 'HQ20BPS4', joined: '2025-12-26', access: 'view' },
    { username: 'insidekiller.', password: 'mayhem2024', name: 'Zero Woods',       roadName: 'Boomhauer',    rank: 'Enforcer',              discord: 'insidekiller.', discordId: '731869362692030484', cid: 'T2VLOY29', joined: '2025-10-31', access: 'view' },
    { username: 'goold8nz',      password: 'mayhem2024', name: 'Frank Diaz',        roadName: 'Sherbert',     rank: 'Enforcer',              discord: 'goold8nz',      discordId: '1248649901089492994', cid: 'H3J8VQ24', joined: '2025-02-23', access: 'view' },
    { username: 'kingofcrate',   password: 'mayhem2024', name: 'James Knight',                 roadName: '',             rank: 'Enforcer',              discord: 'kingofcrate',   discordId: '189264150822780928', cid: 'DLT93Y2S', joined: '2026-02-28', access: 'view' },
    { username: 'opknight9',     password: 'mayhem2024', name: 'Dominic Wolfgang',     roadName: 'Blink',        rank: 'Senior Member',         discord: 'opknight9',     discordId: '347744181080293376', cid: 'Z688C788', joined: '2024-06-19', access: 'view' },
    { username: 'yaboycoffey21', password: 'mayhem2024', name: 'Tommy Coffey',                 roadName: '',             rank: 'Senior Member',         discord: 'yaboycoffey21', discordId: '840918344815083541', cid: 'TI98JC0H', joined: '2024-07-09', access: 'view' },
    { username: 'oldpilgrim',    password: 'mayhem2024', name: 'Petey McCarthy',               roadName: '',             rank: 'Patched Member',        discord: 'oldpilgrim',    discordId: '242650964165787659', cid: 'HSB17UN8', joined: '2026-01-23', access: 'view' },
    { username: 'race_angel',    password: 'mayhem2024', name: 'Yeu-Mi Silver',                roadName: '',             rank: 'Patched Member',        discord: 'race_angel',    discordId: '243554461811736576', cid: 'ESE2Q917', joined: '2026-02-08', access: 'view' },
    { username: 'Atryus',        password: 'mayhem2024', name: 'Jace Sigardson',               roadName: '',             rank: 'Patched Member',        discord: 'Atryus',        discordId: '110926727936495616', cid: 'NM51TZBG', joined: '2026-03-21', access: 'view' },
    { username: 'sticky',        password: 'mayhem2024', name: 'Billy Stickler',               roadName: '',             rank: 'Patched Member',        discord: 'sticky',        discordId: '327215483570880523', cid: 'G85Q73L0', joined: '2026-04-01', access: 'view' },
    { username: 'ogcomplex645',  password: 'mayhem2024', name: 'Alex Cruz',                    roadName: '',             rank: 'Prospect',              discord: 'ogcomplex645',  discordId: '1202497211288526928', cid: 'PYYNQUE8', joined: '2026-04-11', access: 'view' },
    { username: 'Cutefawn01',    password: 'mayhem2024', name: 'Nina Morrigan',                roadName: '',             rank: 'Prospect',              discord: 'Cutefawn01',    discordId: '391007996882190337', cid: 'CL307B73', joined: '2026-04-11', access: 'view' },
    { username: 'murphitis',     password: 'mayhem2024', name: 'IzzI Robinson',                roadName: '',             rank: 'Hang-Around',           discord: 'murphitis',     discordId: '229328181792866304', cid: 'I340Z5PE', joined: '2026-04-24', access: 'view' },
    { username: 'gangteam', password: 'immense2025', name: 'Gang Team',  roadName: '',         rank: 'Observer',        discord: '', discordId: '', cid: '', joined: '2025-01-01', access: 'view'   },
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
