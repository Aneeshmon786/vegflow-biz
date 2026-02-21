# VegFlow Biz

Mobile-first web app for **vegetable sales**: billing (cash & credit), inventory, accounting, customers/suppliers, daily collection, balances, purchases, expenses (daily + monthly), and **Profit & Loss**.  
Built with **React** and **Django**. All names use the `vegflow_` prefix to avoid Python package conflicts.

## Quick start

### 1. Backend (Django)

```bash
cd vegflow_backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Create a user:

```bash
python manage.py createsuperuser
```

Or register via API: `POST http://localhost:8000/api/auth/register/`  
Body: `{"username":"admin","email":"a@b.com","password":"yourpassword","business_name":"My Veg Shop"}`

### 2. Frontend (React)

```bash
cd vegflow_frontend
npm install
npm start
```

Open http://localhost:3000 and log in.

## Features

- **Login** – Client area with JWT
- **Customers & Suppliers** – Permanent records, customer balance shown
- **Products** – Inventory for billing (no repacking)
- **Sales** – Cash and Credit separately; editable; date filter (daily/monthly/custom)
- **Purchases** – Editable; date filter
- **Expenses** – Daily and Monthly (salary, rent, bills) separately; editable
- **Collections** – Daily collection from customers; editable
- **Profit & Loss** – Sales (cash + credit) − Purchases − Expenses = Net profit; custom date range

## Project structure

- `WIREFRAMES_AND_PLAN.md` – Wireframes and folder plan  
- `STEP_BY_STEP.md` – Beginner steps  
- `vegflow_backend/` – Django (vegflow_core, vegflow_auth, vegflow_parties, vegflow_products, vegflow_billing, vegflow_purchases, vegflow_expenses, vegflow_collections, vegflow_reports)  
- `vegflow_frontend/` – React (mobile-first UI)

## API base

- Backend: http://localhost:8000/api/  
- Frontend proxy: set in `package.json` to `http://localhost:8000` for development.

## Push to GitHub and hosting

See **[GITHUB_HOSTING.md](GITHUB_HOSTING.md)** for steps to push this repo to GitHub and options to host the app online.
