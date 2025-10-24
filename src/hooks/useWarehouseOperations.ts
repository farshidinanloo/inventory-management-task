import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Warehouse } from '@/types';

interface DeleteWarehouseParams {
  id: number;
}

const deleteWarehouse = async ({ id }: DeleteWarehouseParams): Promise<void> => {
  const response = await fetch(`/api/warehouses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete warehouse');
  }
};

export const useWarehouseOperations = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteWarehouseMutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES });
      handleClose();
    },
    onError: (error) => {
      console.error('Error deleting warehouse:', error);
    },
  });

  const handleClickOpen = (id: number) => {
    setSelectedWarehouseId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWarehouseId(null);
  };

  const handleDelete = () => {
    if (selectedWarehouseId) {
      deleteWarehouseMutation.mutate({ id: selectedWarehouseId });
    }
  };

  return {
    open,
    selectedWarehouseId,
    handleClickOpen,
    handleClose,
    handleDelete,
    isDeleting: deleteWarehouseMutation.isPending,
  };
};
