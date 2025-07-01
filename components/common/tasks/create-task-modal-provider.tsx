'use client';

import { CreateNewTask } from '@/components/layout/sidebar/create-new-task';

export function CreateTaskModalProvider() {
   return (
      <div className="hidden">
         <CreateNewTask />
      </div>
   );
}
