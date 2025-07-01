import AllTasks from '@/components/common/tasks/all-tasks';
import MainLayout from '@/components/layout/main-layout';

export default function TasksPage() {
   return (
      <MainLayout>
         <AllTasks showAllTags={true} />
      </MainLayout>
   );
}
