'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18nContext } from '@/components/providers/i18n-provider';
import { i18nConfig } from '@/lib/i18n/config';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
   const { locale, changeLocale, translate } = useI18nContext();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
               <Languages className="h-4 w-4" />
               <span className="sr-only">{translate('settings.language')}</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            {i18nConfig.locales.map((lang) => (
               <DropdownMenuItem
                  key={lang}
                  onClick={() => changeLocale(lang)}
                  className={locale === lang ? 'bg-accent' : ''}
               >
                  {i18nConfig.localeNames[lang]}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
} 