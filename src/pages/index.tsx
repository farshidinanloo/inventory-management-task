import {
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { useDashboardData, useDashboardMetrics } from '@/hooks';
import {
  AppBar,
  LoadingSkeleton,
  ErrorDisplay,
  MetricsCards,
  CategoryChart,
  WarehouseStockChart,
  InventoryValueChart,
  CriticalAlerts,
  InventoryOverviewTable,
} from '@/components';

export default function Home() {
  const { products, warehouses, stock, alerts, isLoading, isError, error } = useDashboardData();
  const metrics = useDashboardMetrics(products, warehouses, stock, alerts);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay error={error?.message || 'Failed to load dashboard data. Please try again.'} />;
  }

  return (
    <>
      <AppBar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sustainable Product Distribution Management
          </Typography>
        </Box>

        <MetricsCards
          totalProducts={products.length}
          totalWarehouses={warehouses.length}
          totalValue={metrics.totalValue}
          lowStockItems={metrics.lowStockItems}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <CategoryChart data={metrics.categoryData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WarehouseStockChart data={metrics.warehouseStockData} />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <InventoryValueChart data={metrics.inventoryValueData} />
          </Grid>
        </Grid>

        <CriticalAlerts alerts={alerts} products={products} />

        <InventoryOverviewTable data={metrics.inventoryOverview} />
      </Container>
    </>
  );
}

