import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface MetricsCardsProps {
  totalProducts: number;
  totalWarehouses: number;
  totalValue: number;
  lowStockItems: number;
}

export default function MetricsCards({
  totalProducts,
  totalWarehouses,
  totalValue,
  lowStockItems,
}: MetricsCardsProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CategoryIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total Products
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {totalProducts}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Eco-friendly products
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
          color: 'white',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarehouseIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Warehouses
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {totalWarehouses}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Distribution centers
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
          color: 'white',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Inventory Value
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              ${totalValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total stock value
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: lowStockItems > 0 
            ? 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)'
            : 'linear-gradient(135deg, #81C784 0%, #A5D6A7 100%)',
          color: 'white',
          height: '100%'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {lowStockItems > 0 ? (
                <WarningIcon sx={{ mr: 1, fontSize: 28 }} />
              ) : (
                <CheckCircleIcon sx={{ mr: 1, fontSize: 28 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Stock Status
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {lowStockItems}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {lowStockItems > 0 ? 'Items need reorder' : 'All items in stock'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
