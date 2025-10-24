import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Alert as AlertType } from '@/types';

interface UpdateAlertParams {
  id: number;
  status: string;
  acknowledgedBy: string;
  notes: string;
}

interface AlertFormData {
  status: string;
  acknowledgedBy: string;
  notes: string;
}

const generateAlerts = async (): Promise<AlertType[]> => {
  const response = await fetch('/api/alerts?action=generate', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to generate alerts');
  }

  return response.json();
};

const updateAlert = async (alert: UpdateAlertParams): Promise<AlertType> => {
  const response = await fetch('/api/alerts', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alert),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update alert');
  }

  return response.json();
};

export const useAlertOperations = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [formData, setFormData] = useState<AlertFormData>({
    status: '',
    acknowledgedBy: '',
    notes: '',
  });
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const generateAlertsMutation = useMutation({
    mutationFn: generateAlerts,
    onSuccess: (newAlerts) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALERTS });
      setSuccess('Alerts generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating alerts:', error);
    },
  });

  const updateAlertMutation = useMutation({
    mutationFn: updateAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALERTS });
      setSuccess('Alert updated successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      console.error('Error updating alert:', error);
    },
  });

  const handleGenerateAlerts = () => {
    generateAlertsMutation.mutate();
  };

  const handleAlertAction = (alert: AlertType) => {
    setSelectedAlert(alert);
    setFormData({
      status: alert.status,
      acknowledgedBy: alert.acknowledgedBy || '',
      notes: alert.notes || '',
    });
    setOpenDialog(true);
  };

  const handleUpdateAlert = () => {
    if (selectedAlert) {
      updateAlertMutation.mutate({
        id: selectedAlert.id,
        ...formData,
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAlert(null);
    setFormData({
      status: '',
      acknowledgedBy: '',
      notes: '',
    });
  };

  const handleFormChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  return {
    openDialog,
    selectedAlert,
    formData,
    success,
    handleGenerateAlerts,
    handleAlertAction,
    handleUpdateAlert,
    handleCloseDialog,
    handleFormChange,
    clearSuccess,
    isGenerating: generateAlertsMutation.isPending,
    isUpdating: updateAlertMutation.isPending,
    generateError: generateAlertsMutation.error,
    updateError: updateAlertMutation.error,
  };
};
