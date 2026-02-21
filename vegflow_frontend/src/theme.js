import { createTheme } from '@mui/material/styles';

export const vegflowTheme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#ff8f00' },
    background: { default: '#f1f8e9', paper: '#ffffff' },
    success: { main: '#388e3c' },
    warning: { main: '#f57c00' },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Arial", sans-serif',
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});
