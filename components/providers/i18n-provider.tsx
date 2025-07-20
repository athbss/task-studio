'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { type Locale } from '@/lib/i18n/config';

interface I18nContextType {
   locale: Locale;
   translate: (key: string) => string;
   changeLocale: (locale: Locale) => void;
   isRTL: boolean;
   dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18nContext() {
   const context = useContext(I18nContext);
   if (!context) {
      throw new Error('useI18nContext must be used within I18nProvider');
   }
   return context;
}

interface I18nProviderProps {
   children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
   const i18n = useI18n();

   return (
      <I18nContext.Provider value={i18n}>
         <div dir={i18n.dir} className={i18n.isRTL ? 'rtl' : 'ltr'}>
            {children}
         </div>
      </I18nContext.Provider>
   );
} 