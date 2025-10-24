import { useQuery } from '@tanstack/react-query';
import { Product, Warehouse, Stock, Alert, Transfer } from '@/types';
import { QUERY_KEYS } from '@/constants/queryKeys';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const response = await fetch('/api/warehouses');
  if (!response.ok) {
    throw new Error('Failed to fetch warehouses');
  }
  return response.json();
};

const fetchStock = async (): Promise<Stock[]> => {
  const response = await fetch('/api/stock');
  if (!response.ok) {
    throw new Error('Failed to fetch stock');
  }
  return response.json();
};

const fetchAlerts = async (): Promise<Alert[]> => {
  const response = await fetch('/api/alerts');
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
};

const fetchTransfers = async (): Promise<Transfer[]> => {
  const response = await fetch('/api/transfers');
  if (!response.ok) {
    throw new Error('Failed to fetch transfers');
  }
  return response.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: fetchProducts,
  });
};

export const useWarehouses = () => {
  return useQuery({
    queryKey: QUERY_KEYS.WAREHOUSES,
    queryFn: fetchWarehouses,
  });
};

export const useStock = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STOCK,
    queryFn: fetchStock,
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ALERTS,
    queryFn: fetchAlerts,
  });
};

export const useTransfers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSFERS,
    queryFn: fetchTransfers,
  });
};

export const useDashboardData = () => {
  const productsQuery = useProducts();
  const warehousesQuery = useWarehouses();
  const stockQuery = useStock();
  const alertsQuery = useAlerts();

  const isLoading = productsQuery.isLoading || warehousesQuery.isLoading || 
                   stockQuery.isLoading || alertsQuery.isLoading;
  
  const isError = productsQuery.isError || warehousesQuery.isError || 
                  stockQuery.isError || alertsQuery.isError;
  
  const error = productsQuery.error || warehousesQuery.error || 
                stockQuery.error || alertsQuery.error;

  return {
    products: productsQuery.data || [],
    warehouses: warehousesQuery.data || [],
    stock: stockQuery.data || [],
    alerts: alertsQuery.data || [],
    isLoading,
    isError,
    error,
    refetch: () => {
      productsQuery.refetch();
      warehousesQuery.refetch();
      stockQuery.refetch();
      alertsQuery.refetch();
    }
  };
};
