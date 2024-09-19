import { ProjectConfigView } from '@frontend/components/app/views/ProjectConfigView';
import { ProjectDescriptionView } from '@frontend/components/app/views/ProjectDescriptionView';
import { Container } from '@frontend/components/common/Container';
import { Organization } from '@type/organization';
import { Tab } from '@type/tabs';
import React, { useState } from 'react';
import { Button, ButtonType } from '@frontend/components/common/Button';
import OrganizationSettingsModal from './modals/OrganizationSettingsModal';

interface AppScreenProps {
  activeOrg: Organization;
  membershipType: 'owner' | 'admin' | 'member';
}

const AppScreen: React.FC<AppScreenProps> = ({ activeOrg, membershipType }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <Container activeTab={Tab.App} className="flex-1 px-6 pb-6 overflow-auto" showSideBar>
      <div className="max-w-[1000px] mx-auto mt-10 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{activeOrg.name}</h1>
          <Button type={ButtonType.Secondary} onClick={() => setShowSettingsModal(true)}>
            Organization Settings
          </Button>
          <OrganizationSettingsModal
            visible={showSettingsModal}
            closeModal={() => setShowSettingsModal(false)}
            organization={activeOrg}
          />
        </div>
      </div>
    </Container>
  );
};

export default AppScreen;
