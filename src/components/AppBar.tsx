import Link from 'next/link';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';

export const AppBar = () => {
  return (
    <MuiAppBar position="static">
      <Toolbar>
        <InventoryIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Management System
        </Typography>
        <Button color="inherit" component={Link} href="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/products">
          Products
        </Button>
        <Button color="inherit" component={Link} href="/warehouses">
          Warehouses
        </Button>
        <Button color="inherit" component={Link} href="/stock">
          Stock Levels
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
};