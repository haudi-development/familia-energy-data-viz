import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import jaTranslations from './locales/ja.json';
import enTranslations from './locales/en.json';
import viTranslations from './locales/vi.json';

const resources = {
  ja: { translation: jaTranslations },
  en: { translation: enTranslations },
  vi: { translation: viTranslations },
};

if (typeof window !== 'undefined') {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ja',
      fallbackLng: 'ja',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;