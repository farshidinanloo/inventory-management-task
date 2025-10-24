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
  Add as AddIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useProducts, useAlerts, useAlertOperations } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';
import { getAlertIcon, getAlertColor, getStatusIcon, getStatusColor } from '@/utils/alertUtils';

export default function Alerts() {
  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorData } = useProducts();
  const { data: alerts = [], isLoading: alertsLoading, isError: alertsError, error: alertsErrorData } = useAlerts();
  
  const {
    openDialog,
    selectedAlert,
    formData,
    success,
    handleGenerateAlerts,
    handleAlertAction,
    handleUpdateAlert,
    handleCloseDialog,
    handleFormChange,
    clearSuccess,
    isGenerating,
    isUpdating,
    generateError,
    updateError,
  } = useAlertOperations();

  const isLoading = productsLoading || alertsLoading;
  const isError = productsError || alertsError;
  const error = productsErrorData || alertsErrorData;

  if (isLoading) {
    return (
      <>
        <Container sx={{ mt: 4, mb: 4 }}>
          <LoadingSkeleton />
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Container sx={{ mt: 4, mb: 4 }}>
          <ErrorDisplay error={error?.message || 'An error occurred'} />
        </Container>
      </>
    );
  }


  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.alertType === 'critical');
  const lowStockAlerts = activeAlerts.filter(alert => alert.alertType === 'low');
  const overstockedAlerts = activeAlerts.filter(alert => alert.alertType === 'overstocked');

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
            disabled={isGenerating}
            sx={{
              bgcolor: '#2E7D32',
              '&:hover': { bgcolor: '#1B5E20' }
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Alerts'}
          </Button>
        </Box>

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

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Manage Alert
          </DialogTitle>
          
          {updateError && (
            <Alert severity="error" sx={{ mx: 3, mb: 2 }}>
              {updateError?.message || 'An error occurred while updating the alert'}
            </Alert>
          )}
          
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
                      value={formData.status}
                      onChange={handleFormChange('status')}
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
                    value={formData.acknowledgedBy}
                    onChange={handleFormChange('acknowledgedBy')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleFormChange('notes')}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateAlert}
              variant="contained"
              disabled={isUpdating}
              sx={{
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#1B5E20' }
              }}
            >
              {isUpdating ? 'Updating...' : 'Update Alert'}
            </Button>
          </DialogActions>
        </Dialog>

        {generateError && (
          <Snackbar
            open={!!generateError}
            autoHideDuration={6000}
            onClose={() => {}}
          >
            <Alert severity="error">
              {generateError?.message || 'Failed to generate alerts'}
            </Alert>
          </Snackbar>
        )}

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={clearSuccess}
        >
          <Alert onClose={clearSuccess} severity="success">
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
