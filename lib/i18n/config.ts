export const i18nConfig = {
   defaultLocale: 'he',
   locales: ['he', 'en'] as const,
   localeNames: {
      he: 'עברית',
      en: 'English',
   },
   rtl: {
      he: true,
      en: false,
   },
} as const;

export type Locale = typeof i18nConfig.locales[number];

export interface I18nConfig {
   locale: Locale;
   rtl: boolean;
   dir: 'rtl' | 'ltr';
}

export function getI18nConfig(locale: Locale): I18nConfig {
   return {
      locale,
      rtl: i18nConfig.rtl[locale],
      dir: i18nConfig.rtl[locale] ? 'rtl' : 'ltr',
   };
} 