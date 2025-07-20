import { format, formatDistance, formatRelative, isValid } from 'date-fns';
import { he, enUS } from 'date-fns/locale';

export interface DateConfig {
   locale: 'he' | 'en';
   rtl: boolean;
}

export function getDateLocale(config: DateConfig) {
   return config.locale === 'he' ? he : enUS;
}

export function formatDate(date: Date | string, config: DateConfig, formatStr: string = 'PP'): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'תאריך לא תקין';
   }

   const locale = getDateLocale(config);
   return format(dateObj, formatStr, { locale });
}

export function formatRelativeDate(date: Date | string, config: DateConfig): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'תאריך לא תקין';
   }

   const locale = getDateLocale(config);
   return formatRelative(dateObj, new Date(), { locale });
}

export function formatDistanceDate(date: Date | string, config: DateConfig): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'תאריך לא תקין';
   }

   const locale = getDateLocale(config);
   return formatDistance(dateObj, new Date(), { 
      locale,
      addSuffix: true 
   });
}

export function formatHebrewDate(date: Date | string): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'תאריך לא תקין';
   }

   const hebrewMonths = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
   ];

   const day = dateObj.getDate();
   const month = hebrewMonths[dateObj.getMonth()];
   const year = dateObj.getFullYear();

   return `${day} ב${month} ${year}`;
}

export function formatHebrewTime(date: Date | string): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'שעה לא תקינה';
   }

   const hours = dateObj.getHours().toString().padStart(2, '0');
   const minutes = dateObj.getMinutes().toString().padStart(2, '0');

   return `${hours}:${minutes}`;
}

export function formatHebrewDateTime(date: Date | string): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'תאריך ושעה לא תקינים';
   }

   return `${formatHebrewDate(dateObj)} ${formatHebrewTime(dateObj)}`;
}

export function getHebrewDayName(date: Date | string): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   
   if (!isValid(dateObj)) {
      return 'יום לא תקין';
   }

   const hebrewDays = [
      'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'
   ];

   return hebrewDays[dateObj.getDay()];
}

export function isToday(date: Date | string): boolean {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   const today = new Date();
   
   return dateObj.toDateString() === today.toDateString();
}

export function isYesterday(date: Date | string): boolean {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   
   return dateObj.toDateString() === yesterday.toDateString();
}

export function isTomorrow(date: Date | string): boolean {
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 1);
   
   return dateObj.toDateString() === tomorrow.toDateString();
} 