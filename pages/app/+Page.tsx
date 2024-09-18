import AppScreen from '@frontend/components/app/AppScreen';
import { AuthProvider } from '@frontend/context/AuthContext';
import { NotificationProvider } from '@frontend/context/NotificationContext';
import { AppData } from 'pages/app/+data';
import { useData } from 'vike-react/useData';

export default function Page() {
  const { organizations, activeOrg, membershipType, user } = useData<AppData>();

  return (
    <>
      <NotificationProvider>
        <AuthProvider user={user} organizations={organizations} activeOrg={activeOrg}>
          <AppScreen activeOrg={activeOrg} membershipType={membershipType} />
        </AuthProvider>
      </NotificationProvider>
    </>
  );
}
