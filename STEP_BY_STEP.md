# VegFlow Biz – Step-by-Step (Beginner)

## Step 1: Create folders (already done)
- `vegflow_backend/` – Django project
- `vegflow_frontend/` – React app

## Step 2: Backend setup
```bash
cd vegflow_backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
 
python manage.py createsuperuser   # optional, for admin
python manage.py runserver
```
API base: http://localhost:8000/api/

## Step 3: Create first user (register)
- POST http://localhost:8000/api/auth/register/
- Body: `{"username":"admin","email":"a@b.com","password":"yourpassword","business_name":"My Veg Shop"}`

## Step 4: Get token (login)
- POST http://localhost:8000/api/auth/token/
- Body: `{"username":"admin","password":"yourpassword"}`
- Use `access` in header: `Authorization: Bearer <access>`

## Step 5: Frontend setup
```bash
cd vegflow_frontend
npm install
npm start
```
App: http://localhost:3000

## Step 6: Use the app
1. Login with your user.
2. Add Customers and Suppliers (Parties).
3. Add Products (inventory for billing).
4. Create Sales (Cash or Credit).
5. Record Daily Collection.
6. Add Purchases and Expenses (daily + monthly).
7. View Reports → Profit & Loss (set date range).
8. All lists support Daily / Monthly / Custom date filter and Edit.

## API endpoints summary
| Endpoint | Description |
|----------|-------------|
| POST /api/auth/register/ | Register |
| POST /api/auth/token/ | Login (get JWT) |
| GET /api/auth/me/ | Current user |
| /api/parties/customers/ | Customers CRUD |
| /api/parties/suppliers/ | Suppliers CRUD |
| /api/products/ | Products CRUD |
| /api/billing/sales/ | Sales CRUD (cash/credit), filter by sale_date |
| /api/purchases/ | Purchases CRUD, filter by purchase_date |
| /api/expenses/ | Expenses CRUD, filter by expense_date, is_monthly |
| /api/expenses/categories/ | Expense categories |
| /api/collections/ | Collections CRUD, filter by collection_date |
| GET /api/reports/dashboard/ | Today’s summary |
| GET /api/reports/customer-balances/ | Balance per customer |
| GET /api/reports/profit-loss/?from_date=&to_date= | P&L |
