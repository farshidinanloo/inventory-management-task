import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Transfer } from '@/types';

interface CreateTransferParams {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  requestedBy: string;
  notes?: string;
}

interface TransferFormData {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: string;
  requestedBy: string;
  notes: string;
}

const createTransfer = async (transfer: CreateTransferParams): Promise<Transfer> => {
  const response = await fetch('/api/transfers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transfer),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create transfer');
  }

  return response.json();
};

export const useTransfers = () => {
  const [formData, setFormData] = useState<TransferFormData>({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: '',
    requestedBy: '',
    notes: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createTransferMutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: (newTransfer) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS });
      setSuccess('Transfer created successfully!');
      resetForm();
      setOpenDialog(false);
    },
    onError: (error) => {
      console.error('Error creating transfer:', error);
    },
  });

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createTransferMutation.mutate({
      productId: parseInt(formData.productId),
      fromWarehouseId: parseInt(formData.fromWarehouseId),
      toWarehouseId: parseInt(formData.toWarehouseId),
      quantity: parseInt(formData.quantity),
      requestedBy: formData.requestedBy,
      notes: formData.notes,
    });
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      fromWarehouseId: '',
      toWarehouseId: '',
      quantity: '',
      requestedBy: '',
      notes: '',
    });
  };

  const openCreateDialog = () => {
    setOpenDialog(true);
  };

  const closeCreateDialog = () => {
    setOpenDialog(false);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    openDialog,
    openCreateDialog,
    closeCreateDialog,
    success,
    clearSuccess,
    isCreating: createTransferMutation.isPending,
    createError: createTransferMutation.error,
  };
};
