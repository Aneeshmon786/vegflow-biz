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
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import { collections, parties } from '../api/endpoints';
import DateRangeFilter, { getDateRange } from '../components/DateRangeFilter';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';
import { collectionVoucher } from '../utils/voucher';
import { format } from 'date-fns';

export default function CollectionsPage() {
  const [list, setList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [mode, setMode] = useState('daily');
  const [customFrom, setCustomFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    customer: '',
    collection_date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    notes: '',
  });

  const { from, to } = getDateRange(mode, customFrom, customTo);

  const load = () => {
    collections.list({ collection_date__gte: from, collection_date__lte: to }).then((res) => setList(res.data));
    parties.customers.list().then((res) => setCustomers(res.data));
  };

  useEffect(() => { load(); }, [from, to]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      customer: customers[0]?.id || '',
      collection_date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      notes: '',
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      customer: row.customer,
      collection_date: row.collection_date,
      amount: row.amount,
      notes: row.notes || '',
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const save = async () => {
    if (!form.customer || !form.amount) return;
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editing) await collections.update(editing.id, payload);
      else await collections.create(payload);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Daily Collection</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to={`/print/collections?from=${from}&to=${to}`} startIcon={<PrintIcon />} variant="outlined" size="small">Print statement</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Record Collection</Button>
        </Box>
      </Box>
      <DateRangeFilter
        mode={mode}
        setMode={setMode}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
      />
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }}>
            <ListItemText
              primary={row.customer_name}
              secondary={`${collectionVoucher(row.id)} • ${row.collection_date} ${row.notes ? `• ${row.notes}` : ''}`}
            />
            <ListItemText
              primary={formatAED(row.amount)}
              sx={{ textAlign: 'right' }}
            />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={() => openEdit(row)}>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Collection' : 'Record Collection'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Customer"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            margin="dense"
            required
          >
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            fullWidth
            label="Date"
            value={form.collection_date}
            onChange={(e) => setForm({ ...form, collection_date: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="number"
            fullWidth
            label="Amount (AED)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            margin="dense"
            inputProps={{ step: 0.01, min: 0 }}
            required
          />
          <TextField
            fullWidth
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
