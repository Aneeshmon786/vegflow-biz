import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { billing, purchases, collections, payments, expenses } from '../api/endpoints';
import PrintStatementLayout from '../components/PrintStatementLayout';
import { formatAED } from '../utils/currency';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const today = new Date();
const defaultFrom = format(startOfMonth(today), 'yyyy-MM-dd');
const defaultTo = format(endOfMonth(today), 'yyyy-MM-dd');

export default function PrintStatementPage() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || defaultFrom;
  const to = searchParams.get('to') || defaultTo;

  const [data, setData] = useState([]);
  const [extra, setExtra] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const load = async () => {
      try {
        if (type === 'sales') {
          const res = await billing.sales.list({ sale_date__gte: from, sale_date__lte: to });
          setData(res.data || []);
          const total = (res.data || []).reduce((s, r) => s + Number(r.total_amount), 0);
          setExtra({ total, label: 'Total Sales' });
        } else if (type === 'purchases') {
          const res = await purchases.list({ purchase_date__gte: from, purchase_date__lte: to });
          setData(res.data || []);
          const total = (res.data || []).reduce((s, r) => s + Number(r.total_amount), 0);
          setExtra({ total, label: 'Total Purchases' });
        } else if (type === 'collections') {
          const res = await collections.list({ collection_date__gte: from, collection_date__lte: to });
          setData(res.data || []);
          const total = (res.data || []).reduce((s, r) => s + Number(r.amount), 0);
          setExtra({ total, label: 'Total Collections' });
        } else if (type === 'payments') {
          const res = await payments.list({ payment_date__gte: from, payment_date__lte: to });
          setData(res.data || []);
          const total = (res.data || []).reduce((s, r) => s + Number(r.amount), 0);
          setExtra({ total, label: 'Total Payments' });
        } else if (type === 'expenses') {
          const res = await expenses.list({ expense_date__gte: from, expense_date__lte: to });
          setData(res.data || []);
          const daily = (res.data || []).filter((r) => !r.is_monthly).reduce((s, r) => s + Number(r.amount), 0);
          const monthly = (res.data || []).filter((r) => r.is_monthly).reduce((s, r) => s + Number(r.amount), 0);
          setExtra({ daily, monthly, total: daily + monthly });
        } else if (type === 'all') {
          const [salesRes, purchasesRes, collectionsRes, paymentsRes, expensesRes] = await Promise.all([
            billing.sales.list({ sale_date__gte: from, sale_date__lte: to }),
            purchases.list({ purchase_date__gte: from, purchase_date__lte: to }),
            collections.list({ collection_date__gte: from, collection_date__lte: to }),
            payments.list({ payment_date__gte: from, payment_date__lte: to }),
            expenses.list({ expense_date__gte: from, expense_date__lte: to }),
          ]);
          setData({
            sales: salesRes.data || [],
            purchases: purchasesRes.data || [],
            collections: collectionsRes.data || [],
            payments: paymentsRes.data || [],
            expenses: expensesRes.data || [],
          });
          setExtra('all');
        } else {
          setData([]);
        }
      } catch (e) {
        setData(type === 'all' ? {} : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, from, to]);

  const titles = {
    sales: 'Sales Statement',
    purchases: 'Purchase Statement',
    collections: 'Daily Collection Report',
    payments: 'Payment Report',
    expenses: 'Expenses Statement (Daily & Monthly)',
    all: 'All Items Statement',
  };

  if (loading) {
    return (
      <PrintStatementLayout title={titles[type] || 'Statement'} fromDate={from} toDate={to} type={type}>
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      </PrintStatementLayout>
    );
  }

  if (type === 'all') {
    const d = data;
    const sales = d.sales || [];
    const purchasesList = d.purchases || [];
    const collectionsList = d.collections || [];
    const paymentsList = d.payments || [];
    const expensesList = d.expenses || [];
    return (
      <PrintStatementLayout title={titles.all} fromDate={from} toDate={to}>
        <Box sx={{ '& .MuiPaper-root': { mb: 3 } }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Sales</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Customer</TableCell><TableCell>Type</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
              <TableBody>
                {sales.map((r) => (<TableRow key={r.id}><TableCell>{r.sale_date}</TableCell><TableCell>{r.customer_name}</TableCell><TableCell>{r.payment_type}</TableCell><TableCell align="right">{formatAED(r.total_amount)}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ mt: 1 }}>Sales total: {formatAED(sales.reduce((s, r) => s + Number(r.total_amount), 0))}</Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Purchases</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Supplier</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
              <TableBody>
                {purchasesList.map((r) => (<TableRow key={r.id}><TableCell>{r.purchase_date}</TableCell><TableCell>{r.supplier_name}</TableCell><TableCell align="right">{formatAED(r.total_amount)}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ mt: 1 }}>Purchases total: {formatAED(purchasesList.reduce((s, r) => s + Number(r.total_amount), 0))}</Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Collections</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Customer</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
              <TableBody>
                {collectionsList.map((r) => (<TableRow key={r.id}><TableCell>{r.collection_date}</TableCell><TableCell>{r.customer_name}</TableCell><TableCell align="right">{formatAED(r.amount)}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ mt: 1 }}>Collections total: {formatAED(collectionsList.reduce((s, r) => s + Number(r.amount), 0))}</Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Supplier Payments</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Supplier</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
              <TableBody>
                {paymentsList.map((r) => (<TableRow key={r.id}><TableCell>{r.payment_date}</TableCell><TableCell>{r.supplier_name}</TableCell><TableCell align="right">{formatAED(r.amount)}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ mt: 1 }}>Payments total: {formatAED(paymentsList.reduce((s, r) => s + Number(r.amount), 0))}</Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Expenses (Daily & Monthly)</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Description</TableCell><TableCell>Type</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
              <TableBody>
                {expensesList.map((r) => (<TableRow key={r.id}><TableCell>{r.expense_date}</TableCell><TableCell>{r.description}</TableCell><TableCell>{r.is_monthly ? 'Monthly' : 'Daily'}</TableCell><TableCell align="right">{formatAED(r.amount)}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ mt: 1 }}>Daily total: {formatAED(expensesList.filter((x) => !x.is_monthly).reduce((s, r) => s + Number(r.amount), 0))} | Monthly total: {formatAED(expensesList.filter((x) => x.is_monthly).reduce((s, r) => s + Number(r.amount), 0))} | Expenses total: {formatAED(expensesList.reduce((s, r) => s + Number(r.amount), 0))}</Typography>
        </Box>
      </PrintStatementLayout>
    );
  }

  if (type === 'sales') {
    return (
      <PrintStatementLayout title={titles.sales} fromDate={from} toDate={to} type="sales">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Customer</TableCell><TableCell>Type</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
            <TableBody>
              {data.map((r) => (<TableRow key={r.id}><TableCell>{r.sale_date}</TableCell><TableCell>{r.customer_name}</TableCell><TableCell>{r.payment_type}</TableCell><TableCell align="right">{formatAED(r.total_amount)}</TableCell></TableRow>))}
            </TableBody>
          </Table>
        </TableContainer>
        {extra && <Typography variant="body1" fontWeight={600} sx={{ mt: 2 }}>{extra.label}: {formatAED(extra.total)}</Typography>}
      </PrintStatementLayout>
    );
  }

  if (type === 'purchases') {
    return (
      <PrintStatementLayout title={titles.purchases} fromDate={from} toDate={to} type="purchases">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Supplier</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
            <TableBody>
              {data.map((r) => (<TableRow key={r.id}><TableCell>{r.purchase_date}</TableCell><TableCell>{r.supplier_name}</TableCell><TableCell align="right">{formatAED(r.total_amount)}</TableCell></TableRow>))}
            </TableBody>
          </Table>
        </TableContainer>
        {extra && <Typography variant="body1" fontWeight={600} sx={{ mt: 2 }}>{extra.label}: {formatAED(extra.total)}</Typography>}
      </PrintStatementLayout>
    );
  }

  if (type === 'collections') {
    return (
      <PrintStatementLayout title={titles.collections} fromDate={from} toDate={to} type="collections">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Customer</TableCell><TableCell>Notes</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
            <TableBody>
              {data.map((r) => (<TableRow key={r.id}><TableCell>{r.collection_date}</TableCell><TableCell>{r.customer_name}</TableCell><TableCell>{r.notes || '—'}</TableCell><TableCell align="right">{formatAED(r.amount)}</TableCell></TableRow>))}
            </TableBody>
          </Table>
        </TableContainer>
        {extra && <Typography variant="body1" fontWeight={600} sx={{ mt: 2 }}>{extra.label}: {formatAED(extra.total)}</Typography>}
      </PrintStatementLayout>
    );
  }

  if (type === 'payments') {
    return (
      <PrintStatementLayout title={titles.payments} fromDate={from} toDate={to} type="payments">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Supplier</TableCell><TableCell>Notes</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
            <TableBody>
              {data.map((r) => (<TableRow key={r.id}><TableCell>{r.payment_date}</TableCell><TableCell>{r.supplier_name}</TableCell><TableCell>{r.notes || '—'}</TableCell><TableCell align="right">{formatAED(r.amount)}</TableCell></TableRow>))}
            </TableBody>
          </Table>
        </TableContainer>
        {extra && <Typography variant="body1" fontWeight={600} sx={{ mt: 2 }}>{extra.label}: {formatAED(extra.total)}</Typography>}
      </PrintStatementLayout>
    );
  }

  if (type === 'expenses') {
    return (
      <PrintStatementLayout title={titles.expenses} fromDate={from} toDate={to} type="expenses">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Description</TableCell><TableCell>Category</TableCell><TableCell>Type</TableCell><TableCell align="right">Amount (AED)</TableCell></TableRow></TableHead>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.expense_date}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.category_name || '—'}</TableCell>
                  <TableCell>{r.is_monthly ? 'Monthly' : 'Daily'}</TableCell>
                  <TableCell align="right">{formatAED(r.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {extra && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Daily total: {formatAED(extra.daily)}</Typography>
            <Typography variant="body2">Monthly total: {formatAED(extra.monthly)}</Typography>
            <Typography variant="body1" fontWeight={600}>Total expenses: {formatAED(extra.total)}</Typography>
          </Box>
        )}
      </PrintStatementLayout>
    );
  }

  return (
    <PrintStatementLayout title="Statement" fromDate={from} toDate={to}>
      <Typography>Unknown statement type.</Typography>
    </PrintStatementLayout>
  );
}
