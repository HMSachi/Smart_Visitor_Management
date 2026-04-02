import { createTheme } from '@mui/material/styles';
import themeColors from './themeColors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: themeColors.primary.main,
      light: themeColors.primary.light,
      dark: themeColors.primary.dark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: themeColors.secondary.main,
      light: themeColors.secondary.light,
      dark: themeColors.secondary.dark,
      contrastText: '#ffffff',
    },
    background: {
      default: themeColors.background.default,
      paper: themeColors.background.paper,
    },
    text: {
      primary: themeColors.text.primary,
      secondary: themeColors.text.secondary,
    },
    error: {
      main: themeColors.status.error,
    },
    success: {
      main: themeColors.status.success,
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontSize: '2.5rem', fontWeight: 800 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: themeColors.background.paper,
        },
      },
    },
  },
});

export default theme;
