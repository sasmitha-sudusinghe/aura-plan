# AuraPlan 🎓🏋️

**Semester Academic Hub & Fitness Planner** — a fully static, zero-backend web app that runs straight from GitHub Pages.

All data is persisted in the browser's `localStorage` — no server, no database required.

---

## ✨ Features

| Tab | What it does |
|-----|-------------|
| **Semester Modules** | Add, edit, delete university modules with credits, exam dates, daily study plans & past-paper checklists |
| **Gym Scheduler** | Manage your weekly gym / rugby conditioning sessions with a completion tracker |
| **Monthly Calendar** | Unified month view combining exam dates, gym sessions & daily diary notes |

---

## 🚀 Live Site

> **https://\<your-username\>.github.io/aura-plan/**

---

## ⚙️ GitHub Pages Setup (one-time)

1. Push this repo to GitHub (if not already):
   ```bash
   git add .
   git commit -m "chore: convert to static localStorage app"
   git push origin main
   ```

2. Open your repo on GitHub → **Settings** → **Pages**

3. Under **Source**, choose:
   - **Branch:** `main`
   - **Folder:** `/ (root)`

4. Click **Save** — your site will be live in ~60 seconds at the URL shown.

---

## 📁 Project Structure

```
aura-plan/
├── index.html          ← main app (served by GitHub Pages)
├── css/
│   └── styles.css      ← all styling
├── js/
│   ├── api.js          ← localStorage data layer (no backend needed)
│   └── ui.js           ← all UI rendering & interactions
├── client/             ← development copy (mirrors root)
└── backend/            ← original Node/Express/MongoDB (not used for Pages)
```

---

## 💾 Data Storage

Everything is saved to `localStorage` under three keys:

| Key | Contents |
|-----|----------|
| `aura_exams` | Academic modules array |
| `aura_gym` | Gym session schedule array |
| `aura_calendar_notes` | Daily diary notes per date |

Data persists across browser sessions on the same device/browser.  
To reset all data: open DevTools → Application → Local Storage → clear the three keys above.

---

## 🛠️ Local Development

No build step needed — just open `index.html` directly in a browser, or use a simple static server:

```bash
# Option 1 – VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Option 2 – Python
python -m http.server 8080

# Option 3 – Node
npx serve .
```
