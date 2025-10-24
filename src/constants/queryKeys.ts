export const QUERY_KEYS = {
  PRODUCTS: ['products'] as const,
  WAREHOUSES: ['warehouses'] as const,
  STOCK: ['stock'] as const,
  ALERTS: ['alerts'] as const,
  TRANSFERS: ['transfers'] as const,
} as const;

export const createQueryKey = {
  product: (id: string) => ['products', id] as const,
  warehouse: (id: string) => ['warehouses', id] as const,
  stock: (id: string) => ['stock', id] as const,
  alert: (id: string) => ['alerts', id] as const,
} as const;
