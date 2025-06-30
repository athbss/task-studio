import MainLayout from '@/components/layout/main-layout';
import Settings from '@/components/common/settings/settings';

export default function SettingsPage() {
   return (
      <MainLayout headersNumber={1}>
         <Settings />
      </MainLayout>
   );
}
