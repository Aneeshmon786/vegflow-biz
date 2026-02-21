import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';

const editPaths = {
  sales: '/sales',
  purchases: '/purchases',
  collections: '/collections',
  payments: '/payments',
  expenses: '/expenses',
};

export default function PrintStatementLayout({ title, fromDate, toDate, type, children }) {
  const editPath = type && editPaths[type];

  const handlePrint = () => window.print();

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }} className="print-statement-root">
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {fromDate && toDate ? `${fromDate} to ${toDate}` : 'All dates'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editPath && (
            <Button component={Link} to={editPath} startIcon={<EditIcon />} variant="outlined" size="small">
              Edit in app
            </Button>
          )}
          <Button startIcon={<PrintIcon />} variant="contained" onClick={handlePrint}>
            Print / Save as PDF
          </Button>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" className="no-print" sx={{ display: 'block', mb: 1 }}>
        All items below are editable in the app. Use &quot;Edit in app&quot; to change any transaction.
      </Typography>
      {children}
    </Box>
  );
}
