import Link from 'next/link';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AppBar } from '@/components';
import { useStock, useProducts, useWarehouses, useStockOperations } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';
import { getProductName, getWarehouseName } from '@/utils/stockUtils';

export default function Stock() {
  const { data: stock = [], isLoading: stockLoading, isError: stockError, error: stockErrorData } = useStock();
  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorData } = useProducts();
  const { data: warehouses = [], isLoading: warehousesLoading, isError: warehousesError, error: warehousesErrorData } = useWarehouses();
  
  const { open, handleClickOpen, handleClose, handleDelete, isDeleting } = useStockOperations();

  const isLoading = stockLoading || productsLoading || warehousesLoading;
  const isError = stockError || productsError || warehousesError;
  const error = stockErrorData || productsErrorData || warehousesErrorData;

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
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Stock Levels
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            href="/stock/add"
          >
            Add Stock Record
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Warehouse</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getProductName(item.productId, products)}</TableCell>
                  <TableCell>{getWarehouseName(item.warehouseId, warehouses)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/stock/edit/${item.id}`}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(item.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {stock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No stock records available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Stock Record</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this stock record? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error" 
              autoFocus
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

