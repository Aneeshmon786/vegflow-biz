# Host VegFlow Biz with GitHub

## 1. Push your project to GitHub

### Create a new repository on GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository** (or **+** → **New repository**).
3. Name it (e.g. `vegflow-biz`).
4. Choose **Public**.
5. **Do not** add a README, .gitignore, or license (you already have code).
6. Click **Create repository**.

### Push your code from your computer

Open a terminal in the project folder (`New folder (2)` or your project root) and run:

```bash
# Initialize Git (if not already)
git init

# Add all files (respects .gitignore)
git add .

# First commit
git commit -m "Initial commit: VegFlow Biz - vegetable sales app"

# Rename branch to main (optional, GitHub default)
git branch -M main

# Add your GitHub repo as remote (replace USERNAME and REPO with yours)
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git push -u origin main
```

Replace `USERNAME` with your GitHub username and `REPO` with the repository name (e.g. `vegflow-biz`).

If you use **SSH** instead of HTTPS:

```bash
git remote add origin git@github.com:USERNAME/REPO.git
git push -u origin main
```

---

## 2. Hosting the app (backend + frontend)

GitHub stores your code. To run the app on the internet you need a **host** for:

- **Backend (Django)** – e.g. Render, Railway, PythonAnywhere.
- **Frontend (React)** – e.g. Vercel, Netlify, or GitHub Pages (static build).

### Option A: Free tier (simple)

| Part      | Service         | Notes |
|----------|------------------|--------|
| Backend  | **Render** or **Railway** | Deploy `vegflow_backend` (Django), add PostgreSQL or keep SQLite for small use. |
| Frontend | **Vercel** or **Netlify** | Deploy `vegflow_frontend` (run `npm run build`), set API URL to your backend. |

### Option B: GitHub Pages (frontend only)

- You can host only the **React build** on GitHub Pages (static site).
- The **Django API** must be hosted elsewhere (Render, Railway, etc.), then set `REACT_APP_API_URL` in the frontend to that API URL before building.

### After you choose a host

1. **Backend:** Point the service at the `vegflow_backend` folder (or repo root and set root to `vegflow_backend`). Set `DEBUG=False`, `ALLOWED_HOSTS`, and `DJANGO_SECRET_KEY` (and DB URL if using PostgreSQL). Run `pip install -r requirements.txt` and `python manage.py migrate`.
2. **Frontend:** Point the service at the `vegflow_frontend` folder. Set build command to `npm run build` and publish the `build` folder. Set environment variable `REACT_APP_API_URL` to your backend URL (e.g. `https://your-django-app.onrender.com/api`).

---

## 3. Later: update code on GitHub

After changing code locally:

```bash
git add .
git commit -m "Describe your changes"
git push
```

Your GitHub repo will stay in sync with your local project.
