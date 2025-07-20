import { heTranslations } from './translations/he';
import { enTranslations } from './translations/en';
import { i18nConfig, type Locale } from './config';

export type Translations = typeof heTranslations;

const translations = {
   he: heTranslations,
   en: enTranslations,
} as const;

export function getTranslations(locale: Locale): any {
   return translations[locale] || translations.he;
}

export function t(locale: Locale, key: string): string {
   const trans = getTranslations(locale);
   const keys = key.split('.');
   let value: any = trans;

   for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
         value = value[k];
      } else {
         return key; // Return key if translation not found
      }
   }

   return typeof value === 'string' ? value : key;
}

export function getLocaleFromPathname(pathname: string): Locale {
   // Check if pathname starts with /he or /en
   if (pathname.startsWith('/he')) return 'he';
   if (pathname.startsWith('/en')) return 'en';
   
   // Default to Hebrew
   return 'he';
}

export function getPathnameWithLocale(pathname: string, locale: Locale): string {
   // Remove existing locale prefix if any
   const pathWithoutLocale = pathname.replace(/^\/(he|en)/, '');
   
   // Add new locale prefix
   return `/${locale}${pathWithoutLocale}`;
}

export { i18nConfig, translations };
export type { Locale }; 