import { CustomThemeProvider } from '@settings';
import { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
import Template from './routes';
import i18n from './i18n';

export default function App() {
  useEffect(() => {
    i18n.changeLanguage('lt');
  }, []);

  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      preventDuplicate
    >
      <CustomThemeProvider>
        <Template />
      </CustomThemeProvider>
    </SnackbarProvider>
  );
}
