import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  LinearProgress,
  Alert,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NatureIcon from '@mui/icons-material/Nature';
import { Product, Warehouse, Stock, InventoryOverview } from '@/types';

// Dynamic imports for charts to avoid SSR issues
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, warehousesRes, stockRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/warehouses'),
          fetch('/api/stock'),
        ]);

        if (!productsRes.ok || !warehousesRes.ok || !stockRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [productsData, warehousesData, stockData] = await Promise.all([
          productsRes.json(),
          warehousesRes.json(),
          stockRes.json(),
        ]);

        setProducts(productsData);
        setWarehouses(warehousesData);
        setStock(stockData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalValue = stock.reduce((sum: number, item: Stock) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.unitCost * item.quantity : 0);
  }, 0);

  const lowStockItems = products.filter(product => {
    const productStock = stock.filter(s => s.productId === product.id);
    const totalQuantity = productStock.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
    return totalQuantity < product.reorderPoint;
  }).length;

  const totalStockItems = stock.reduce((sum: number, item: Stock) => sum + item.quantity, 0);

  // Get products with stock across all warehouses
  const inventoryOverview: InventoryOverview[] = products.map(product => {
    const productStock = stock.filter(s => s.productId === product.id);
    const totalQuantity = productStock.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
    return {
      ...product,
      totalQuantity,
      isLowStock: totalQuantity < product.reorderPoint,
    };
  });

  // Chart data
  const categoryData = products.reduce((acc: any, product) => {
    const existing = acc.find((item: any) => item.category === product.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: product.category, count: 1 });
    }
    return acc;
  }, []);

  const warehouseStockData = warehouses.map(warehouse => {
    const warehouseStock = stock.filter(s => s.warehouseId === warehouse.id);
    const totalQuantity = warehouseStock.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
    return {
      name: warehouse.name,
      stock: totalQuantity,
      location: warehouse.location,
    };
  });

  const inventoryValueData = products.map(product => {
    const productStock = stock.filter(s => s.productId === product.id);
    const totalQuantity = productStock.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
    return {
      name: product.name,
      value: product.unitCost * totalQuantity,
      quantity: totalQuantity,
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'];

  if (loading) {
    return (
      <>
        <AppBar position="static" sx={{ bgcolor: '#2E7D32' }}>
          <Toolbar>
            <NatureIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GreenSupply Co - Inventory Management
            </Typography>
            <Button color="inherit" component={Link} href="/products">
              Products
            </Button>
            <Button color="inherit" component={Link} href="/warehouses">
              Warehouses
            </Button>
            <Button color="inherit" component={Link} href="/stock">
              Stock Levels
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={300} />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppBar position="static" sx={{ bgcolor: '#2E7D32' }}>
          <Toolbar>
            <NatureIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GreenSupply Co - Inventory Management
            </Typography>
            <Button color="inherit" component={Link} href="/products">
              Products
            </Button>
            <Button color="inherit" component={Link} href="/warehouses">
              Warehouses
            </Button>
            <Button color="inherit" component={Link} href="/stock">
              Stock Levels
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#2E7D32' }}>
        <Toolbar>
          <NatureIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GreenSupply Co - Inventory Management
          </Typography>
          <Button color="inherit" component={Link} href="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} href="/warehouses">
            Warehouses
          </Button>
          <Button color="inherit" component={Link} href="/stock">
            Stock Levels
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sustainable Product Distribution Management
          </Typography>
        </Box>

        {/* Enhanced Metrics Cards */}
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
                  {products.length}
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
                  {warehouses.length}
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

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Product Categories Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                  Product Categories Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, count }) => `${category}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Warehouse Stock Levels */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                  Stock Levels by Warehouse
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={warehouseStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Products by Value */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                  Top Products by Inventory Value
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryValueData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Bar dataKey="value" fill="#66BB6A" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Inventory Overview Table */}
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
                  {inventoryOverview.map((item) => {
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
      </Container>
    </>
  );
}

