import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  MenuItem,
  Alert,
} from '@mui/material';
import { AppBar } from '@/components';
import { useProducts, useWarehouses, useStockEdit } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';

export default function EditStock() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorData } = useProducts();
  const { data: warehouses = [], isLoading: warehousesLoading, isError: warehousesError, error: warehousesErrorData } = useWarehouses();
  
  const { 
    formData, 
    handleChange, 
    handleSubmit, 
    isLoading: stockLoading, 
    isError: stockError, 
    fetchError, 
    isUpdating, 
    updateError 
  } = useStockEdit(id as string);

  const isLoading = stockLoading || productsLoading || warehousesLoading;
  const isError = stockError || productsError || warehousesError;
  const error = fetchError || productsErrorData || warehousesErrorData;

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
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Stock Record
          </Typography>
          
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError?.message || 'An error occurred while updating the stock record'}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Product"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Warehouse"
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              inputProps={{ min: '0' }}
              value={formData.quantity}
              onChange={handleChange}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Stock'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/stock"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

