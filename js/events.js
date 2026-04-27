/* ═══════════════════════════════════════════
   WOLVES OF MAYHEM — Events Module
   ═══════════════════════════════════════════ */
'use strict';

/* ── Event Storage ── */
const EventStore = (() => {
  const KEY = 'wom_events_v1';
  function load()      { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; } }
  function save(evts)  { try { localStorage.setItem(KEY, JSON.stringify(evts)); } catch(e) {} }
  return { load, save };
})();

/* ── Opt-in Storage ── */
const OptInStore = (() => {
  const KEY = 'wom_optins_v1';
  function load()     { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { return {}; } }
  function save(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e) {} }
  return { load, save };
})();

/* ── Timezone list ── */
const TIMEZONES = [
  { value: 'America/New_York',    label: 'Eastern (EST/EDT)'    },
  { value: 'America/Chicago',     label: 'Central (CST/CDT)'    },
  { value: 'America/Denver',      label: 'Mountain (MST/MDT)'   },
  { value: 'America/Los_Angeles', label: 'Pacific (PST/PDT)'    },
  { value: 'America/Anchorage',   label: 'Alaska (AKST/AKDT)'   },
  { value: 'Pacific/Honolulu',    label: 'Hawaii (HST)'          },
  { value: 'America/Toronto',     label: 'Toronto (EST/EDT)'     },
  { value: 'America/Vancouver',   label: 'Vancouver (PST/PDT)'   },
  { value: 'Europe/London',       label: 'London (GMT/BST)'      },
  { value: 'Europe/Paris',        label: 'Paris (CET/CEST)'      },
  { value: 'Australia/Sydney',    label: 'Sydney (AEST/AEDT)'    },
  { value: 'UTC',                 label: 'UTC'                    },
];

const DEFAULT_TZ = 'America/New_York';

/* Get timezone for current user (falls back to EST) */
function getUserTz() {
  if (!currentUser) return DEFAULT_TZ;
  return currentUser.timezone || DEFAULT_TZ;
}

/* Format a UTC ISO date string into the user's timezone */
function formatEventTime(isoStr, tz) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('en-US', {
      timeZone: tz || getUserTz(),
      weekday: 'short', month: 'short', day: 'numeric',
      year: 'numeric', hour: 'numeric', minute: '2-digit',
      hour12: true,
    });
  } catch(e) { return isoStr; }
}

