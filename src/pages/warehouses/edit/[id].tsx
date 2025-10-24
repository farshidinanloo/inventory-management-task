import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AppBar } from '@/components';
import { useWarehouseEdit } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';

export default function EditWarehouse() {
  const router = useRouter();
  const { id } = router.query;
  
  const { 
    formData, 
    handleChange, 
    handleSubmit, 
    isLoading, 
    isError, 
    fetchError, 
    isUpdating, 
    updateError 
  } = useWarehouseEdit(id as string);

  if (isLoading) {
    return (
      <>
        <AppBar />
        <Container sx={{ mt: 4, mb: 4 }}>
          <LoadingSkeleton />
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <AppBar />
        <Container sx={{ mt: 4, mb: 4 }}>
          <ErrorDisplay error={fetchError?.message || 'An error occurred'} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Warehouse
          </Typography>
          
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError?.message || 'An error occurred while updating the warehouse'}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Warehouse Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Warehouse Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
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
                {isUpdating ? 'Updating...' : 'Update Warehouse'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/warehouses"
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

