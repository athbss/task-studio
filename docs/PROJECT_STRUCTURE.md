# מבנה הפרויקט

## סקירה כללית

Task Studio הוא ממשק ווב מתקדם לניהול משימות AI. הפרויקט בנוי עם Next.js 15, TypeScript, ו-Tailwind CSS.

## מבנה התיקיות

```
task-studio/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── taskmaster/           # Task Master API endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── tasks/                    # Tasks page
│   ├── tags/                     # Tags page
│   ├── members/                  # Members page
│   └── settings/                 # Settings page
├── components/                    # React components
│   ├── common/                   # Shared components
│   │   ├── tasks/                # Task-related components
│   │   ├── tags/                 # Tag-related components
│   │   ├── members/              # Member-related components
│   │   └── teams/                # Team-related components
│   ├── layout/                   # Layout components
│   │   ├── headers/              # Header components
│   │   ├── sidebar/              # Sidebar components
│   │   └── main-layout.tsx       # Main layout wrapper
│   ├── providers/                # Context providers
│   │   ├── i18n-provider.tsx     # Internationalization provider
│   │   ├── query-provider.tsx    # TanStack Query provider
│   │   ├── nuqs-provider.tsx     # URL state provider
│   │   └── taskmaster-websocket-provider.tsx # WebSocket provider
│   └── ui/                       # UI components (shadcn/ui)
├── hooks/                        # Custom React hooks
│   ├── use-i18n.ts              # i18n and RTL hook
│   ├── use-taskmaster-queries.ts # Task Master data hooks
│   ├── use-taskmaster-websocket.ts # WebSocket hook
│   └── use-debounce.ts          # Debounce utility hook
├── lib/                          # Utility libraries
│   ├── i18n/                     # Internationalization
│   │   ├── config.ts             # i18n configuration
│   │   ├── index.ts              # i18n utilities
│   │   └── translations/         # Translation files
│   │       ├── he.ts             # Hebrew translations
│   │       └── en.ts             # English translations
│   ├── api/                      # API utilities
│   │   └── taskmaster.ts         # Task Master API client
│   ├── date-utils.ts             # Date formatting utilities
│   ├── number-utils.ts           # Number formatting utilities
│   ├── taskmaster-service.ts     # Task Master service
│   ├── taskmaster-constants.ts   # Task Master constants
│   ├── taskmaster-paths.ts       # Task Master path utilities
│   ├── websocket-server.ts       # WebSocket server utilities
│   └── utils.ts                  # General utilities
├── store/                        # State management (Zustand)
│   ├── create-task-store.ts      # Task creation store
│   ├── filter-store.ts           # Filter state store
│   ├── search-store.ts           # Search state store
│   ├── task-view-store.ts        # Task view state store
│   ├── taskmaster-store.ts       # Task Master state store
│   ├── tasks-store.ts            # Tasks state store
│   └── view-store.ts             # View state store
├── types/                        # TypeScript type definitions
│   ├── taskmaster.ts             # Task Master types
│   └── taskmaster-api.ts         # Task Master API types
├── mock-data/                    # Mock data for development
│   ├── tasks.ts                  # Mock tasks data
│   ├── tags.ts                   # Mock tags data
│   ├── teams.ts                  # Mock teams data
│   ├── users.ts                  # Mock users data
│   ├── priorities.tsx            # Mock priorities data
│   ├── status.tsx                # Mock status data
│   ├── labels.ts                 # Mock labels data
│   ├── cycles.ts                 # Mock cycles data
│   └── side-bar-nav.ts           # Mock navigation data
├── scripts/                      # Build and utility scripts
│   ├── ws.js                     # WebSocket server script
│   ├── ws.ts                     # WebSocket TypeScript version
│   └── prepare-package.js        # Package preparation script
├── docs/                         # Documentation
│   ├── HEBREW_SUPPORT.md         # Hebrew and RTL support guide
│   ├── CHANGELOG.md              # Project changelog
│   └── PROJECT_STRUCTURE.md      # This file
├── public/                       # Static assets
│   └── images/                   # Image assets
├── bin/                          # Binary files
│   └── index.js                  # Main binary
├── utils/                        # Utility functions
│   └── filesystem.ts             # File system utilities
├── standalone-server.js          # Standalone server
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
├── pnpm-lock.yaml               # Package lock file
├── README.md                     # Project readme
└── LICENSE.md                    # Project license
```

## תיאור הקבצים העיקריים

