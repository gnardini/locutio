import { SyncButton } from '@frontend/components/app/views/SyncButton';
import { Button, ButtonType } from '@frontend/components/common/Button';
import { Container } from '@frontend/components/common/Container';
import { Organization } from '@type/organization';
import { Tab } from '@type/tabs';
import { MembershipType } from '@type/user';
import React, { useState } from 'react';
import OrganizationSettingsModal from './modals/OrganizationSettingsModal';
import { LanguagesProgressList } from './views/LanguagesProgressList';

interface AppScreenProps {
  activeOrg: Organization;
  membershipType: MembershipType;
}

const AppScreen: React.FC<AppScreenProps> = ({ activeOrg, membershipType }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <Container activeTab={Tab.App} className="flex-1 px-6 pb-6 overflow-auto" showSideBar>
      <div className="max-w-[1000px] mx-auto mt-10 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{activeOrg.name}</h1>

        <div className="flex items-start gap-4">
          <Button type={ButtonType.Secondary} onClick={() => setShowSettingsModal(true)}>
            Organization Settings
          </Button>
          <OrganizationSettingsModal
            visible={showSettingsModal}
            closeModal={() => setShowSettingsModal(false)}
            organization={activeOrg}
          />

          <SyncButton organization={activeOrg} />
        </div>

        <LanguagesProgressList organization={activeOrg} />
      </div>
    </Container>
  );
};

export default AppScreen;
