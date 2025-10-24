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
  Add as AddIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { AppBar } from '@/components';
import { useProducts, useWarehouses, useTransfers, useTransferForm } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';
import { getStatusIcon, getStatusColor } from '@/utils/transferUtils';

export default function Transfers() {
  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorData } = useProducts();
  const { data: warehouses = [], isLoading: warehousesLoading, isError: warehousesError, error: warehousesErrorData } = useWarehouses();
  const { data: transfers = [], isLoading: transfersLoading, isError: transfersError, error: transfersErrorData } = useTransfers();
  
  const {
    formData,
    handleInputChange,
    handleSubmit,
    openDialog,
    openCreateDialog,
    closeCreateDialog,
    success,
    clearSuccess,
    isCreating,
    createError,
  } = useTransferForm();

  const isLoading = productsLoading || warehousesLoading || transfersLoading;
  const isError = productsError || warehousesError || transfersError;
  const error = productsErrorData || warehousesErrorData || transfersErrorData;

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

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
            onClick={openCreateDialog}
            sx={{
              bgcolor: '#2E7D32',
              '&:hover': { bgcolor: '#1B5E20' }
            }}
          >
            New Transfer
          </Button>
        </Box>

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

        <Dialog open={openDialog} onClose={closeCreateDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Create New Transfer
          </DialogTitle>
          
          {createError && (
            <Alert severity="error" sx={{ mx: 3, mb: 2 }}>
              {createError?.message || 'An error occurred while creating the transfer'}
            </Alert>
          )}
          
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
              <Button onClick={closeCreateDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={isCreating}
                sx={{
                  bgcolor: '#2E7D32',
                  '&:hover': { bgcolor: '#1B5E20' }
                }}
              >
                {isCreating ? 'Creating...' : 'Create Transfer'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

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
