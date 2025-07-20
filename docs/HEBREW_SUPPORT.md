# תמיכה בעברית ו-RTL

## סקירה כללית

Task Studio תומך כעת באופן מלא בעברית ובמצב RTL (ימין-שמאל). המערכת כוללת:

- **תרגומים מלאים** - כל הטקסטים בממשק תורגמו לעברית
- **תמיכה ב-RTL** - עיצוב מותאם לכיוון כתיבה מימין לשמאל
- **תאריכים בעברית** - תצוגת תאריכים בעברית עם שמות חודשים וימים
- **מספרים בעברית** - תמיכה במספרים עבריים (אותיות)
- **בחירת שפה** - ממשק לבחירת שפה בין עברית לאנגלית

## מבנה הקבצים

### תרגומים
```
lib/i18n/
├── config.ts              # הגדרות i18n
├── index.ts               # פונקציות עזר לתרגום
└── translations/
    ├── he.ts              # תרגומים לעברית
    └── en.ts              # תרגומים לאנגלית
```

### Hooks
```
hooks/
└── use-i18n.ts           # Hook לניהול i18n ו-RTL
```

### Providers
```
components/providers/
└── i18n-provider.tsx     # Provider ל-i18n
```

### כלי עזר
```
lib/
├── date-utils.ts         # כלי עזר לתאריכים בעברית
└── number-utils.ts       # כלי עזר למספרים בעברית
```

## שימוש במערכת

### הוספת תרגום חדש

1. **הוסף תרגום לעברית** ב-`lib/i18n/translations/he.ts`:
```typescript
export const heTranslations = {
   // ... existing translations
   newSection: {
      newKey: 'תרגום חדש',
   },
};
```

2. **הוסף תרגום לאנגלית** ב-`lib/i18n/translations/en.ts`:
```typescript
export const enTranslations = {
   // ... existing translations
   newSection: {
      newKey: 'New translation',
   },
};
```

### שימוש בתרגום ברכיב

```typescript
import { useI18nContext } from '@/components/providers/i18n-provider';

function MyComponent() {
   const { translate, isRTL, dir } = useI18nContext();
   
   return (
      <div dir={dir} className={isRTL ? 'rtl' : 'ltr'}>
         <h1>{translate('navigation.tasks')}</h1>
         <p>{translate('tasks.description')}</p>
      </div>
   );
}
```

### שימוש בתאריכים בעברית

```typescript
import { formatHebrewDate, formatHebrewDateTime } from '@/lib/date-utils';

const date = new Date();
const hebrewDate = formatHebrewDate(date); // "15 בינואר 2024"
const hebrewDateTime = formatHebrewDateTime(date); // "15 בינואר 2024 14:30"
```

### שימוש במספרים בעברית

```typescript
import { formatHebrewNumber, formatHebrewCurrency } from '@/lib/number-utils';

const number = 15;
const hebrewNumber = formatHebrewNumber(number); // "טו"
const currency = formatHebrewCurrency(1000); // "1,000 ₪"
```

## סגנונות RTL

### CSS Classes

המערכת כוללת classes מותאמות ל-RTL:

```css
.rtl {
   direction: rtl;
   text-align: right;
}

.rtl .text-left { text-align: right; }
.rtl .text-right { text-align: left; }
.rtl .ml-auto { margin-left: unset; margin-right: auto; }
.rtl .mr-auto { margin-right: unset; margin-left: auto; }
```

### שימוש ב-Tailwind

```typescript
import { useRTL } from '@/hooks/use-i18n';

function MyComponent() {
   const { textAlign, flexDirection, marginStart } = useRTL();
   
   return (
      <div className={`flex ${flexDirection} ${textAlign}`}>
         <span className={marginStart}>תוכן</span>
      </div>
   );
}
```

## בחירת שפה

רכיב `LanguageSelector` מאפשר למשתמשים לבחור שפה:

```typescript
import { LanguageSelector } from '@/components/ui/language-selector';

function Header() {
   return (
      <header>
         <LanguageSelector />
      </header>
   );
}
```

## URL Structure

המערכת תומכת ב-URLs עם שפה:

- `/he/tasks` - משימות בעברית
- `/en/tasks` - משימות באנגלית
- `/he/tags` - תגיות בעברית
- `/en/tags` - תגיות באנגלית

## תאריכים ומספרים

### תאריכים בעברית

- **חודשים**: ינואר, פברואר, מרץ, וכו'
- **ימים**: ראשון, שני, שלישי, וכו'
- **תבניות**: "15 בינואר 2024", "אתמול", "היום", "מחר"

### מספרים בעברית

- **מספרים קטנים**: א, ב, ג, ד, ה, ו, ז, ח, ט, י
- **מספרים גדולים**: יא, יב, יג, וכו'
- **מטבע**: ₪ עם תמיכה בפורמט ישראלי

## בדיקות

### בדיקת RTL

1. פתח את האפליקציה
2. בחר עברית מהתפריט
3. ודא שהטקסט מיושר לימין
4. ודא שהאלמנטים מסודרים נכון

### בדיקת תרגומים

1. החלף בין עברית לאנגלית
2. ודא שכל הטקסטים מתורגמים
3. ודא שהתאריכים והמספרים מוצגים נכון

## הרחבות עתידיות

- תמיכה בשפות נוספות
- תרגומים דינמיים מהשרת
- תמיכה בפורמטים נוספים של תאריכים
- תמיכה במספרים רומיים

## בעיות ידועות

- חלק מהרכיבים של צד שלישי לא תומכים ב-RTL
- תאריכים מורכבים עשויים לדרוש התאמות נוספות
- מספרים גדולים מאוד מוצגים בספרות ערביות

## תרומה

כדי להוסיף תמיכה בשפה חדשה:

1. הוסף את השפה ל-`i18nConfig`
2. צור קובץ תרגומים חדש
3. הוסף תמיכה ב-RTL אם נדרש
4. בדוק את התצוגה והפונקציונליות 