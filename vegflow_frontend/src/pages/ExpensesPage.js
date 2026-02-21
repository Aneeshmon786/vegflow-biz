import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Switch, MenuItem, Tabs, Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrintIcon from '@mui/icons-material/Print';
import { expenses } from '../api/endpoints';
import DateRangeFilter, { getDateRange } from '../components/DateRangeFilter';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';
import { expenseVoucher } from '../utils/voucher';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [mode, setMode] = useState('daily');
  const [customFrom, setCustomFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    category: '',
    description: '',
    is_monthly: false,
  });
  const [openCategories, setOpenCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', category_type: 'monthly' });

  const { from, to } = getDateRange(mode, customFrom, customTo);

  const load = () => {
    expenses.list({ expense_date__gte: from, expense_date__lte: to }).then((res) => setList(res.data));
    expenses.categories.list().then((res) => setCategories(res.data || [])).catch(() => setCategories([]));
    expenses.staff.list().then((res) => setStaffList(res.data || [])).catch(() => setStaffList([]));
  };

  useEffect(() => { load(); }, [from, to]);

  const dailyList = list.filter((row) => !row.is_monthly);
  const monthlyList = list.filter((row) => row.is_monthly);
  const dailyTotal = dailyList.reduce((s, r) => s + Number(r.amount), 0);
  const monthlyTotal = monthlyList.reduce((s, r) => s + Number(r.amount), 0);
  const filteredList = tab === 1 ? dailyList : tab === 2 ? monthlyList : list;
  const monthlyCategories = categories.filter((c) => c.category_type === 'monthly');
  const dailyCategories = categories.filter((c) => c.category_type === 'daily');

  const openAdd = () => {
    setEditing(null);
    setForm({
      expense_date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      category: '',
      description: '',
      is_monthly: false,
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      expense_date: row.expense_date,
      amount: row.amount,
      category: row.category || '',
      description: row.description || '',
      is_monthly: row.is_monthly || false,
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const save = async () => {
    if (!form.amount || !form.description.trim()) return;
    try {
      const payload = { ...form, amount: parseFloat(form.amount), category: form.category || null };
      if (editing) await expenses.update(editing.id, payload);
      else await expenses.create(payload);
      close();
      load();
    } catch (e) {}
  };

  const openCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', category_type: 'monthly' });
    setOpenCategories(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, category_type: cat.category_type || 'monthly' });
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) return;
    try {
      if (editingCategory) await expenses.categories.update(editingCategory.id, categoryForm);
      else await expenses.categories.create(categoryForm);
      setEditingCategory(null);
      setCategoryForm({ name: '', category_type: 'monthly' });
      load();
    } catch (e) {}
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Expenses using it will keep the amount but lose the category.')) return;
    try {
      await expenses.categories.delete(id);
      load();
    } catch (e) {}
  };

  const fillFromStaff = (staffId) => {
    if (!staffId) return;
    const staff = staffList.find((s) => Number(s.id) === Number(staffId));
    if (staff) {
      setForm((f) => ({ ...f, description: staff.name, amount: staff.monthly_salary, is_monthly: true }));
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Expenses</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button component={Link} to={`/print/expenses?from=${from}&to=${to}`} startIcon={<PrintIcon />} variant="outlined" size="small">Print statement</Button>
          <Button startIcon={<CategoryIcon />} variant="outlined" size="small" onClick={openCategoryDialog}>Manage categories</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Add Expense</Button>
        </Box>
      </Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 1 }}>
        <Tab label="All" />
        <Tab label="Daily" />
        <Tab label="Monthly (Salary, Rent, Bills)" />
      </Tabs>
      <DateRangeFilter mode={mode} setMode={setMode} customFrom={customFrom} setCustomFrom={setCustomFrom} customTo={customTo} setCustomTo={setCustomTo} />
      {tab === 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" color="text.secondary">Daily Expense Total</Typography>
          <Typography variant="h6" color="primary">{formatAED(dailyTotal)}</Typography>
          <Typography variant="overline" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Monthly Expense Total</Typography>
          <Typography variant="h6" color="secondary">{formatAED(monthlyTotal)}</Typography>
        </Box>
      )}
      {tab === 1 && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Daily total: {formatAED(dailyTotal)}</Typography>}
      {tab === 2 && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Monthly total: {formatAED(monthlyTotal)}</Typography>}
      <List>
        {filteredList.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }} secondaryAction={<IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>}>
            <ListItemText primary={row.description} secondary={`${expenseVoucher(row.id)} • ${row.expense_date} ${row.category_name ? ' • ' + row.category_name : ''} ${row.is_monthly ? ' • Monthly' : ''}`} />
            <ListItemText primary={formatAED(row.amount)} sx={{ textAlign: 'right' }} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <TextField type="date" fullWidth label="Date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
          {form.is_monthly && staffList.length > 0 && (
            <TextField select fullWidth label="Fill from staff (salary)" value="" onChange={(e) => fillFromStaff(e.target.value)} margin="dense">
              <MenuItem value="">— Select staff —</MenuItem>
              {staffList.map((s) => <MenuItem key={s.id} value={s.id}>{s.name} – {formatAED(s.monthly_salary)}</MenuItem>)}
            </TextField>
          )}
          <TextField type="number" fullWidth label="Amount (AED)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} margin="dense" inputProps={{ step: 0.01, min: 0 }} />
          <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} margin="dense" placeholder="e.g. Petty, Transport, Salary – Name, Rent" required />
          <TextField select fullWidth label="Category" value={form.category} onChange={(e) => {
            const val = e.target.value;
            const cat = categories.find((c) => String(c.id) === String(val));
            setForm((f) => ({ ...f, category: val, is_monthly: cat ? cat.category_type === 'monthly' : f.is_monthly }));
          }} margin="dense" helperText="Selecting a category auto-sets Daily or Monthly expense.">
            <MenuItem value="">— None —</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name} ({c.category_type === 'monthly' ? 'Monthly' : 'Daily'})</MenuItem>)}
          </TextField>
          <FormControlLabel control={<Switch checked={form.is_monthly} onChange={(e) => setForm({ ...form, is_monthly: e.target.checked })} />} label={form.is_monthly ? 'Monthly expense' : 'Daily expense'} />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCategories} onClose={() => setOpenCategories(false)} fullWidth maxWidth="xs">
        <DialogTitle>Expense categories</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Create categories for monthly (e.g. Salary, Rent, Bills) or daily (e.g. Petty, Transport) expenses.</Typography>
          <List dense disablePadding sx={{ mb: 2 }}>
            {categories.map((c) => (
              <ListItem key={c.id} secondaryAction={<><IconButton size="small" onClick={() => openEditCategory(c)}><EditIcon /></IconButton><IconButton size="small" onClick={() => deleteCategory(c.id)}><DeleteOutlineIcon /></IconButton></>}>
                <ListItemText primary={c.name} secondary={c.category_type === 'monthly' ? 'Monthly' : 'Daily'} />
              </ListItem>
            ))}
          </List>
          <TextField fullWidth label="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} margin="dense" placeholder="e.g. Salary, Rent, Petty" />
          <TextField select fullWidth label="Type" value={categoryForm.category_type} onChange={(e) => setCategoryForm({ ...categoryForm, category_type: e.target.value })} margin="dense">
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>
          <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={saveCategory} sx={{ mt: 1 }}>{editingCategory ? 'Update category' : 'Add category'}</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategories(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
