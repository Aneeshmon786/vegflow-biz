import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Button, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Radio, RadioGroup,
  MenuItem, Table, TableBody, TableRow, TableCell,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import { billing, parties, products } from '../api/endpoints';
import DateRangeFilter, { getDateRange } from '../components/DateRangeFilter';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';
import { saleVoucher } from '../utils/voucher';
import { format } from 'date-fns';

export default function SalesPage() {
  const [list, setList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productList, setProductList] = useState([]);
  const [mode, setMode] = useState('daily');
  const [customFrom, setCustomFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    customer: '',
    sale_date: format(new Date(), 'yyyy-MM-dd'),
    payment_type: 'cash',
    notes: '',
    items: [{ product: '', quantity: 1, rate: 0, amount: 0 }],
  });

  const { from, to } = getDateRange(mode, customFrom, customTo);

  const load = () => {
    billing.sales.list({ sale_date__gte: from, sale_date__lte: to }).then((res) => setList(res.data));
    parties.customers.list().then((res) => setCustomers(res.data));
    products.list().then((res) => setProductList(res.data));
  };

  useEffect(() => { load(); }, [from, to]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      customer: customers[0]?.id || '',
      sale_date: format(new Date(), 'yyyy-MM-dd'),
      payment_type: 'cash',
      notes: '',
      items: [{ product: '', quantity: 1, rate: 0, amount: 0 }],
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      customer: row.customer,
      sale_date: row.sale_date,
      payment_type: row.payment_type,
      notes: row.notes || '',
      items: row.items?.length ? row.items.map((i) => ({ product: i.product, quantity: parseFloat(i.quantity), rate: parseFloat(i.rate), amount: parseFloat(i.amount) })) : [{ product: '', quantity: 1, rate: 0, amount: 0 }],
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const addRow = () => setForm((f) => ({ ...f, items: [...f.items, { product: '', quantity: 1, rate: 0, amount: 0 }] }));
  const removeRow = (idx) => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const updateItem = (idx, field, value) => {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        const q = parseFloat(items[idx].quantity) || 0;
        const r = parseFloat(items[idx].rate) || 0;
        items[idx].amount = q * r;
      }
      return { ...f, items };
    });
  };

  const total = form.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);

  const save = async () => {
    if (!form.customer) return;
    const payload = {
      customer: form.customer,
      sale_date: form.sale_date,
      payment_type: form.payment_type,
      notes: form.notes,
      total_amount: total,
      items: form.items.filter((i) => i.product && (parseFloat(i.quantity) || 0) > 0).map((i) => ({
        product: Number(i.product),
        quantity: i.quantity,
        rate: i.rate,
        amount: i.amount,
      })),
    };
    if (payload.items.length === 0) return;
    try {
      if (editing) await billing.sales.update(editing.id, payload);
      else await billing.sales.create(payload);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Sales</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to={`/print/sales?from=${from}&to=${to}`} startIcon={<PrintIcon />} variant="outlined" size="small">Print statement</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>New Sale</Button>
        </Box>
      </Box>
      <DateRangeFilter mode={mode} setMode={setMode} customFrom={customFrom} setCustomFrom={setCustomFrom} customTo={customTo} setCustomTo={setCustomTo} />
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1, flexWrap: 'wrap' }} secondaryAction={<Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(row)}>Edit bill</Button>}>
            <ListItemText primary={`${row.customer_name} • ${row.sale_date}`} secondary={`${saleVoucher(row.id, row.payment_type)} • ${row.payment_type} • ${formatAED(row.total_amount)}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Bill' : 'New Sale'}</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Customer" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} margin="dense" required>
            {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField type="date" fullWidth label="Date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
          <RadioGroup row value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value })}>
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel value="credit" control={<Radio />} label="Credit" />
          </RadioGroup>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Items</Typography>
          <Table size="small">
            <TableBody>
              {form.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField select size="small" fullWidth label="Product" value={item.product} onChange={(e) => { const p = productList.find((x) => x.id === Number(e.target.value)); updateItem(idx, 'product', e.target.value); if (p) updateItem(idx, 'rate', p.default_rate); }}>
                      {productList.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </TextField>
                  </TableCell>
                  <TableCell><TextField type="number" size="small" label="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} inputProps={{ step: 0.001, min: 0 }} sx={{ width: 70 }} /></TableCell>
                  <TableCell><TextField type="number" size="small" label="Rate" value={item.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} inputProps={{ step: 0.01, min: 0 }} sx={{ width: 80 }} /></TableCell>
                  <TableCell>₹{(item.amount || 0).toFixed(2)}</TableCell>
                  <TableCell><Button size="small" color="error" onClick={() => removeRow(idx)}>×</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" onClick={addRow}>+ Add row</Button>
          <Typography sx={{ mt: 1 }}>Total: {formatAED(total)}</Typography>
          <TextField fullWidth label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} margin="dense" multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
