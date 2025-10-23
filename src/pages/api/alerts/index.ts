import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Alert, Product, Stock, StockStatus } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'alerts.json');
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
const stockFilePath = path.join(process.cwd(), 'data', 'stock.json');

// Calculate stock status for all products
function calculateStockStatus(): StockStatus[] {
  const products: Product[] = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  const stock: Stock[] = JSON.parse(fs.readFileSync(stockFilePath, 'utf8'));

  return products.map(product => {
    const productStock = stock.filter(s => s.productId === product.id);
    const totalStock = productStock.reduce((sum, s) => sum + s.quantity, 0);
    const stockPercentage = (totalStock / product.reorderPoint) * 100;
    
    let status: 'critical' | 'low' | 'adequate' | 'overstocked';
    let recommendedOrder = 0;

    if (totalStock === 0) {
      status = 'critical';
      recommendedOrder = product.reorderPoint * 2; // Order 2x reorder point for critical
    } else if (totalStock < product.reorderPoint * 0.5) {
      status = 'critical';
      recommendedOrder = product.reorderPoint * 1.5;
    } else if (totalStock < product.reorderPoint) {
      status = 'low';
      recommendedOrder = product.reorderPoint;
    } else if (totalStock > product.reorderPoint * 2) {
      status = 'overstocked';
      recommendedOrder = 0;
    } else {
      status = 'adequate';
      recommendedOrder = 0;
    }

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      totalStock,
      reorderPoint: product.reorderPoint,
      status,
      stockPercentage,
      recommendedOrder
    };
  });
}

// Generate alerts based on stock status
function generateAlerts(): Alert[] {
  const stockStatuses = calculateStockStatus();
  const existingAlerts: Alert[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
  const newAlerts: Alert[] = [];
  
  stockStatuses.forEach(stockStatus => {
    if (stockStatus.status === 'critical' || stockStatus.status === 'low' || stockStatus.status === 'overstocked') {
      // Check if there's already an active alert for this product
      const existingAlert = existingAlerts.find(
        alert => alert.productId === stockStatus.productId && alert.status === 'active'
      );
      
      if (!existingAlert) {
        const alertType = stockStatus.status === 'overstocked' ? 'overstocked' : 
                         stockStatus.status === 'critical' ? 'critical' : 'low';
        
        newAlerts.push({
          id: existingAlerts.length > 0 ? Math.max(...existingAlerts.map(a => a.id)) + newAlerts.length + 1 : newAlerts.length + 1,
          productId: stockStatus.productId,
          alertType,
          currentStock: stockStatus.totalStock,
          reorderPoint: stockStatus.reorderPoint,
          recommendedOrder: stockStatus.recommendedOrder,
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }
    }
  });
  
  return [...existingAlerts, ...newAlerts];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { action } = req.query;
      
      if (action === 'stock-status') {
        const stockStatuses = calculateStockStatus();
        res.status(200).json(stockStatuses);
        return;
      }
      
      if (action === 'generate') {
        const alerts = generateAlerts();
        fs.writeFileSync(dataFilePath, JSON.stringify(alerts, null, 2));
        res.status(200).json(alerts);
        return;
      }
      
      // Default: return existing alerts
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const alerts: Alert[] = JSON.parse(data);
      res.status(200).json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read alerts data' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, status, acknowledgedBy, notes } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const alerts: Alert[] = JSON.parse(data);
      
      const alertIndex = alerts.findIndex(alert => alert.id === id);
      if (alertIndex === -1) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      const updatedAlert = {
        ...alerts[alertIndex],
        status,
        acknowledgedBy: status === 'acknowledged' ? acknowledgedBy : alerts[alertIndex].acknowledgedBy,
        acknowledgedAt: status === 'acknowledged' ? new Date().toISOString() : alerts[alertIndex].acknowledgedAt,
        resolvedAt: status === 'resolved' ? new Date().toISOString() : alerts[alertIndex].resolvedAt,
        notes: notes || alerts[alertIndex].notes
      };
      
      alerts[alertIndex] = updatedAlert;
      fs.writeFileSync(dataFilePath, JSON.stringify(alerts, null, 2));
      
      res.status(200).json(updatedAlert);
    } catch (error) {
      console.error('Error updating alert:', error);
      res.status(500).json({ error: 'Failed to update alert' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
