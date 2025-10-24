import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface CreateProductParams {
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderPoint: number;
}

interface ProductFormData {
  sku: string;
  name: string;
  category: string;
  unitCost: string;
  reorderPoint: string;
}

const createProduct = async (product: CreateProductParams): Promise<void> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }
};

export const useProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    category: '',
    unitCost: '',
    reorderPoint: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      router.push('/products');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate({
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      unitCost: parseFloat(formData.unitCost),
      reorderPoint: parseInt(formData.reorderPoint),
    });
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      category: '',
      unitCost: '',
      reorderPoint: '',
    });
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isCreating: createProductMutation.isPending,
    error: createProductMutation.error,
  };
};
