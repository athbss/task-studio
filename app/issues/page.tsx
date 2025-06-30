import AllIssues from '@/components/common/issues/all-issues';
import MainLayout from '@/components/layout/main-layout';

export default function IssuesPage() {
   return (
      <MainLayout>
         <AllIssues showAllTags={true} />
      </MainLayout>
   );
}
