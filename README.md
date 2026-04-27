# Wolves of Mayhem MC — Member Portal

Private members portal for the Wolves of Mayhem MC.

## Project Structure

```
wolves-of-mayhem/
├── index.html        ← Main entry point (all pages live here)
├── css/
│   └── style.css     ← All styles
├── js/
│   └── app.js        ← All JavaScript / logic
└── README.md
```

## Demo Login Credentials

| Username    | Password     | Role               | Access Level     |
|-------------|--------------|---------------------|------------------|
| `prez`      | `mayhem2024` | President           | Full access      |
| `vp`        | `chapter1`   | Vice President      | Full access      |
| `treasurer` | `ledger99`   | Treasurer           | Finances only    |
| `sergeant`  | `patch01`    | Sergeant at Arms    | Standard         |
| `member`    | `wolf`       | Member              | Standard         |

> ⚠️ **Before going live:** Update credentials in `js/app.js` under the `MEMBERS` array.

## Hosting on GitHub Pages

### Step 1 — Create a GitHub Account
If you don't have one, go to [github.com](https://github.com) and sign up for free.

### Step 2 — Create a New Repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `wolves-of-mayhem` (or anything you like)
3. Set it to **Public** (required for free GitHub Pages)
4. Leave everything else as default
5. Click **Create repository**

### Step 3 — Upload Your Files
**Option A — GitHub Web Interface (easiest, no software needed):**
1. On your new repo page, click **uploading an existing file**
2. Drag and drop ALL files and folders from this project
   - `index.html`
   - `css/` folder (with `style.css` inside)
   - `js/` folder (with `app.js` inside)
   - `README.md`
3. Scroll down, add a commit message like "Initial upload"
4. Click **Commit changes**

**Option B — Git Command Line:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wolves-of-mayhem.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. In your repository, click **Settings** (top tab)
2. In the left sidebar, click **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select `main` and folder `/root`
5. Click **Save**

### Step 5 — Access Your Site
After 1–2 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/wolves-of-mayhem/
```

GitHub will show the URL on the Pages settings page once it's ready.

---

## Custom Domain (Optional)
If you want a custom domain like `wolvesofmayhem.com`:
1. Buy a domain from any registrar (Namecheap, GoDaddy, etc.)
2. In GitHub Pages settings, enter your domain under **Custom domain**
3. Update your domain's DNS to point to GitHub (they'll give you instructions)

---

## Next Steps / Roadmap
- [ ] Roster module — full member directory
- [ ] Finances module — dues tracking, expenses
- [ ] Inventory module — gear and merch logging
- [ ] Events module — rides and meeting calendar
- [ ] Settings / admin panel
- [ ] Move authentication to a real backend (recommended before full club use)
