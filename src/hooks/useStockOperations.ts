import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface DeleteStockParams {
  id: number;
}

const deleteStock = async ({ id }: DeleteStockParams): Promise<void> => {
  const response = await fetch(`/api/stock/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete stock record');
  }
};

export const useStockOperations = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteStockMutation = useMutation({
    mutationFn: deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STOCK });
      handleClose();
    },
    onError: (error) => {
      console.error('Error deleting stock record:', error);
    },
  });

  const handleClickOpen = (id: number) => {
    setSelectedStockId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const handleDelete = () => {
    if (selectedStockId) {
      deleteStockMutation.mutate({ id: selectedStockId });
    }
  };

  return {
    open,
    selectedStockId,
    handleClickOpen,
    handleClose,
    handleDelete,
    isDeleting: deleteStockMutation.isPending,
  };
};
