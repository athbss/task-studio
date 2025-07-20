'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getI18nConfig, type Locale } from '@/lib/i18n/config';
import { t, getLocaleFromPathname, getPathnameWithLocale } from '@/lib/i18n/index';

export function useI18n() {
   const pathname = usePathname();
   const router = useRouter();
   const [locale, setLocale] = useState<Locale>('he');
   const [config, setConfig] = useState(getI18nConfig('he'));

   // Initialize locale from pathname
   useEffect(() => {
      const pathLocale = getLocaleFromPathname(pathname);
      setLocale(pathLocale);
      setConfig(getI18nConfig(pathLocale));
   }, [pathname]);

   // Change locale function
   const changeLocale = useCallback((newLocale: Locale) => {
      setLocale(newLocale);
      setConfig(getI18nConfig(newLocale));
      
      // Update URL with new locale
      const newPathname = getPathnameWithLocale(pathname, newLocale);
      router.push(newPathname);
   }, [pathname, router]);

   // Translation function
   const translate = useCallback((key: string): string => {
      return t(locale, key);
   }, [locale]);

   // RTL utilities
   const isRTL = config.rtl;
   const dir = config.dir;

   return {
      locale,
      config,
      translate,
      changeLocale,
      isRTL,
      dir,
   };
}

// Hook for RTL-specific utilities
export function useRTL() {
   const { isRTL, dir } = useI18n();
   
   const rtlClass = isRTL ? 'rtl' : 'ltr';
   const textAlign = isRTL ? 'text-right' : 'text-left';
   const flexDirection = isRTL ? 'flex-row-reverse' : 'flex-row';
   const marginStart = isRTL ? 'mr-auto' : 'ml-auto';
   const marginEnd = isRTL ? 'ml-auto' : 'mr-auto';
   const paddingStart = isRTL ? 'pr-4' : 'pl-4';
   const paddingEnd = isRTL ? 'pl-4' : 'pr-4';

   return {
      isRTL,
      dir,
      rtlClass,
      textAlign,
      flexDirection,
      marginStart,
      marginEnd,
      paddingStart,
      paddingEnd,
   };
} 