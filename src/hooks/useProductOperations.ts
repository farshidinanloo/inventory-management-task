import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface DeleteProductParams {
  id: number;
}

const deleteProduct = async ({ id }: DeleteProductParams): Promise<void> => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};

export const useProductOperations = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      handleClose();
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
    },
  });

  const handleClickOpen = (id: number) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = () => {
    if (selectedProductId) {
      deleteProductMutation.mutate({ id: selectedProductId });
    }
  };

  return {
    open,
    selectedProductId,
    handleClickOpen,
    handleClose,
    handleDelete,
    isDeleting: deleteProductMutation.isPending,
  };
};
