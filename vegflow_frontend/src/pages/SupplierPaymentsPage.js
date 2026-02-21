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
import { payments, parties } from '../api/endpoints';
import DateRangeFilter, { getDateRange } from '../components/DateRangeFilter';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';
import { paymentVoucher } from '../utils/voucher';
import { format } from 'date-fns';

export default function SupplierPaymentsPage() {
  const [list, setList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [mode, setMode] = useState('daily');
  const [customFrom, setCustomFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    supplier: '',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    notes: '',
  });

  const { from, to } = getDateRange(mode, customFrom, customTo);

  const load = () => {
    payments.list({ payment_date__gte: from, payment_date__lte: to }).then((res) => setList(res.data));
    parties.suppliers.list().then((res) => setSuppliers(res.data));
  };

  useEffect(() => { load(); }, [from, to]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      supplier: suppliers[0]?.id || '',
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      notes: '',
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      supplier: row.supplier,
      payment_date: row.payment_date,
      amount: row.amount,
      notes: row.notes || '',
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const save = async () => {
    if (!form.supplier || !form.amount) return;
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editing) await payments.update(editing.id, payload);
      else await payments.create(payload);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Supplier Payments</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to={`/print/payments?from=${from}&to=${to}`} startIcon={<PrintIcon />} variant="outlined" size="small">Print statement</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>Record Payment</Button>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Payments to suppliers reduce supplier balance (like collections for customers).
      </Typography>
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
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }} secondaryAction={<Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(row)}>Edit</Button>}>
            <ListItemText
              primary={row.supplier_name}
              secondary={`${paymentVoucher(row.id)} • ${row.payment_date} ${row.notes ? `• ${row.notes}` : ''}`}
            />
            <ListItemText primary={formatAED(row.amount)} sx={{ textAlign: 'right' }} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Payment' : 'Record Payment to Supplier'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Supplier"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            margin="dense"
            required
          >
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            fullWidth
            label="Date"
            value={form.payment_date}
            onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
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
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
