# Wolves of Mayhem MC — Member Portal

Private members portal for the Wolves of Mayhem MC.

## File Structure

```
wolves-of-mayhem/
├── index.html              ← All pages live here (single-page app)
├── css/
│   └── style.css           ← All styles + CSS variables
├── js/
│   ├── config.js           ← Default config, ConfigManager, applyTheme()
│   ├── config-panel.js     ← Admin config panel UI + logic
│   └── app.js              ← Routing, auth, dashboard, landing render
└── README.md
```

## How the Config System Works

All site settings live in `js/config.js` as `DEFAULT_CONFIG`.
When an admin makes changes via the **Config panel** (login as `prez`), they are saved to `localStorage` and override the defaults — no server needed.

Changes persist across sessions. Use **Factory Reset** in the Config panel to revert everything to defaults.

## Demo Login Credentials

| Username    | Password     | Role              | Access        |
|-------------|--------------|-------------------|---------------|
| `prez`      | `mayhem2024` | President         | Full (admin)  |
| `vp`        | `chapter1`   | Vice President    | Full (admin)  |
| `treasurer` | `ledger99`   | Treasurer         | Finances only |
| `sergeant`  | `patch01`    | Sergeant at Arms  | Standard      |
| `member`    | `wolf`       | Member            | Standard      |

> ⚠️ Update credentials via the Config panel before sharing with members.

## Access Levels

| Level      | Can access                                      |
|------------|-------------------------------------------------|
| `all`      | All modules including Config/Settings           |
| `finances` | Roster, Finances, Events                        |
| `standard` | Roster, Inventory, Events                       |

## Hosting on GitHub Pages — Step by Step

### 1. Create a GitHub account
Go to https://github.com and sign up (free).

### 2. Create a new repository
1. Click **+** → **New repository**
2. Name: `wolves-of-mayhem` (or anything you like)
3. Visibility: **Public** (required for free GitHub Pages)
4. Click **Create repository**

### 3. Upload your files
**Easiest method — GitHub web upload:**
1. Unzip this project folder
2. On your new repo page, click **"uploading an existing file"**
3. Drag in the entire contents:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `README.md`
4. Add commit message: `Initial upload`
5. Click **Commit changes**

**Important:** Make sure the folder structure is preserved —
`css/style.css` and `js/app.js` must be in their folders, not loose.

### 4. Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source** → **Deploy from a branch**
3. Branch: `main`, Folder: `/ (root)`
4. Click **Save**

### 5. Your site goes live
After 1–2 minutes, your URL will be:
```
https://YOUR_USERNAME.github.io/wolves-of-mayhem/
```
GitHub shows this URL on the Pages settings screen once it's ready.

---

## Updating the Site Later

After making code changes:
1. Go to your GitHub repo
2. Click on the file you want to update (e.g. `js/config.js`)
3. Click the pencil ✏️ icon to edit
4. Make your changes
5. Click **Commit changes**

The site auto-deploys within ~1 minute.

---

## Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, Cloudflare, etc.)
2. Repo → Settings → Pages → **Custom domain** → enter your domain
3. Update your domain's DNS as GitHub instructs (A records or CNAME)

---

## Roadmap

- [ ] Roster module — member directory with add/edit/remove
- [ ] Finances module — dues ledger, expenses, balance
- [ ] Inventory module — gear and merch with quantity tracking  
- [ ] Events module — calendar with rides and meetings
- [ ] Move credentials to a real backend (recommended for production)
