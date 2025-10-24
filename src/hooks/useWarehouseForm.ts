import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Warehouse } from '@/types';

interface CreateWarehouseParams {
  name: string;
  location: string;
  code: string;
}

interface WarehouseFormData {
  name: string;
  location: string;
  code: string;
}

const createWarehouse = async (warehouse: CreateWarehouseParams): Promise<Warehouse> => {
  const response = await fetch('/api/warehouses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(warehouse),
  });

  if (!response.ok) {
    throw new Error('Failed to create warehouse');
  }

  return response.json();
};

export const useWarehouseForm = () => {
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    location: '',
    code: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const createWarehouseMutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES });
      router.push('/warehouses');
    },
    onError: (error) => {
      console.error('Error creating warehouse:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWarehouseMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      code: '',
    });
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isCreating: createWarehouseMutation.isPending,
    error: createWarehouseMutation.error,
  };
};
