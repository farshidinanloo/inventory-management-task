import { Product, Warehouse } from '@/types';

export const getProductName = (productId: number, products: Product[]): string => {
  const product = products.find(p => p.id === productId);
  return product ? `${product.name} (${product.sku})` : 'Unknown';
};

export const getWarehouseName = (warehouseId: number, warehouses: Warehouse[]): string => {
  const warehouse = warehouses.find(w => w.id === warehouseId);
  return warehouse ? `${warehouse.name} (${warehouse.code})` : 'Unknown';
};
