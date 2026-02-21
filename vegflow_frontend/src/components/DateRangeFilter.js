import React, { useState, useMemo } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';
import { format, startOfMonth, endOfMonth, subMonths, startOfDay } from 'date-fns';

export function getDateRange(mode, customFrom, customTo) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  switch (mode) {
    case 'daily':
      return { from: format(today, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') };
    case 'monthly':
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      return { from: format(start, 'yyyy-MM-dd'), to: format(end, 'yyyy-MM-dd') };
    case 'custom':
      return {
        from: customFrom || format(today, 'yyyy-MM-dd'),
        to: customTo || format(today, 'yyyy-MM-dd'),
      };
    default:
      return { from: format(today, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') };
  }
}

export default function DateRangeFilter({ mode, setMode, customFrom, setCustomFrom, customTo, setCustomTo, onApply }) {
  const handleMode = (e, newMode) => {
    if (newMode != null) setMode(newMode);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 2 }}>
      <ToggleButtonGroup value={mode} exclusive onChange={handleMode} size="small">
        <ToggleButton value="daily">Daily</ToggleButton>
        <ToggleButton value="monthly">Monthly</ToggleButton>
        <ToggleButton value="custom">Custom</ToggleButton>
      </ToggleButtonGroup>
      {mode === 'custom' && (
        <>
          <TextField type="date" label="From" size="small" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField type="date" label="To" size="small" value={customTo} onChange={(e) => setCustomTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        </>
      )}
      {onApply && (
        <ToggleButton value="apply" onClick={onApply}>Apply</ToggleButton>
      )}
    </Box>
  );
}
