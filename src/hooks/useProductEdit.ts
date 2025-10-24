import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { QUERY_KEYS, createQueryKey } from '@/constants/queryKeys';
import { Product } from '@/types';

interface UpdateProductParams {
  id: string;
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

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

const updateProduct = async ({ id, ...product }: UpdateProductParams): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
};

export const useProductEdit = (id: string) => {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    category: '',
    unitCost: '',
    reorderPoint: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: createQueryKey.product(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: createQueryKey.product(id) });
      router.push('/products');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        unitCost: product.unitCost.toString(),
        reorderPoint: product.reorderPoint.toString(),
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateProductMutation.mutate({
        id,
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        unitCost: parseFloat(formData.unitCost),
        reorderPoint: parseInt(formData.reorderPoint),
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
    isUpdating: updateProductMutation.isPending,
    updateError: updateProductMutation.error,
  };
};
