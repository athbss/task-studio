'use client';

import AllIssues from '@/components/common/issues/all-issues';
import Header from '@/components/layout/headers/issues/header';
import MainLayout from '@/components/layout/main-layout';
import { useParams } from 'next/navigation';

export default function TagIssuesPage() {
   const params = useParams();
   const tagName = params.tagName as string;

   return (
      <MainLayout header={<Header />}>
         <AllIssues showAllTags={false} tagName={tagName} />
      </MainLayout>
   );
}
