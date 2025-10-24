import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  alpha,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InventoryOverview } from '@/types';

interface InventoryOverviewTableProps {
  data: InventoryOverview[];
}

export default function InventoryOverviewTable({ data }: InventoryOverviewTableProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InventoryIcon sx={{ mr: 1, color: '#2E7D32' }} />
          <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Inventory Overview
          </Typography>
        </Box>
        
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.1) }}>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Total Stock</strong></TableCell>
                <TableCell align="right"><strong>Reorder Point</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Value</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => {
                const stockPercentage = (item.totalQuantity / item.reorderPoint) * 100;
                return (
                  <TableRow 
                    key={item.id}
                    sx={{ 
                      backgroundColor: item.isLowStock ? alpha('#FF9800', 0.1) : 'inherit',
                      '&:hover': {
                        backgroundColor: alpha('#2E7D32', 0.05)
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha('#4CAF50', 0.1),
                          color: '#2E7D32',
                          fontWeight: 'medium'
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {item.totalQuantity.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        {item.reorderPoint.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {item.isLowStock ? (
                        <Chip 
                          icon={<WarningIcon />}
                          label="Low Stock" 
                          color="warning" 
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      ) : (
                        <Chip 
                          icon={<CheckCircleIcon />}
                          label="In Stock" 
                          color="success" 
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        ${(item.unitCost * item.totalQuantity).toLocaleString()}
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
  );
}
