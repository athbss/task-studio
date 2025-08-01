export const heTranslations = {
   common: {
      loading: 'טוען...',
      error: 'שגיאה',
      success: 'הצלחה',
      cancel: 'ביטול',
      save: 'שמור',
      delete: 'מחק',
      edit: 'ערוך',
      add: 'הוסף',
      search: 'חיפוש',
      filter: 'סינון',
      clear: 'נקה',
      close: 'סגור',
      open: 'פתח',
      yes: 'כן',
      no: 'לא',
      all: 'הכל',
      none: 'ללא',
      unknown: 'לא ידוע',
   },
   navigation: {
      home: 'בית',
      tasks: 'משימות',
      tags: 'תגיות',
      projects: 'פרויקטים',
      settings: 'הגדרות',
      members: 'חברים',
      teams: 'צוותים',
   },
   tasks: {
      title: 'משימות',
      newTask: 'משימה חדשה',
      editTask: 'ערוך משימה',
      deleteTask: 'מחק משימה',
      taskDetails: 'פרטי משימה',
      subtasks: 'תת-משימות',
      dependencies: 'תלויות',
      assignee: 'אחראי',
      priority: 'עדיפות',
      status: 'סטטוס',
      labels: 'תגיות',
      dueDate: 'תאריך יעד',
      createdAt: 'נוצר ב',
      updatedAt: 'עודכן ב',
      description: 'תיאור',
      details: 'פרטים',
      testStrategy: 'אסטרטגיית בדיקה',
      complexity: 'מורכבות',
      rank: 'דירוג',
      cycle: 'מחזור',
   },
   status: {
      pending: 'ממתין',
      inProgress: 'בתהליך',
      done: 'הושלם',
      cancelled: 'בוטל',
      deferred: 'נדחה',
      review: 'בבדיקה',
   },
   priority: {
      low: 'נמוכה',
      medium: 'בינונית',
      high: 'גבוהה',
      urgent: 'דחופה',
   },
   tags: {
      title: 'תגיות',
      newTag: 'תגית חדשה',
      editTag: 'ערוך תגית',
      deleteTag: 'מחקגית',
      tagName: 'שם תגית',
      tagDescription: 'תיאור תגית',
      taskCount: 'מספר משימות',
      currentTag: 'תגית נוכחית',
      switchTag: 'החלף תגית',
   },
   projects: {
      title: 'פרויקטים',
      projectName: 'שם פרויקט',
      projectDescription: 'תיאור פרויקט',
      lastModified: 'שונה לאחרונה',
      taskCount: 'מספר משימות',
      activeTasks: 'משימות פעילות',
      completedTasks: 'משימות שהושלמו',
      noProjects: 'לא נמצאו פרויקטים',
      scanProjects: 'סרוק פרויקטים',
      addProject: 'הוסף פרויקט',
   },
   sync: {
      title: 'סנכרון',
      syncWith: 'סנכרון עם',
      notion: 'Notion',
      github: 'GitHub',
      trello: 'Trello',
      lastSync: 'סנכרון אחרון',
      syncNow: 'סנכרון עכשיו',
      syncSettings: 'הגדרות סנכרון',
      connected: 'מחובר',
      disconnected: 'מנותק',
      connecting: 'מתחבר...',
      syncError: 'שגיאת סנכרון',
   },
   settings: {
      title: 'הגדרות',
      language: 'שפה',
      theme: 'ערכת נושא',
      dark: 'כהה',
      light: 'בהירה',
      system: 'מערכת',
      notifications: 'התראות',
      autoSync: 'סנכרון אוטומטי',
      taskmasterPath: 'נתיב Task Master',
   },
   view: {
      list: 'רשימה',
      board: 'לוח',
      grid: 'רשת',
      compact: 'קומפקטי',
      detailed: 'מפורט',
   },
   filters: {
      title: 'סינון',
      status: 'סטטוס',
      priority: 'עדיפות',
      assignee: 'אחראי',
      labels: 'תגיות',
      dateRange: 'טווח תאריכים',
      active: 'פעיל',
      completed: 'הושלם',
      overdue: 'באיחור',
   },
   search: {
      placeholder: 'חיפוש במשימות...',
      noResults: 'לא נמצאו תוצאות',
      resultsCount: 'תוצאות',
   },
   errors: {
      networkError: 'שגיאת רשת',
      serverError: 'שגיאת שרת',
      notFound: 'לא נמצא',
      unauthorized: 'לא מורשה',
      forbidden: 'אסור',
      validationError: 'שגיאת אימות',
      unknownError: 'שגיאה לא ידועה',
   },
   messages: {
      taskCreated: 'משימה נוצרה בהצלחה',
      taskUpdated: 'משימה עודכנה בהצלחה',
      taskDeleted: 'משימה נמחקה בהצלחה',
      tagCreated: 'תגית נוצרה בהצלחה',
      tagUpdated: 'תגית עודכנה בהצלחה',
      tagDeleted: 'תגית נמחקה בהצלחה',
      syncStarted: 'סנכרון התחיל',
      syncCompleted: 'סנכרון הושלם',
      syncFailed: 'סנכרון נכשל',
   },
   time: {
      today: 'היום',
      yesterday: 'אתמול',
      tomorrow: 'מחר',
      thisWeek: 'השבוע',
      lastWeek: 'שבוע שעבר',
      nextWeek: 'שבוע הבא',
      thisMonth: 'החודש',
      lastMonth: 'חודש שעבר',
      nextMonth: 'חודש הבא',
   },
   numbers: {
      zero: 'אפס',
      one: 'אחת',
      two: 'שתיים',
      three: 'שלוש',
      four: 'ארבע',
      five: 'חמש',
      six: 'שש',
      seven: 'שבע',
      eight: 'שמונה',
      nine: 'תשע',
      ten: 'עשר',
   },
} as const; 