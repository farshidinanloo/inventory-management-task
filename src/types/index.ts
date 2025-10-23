export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderPoint: number;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  code: string;
}

export interface Stock {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
}

export interface InventoryOverview extends Product {
  totalQuantity: number;
  isLowStock: boolean;
}

export interface Transfer {
  id: number;
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface Alert {
  id: number;
  productId: number;
  alertType: 'critical' | 'low' | 'overstocked';
  currentStock: number;
  reorderPoint: number;
  recommendedOrder: number;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
  notes?: string;
}

export interface StockStatus {
  productId: number;
  productName: string;
  sku: string;
  category: string;
  totalStock: number;
  reorderPoint: number;
  status: 'critical' | 'low' | 'adequate' | 'overstocked';
  stockPercentage: number;
  recommendedOrder: number;
}

import { NextApiRequest, NextApiResponse } from 'next';

export interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}