/* Short format for card */
function formatEventTimeShort(isoStr, tz) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('en-US', {
      timeZone: tz || getUserTz(),
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch(e) { return isoStr; }
}

/* ── Generate recurring instances ──
   Given a base event, produce all occurrences from now
   up to 6 months ahead. Returns array of {event, instanceDate} */
function getEventInstances(event, fromDate, toDate) {
  const instances = [];
  const base = new Date(event.datetime);
  if (isNaN(base)) return instances;

  const from = fromDate || new Date();
  const to   = toDate   || new Date(Date.now() + 1000*60*60*24*180); // 6 months

  if (!event.recurring || event.recurring === 'none') {
    if (base >= from && base <= to) instances.push({ ...event, instanceDate: event.datetime });
    return instances;
  }

  let cursor = new Date(base);
  let safetyLimit = 200;

  /* Walk forward to first occurrence >= from */
  while (cursor < from && safetyLimit-- > 0) {
    cursor = nextOccurrence(cursor, event.recurring);
  }

  while (cursor <= to && safetyLimit-- > 0) {
    instances.push({ ...event, instanceDate: cursor.toISOString() });
    cursor = nextOccurrence(new Date(cursor), event.recurring);
  }

  return instances;
}

function nextOccurrence(date, recurring) {
  const d = new Date(date);
  switch (recurring) {
    case 'weekly':    d.setDate(d.getDate() + 7);   break;
    case 'biweekly':  d.setDate(d.getDate() + 14);  break;
    case 'monthly':   d.setMonth(d.getMonth() + 1); break;
    default:          d.setFullYear(d.getFullYear() + 100); break;
  }
  return d;
}

/* ── Build flat sorted list of upcoming instances ── */
function getUpcomingInstances(includePrivate) {
  const events = EventStore.load();
  const now    = new Date();
  const future = new Date(Date.now() + 1000*60*60*24*180);

  let instances = [];
  events.forEach(ev => {
    if (ev.visibility === 'private' && !includePrivate) return;
    getEventInstances(ev, now, future).forEach(inst => instances.push(inst));
  });

  instances.sort((a,b) => new Date(a.instanceDate) - new Date(b.instanceDate));
  return instances;
}

/* ═══════════════════════════════════════════
   RENDER EVENTS PAGE
   ═══════════════════════════════════════════ */
function renderEventsPage() {
  const container = document.getElementById('events-container');
  if (!container) return;

  const isLoggedIn = !!currentUser;
  const isAdmin    = currentUser?.access === 'admin';
  const tz         = getUserTz();

  const instances = getUpcomingInstances(isLoggedIn);

  let html = '';

  if (isAdmin) {
    html += `
      <div class="events-toolbar">
        <button class="btn-create-event" onclick="openEventEditor()">+ Create Event</button>
      </div>`;
  }

  if (instances.length === 0) {
    html += `<div class="events-empty">No upcoming events. Check back soon.</div>`;
  } else {
    html += `<div class="events-grid" id="events-grid">`;
    instances.forEach(inst => {
      const timeStr = formatEventTimeShort(inst.instanceDate, tz);
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
            <div class="ev-card-tz">Showing in ${tz.replace('_',' ')}</div>
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
}

/* ═══════════════════════════════════════════
   EVENT DETAIL MODAL
   ═══════════════════════════════════════════ */
function openEventDetail(eventId, instanceDate) {
  const events = EventStore.load();
  const event  = events.find(e => e.id === eventId);
  if (!event) return;

  const tz        = getUserTz();
  const timeStr   = formatEventTime(instanceDate, tz);
  const isAdmin   = currentUser?.access === 'admin';
  const isLoggedIn = !!currentUser;

  /* Opt-in data */
  const optIns    = OptInStore.load();
  const eventKey  = `${eventId}_${instanceDate}`;
  const optInList = optIns[eventKey] || [];
  const userOptedIn = isLoggedIn && optInList.includes(currentUser.username);

  /* Attendance section */
  let attendanceHtml = '';
  if (isLoggedIn) {
    const btnLabel = userOptedIn ? '✓ You\'re In' : 'Opt In';
    const btnClass = userOptedIn ? 'btn-optin btn-optin--active' : 'btn-optin';
    attendanceHtml = `
      <div class="ev-modal-attendance">
        <button class="${btnClass}" onclick="toggleOptIn('${esc(eventId)}','${esc(instanceDate)}')">${btnLabel}</button>`;

    if (isAdmin) {
      /* Admin sees full list */
      const rosterMembers = CFG.members.filter(m => m.access !== 'view');
      const optedInNames  = optInList.map(u => {
        const m = CFG.members.find(x => x.username === u);
        return m ? (m.roadName || m.name) : u;
      });
      const missingNames = rosterMembers
        .filter(m => !optInList.includes(m.username))
        .map(m => m.roadName || m.name);

      attendanceHtml += `
        <div class="ev-attendance-count">
          <span class="ev-att-in">${optInList.length} opted in</span>
          <span class="ev-att-sep">·</span>
          <span class="ev-att-out">${missingNames.length} not responded</span>
        </div>
        <div class="ev-attendance-lists">
          <div class="ev-att-col">
            <div class="ev-att-heading">&#10003; In</div>
            ${optedInNames.length
              ? optedInNames.map(n => `<div class="ev-att-name ev-att-name--in">${esc(n)}</div>`).join('')
              : '<div class="ev-att-empty">None yet</div>'}
          </div>
          <div class="ev-att-col">
            <div class="ev-att-heading">&#8212; Not Responded</div>
            ${missingNames.length
              ? missingNames.map(n => `<div class="ev-att-name ev-att-name--out">${esc(n)}</div>`).join('')
              : '<div class="ev-att-empty">Everyone\'s in!</div>'}
          </div>
        </div>`;
    } else {
      attendanceHtml += `<div class="ev-attendance-count"><span class="ev-att-in">${optInList.length} opted in</span></div>`;
    }
    attendanceHtml += `</div>`;
  }

  /* Admin controls */
  let adminHtml = '';
  if (isAdmin) {
    adminHtml = `
      <div class="ev-modal-admin">
        <button class="ev-edit-btn" onclick="closeEventDetail();openEventEditor('${esc(eventId)}')">Edit Event</button>
        <button class="ev-del-btn"  onclick="deleteEvent('${esc(eventId)}')">Delete</button>
      </div>`;
  }

  const imgHtml = event.imageUrl
    ? `<img src="${escAttr(event.imageUrl)}" alt="${esc(event.title)}" class="ev-modal-img" />`
    : `<div class="ev-modal-img-placeholder"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;

  const recurText = event.recurring && event.recurring !== 'none'
    ? `<span class="ev-modal-recur">Repeats ${event.recurring}</span>` : '';

  document.getElementById('event-modal-inner').innerHTML = `
    ${imgHtml}
    <div class="ev-modal-body">
      <div class="ev-modal-badges">
        ${event.visibility === 'private' ? '<span class="ev-private-badge">Members Only</span>' : '<span class="ev-public-badge">Public</span>'}
        ${recurText}
      </div>
      <h2 class="ev-modal-title">${esc(event.title)}</h2>
      <div class="ev-modal-time">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${esc(timeStr)}
        <span class="ev-modal-tz">${tz.replace(/_/g,' ')}</span>
      </div>
      <p class="ev-modal-desc">${esc(event.description || '').replace(/\n/g,'<br>')}</p>
      ${attendanceHtml}
      ${adminHtml}
    </div>`;

  document.getElementById('event-modal').classList.add('open');
}

function closeEventDetail() {
  document.getElementById('event-modal').classList.remove('open');
}

function toggleOptIn(eventId, instanceDate) {
  if (!currentUser) return;
  const optIns   = OptInStore.load();
  const key      = `${eventId}_${instanceDate}`;
  const list     = optIns[key] || [];
  const idx      = list.indexOf(currentUser.username);
  if (idx === -1) list.push(currentUser.username);
  else            list.splice(idx, 1);
  optIns[key] = list;
  OptInStore.save(optIns);
  /* Re-render the modal */
  closeEventDetail();
  openEventDetail(eventId, instanceDate);
}

function deleteEvent(eventId) {
  if (!confirm('Delete this event and all its recurrences?')) return;
  const events = EventStore.load().filter(e => e.id !== eventId);
  EventStore.save(events);
  closeEventDetail();
  renderEventsPage();
}

/* ═══════════════════════════════════════════
   EVENT EDITOR MODAL
   ═══════════════════════════════════════════ */
function openEventEditor(editId) {
  const events   = EventStore.load();
  const existing = editId ? events.find(e => e.id === editId) : null;
  const e        = existing || {};

  const tzOpts = TIMEZONES.map(t =>
    `<option value="${t.value}" ${t.value === DEFAULT_TZ ? 'selected' : ''}>${t.label}</option>`
  ).join('');

  const recurOpts = [
    { value: 'none',      label: 'Does not repeat' },
    { value: 'weekly',    label: 'Weekly'           },
    { value: 'biweekly',  label: 'Every 2 weeks'    },
    { value: 'monthly',   label: 'Monthly'          },
  ].map(o => `<option value="${o.value}" ${(e.recurring||'none')===o.value?'selected':''}>${o.label}</option>`).join('');

  const visOpts = [
    { value: 'public',  label: 'Public — everyone can see' },
    { value: 'private', label: 'Private — members only'    },
  ].map(o => `<option value="${o.value}" ${(e.visibility||'public')===o.value?'selected':''}>${o.label}</option>`).join('');

  /* Convert stored UTC to local datetime-local value for the input */
  let datetimeVal = '';
  if (e.datetime) {
    try {
      const d = new Date(e.datetime);
      const pad = n => String(n).padStart(2,'0');
      datetimeVal = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch(_) {}
  }

  document.getElementById('event-editor-inner').innerHTML = `
    <div class="ee-header">
      <span class="ee-title">${editId ? 'Edit Event' : 'Create Event'}</span>
      <button class="lp-close" onclick="closeEventEditor()">&#10005;</button>
    </div>
    <div class="ee-body">
      <div class="ee-field">
        <label class="ee-label">Event Title *</label>
        <input class="s-input" id="ee-title" type="text" value="${esc(e.title||'')}" placeholder="e.g. Weekly Church Run" />
      </div>

      <div class="ee-field">
        <label class="ee-label">Date & Time (EST) *</label>
        <div class="ee-datetime-row">
          <input class="s-input" id="ee-datetime" type="datetime-local" value="${datetimeVal}" style="max-width:240px;" />
          <select class="s-input s-select" id="ee-input-tz" style="max-width:220px;">${tzOpts}</select>
        </div>
        <span class="ee-hint">Enter time in the timezone you select above — it will be converted for each member.</span>
      </div>

      <div class="ee-field">
        <label class="ee-label">Recurrence</label>
        <select class="s-input s-select" id="ee-recurring" style="max-width:220px;">${recurOpts}</select>
      </div>

      <div class="ee-field">
        <label class="ee-label">Visibility</label>
        <select class="s-input s-select" id="ee-visibility" style="max-width:260px;">${visOpts}</select>
      </div>

      <div class="ee-field">
        <label class="ee-label">Description</label>
        <textarea class="s-input s-textarea" id="ee-desc" rows="4" placeholder="Details about the event...">${esc(e.description||'')}</textarea>
      </div>

      <div class="ee-field">
        <label class="ee-label">Event Image</label>
        <div class="ee-img-preview" id="ee-img-preview">
          ${e.imageUrl ? `<img src="${escAttr(e.imageUrl)}" alt="Event image" />` : '<span>No image</span>'}
        </div>
        <div class="ee-img-options">
          <label class="ee-img-upload-btn">
            Upload Image
            <input type="file" id="ee-img-upload" accept="image/*" style="display:none;" onchange="handleEventImgUpload(event)" />
          </label>
          <span class="ee-img-or">or</span>
          <input class="s-input" id="ee-img-url" type="url" placeholder="Paste image URL"
                 value="${esc(e.imageUrl && !e.imageUrl.startsWith('data:') ? e.imageUrl : '')}"
                 oninput="previewEventImgUrl(this.value)" style="flex:1;max-width:300px;" />
        </div>
        <input type="hidden" id="ee-img-data" value="${escAttr(e.imageUrl||'')}" />
      </div>

      <div class="ee-actions">
        <button class="btn-save" onclick="saveEvent('${editId||''}')">
          ${editId ? 'Update Event' : 'Create Event'}
        </button>
        <button class="btn-reset" onclick="closeEventEditor()">Cancel</button>
        <span class="s-saved" id="ee-saved-msg"></span>
      </div>
    </div>`;

  document.getElementById('event-editor').classList.add('open');
}

function closeEventEditor() {
  document.getElementById('event-editor').classList.remove('open');
}

function handleEventImgUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const dataUrl = ev.target.result;
    document.getElementById('ee-img-data').value = dataUrl;
    document.getElementById('ee-img-preview').innerHTML = `<img src="${dataUrl}" alt="Preview" />`;
    document.getElementById('ee-img-url').value = '';
  };
  reader.readAsDataURL(file);
}

function previewEventImgUrl(url) {
  if (!url) { document.getElementById('ee-img-preview').innerHTML = '<span>No image</span>'; return; }
  document.getElementById('ee-img-data').value = url;
  document.getElementById('ee-img-preview').innerHTML = `<img src="${escAttr(url)}" alt="Preview" onerror="this.parentElement.innerHTML='<span>Could not load image</span>'" />`;
}

function saveEvent(editId) {
  const title      = document.getElementById('ee-title')?.value.trim();
  const datetimeRaw= document.getElementById('ee-datetime')?.value;
  const inputTz    = document.getElementById('ee-input-tz')?.value || DEFAULT_TZ;
  const recurring  = document.getElementById('ee-recurring')?.value || 'none';
  const visibility = document.getElementById('ee-visibility')?.value || 'public';
  const description= document.getElementById('ee-desc')?.value.trim() || '';
  const imageUrl   = document.getElementById('ee-img-data')?.value
                  || document.getElementById('ee-img-url')?.value.trim()
                  || '';

  if (!title)       { alert('Please enter a title.');      return; }
  if (!datetimeRaw) { alert('Please select a date/time.'); return; }

  /* Convert the entered time from the selected timezone to UTC */
  let utcDatetime;
  try {
    /* Build a fake date string and parse it as if it were in inputTz */
    const localStr  = datetimeRaw.replace('T', ' ') + ':00';
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: inputTz, year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false,
    });
    /* Use a workaround: create date from string, adjust for tz offset */
    const naive    = new Date(datetimeRaw);
    /* Get offset between inputTz and UTC at that moment */
    const utcMs    = naive.getTime();
    const tzDate   = new Date(naive.toLocaleString('en-US', { timeZone: inputTz }));
    const naiveLocal = new Date(naive.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offset   = naiveLocal - tzDate; /* ms */
    utcDatetime    = new Date(utcMs + offset).toISOString();
  } catch(err) {
    utcDatetime = new Date(datetimeRaw).toISOString();
  }

  const events = EventStore.load();
  if (editId) {
    const idx = events.findIndex(e => e.id === editId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], title, datetime: utcDatetime, recurring, visibility, description, imageUrl };
    }
  } else {
    events.push({
      id: 'evt_' + Date.now(),
      title, datetime: utcDatetime,
      recurring, visibility, description, imageUrl,
      createdBy: currentUser?.username || 'admin',
      createdAt: new Date().toISOString(),
    });
  }

  EventStore.save(events);
  closeEventEditor();
  renderEventsPage();

  const msg = document.getElementById('ee-saved-msg');
  if (msg) { msg.textContent = 'Saved!'; msg.classList.add('show'); setTimeout(()=>msg.classList.remove('show'),2000); }
}

/* ── escAttr helper (for use in attribute values) ── */
function escAttr(s='') {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;');
}
