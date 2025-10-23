import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
} from '@mui/material';
import {
  TransferWithinAStation as TransferIcon,
  Add as AddIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Product, Warehouse, Transfer } from '@/types';

export default function Transfers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: '',
    requestedBy: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, warehousesRes, transfersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/warehouses'),
          fetch('/api/transfers'),
        ]);

        if (!productsRes.ok || !warehousesRes.ok || !transfersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [productsData, warehousesData, transfersData] = await Promise.all([
          productsRes.json(),
          warehousesRes.json(),
          transfersRes.json(),
        ]);

        setProducts(productsData);
        setWarehouses(warehousesData);
        setTransfers(transfersData);
        setError(null);
      } catch (err) {
        setError('Failed to load transfers data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId: parseInt(formData.productId),
          fromWarehouseId: parseInt(formData.fromWarehouseId),
          toWarehouseId: parseInt(formData.toWarehouseId),
          quantity: parseInt(formData.quantity),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transfer');
      }

      const newTransfer = await response.json();
      setTransfers([newTransfer, ...transfers]);
      setSuccess('Transfer created successfully!');
      setFormData({
        productId: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        quantity: '',
        requestedBy: '',
        notes: ''
      });
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create transfer');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'cancelled':
        return <CancelIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <>
        <AppBar position="static" sx={{ bgcolor: '#2E7D32' }}>
          <Toolbar>
            <TransferIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Transfers
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
        </AppBar>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#2E7D32' }}>
        <Toolbar>
          <TransferIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Transfers
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
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Stock Transfers
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage inventory transfers between warehouses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: '#2E7D32',
              '&:hover': { bgcolor: '#1B5E20' }
            }}
          >
            New Transfer
          </Button>
        </Box>

        {/* Transfer History */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HistoryIcon sx={{ mr: 1, color: '#2E7D32' }} />
              <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                Transfer History
              </Typography>
            </Box>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.1) }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Product</strong></TableCell>
                    <TableCell><strong>From</strong></TableCell>
                    <TableCell><strong>To</strong></TableCell>
                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Requested By</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transfers.map((transfer) => {
                    const product = products.find(p => p.id === transfer.productId);
                    const fromWarehouse = warehouses.find(w => w.id === transfer.fromWarehouseId);
                    const toWarehouse = warehouses.find(w => w.id === transfer.toWarehouseId);
                    
                    return (
                      <TableRow 
                        key={transfer.id}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: alpha('#2E7D32', 0.05)
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            #{transfer.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {product?.name || 'Unknown Product'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product?.sku || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {fromWarehouse?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {fromWarehouse?.location || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {toWarehouse?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {toWarehouse?.location || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {transfer.quantity.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(transfer.status)}
                            label={transfer.status.toUpperCase()} 
                            color={getStatusColor(transfer.status) as any}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {transfer.requestedBy}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(transfer.requestedAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(transfer.requestedAt).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Transfer Form Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Create New Transfer
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={formData.productId}
                      onChange={handleInputChange('productId')}
                      label="Product"
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>From Warehouse</InputLabel>
                    <Select
                      value={formData.fromWarehouseId}
                      onChange={handleInputChange('fromWarehouseId')}
                      label="From Warehouse"
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} - {warehouse.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>To Warehouse</InputLabel>
                    <Select
                      value={formData.toWarehouseId}
                      onChange={handleInputChange('toWarehouseId')}
                      label="To Warehouse"
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} - {warehouse.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange('quantity')}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Requested By"
                    value={formData.requestedBy}
                    onChange={handleInputChange('requestedBy')}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange('notes')}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  bgcolor: '#2E7D32',
                  '&:hover': { bgcolor: '#1B5E20' }
                }}
              >
                Create Transfer
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
