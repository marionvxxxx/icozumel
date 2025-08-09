'use client';

import { useContext } from 'react';
import { I18nContext } from './provider';
import { translations, type NestedTranslationKey } from './translations';

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const { locale, setLocale } = context;

  const t = (key: NestedTranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[locale as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return {
    t,
    locale,
    setLocale,
  };
}