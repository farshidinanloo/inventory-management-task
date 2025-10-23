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

import { NextApiRequest, NextApiResponse } from 'next';

export interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}
