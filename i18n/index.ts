import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import jaTranslations from './locales/ja.json';
import enTranslations from './locales/en.json';
import viTranslations from './locales/vi.json';

const resources = {
  ja: {
    translation: jaTranslations,
  },
  en: {
    translation: enTranslations,
  },
  vi: {
    translation: viTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

export default i18n;