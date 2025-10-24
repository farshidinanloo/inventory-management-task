import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { QUERY_KEYS, createQueryKey } from '@/constants/queryKeys';
import { Warehouse } from '@/types';

interface UpdateWarehouseParams {
  id: string;
  name: string;
  location: string;
  code: string;
}

interface WarehouseFormData {
  name: string;
  location: string;
  code: string;
}

const fetchWarehouse = async (id: string): Promise<Warehouse> => {
  const response = await fetch(`/api/warehouses/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch warehouse');
  }
  return response.json();
};

const updateWarehouse = async ({ id, ...warehouse }: UpdateWarehouseParams): Promise<Warehouse> => {
  const response = await fetch(`/api/warehouses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(warehouse),
  });

  if (!response.ok) {
    throw new Error('Failed to update warehouse');
  }

  return response.json();
};

export const useWarehouseEdit = (id: string) => {
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    location: '',
    code: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: warehouse,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: createQueryKey.warehouse(id),
    queryFn: () => fetchWarehouse(id),
    enabled: !!id,
  });

  const updateWarehouseMutation = useMutation({
    mutationFn: updateWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES });
      queryClient.invalidateQueries({ queryKey: createQueryKey.warehouse(id) });
      router.push('/warehouses');
    },
    onError: (error) => {
      console.error('Error updating warehouse:', error);
    },
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        location: warehouse.location,
        code: warehouse.code,
      });
    }
  }, [warehouse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateWarehouseMutation.mutate({
        id,
        ...formData,
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
    isUpdating: updateWarehouseMutation.isPending,
    updateError: updateWarehouseMutation.error,
  };
};
