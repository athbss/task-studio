import AllIssues from '@/components/common/issues/all-issues';
import Header from '@/components/layout/headers/issues/header';
import MainLayout from '@/components/layout/main-layout';

export default function IssuesPage() {
   return (
      <MainLayout header={<Header />}>
         <AllIssues showAllTags={true} />
      </MainLayout>
   );
}
