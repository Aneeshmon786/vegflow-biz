import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { expenses } from '../api/endpoints';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';

export default function StaffPage() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', monthly_salary: '', notes: '' });

  const load = () => expenses.staff.list().then((res) => setList(res.data || []));

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', monthly_salary: '', notes: '' });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name,
      monthly_salary: row.monthly_salary ?? '',
      notes: row.notes || '',
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      const payload = { ...form, monthly_salary: parseFloat(form.monthly_salary) || 0 };
      if (editing) await expenses.staff.update(editing.id, payload);
      else await expenses.staff.create(payload);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Staff & Salary</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Add Staff</Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add staff and their monthly salary. When adding a monthly expense, you can pick a staff member to fill salary amount.
      </Typography>
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }} secondaryAction={<IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>}>
            <ListItemText primary={row.name} secondary={row.notes || `Monthly salary: ${formatAED(row.monthly_salary)}`} />
            <ListItemText primary={formatAED(row.monthly_salary)} sx={{ textAlign: 'right' }} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} margin="dense" required placeholder="Staff name" />
          <TextField fullWidth type="number" label="Monthly salary (AED)" value={form.monthly_salary} onChange={(e) => setForm({ ...form, monthly_salary: e.target.value })} margin="dense" inputProps={{ step: 0.01, min: 0 }} />
          <TextField fullWidth label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} margin="dense" placeholder="Optional" />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
