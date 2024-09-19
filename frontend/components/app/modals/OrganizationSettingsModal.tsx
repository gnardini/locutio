import React from 'react';
import { Modal } from '@frontend/components/common/Modal';
import { Organization } from '@type/organization';
import { ProjectDescriptionView } from '@frontend/components/app/views/ProjectDescriptionView';
import { ProjectConfigView } from '@frontend/components/app/views/ProjectConfigView';

interface OrganizationSettingsModalProps {
  visible: boolean;
  closeModal: () => void;
  organization: Organization;
}

const OrganizationSettingsModal: React.FC<OrganizationSettingsModalProps> = ({
  visible,
  closeModal,
  organization,
}) => {
  return (
    <Modal visible={visible} closeModal={closeModal} className="w-full max-w-4xl p-6">
      <h2 className="text-2xl font-bold mb-6">Organization Settings</h2>
      <div className="space-y-6">
        <ProjectDescriptionView organization={organization} />
        <ProjectConfigView organization={organization} />
      </div>
    </Modal>
  );
};

export default OrganizationSettingsModal;