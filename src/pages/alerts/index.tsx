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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { Product, Alert as AlertType, StockStatus } from '@/types';

export default function Alerts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [stockStatuses, setStockStatuses] = useState<StockStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  // Form state for alert management
  const [alertForm, setAlertForm] = useState({
    status: '',
    acknowledgedBy: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, alertsRes, stockStatusRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/alerts'),
          fetch('/api/alerts?action=stock-status'),
        ]);

        if (!productsRes.ok || !alertsRes.ok || !stockStatusRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [productsData, alertsData, stockStatusData] = await Promise.all([
          productsRes.json(),
          alertsRes.json(),
          stockStatusRes.json(),
        ]);

        setProducts(productsData);
        setAlerts(alertsData);
        setStockStatuses(stockStatusData);
        setError(null);
      } catch (err) {
        setError('Failed to load alerts data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateAlerts = async () => {
    try {
      const response = await fetch('/api/alerts?action=generate', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate alerts');
      }

      const newAlerts = await response.json();
      setAlerts(newAlerts);
      setSuccess('Alerts generated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to generate alerts');
    }
  };

  const handleAlertAction = (alert: AlertType) => {
    setSelectedAlert(alert);
    setAlertForm({
      status: alert.status,
      acknowledgedBy: alert.acknowledgedBy || '',
      notes: alert.notes || ''
    });
    setOpenDialog(true);
  };

  const handleUpdateAlert = async () => {
    if (!selectedAlert) return;

    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedAlert.id,
          ...alertForm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update alert');
      }

      const updatedAlert = await response.json();
      setAlerts(alerts.map(alert => alert.id === updatedAlert.id ? updatedAlert : alert));
      setSuccess('Alert updated successfully!');
      setOpenDialog(false);
      setSelectedAlert(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update alert');
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'critical':
        return <WarningIcon color="error" />;
      case 'low':
        return <TrendingDownIcon color="warning" />;
      case 'overstocked':
        return <TrendingUpIcon color="info" />;
      default:
        return <WarningIcon />;
    }
  };

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'critical':
        return 'error';
      case 'low':
        return 'warning';
      case 'overstocked':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PendingIcon color="warning" />;
      case 'acknowledged':
        return <CheckCircleIcon color="info" />;
      case 'resolved':
        return <CheckCircleIcon color="success" />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'warning';
      case 'acknowledged':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#f44336';
      case 'low':
        return '#ff9800';
      case 'adequate':
        return '#4caf50';
      case 'overstocked':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.alertType === 'critical');
  const lowStockAlerts = activeAlerts.filter(alert => alert.alertType === 'low');
  const overstockedAlerts = activeAlerts.filter(alert => alert.alertType === 'overstocked');

  if (loading) {
    return (
      <>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Stock Alerts & Reorder System
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Monitor inventory levels and manage reorder recommendations
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleGenerateAlerts}
            sx={{
              bgcolor: '#2E7D32',
              '&:hover': { bgcolor: '#1B5E20' }
            }}
          >
            Generate Alerts
          </Button>
        </Box>

        {/* Alert Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f44336 0%, #ff5722 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Critical Alerts
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {criticalAlerts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Immediate action required
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingDownIcon sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Low Stock
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {lowStockAlerts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Reorder recommended
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Overstocked
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {overstockedAlerts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Excess inventory
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total Active
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {activeAlerts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Alerts requiring attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Stock Status Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <InventoryIcon sx={{ mr: 1, color: '#2E7D32' }} />
              <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                Stock Status Overview
              </Typography>
            </Box>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.1) }}>
                    <TableCell><strong>Product</strong></TableCell>
                    <TableCell><strong>Current Stock</strong></TableCell>
                    <TableCell><strong>Reorder Point</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Stock Level</strong></TableCell>
                    <TableCell align="right"><strong>Recommended Order</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockStatuses.map((status) => (
                    <TableRow 
                      key={status.productId}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: alpha('#2E7D32', 0.05)
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {status.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {status.sku} • {status.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {status.totalStock.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {status.reorderPoint.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={status.status.toUpperCase()}
                          size="small"
                          sx={{ 
                            bgcolor: getStockStatusColor(status.status),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(status.stockPercentage, 100)} 
                            sx={{ 
                              width: 100, 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: alpha(getStockStatusColor(status.status), 0.2),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getStockStatusColor(status.status)
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {status.stockPercentage.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {status.recommendedOrder > 0 ? status.recommendedOrder.toLocaleString() : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WarningIcon sx={{ mr: 1, color: '#2E7D32' }} />
              <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                Active Alerts
              </Typography>
            </Box>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.1) }}>
                    <TableCell><strong>Product</strong></TableCell>
                    <TableCell><strong>Alert Type</strong></TableCell>
                    <TableCell><strong>Current Stock</strong></TableCell>
                    <TableCell><strong>Recommended Order</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Created</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((alert) => {
                    const product = products.find(p => p.id === alert.productId);
                    
                    return (
                      <TableRow 
                        key={alert.id}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: alpha('#2E7D32', 0.05)
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {product?.name || 'Unknown Product'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product?.sku || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getAlertIcon(alert.alertType)}
                            label={alert.alertType.toUpperCase()}
                            color={getAlertColor(alert.alertType) as any}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {alert.currentStock.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {alert.recommendedOrder.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(alert.status)}
                            label={alert.status.toUpperCase()}
                            color={getStatusColor(alert.status) as any}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(alert.createdAt).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleAlertAction(alert)}
                            sx={{
                              borderColor: '#2E7D32',
                              color: '#2E7D32',
                              '&:hover': {
                                borderColor: '#1B5E20',
                                bgcolor: alpha('#2E7D32', 0.1)
                              }
                            }}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Alert Management Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Manage Alert
          </DialogTitle>
          <DialogContent>
            {selectedAlert && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {products.find(p => p.id === selectedAlert.productId)?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alert Type: {selectedAlert.alertType.toUpperCase()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={alertForm.status}
                      onChange={(e) => setAlertForm({...alertForm, status: e.target.value})}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="acknowledged">Acknowledged</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Acknowledged By"
                    value={alertForm.acknowledgedBy}
                    onChange={(e) => setAlertForm({...alertForm, acknowledgedBy: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={alertForm.notes}
                    onChange={(e) => setAlertForm({...alertForm, notes: e.target.value})}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateAlert}
              variant="contained"
              sx={{
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#1B5E20' }
              }}
            >
              Update Alert
            </Button>
          </DialogActions>
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
