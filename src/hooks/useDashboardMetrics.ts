import { useMemo } from 'react';
import { Product, Warehouse, Stock, Alert, InventoryOverview } from '@/types';

interface DashboardMetrics {
  totalValue: number;
  lowStockItems: number;
  inventoryOverview: InventoryOverview[];
  categoryData: Array<{ category: string; count: number }>;
  warehouseStockData: Array<{ name: string; stock: number; location: string }>;
  inventoryValueData: Array<{ name: string; value: number; quantity: number }>;
  criticalAlerts: Alert[];
}

export const useDashboardMetrics = (
  products: Product[],
  warehouses: Warehouse[],
  stock: Stock[],
  alerts: Alert[]
): DashboardMetrics => {
  return useMemo(() => {
    const totalValue = stock.reduce((sum: number, item: Stock) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.unitCost * item.quantity : 0);
    }, 0);

    const lowStockItems = products.filter(product => {
      const productStock = stock.filter(s => s.productId === product.id);
      const totalQuantity = productStock.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
      return totalQuantity < product.reorderPoint;
    }).length;

    const inventoryOverview: InventoryOverview[] = products.map(product => {
      const productStock = stock.filter(s => s.productId === product.id);
      const totalQuantity = productStock.reduce((sum: number, s: Stock) => sum + s.quantity, 0);
      return {
        ...product,
        totalQuantity,
        isLowStock: totalQuantity < product.reorderPoint,
      };
    });

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

    const criticalAlerts = alerts.filter(alert => 
      alert.status === 'active' && alert.alertType === 'critical'
    );

    return {
      totalValue,
      lowStockItems,
      inventoryOverview,
      categoryData,
      warehouseStockData,
      inventoryValueData,
      criticalAlerts,
    };
  }, [products, warehouses, stock, alerts]);
};
