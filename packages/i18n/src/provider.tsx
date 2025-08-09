'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'es';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function I18nProvider({ children, defaultLocale = 'es' }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      setLocale('es');
    } else {
      setLocale('en');
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}