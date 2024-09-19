import { Modal } from '@frontend/components/common/Modal';
import { useCreateOrgQuery } from '@frontend/queries/organizations/useCreateOrgQuery';
import { GitHubRepo } from '@type/github';
import React, { useEffect, useState } from 'react';
import { Button, ButtonType } from '../../common/Button';
import { Input } from '@frontend/components/common/Input';

interface Props {
  visible: boolean;
  closeModal: () => void;
  repos: GitHubRepo[];
}

export const AddProjectModal: React.FC<Props> = ({ visible, closeModal, repos }) => {
  const [search, setSearch] = useState('');
  const [description, setDescription] = useState('');
  const [filteredRepos, setFilteredRepos] = useState(repos);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const { execute: runQuery, loading, error } = useCreateOrgQuery();

  useEffect(() => {
    setFilteredRepos(
      repos.filter((repo) => repo.name.toLowerCase().includes(search.toLowerCase())),
    );
  }, [search, repos]);

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
  };

  const handleCreateProject = async () => {
    if (selectedRepo) {
      await runQuery({
        name: selectedRepo.name,
        description: description,
        baseLanguage: 'en',
        githubRepo: selectedRepo.name,
      });
      closeModal();
      window.location.reload();
    }
  };

  return (
    <Modal
      visible={visible}
      closeModal={closeModal}
      className="w-[500px] max-h-[80vh] overflow-auto"
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Add New Project</h2>
        <Input
          type="text"
          placeholder="Search repos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1 mb-4 rounded-lg outline-gray-400"
        />
        <textarea
          placeholder="Project description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-tertiary-background px-2 py-1 mb-4 rounded-lg outline-gray-400 resize-none"
          rows={3}
        />
        <div className="max-h-[400px] bg-gray-0 border border-gray-200 px-1 rounded-lg overflow-y-auto mb-4">
          {filteredRepos.map((repo) => {
            const isSelected = selectedRepo?.name === repo.name;
            return (
              <div
                key={repo.name}
                className={`flex flex-row items-center my-1 py-1 px-1 cursor-pointer w-full rounded-lg ${
                  isSelected ? 'bg-tertiary-background' : 'hover:bg-tertiary-background'
                }`}
                onClick={() => handleSelectRepo(repo)}
              >
                <img src={repo.logo} alt={repo.name} className="w-7 h-7 rounded-full" />
                <h2 className="ml-2">{repo.name}</h2>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end space-x-2">
          <Button type={ButtonType.Secondary} onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleCreateProject} loading={loading} disabled={!selectedRepo}>
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};
