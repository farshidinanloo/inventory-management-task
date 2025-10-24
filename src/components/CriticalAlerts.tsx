import Link from 'next/link';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Button,
  alpha,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Product, Alert } from '@/types';

interface CriticalAlertsProps {
  alerts: Alert[];
  products: Product[];
}

export default function CriticalAlerts({ alerts, products }: CriticalAlertsProps) {
  const criticalAlerts = alerts.filter(alert => 
    alert.status === 'active' && alert.alertType === 'critical'
  );

  if (criticalAlerts.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mb: 4, border: '2px solid #f44336' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WarningIcon sx={{ mr: 1, color: '#f44336', fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 'bold' }}>
            Critical Stock Alerts
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {criticalAlerts.slice(0, 3).map((alert) => {
            const product = products.find(p => p.id === alert.productId);
            return (
              <Grid item xs={12} sm={6} md={4} key={alert.id}>
                <Card sx={{ 
                  bgcolor: alpha('#f44336', 0.1),
                  border: '1px solid #f44336'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                      {product?.name || 'Unknown Product'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product?.sku || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Current Stock:</strong> {alert.currentStock.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Reorder Point:</strong> {alert.reorderPoint.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                      <strong>Recommended Order:</strong> {alert.recommendedOrder.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        
        {criticalAlerts.length > 3 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              component={Link}
              href="/alerts"
              variant="contained"
              sx={{
                bgcolor: '#f44336',
                '&:hover': { bgcolor: '#d32f2f' }
              }}
            >
              View All Alerts ({criticalAlerts.length})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
