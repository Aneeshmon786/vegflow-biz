# VegFlow Biz – Wireframes & Step-by-Step Plan

## Project Overview
**VegFlow Biz** is a mobile-first web app for vegetable sales: inventory, billing (cash/credit), accounting, customers/suppliers, daily collection, balances, purchases, expenses, and profit & loss. Built with **React** (frontend) and **Django** (backend). All names use the `vegflow_` prefix to avoid Python package conflicts.

---

## Wireframes (Mobile-First)

### 1. Login (Client Area)
```
+----------------------------------+
|     [VegFlow Biz Logo]           |
|                                  |
|  Email/Phone: [______________]   |
|  Password:    [______________]   |
|                                  |
|  [      LOG IN      ]            |
+----------------------------------+
```

### 2. Dashboard
```
+----------------------------------+
| ☰  VegFlow Biz    [User ▼]       |
+----------------------------------+
|  Today's Summary                 |
|  Sales: ₹X   Collection: ₹Y      |
|  Expense: ₹Z  Net: ₹W            |
+----------------------------------+
| [Sales] [Purchase] [Expense]      |
| [Customers] [Suppliers] [Reports] |
+----------------------------------+
| Quick: New Sale | New Purchase    |
+----------------------------------+
```

### 3. Customers List (with balance)
```
+----------------------------------+
| ← Customers                      |
| Filter: [Daily▼][Monthly][Custom] |
| From [__/__/__] To [__/__/__]    |
+----------------------------------+
| Ram Traders      Balance: ₹5,200 |
| Fresh Veg Co     Balance: ₹1,100 |
| [+ Add Customer]                 |
+----------------------------------+
```

### 4. Sales (Billing) – Cash / Credit
```
+----------------------------------+
| ← New Sale / Edit Sale           |
| Customer: [Select ▼]             |
| Date: [__/__/__]                 |
| Type: (•) Cash  ( ) Credit       |
| ---------------------------------|
| Item        Qty   Rate   Amount  |
| Tomato      10    40     400     |
| [+ Add Row]                      |
| ---------------------------------|
| Total: ₹400                      |
| [Save] [Save as Credit]          |
+----------------------------------+
```

### 5. Daily Collection
```
+----------------------------------+
| ← Daily Collection               |
| Date: [__/__/__]                 |
| Customer: [Select ▼]             |
| Amount: [________]               |
| [Record Collection]              |
+----------------------------------+
| Today's collections list...      |
+----------------------------------+
```

### 6. Expenses
```
+----------------------------------+
| ← Expenses                       |
| [Daily] [Monthly]                |
| Daily:  Petty, transport...      |
| Monthly: Salary, Rent, Bills     |
| Date filter: [Daily▼][Custom]    |
| [+ Add Expense] (editable rows)   |
+----------------------------------+
```

### 7. Profit & Loss
```
+----------------------------------+
| ← Profit & Loss                  |
| From [__/__/__] To [__/__/__]    |
| ---------------------------------|
| Sales (Cash):     ₹XXX           |
| Sales (Credit):   ₹XXX           |
| Total Sales:      ₹XXX           |
| (-) Purchases:    ₹XXX           |
| (-) Expenses:     ₹XXX           |
| ---------------------------------|
| NET PROFIT:       ₹XXX           |
+----------------------------------+
```

---

## Folder Structure (Creation Order)

### Step 1 – Root
```
vegflow_project/
├── WIREFRAMES_AND_PLAN.md
├── README.md
├── vegflow_backend/          # Django
└── vegflow_frontend/         # React
```

### Step 2 – Backend (Django)
```
vegflow_backend/
├── manage.py
├── requirements.txt
├── vegflow_core/             # Project config (settings, urls)
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── vegflow_auth/             # Login, users
├── vegflow_parties/          # Customers, suppliers
├── vegflow_products/         # Inventory items
├── vegflow_billing/          # Sales (cash/credit), invoices
├── vegflow_purchases/        # Purchase records
├── vegflow_expenses/         # Daily + monthly expenses
├── vegflow_collections/      # Daily collection, balances
└── vegflow_reports/          # P&L, net profit
```

### Step 3 – Frontend (React)
```
vegflow_frontend/
├── package.json
├── public/
├── src/
│   ├── index.js
│   ├── App.js
│   ├── theme.js
│   ├── api/
│   ├── components/
│   ├── pages/
│   └── context/
```

---

## Step-by-Step for Beginners

| Step | Action | What you get |
|------|--------|--------------|
| 1 | Create root folders | vegflow_backend, vegflow_frontend |
| 2 | Django project & apps | vegflow_core + 8 apps |
| 3 | Models | Parties, Products, Sales, Purchases, Expenses, Collections |
| 4 | Migrations | Database tables created |
| 5 | Serializers & ViewSets | REST API |
| 6 | URLs & Auth | Login, token, all endpoints |
| 7 | React create-app & deps | Frontend scaffold |
| 8 | Auth + Dashboard | Login page, dashboard |
| 9 | All modules + date filters | Customers, Sales, Purchase, Expense, Collection |
| 10 | Edit transactions | Edit on all list/detail pages |
| 11 | Reports & P&L | Profit & Loss with cash/credit sales |

---

## Feature Checklist

- [x] Login (client area)
- [x] Customers & Suppliers (permanent, with balance)
- [x] Inventory (products for billing only, no repacking)
- [x] Billing: Sales as **Cash** and **Credit** separately
- [x] Edit all transactions (sales, purchase, expense, collection)
- [x] Daily collection + remaining balance per customer
- [x] Purchases, Sales, Expenses in accounting
- [x] Daily expense (separate) + Monthly expense (salary, rent, bills) – editable
- [x] Net profit & full Profit & Loss (including credit sales when billed later)
- [x] Sort/filter: Daily, Monthly, Custom date on all pages
- [x] Mobile-first UI
- [x] Unique names (vegflow_*) to avoid Python package conflicts
