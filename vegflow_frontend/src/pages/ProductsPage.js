import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { products } from '../api/endpoints';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';

export default function ProductsPage() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', unit: 'kg', default_rate: '' });

  const load = () => products.list().then((res) => setList(res.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', unit: 'kg', default_rate: '' }); setOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm({ name: row.name, unit: row.unit || 'kg', default_rate: row.default_rate != null && row.default_rate !== '' ? row.default_rate : '' }); setOpen(true); };
  const close = () => setOpen(false);

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      const payload = { ...form, default_rate: parseFloat(form.default_rate) || 0 };
      if (editing) await products.update(editing.id, payload);
      else await products.create(payload);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Products</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Add</Button>
      </Box>
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }}>
            <ListItemText
              primary={row.name}
              secondary={row.default_rate != null && Number(row.default_rate) > 0 ? `${row.unit} • ${formatAED(row.default_rate)}` : `${row.unit} • No rate (set per bill)`}
            />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} margin="dense" required />
          <TextField fullWidth label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} margin="dense" placeholder="kg, box, piece" />
          <TextField fullWidth type="number" label="Default selling rate (AED) – optional" value={form.default_rate} onChange={(e) => setForm({ ...form, default_rate: e.target.value })} margin="dense" inputProps={{ step: 0.01, min: 0 }} placeholder="Leave empty if you set rate per bill" />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
