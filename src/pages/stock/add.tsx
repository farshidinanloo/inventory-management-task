import Link from 'next/link';
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
import { useProducts, useWarehouses, useStockForm } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';

export default function AddStock() {
  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorData } = useProducts();
  const { data: warehouses = [], isLoading: warehousesLoading, isError: warehousesError, error: warehousesErrorData } = useWarehouses();
  
  const { formData, handleChange, handleSubmit, isCreating, error } = useStockForm();

  const isLoading = productsLoading || warehousesLoading;
  const isError = productsError || warehousesError;
  const errorData = productsErrorData || warehousesErrorData;

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
          <ErrorDisplay error={errorData?.message || 'An error occurred'} />
        </Container>
      </>
    );
  }

  return (
    <>
      
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add Stock Record
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.message || 'An error occurred while creating the stock record'}
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
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add Stock'}
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

