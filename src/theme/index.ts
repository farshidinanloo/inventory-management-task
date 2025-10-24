import { createTheme } from '@mui/material/styles';

// Green color palette based on #2E7D32
const greenPalette = {
  primary: {
    main: '#2E7D32', // Your requested primary color
    light: '#4CAF50', // Lighter shade for hover states
    dark: '#1B5E20', // Darker shade for pressed states
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#66BB6A', // Complementary green
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#D32F2F',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
};

// Create the theme
const theme = createTheme({
  palette: {
    ...greenPalette,
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(46, 125, 50, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: greenPalette.primary.main,
          boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: greenPalette.primary.light,
          color: greenPalette.primary.contrastText,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: greenPalette.primary.light,
          '& .MuiLinearProgress-bar': {
            backgroundColor: greenPalette.primary.main,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: greenPalette.success.light,
          color: greenPalette.success.dark,
        },
      },
    },
  },
});

export default theme;
