/**
 * VegFlow Biz - API endpoint helpers.
 */
import vegflowApi from './client';

const auth = {
  login: (username, password) => vegflowApi.post('/auth/token/', { username, password }),
  register: (data) => vegflowApi.post('/auth/register/', data),
  me: () => vegflowApi.get('/auth/me/'),
  refresh: (refresh) => vegflowApi.post('/auth/token/refresh/', { refresh }),
};

const parties = {
  customers: {
    list: (params) => vegflowApi.get('/parties/customers/', { params }),
    get: (id) => vegflowApi.get(`/parties/customers/${id}/`),
    create: (data) => vegflowApi.post('/parties/customers/', data),
    update: (id, data) => vegflowApi.patch(`/parties/customers/${id}/`, data),
    delete: (id) => vegflowApi.delete(`/parties/customers/${id}/`),
  },
  suppliers: {
    list: (params) => vegflowApi.get('/parties/suppliers/', { params }),
    get: (id) => vegflowApi.get(`/parties/suppliers/${id}/`),
    create: (data) => vegflowApi.post('/parties/suppliers/', data),
    update: (id, data) => vegflowApi.patch(`/parties/suppliers/${id}/`, data),
    delete: (id) => vegflowApi.delete(`/parties/suppliers/${id}/`),
  },
};

const products = {
  list: (params) => vegflowApi.get('/products/', { params }),
  get: (id) => vegflowApi.get(`/products/${id}/`),
  create: (data) => vegflowApi.post('/products/', data),
  update: (id, data) => vegflowApi.patch(`/products/${id}/`, data),
  delete: (id) => vegflowApi.delete(`/products/${id}/`),
};

const billing = {
  sales: {
    list: (params) => vegflowApi.get('/billing/sales/', { params }),
    get: (id) => vegflowApi.get(`/billing/sales/${id}/`),
    create: (data) => vegflowApi.post('/billing/sales/', data),
    update: (id, data) => vegflowApi.patch(`/billing/sales/${id}/`, data),
    delete: (id) => vegflowApi.delete(`/billing/sales/${id}/`),
  },
};

const purchases = {
  list: (params) => vegflowApi.get('/purchases/', { params }),
  get: (id) => vegflowApi.get(`/purchases/${id}/`),
  create: (data) => vegflowApi.post('/purchases/', data),
  update: (id, data) => vegflowApi.patch(`/purchases/${id}/`, data),
  delete: (id) => vegflowApi.delete(`/purchases/${id}/`),
};

const expenses = {
  list: (params) => vegflowApi.get('/expenses/', { params }),
  get: (id) => vegflowApi.get(`/expenses/${id}/`),
  create: (data) => vegflowApi.post('/expenses/', data),
  update: (id, data) => vegflowApi.patch(`/expenses/${id}/`, data),
  delete: (id) => vegflowApi.delete(`/expenses/${id}/`),
  categories: {
    list: () => vegflowApi.get('/expenses/categories/'),
    create: (data) => vegflowApi.post('/expenses/categories/', data),
    update: (id, data) => vegflowApi.patch(`/expenses/categories/${id}/`, data),
    delete: (id) => vegflowApi.delete(`/expenses/categories/${id}/`),
  },
  staff: {
    list: () => vegflowApi.get('/expenses/staff/'),
    get: (id) => vegflowApi.get(`/expenses/staff/${id}/`),
    create: (data) => vegflowApi.post('/expenses/staff/', data),
    update: (id, data) => vegflowApi.patch(`/expenses/staff/${id}/`, data),
    delete: (id) => vegflowApi.delete(`/expenses/staff/${id}/`),
  },
};

const collections = {
  list: (params) => vegflowApi.get('/collections/', { params }),
  get: (id) => vegflowApi.get(`/collections/${id}/`),
  create: (data) => vegflowApi.post('/collections/', data),
  update: (id, data) => vegflowApi.patch(`/collections/${id}/`, data),
  delete: (id) => vegflowApi.delete(`/collections/${id}/`),
};

const payments = {
  list: (params) => vegflowApi.get('/payments/', { params }),
  get: (id) => vegflowApi.get(`/payments/${id}/`),
  create: (data) => vegflowApi.post('/payments/', data),
  update: (id, data) => vegflowApi.patch(`/payments/${id}/`, data),
  delete: (id) => vegflowApi.delete(`/payments/${id}/`),
};

const reports = {
  dashboard: () => vegflowApi.get('/reports/dashboard/'),
  customerBalances: () => vegflowApi.get('/reports/customer-balances/'),
  supplierBalances: () => vegflowApi.get('/reports/supplier-balances/'),
  profitLoss: (fromDate, toDate) => vegflowApi.get('/reports/profit-loss/', { params: { from_date: fromDate, to_date: toDate } }),
};

export { auth, parties, products, billing, purchases, expenses, collections, payments, reports };
export default vegflowApi;
