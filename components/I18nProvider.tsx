'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    setI18nInitialized(true);
  }, []);

  if (!i18nInitialized) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}