# Changelog

כל השינויים המשמעותיים בפרויקט יועדו בקובץ זה.

הפורמט מבוסס על [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
והפרויקט עוקב אחר [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **תמיכה מלאה בעברית ו-RTL**
  - מערכת i18n מלאה עם תמיכה בעברית ואנגלית
  - תרגומים מלאים לכל הטקסטים בממשק
  - תמיכה ב-RTL (ימין-שמאל) עם CSS מותאם
  - רכיב בחירת שפה עם LanguageSelector
  - כלי עזר לתאריכים בעברית (date-utils.ts)
  - כלי עזר למספרים בעברית (number-utils.ts)
  - תמיכה בתאריכים עבריים עם שמות חודשים וימים
  - תמיכה במספרים עבריים (אותיות)
  - תמיכה במטבע ישראלי (₪)
  - URL structure עם שפה (/he/, /en/)

### Changed
- **עדכון Layout הראשי**
  - הוספת I18nProvider ל-app/layout.tsx
  - שינוי ברירת מחדל לשפה עברית
  - הוספת תמיכה ב-RTL ב-HTML element

### Technical
- **הוספת קבצי תמיכה**
  - lib/i18n/config.ts - הגדרות i18n
  - lib/i18n/index.ts - פונקציות עזר לתרגום
  - lib/i18n/translations/he.ts - תרגומים לעברית
  - lib/i18n/translations/en.ts - תרגומים לאנגלית
  - hooks/use-i18n.ts - Hook לניהול i18n ו-RTL
  - components/providers/i18n-provider.tsx - Provider ל-i18n
  - components/ui/language-selector.tsx - רכיב בחירת שפה
  - lib/date-utils.ts - כלי עזר לתאריכים בעברית
  - lib/number-utils.ts - כלי עזר למספרים בעברית
  - docs/HEBREW_SUPPORT.md - תיעוד לתמיכה בעברית

### CSS
- **הוספת סגנונות RTL**
  - תמיכה ב-direction: rtl
  - התאמת margins ו-paddings ל-RTL
  - תמיכה ב-flex-direction: row-reverse
  - התאמת text-align ל-RTL
  - סגנונות מותאמים ל-inputs, dropdowns, modals
  - תמיכה ב-tables, forms, buttons, navigation

## [0.1.0] - 2024-01-15

### Added
- **בסיס הפרויקט**
  - Next.js 15 עם App Router
  - TypeScript עם טיפוסים חזקים
  - Tailwind CSS לעיצוב
  - shadcn/ui לרכיבי UI
  - Zustand לניהול state
  - TanStack Query לניהול data fetching
  - WebSocket לעדכונים בזמן אמת

### Features
- **ממשק לניהול משימות**
  - תצוגת משימות עם סינון וחיפוש
  - ניהול תגיות ופרויקטים
  - עריכת משימות עם subtasks
  - תמיכה ב-dependencies
  - מערכת התראות בזמן אמת

### Architecture
- **ארכיטקטורה מודולרית**
  - הפרדה בין UI, Logic ו-Data
  - Providers לניהול state
  - Hooks מותאמים אישית
  - API routes לשרת
  - WebSocket לסנכרון

## [0.0.1] - 2024-01-01

### Added
- **התחלת הפרויקט**
  - הגדרת Next.js
  - התקנת dependencies
  - הגדרת TypeScript
  - הגדרת Tailwind CSS
  - הגדרת ESLint
  - הגדרת Prettier 