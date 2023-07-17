import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

export default function CustomThemeProvider({ children }: { children: ReactNode }) {
  const customTheme = createTheme({
    palette: {
      primary: {
        main: '#171e21',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#101619',
        contrastText: '#ffffff',
      },
      accent: {
        text: '#3c879c',
        contrastText: '#ffffff',
      },
      background: {
        default: '#000000',
        paper: '#121212',
      },
      mode: 'dark',
    },
    components: {
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            color: '#ffffff',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          color: 'secondary',
          size: 'small',
          fullWidth: true,
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      {children}
    </ThemeProvider>
  );
}
