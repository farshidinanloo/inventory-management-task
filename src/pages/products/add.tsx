import Link from 'next/link';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { useProductForm } from '@/hooks';

export default function AddProduct() {
  const { formData, handleChange, handleSubmit, isCreating, error } = useProductForm();

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Product
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.message || 'An error occurred while creating the product'}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Unit Cost"
              name="unitCost"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={formData.unitCost}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Reorder Point"
              name="reorderPoint"
              type="number"
              inputProps={{ min: '0' }}
              value={formData.reorderPoint}
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
                {isCreating ? 'Adding...' : 'Add Product'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/products"
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

