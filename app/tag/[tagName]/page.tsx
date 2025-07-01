'use client';

import AllTasks from '@/components/common/tasks/all-tasks';
import MainLayout from '@/components/layout/main-layout';
import { useParams } from 'next/navigation';

export default function TagTasksPage() {
   const params = useParams();
   const tagName = params.tagName as string;

   return (
      <MainLayout>
         <AllTasks showAllTags={false} tagName={tagName} />
      </MainLayout>
   );
}
