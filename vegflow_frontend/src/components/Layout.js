import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import BadgeIcon from '@mui/icons-material/Badge';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const nav = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/customers', label: 'Customers', icon: <PersonIcon /> },
  { path: '/suppliers', label: 'Suppliers', icon: <StorefrontIcon /> },
  { path: '/products', label: 'Products', icon: <InventoryIcon /> },
  { path: '/sales', label: 'Sales', icon: <ReceiptIcon /> },
  { path: '/purchases', label: 'Purchases', icon: <ShoppingCartIcon /> },
  { path: '/expenses', label: 'Expenses', icon: <PaymentIcon /> },
  { path: '/staff', label: 'Staff & Salary', icon: <BadgeIcon /> },
  { path: '/collections', label: 'Collections', icon: <AccountBalanceWalletIcon /> },
  { path: '/payments', label: 'Supplier Payments', icon: <MoneyOffIcon /> },
  { path: '/reports', label: 'Profit & Loss', icon: <AssessmentIcon /> },
];

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>VegFlow Biz</Typography>
          <Typography variant="body2">{user?.business_name || user?.username}</Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {nav.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => { navigate(item.path); setDrawerOpen(false); }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={() => { logout(); navigate('/login'); setDrawerOpen(false); }}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ p: 2, maxWidth: 480, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}
