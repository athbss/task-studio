'use client';

import AllIssues from '@/components/common/issues/all-issues';
import MainLayout from '@/components/layout/main-layout';
import { useParams } from 'next/navigation';

export default function TagIssuesPage() {
   const params = useParams();
   const tagName = params.tagName as string;

   return (
      <MainLayout>
         <AllIssues showAllTags={false} tagName={tagName} />
      </MainLayout>
   );
}
