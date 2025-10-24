import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface CreateStockParams {
  productId: number;
  warehouseId: number;
  quantity: number;
}

interface StockFormData {
  productId: string;
  warehouseId: string;
  quantity: string;
}

const createStock = async (stock: CreateStockParams): Promise<void> => {
  const response = await fetch('/api/stock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stock),
  });

  if (!response.ok) {
    throw new Error('Failed to create stock record');
  }
};

export const useStockForm = () => {
  const [formData, setFormData] = useState<StockFormData>({
    productId: '',
    warehouseId: '',
    quantity: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const createStockMutation = useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STOCK });
      router.push('/stock');
    },
    onError: (error) => {
      console.error('Error creating stock record:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStockMutation.mutate({
      productId: parseInt(formData.productId),
      warehouseId: parseInt(formData.warehouseId),
      quantity: parseInt(formData.quantity),
    });
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      warehouseId: '',
      quantity: '',
    });
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isCreating: createStockMutation.isPending,
    error: createStockMutation.error,
  };
};
