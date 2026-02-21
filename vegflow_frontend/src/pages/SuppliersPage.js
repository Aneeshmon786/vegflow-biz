import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { parties } from '../api/endpoints';
import Layout from '../components/Layout';

export default function SuppliersPage() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const load = () => parties.suppliers.list().then((res) => setList(res.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', phone: '', address: '' }); setOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm({ name: row.name, phone: row.phone || '', address: row.address || '' }); setOpen(true); };
  const close = () => setOpen(false);

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      if (editing) await parties.suppliers.update(editing.id, form);
      else await parties.suppliers.create(form);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Suppliers</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Add</Button>
      </Box>
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }}>
            <ListItemText primary={row.name} secondary={row.phone || '—'} />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={() => openEdit(row)}><EditIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
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
