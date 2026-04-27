# Wolves of Mayhem MC — Member Portal v3

## File Structure

```
wolves-of-mayhem/
├── index.html          ← All pages (single-page app)
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── config.js       ← Site config, defaults, ConfigManager, applyTheme
│   └── app.js          ← Routing, auth, page rendering, settings logic
├── assets/
│   ├── patch.jpg       ← Full club patch logo
│   └── wolf.jpg        ← Wolf head logo
└── README.md
```

## Access Levels

| Level    | What they see                                         |
|----------|-------------------------------------------------------|
| `admin`  | Dashboard → all enabled modules + Settings            |
| `member` | Roster only (no dashboard, no settings)               |
| `view`   | Roster only, read-only (gangteam account)             |

## Default Credentials

| Username    | Password      | Access  | Notes                        |
|-------------|---------------|---------|------------------------------|
| `prez`      | `mayhem2024`  | admin   | Full access + settings       |
| `vp`        | `chapter1`    | admin   | Full access + settings       |
| `gangteam`  | `immense2025` | view    | Read-only, not on roster     |

> Update all credentials via the **Settings → Members** tab after first login.

## Adding More Logo Images

1. Copy your image file into the `assets/` folder (e.g., `assets/mylogo.jpg`)
2. Login as admin → Settings → Logo tab
3. The active logo dropdown currently supports `patch` and `wolf`
4. To add a new option, open `js/app.js`, find the `renderSettings()` function,
   and add your filename to the `logoOpts` array

## Hosting on GitHub Pages

### Step 1 — Create GitHub account
https://github.com → Sign up (free)

### Step 2 — New repository
- Click **+** → **New repository**
- Name: `wolves-of-mayhem`
- Visibility: **Public**
- Click **Create repository**

### Step 3 — Upload files
1. Unzip the project folder
2. On the new repo page → click **"uploading an existing file"**
3. Drag ALL files and folders in:
   - `index.html`
   - `css/` folder (with style.css)
   - `js/` folder (with config.js and app.js)
   - `assets/` folder (with patch.jpg and wolf.jpg)
   - `README.md`
4. Commit message: `Initial upload`
5. Click **Commit changes**

**Important:** The folder structure must be preserved exactly as shown above.

### Step 4 — Enable GitHub Pages
1. Repo → **Settings** → **Pages** (left sidebar)
2. Source: **Deploy from a branch**
3. Branch: `main`, Folder: `/ (root)`
4. Click **Save**

### Step 5 — Live!
After ~2 minutes your site is at:
```
https://YOUR_USERNAME.github.io/wolves-of-mayhem/
```

## Updating Credentials Later

After initial deployment, log in as an admin and use **Settings → Members** to
add, edit, or remove members. Changes save to `localStorage` on that browser.

> Note: Since this is a static site with no server, credentials are stored in
> the browser's localStorage. For a shared admin computer this works great.
> For production use across multiple devices, a backend database is recommended.

## Roadmap

- [ ] Finances module
- [ ] Inventory module  
- [ ] Events / calendar module
- [ ] Backend authentication (for multi-device credential sync)