### App Router (app/)

- **layout.tsx** - Layout הראשי עם providers
- **page.tsx** - דף הבית
- **tasks/page.tsx** - דף המשימות
- **tags/page.tsx** - דף התגיות
- **api/taskmaster/** - API endpoints לשרת

### Components

#### Common Components (components/common/)
- **tasks/** - רכיבים לניהול משימות
- **tags/** - רכיבים לניהול תגיות
- **members/** - רכיבים לניהול חברים
- **teams/** - רכיבים לניהול צוותים

#### Layout Components (components/layout/)
- **headers/** - רכיבי headers שונים
- **sidebar/** - רכיבי sidebar
- **main-layout.tsx** - Layout הראשי

#### Providers (components/providers/)
- **i18n-provider.tsx** - Provider לתרגומים ו-RTL
- **query-provider.tsx** - Provider ל-TanStack Query
- **nuqs-provider.tsx** - Provider לניהול state ב-URL
- **taskmaster-websocket-provider.tsx** - Provider ל-WebSocket

#### UI Components (components/ui/)
רכיבי shadcn/ui מותאמים אישית

### Hooks (hooks/)

- **use-i18n.ts** - Hook לניהול תרגומים ו-RTL
- **use-taskmaster-queries.ts** - Hooks לנתוני Task Master
- **use-taskmaster-websocket.ts** - Hook ל-WebSocket
- **use-debounce.ts** - Hook ל-debounce

### Libraries (lib/)

#### i18n (lib/i18n/)
- **config.ts** - הגדרות i18n
- **index.ts** - פונקציות עזר לתרגום
- **translations/** - קבצי תרגומים

#### API (lib/api/)
- **taskmaster.ts** - לקוח API ל-Task Master

#### Utilities (lib/)
- **date-utils.ts** - כלי עזר לתאריכים בעברית
- **number-utils.ts** - כלי עזר למספרים בעברית
- **taskmaster-service.ts** - שירות Task Master
- **websocket-server.ts** - כלי עזר ל-WebSocket

### State Management (store/)

- **create-task-store.ts** - Store ליצירת משימות
- **filter-store.ts** - Store לסינון
- **search-store.ts** - Store לחיפוש
- **task-view-store.ts** - Store לתצוגת משימות
- **taskmaster-store.ts** - Store ל-Task Master
- **tasks-store.ts** - Store למשימות
- **view-store.ts** - Store לתצוגה

### Types (types/)

- **taskmaster.ts** - טיפוסים ל-Task Master
- **taskmaster-api.ts** - טיפוסים ל-API

### Mock Data (mock-data/)

נתונים מדומים לפיתוח ובדיקות

### Scripts (scripts/)

- **ws.js** - שרת WebSocket
- **prepare-package.js** - הכנת חבילה

### Documentation (docs/)

- **HEBREW_SUPPORT.md** - מדריך לתמיכה בעברית
- **CHANGELOG.md** - יומן שינויים
- **PROJECT_STRUCTURE.md** - תיעוד מבנה הפרויקט

## ארכיטקטורה

### שכבות

1. **UI Layer** - רכיבי React
2. **Logic Layer** - Hooks ו-Stores
3. **Data Layer** - API ו-WebSocket

### Providers

המערכת משתמשת ב-providers לניהול state:

```typescript
<I18nProvider>
   <NuqsProvider>
      <QueryProvider>
         <ThemeProvider>
            <TaskmasterWebSocketProvider>
               {children}
            </TaskmasterWebSocketProvider>
         </ThemeProvider>
      </QueryProvider>
   </NuqsProvider>
</I18nProvider>
```

### State Management

- **Zustand** - לניהול state מקומי
- **TanStack Query** - לניהול server state
- **nuqs** - לניהול state ב-URL

### Internationalization

- **i18n** - מערכת תרגומים
- **RTL** - תמיכה בימין-שמאל
- **תאריכים** - תמיכה בתאריכים עבריים
- **מספרים** - תמיכה במספרים עבריים

## פיתוח

### התקנה

```bash
npm install
# או
pnpm install
```

### הפעלה

```bash
npm run dev
# או
pnpm dev
```

### בנייה

```bash
npm run build
# או
pnpm build
```

### בדיקות

```bash
npm run lint
npm run type-check
```

## טכנולוגיות

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **WebSocket** - Real-time updates
- **date-fns** - Date manipulation
- **lucide-react** - Icons 