import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import backend from 'i18next-http-backend';

const langFromLocalStorage = localStorage.getItem('lang');

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    defaultNS: 'common',
    ns: ['common'],
    lng: langFromLocalStorage,
    fallbackLng: 'lt',
    fallbackNS: 'common',
    load: 'languageOnly',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
