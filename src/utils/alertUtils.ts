import React from 'react';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

export const getAlertIcon = (alertType: string): React.ReactElement => {
  switch (alertType) {
    case 'critical':
      return React.createElement(WarningIcon, { color: 'error' });
    case 'low':
      return React.createElement(TrendingDownIcon, { color: 'warning' });
    case 'overstocked':
      return React.createElement(TrendingUpIcon, { color: 'info' });
    default:
      return React.createElement(WarningIcon);
  }
};

export const getAlertColor = (alertType: string): string => {
  switch (alertType) {
    case 'critical':
      return 'error';
    case 'low':
      return 'warning';
    case 'overstocked':
      return 'info';
    default:
      return 'default';
  }
};

export const getStatusIcon = (status: string): React.ReactElement => {
  switch (status) {
    case 'active':
      return React.createElement(PendingIcon, { color: 'warning' });
    case 'acknowledged':
      return React.createElement(CheckCircleIcon, { color: 'info' });
    case 'resolved':
      return React.createElement(CheckCircleIcon, { color: 'success' });
    default:
      return React.createElement(PendingIcon);
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'warning';
    case 'acknowledged':
      return 'info';
    case 'resolved':
      return 'success';
    default:
      return 'default';
  }
};
