import { Button, ButtonType } from '@frontend/components/common/Button';
import { Container } from '@frontend/components/common/Container';
import { AddProjectModal } from '@frontend/components/settings/modals/AddProjectModal';
import { GitHubRepo } from '@type/github';
import { Tab } from '@type/tabs';
import { useState } from 'react';

interface Props {
  repos: GitHubRepo[];
}

export function SettingsScreen({ repos }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container activeTab={Tab.Settings} showSideBar={true}>
      <h1>Settings</h1>
      <Button type={ButtonType.Primary} onClick={() => setIsModalOpen(true)} className="mt-4 p-3">
        Create project
      </Button>
      <AddProjectModal
        visible={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        repos={repos}
      />
    </Container>
  );
}
