import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { QUERY_KEYS, createQueryKey } from '@/constants/queryKeys';
import { Stock } from '@/types';

interface UpdateStockParams {
  id: string;
  productId: number;
  warehouseId: number;
  quantity: number;
}

interface StockFormData {
  productId: string;
  warehouseId: string;
  quantity: string;
}

const fetchStock = async (id: string): Promise<Stock> => {
  const response = await fetch(`/api/stock/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock record');
  }
  return response.json();
};

const updateStock = async ({ id, ...stock }: UpdateStockParams): Promise<Stock> => {
  const response = await fetch(`/api/stock/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stock),
  });

  if (!response.ok) {
    throw new Error('Failed to update stock record');
  }

  return response.json();
};

export const useStockEdit = (id: string) => {
  const [formData, setFormData] = useState<StockFormData>({
    productId: '',
    warehouseId: '',
    quantity: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: stock,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: createQueryKey.stock(id),
    queryFn: () => fetchStock(id),
    enabled: !!id,
  });

  const updateStockMutation = useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STOCK });
      queryClient.invalidateQueries({ queryKey: createQueryKey.stock(id) });
      router.push('/stock');
    },
    onError: (error) => {
      console.error('Error updating stock record:', error);
    },
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        productId: stock.productId.toString(),
        warehouseId: stock.warehouseId.toString(),
        quantity: stock.quantity.toString(),
      });
    }
  }, [stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateStockMutation.mutate({
        id,
        productId: parseInt(formData.productId),
        warehouseId: parseInt(formData.warehouseId),
        quantity: parseInt(formData.quantity),
      });
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    isError,
    fetchError,
    isUpdating: updateStockMutation.isPending,
    updateError: updateStockMutation.error,
  };
};
