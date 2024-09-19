import { NotificationProvider } from '@frontend/context/NotificationContext.jsx';

export default function Page() {
  return (
    <>
      <NotificationProvider>
        <p>You shoudn't be seeing this :) Something went wrong.</p>
      </NotificationProvider>
    </>
  );
}
