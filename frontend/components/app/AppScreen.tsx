import { Container } from '@frontend/components/common/Container';
import { Organization } from '@type/organization';
import { Tab } from '@type/tabs';
import React from 'react';

interface AppScreenProps {
  activeOrg: Organization;
  membershipType: 'owner' | 'admin' | 'member';
}

const AppScreen: React.FC<AppScreenProps> = ({ activeOrg, membershipType }) => {
  return (
    <Container activeTab={Tab.App} className="flex-1 px-6 pb-6 overflow-auto">
      <div className="max-w-[1000px] mx-auto">
        <p>App</p>
      </div>
    </Container>
  );
};

export default AppScreen;
