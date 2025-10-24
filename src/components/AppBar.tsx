import Link from 'next/link';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import NatureIcon from '@mui/icons-material/Nature';

export default function AppBar() {
  return (
    <MuiAppBar position="static">
      <Toolbar>
        <NatureIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GreenSupply Co - Inventory Management
        </Typography>
        <Button color="inherit" component={Link} href="/products">
          Products
        </Button>
        <Button color="inherit" component={Link} href="/warehouses">
          Warehouses
        </Button>
        <Button color="inherit" component={Link} href="/stock">
          Stock Levels
        </Button>
        <Button color="inherit" component={Link} href="/transfers">
          Transfers
        </Button>
        <Button color="inherit" component={Link} href="/alerts">
          Alerts
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
}
