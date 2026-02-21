import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Button, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Table, TableBody, TableRow, TableCell,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import { purchases, parties, products } from '../api/endpoints';
import DateRangeFilter, { getDateRange } from '../components/DateRangeFilter';
import Layout from '../components/Layout';
import { formatAED } from '../utils/currency';
import { purchaseVoucher } from '../utils/voucher';
import { format } from 'date-fns';

export default function PurchasesPage() {
  const [list, setList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productList, setProductList] = useState([]);
  const [mode, setMode] = useState('daily');
  const [customFrom, setCustomFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    supplier: '',
    purchase_date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    items: [{ product: '', quantity: 1, rate: 0, amount: 0 }],
  });

  const { from, to } = getDateRange(mode, customFrom, customTo);

  const load = () => {
    purchases.list({ purchase_date__gte: from, purchase_date__lte: to }).then((res) => setList(res.data));
    parties.suppliers.list().then((res) => setSuppliers(res.data));
    products.list().then((res) => setProductList(res.data));
  };

  useEffect(() => { load(); }, [from, to]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      supplier: suppliers[0]?.id || '',
      purchase_date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      items: [{ product: '', quantity: 1, rate: 0, amount: 0 }],
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      supplier: row.supplier,
      purchase_date: row.purchase_date,
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
    if (!form.supplier) return;
    const payload = {
      supplier: form.supplier,
      purchase_date: form.purchase_date,
      notes: form.notes,
      total_amount: total,
      items: form.items.filter((i) => i.product && (parseFloat(i.quantity) || 0) > 0).map((i) => ({ product: Number(i.product), quantity: i.quantity, rate: i.rate, amount: i.amount })),
    };
    if (payload.items.length === 0) return;
    try {
      if (editing) await purchases.update(editing.id, payload);
      else await purchases.create(payload);
      close();
      load();
    } catch (e) {}
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">Purchases</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to={`/print/purchases?from=${from}&to=${to}`} startIcon={<PrintIcon />} variant="outlined" size="small">Print statement</Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>New Purchase</Button>
        </Box>
      </Box>
      <DateRangeFilter mode={mode} setMode={setMode} customFrom={customFrom} setCustomFrom={setCustomFrom} customTo={customTo} setCustomTo={setCustomTo} />
      <List>
        {list.map((row) => (
          <ListItem key={row.id} sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 1 }} secondaryAction={<Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(row)}>Edit bill</Button>}>
            <ListItemText primary={`${row.supplier_name} • ${row.purchase_date}`} secondary={`${purchaseVoucher(row.id)} • ${formatAED(row.total_amount)}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Purchase Bill' : 'New Purchase'}</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} margin="dense" required>
            {suppliers.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
          <TextField type="date" fullWidth label="Date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
          <Table size="small">
            <TableBody>
              {form.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField select size="small" fullWidth label="Product" value={item.product} onChange={(e) => { const p = productList.find((x) => x.id === Number(e.target.value)); updateItem(idx, 'product', e.target.value); if (p) updateItem(idx, 'rate', p.default_rate); }}>
                      {productList.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </TextField>
                  </TableCell>
                  <TableCell><TextField type="number" size="small" label="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} inputProps={{ step: 0.001 }} sx={{ width: 70 }} /></TableCell>
                  <TableCell><TextField type="number" size="small" label="Rate" value={item.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} inputProps={{ step: 0.01 }} sx={{ width: 80 }} /></TableCell>
                  <TableCell>{formatAED(item.amount || 0)}</TableCell>
                  <TableCell><Button size="small" color="error" onClick={() => removeRow(idx)}>×</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" onClick={addRow}>+ Add row</Button>
          <Typography sx={{ mt: 1 }}>Total: {formatAED(total)}</Typography>
          <TextField fullWidth label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
