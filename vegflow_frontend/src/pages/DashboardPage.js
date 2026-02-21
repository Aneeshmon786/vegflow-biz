import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { reports } from '../api/endpoints';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

const defaultDashboard = {
  sales_today: 0,
  collections_today: 0,
  supplier_payments_today: 0,
  expenses_today: 0,
  daily_expense_today: 0,
  monthly_expense_today: 0,
  net_today: 0,
  profit_loss: {},
  customer_balances: [],
  supplier_balances: [],
  chart_data: [],
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reports.dashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(defaultDashboard))
      .finally(() => setLoading(false));
    return undefined;
  }, []);

  if (loading) return <Layout><Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box></Layout>;

  const d = data || defaultDashboard;
  const pl = d.profit_loss || {};
  const monthFrom = pl.from_date || format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const monthTo = pl.to_date || format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const todayCards = [
    { label: "Today's Sales", value: d.sales_today, color: '#2e7d32' },
    { label: "Collections", value: d.collections_today, color: '#1565c0' },
    { label: "Supplier Payments", value: d.supplier_payments_today, color: '#6a1b9a' },
    { label: "Daily Expense", value: d.daily_expense_today, color: '#c62828' },
    { label: "Monthly Expense", value: d.monthly_expense_today, color: '#d84315' },
    { label: "Net Today", value: d.net_today, color: '#ff8f00' },
  ];

  const chartData = (d.chart_data || []).map((row) => ({
    ...row,
    dateShort: format(parseISO(row.date), 'dd/MM'),
  }));

  return (
    <Layout>
      <Typography variant="h6" gutterBottom>Dashboard (AED)</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {todayCards.map((c) => (
          <Grid item xs={6} key={c.label}>
            <Card sx={{ bgcolor: c.color + '14', borderLeft: 4, borderColor: c.color }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                <Typography variant="subtitle1" fontWeight={600}>{formatAED(c.value)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {chartData.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Last 14 days</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="dateShort" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
              <Tooltip formatter={(v) => [formatAED(v), '']} labelFormatter={(l) => `Date: ${l}`} />
              <Legend />
              <Bar dataKey="sales" name="Sales" fill="#2e7d32" radius={[2, 2, 0, 0]} />
              <Bar dataKey="collections" name="Collections" fill="#1565c0" radius={[2, 2, 0, 0]} />
              <Bar dataKey="supplier_payments" name="Supplier Payments" fill="#6a1b9a" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#c62828" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Profit & Loss (This Month)</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Sales</span>
            <strong>{formatAED(pl.total_sales)}</strong>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>(-) Purchases</span>
            <span>{formatAED(pl.purchases)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>(-) Daily Expense</span>
            <span>{formatAED(pl.daily_expense)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>(-) Monthly Expense</span>
            <span>{formatAED(pl.monthly_expense)}</span>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: (pl.net_profit >= 0 ? 'success.light' : 'error.light'), p: 1.5, borderRadius: 1 }}>
            <strong>Net Profit</strong>
            <strong>{formatAED(pl.net_profit)}</strong>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Pending from Customers (Receivable)</Typography>
            {(d.customer_balances || []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">No pending balance</Typography>
            ) : (
              <List dense disablePadding>
                {(d.customer_balances || []).map((b) => (
                  <ListItem key={b.customer_id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText primary={b.customer_name} secondary={formatAED(b.balance)} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Pending to Suppliers (Payable)</Typography>
            {(d.supplier_balances || []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">No pending balance</Typography>
            ) : (
              <List dense disablePadding>
                {(d.supplier_balances || []).map((b) => (
                  <ListItem key={b.supplier_id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText primary={b.supplier_name} secondary={formatAED(b.balance)} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box className="no-print" sx={{ mt: 2 }}>
        <Button component={Link} to={`/print/all?from=${monthFrom}&to=${monthTo}`} startIcon={<PrintIcon />} variant="outlined" fullWidth>
          Print all items statement (Sales, Purchases, Collections, Payments, Expenses)
        </Button>
      </Box>
    </Layout>
  );
}
