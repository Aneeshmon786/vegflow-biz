import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { reports } from '../api/endpoints';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';

export default function ReportsPage() {
  const today = new Date();
  const [fromDate, setFromDate] = useState(format(startOfMonth(today), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(endOfMonth(today), 'yyyy-MM-dd'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    reports.profitLoss(fromDate, toDate)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  const setDaily = () => {
    const d = format(today, 'yyyy-MM-dd');
    setFromDate(d);
    setToDate(d);
  };
  const setMonthly = () => {
    setFromDate(format(startOfMonth(today), 'yyyy-MM-dd'));
    setToDate(format(endOfMonth(today), 'yyyy-MM-dd'));
  };

  return (
    <Layout>
      <Typography variant="h6" gutterBottom>Profit & Loss (AED)</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Reports (print / PDF)</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button component={Link} to={`/print/collections?from=${fromDate}&to=${toDate}`} startIcon={<PrintIcon />} variant="outlined" size="small">Daily Collection Report</Button>
          <Button component={Link} to={`/print/payments?from=${fromDate}&to=${toDate}`} startIcon={<PrintIcon />} variant="outlined" size="small">Payment Report</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 2 }}>
        <Button size="small" variant="outlined" onClick={setDaily}>Today</Button>
        <Button size="small" variant="outlined" onClick={setMonthly}>This month</Button>
        <TextField type="date" size="small" label="From" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField type="date" size="small" label="To" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Get P&L'}</Button>
      </Box>
      {data && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">{data.from_date} to {data.to_date}</Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <span>Sales (Cash)</span>
              <span>{formatAED(data.sales_cash)}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <span>Sales (Credit)</span>
              <span>{formatAED(data.sales_credit)}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <strong>Total Sales</strong>
              <strong>{formatAED(data.total_sales)}</strong>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <span>(-) Purchases</span>
              <span>{formatAED(data.purchases)}</span>
            </Box>
            {data.daily_expense != null && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <span>(-) Daily Expense</span>
                <span>{formatAED(data.daily_expense)}</span>
              </Box>
            )}
            {data.monthly_expense != null && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <span>(-) Monthly Expense</span>
                <span>{formatAED(data.monthly_expense)}</span>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <span>(-) Total Expenses</span>
              <span>{formatAED(data.expenses)}</span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, mt: 1, bgcolor: data.net_profit >= 0 ? 'success.light' : 'error.light', borderRadius: 1, px: 2 }}>
              <strong>NET PROFIT</strong>
              <strong>{formatAED(data.net_profit)}</strong>
            </Box>
          </Box>
        </Paper>
      )}
    </Layout>
  );
}
