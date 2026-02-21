import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { parties, reports } from '../api/endpoints';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';

export default function CustomersPage() {
  const [list, setList] = useState([]);
  const [balances, setBalances] = useState({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const location = useLocation();

  const load = useCallback(() => {
    parties.customers.list().then((res) => setList(res.data || []));
    reports.customerBalances().then((res) => {
      const map = {};
      (res.data || []).forEach((b) => {
        const id = Number(b.customer_id);
        if (!Number.isNaN(id)) map[id] = Number(b.balance);
      });
      setBalances(map);
    }).catch(() => setBalances({}));
  }, []);

  useEffect(() => { load(); }, [load]);
  // Refetch balances when user returns to this page (e.g. after adding a sale or collection)
  useEffect(() => {
    if (location.pathname !== '/customers') return;
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [location.pathname, load]);

  const openAdd = () => { setEditing(null); setForm({ name: '', phone: '', address: '' }); setOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm({ name: row.name, phone: row.phone || '', address: row.address || '' }); setOpen(true); };
  const close = () => setOpen(false);

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      if (editing) await parties.customers.update(editing.id, form);
      else await parties.customers.create(form);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Customers</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<RefreshIcon />} variant="outlined" size="small" onClick={load}>Refresh balances</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Add</Button>
        </Box>
      </Box>
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }}>
            <ListItemText primary={row.name} secondary={row.phone || '—'} />
            <ListItemText secondary={`Balance: ${formatAED(balances[Number(row.id)] ?? 0)}`} sx={{ textAlign: 'right' }} />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} margin="dense" required />
          <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} margin="dense" />
          <TextField fullWidth label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} margin="dense" multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
