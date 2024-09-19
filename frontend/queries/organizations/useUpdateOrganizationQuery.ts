import { useQuery } from '@frontend/queries/useQuery';
import { updateOrganizationSchema } from '@backend/schemas/organization';
import { Organization } from '@type/organization';

type UpdateOrganizationInput = {
  id: string;
  name?: string;
  description?: string;
  baseLanguage?: string;
  inputFile?: string;
  outputFile?: string;
  languages?: string[];
  mainBranch?: string;
  lastCommit?: string;
};

type UpdateOrganizationOutput = {};

export const useUpdateOrganizationQuery = () => {
  return useQuery<UpdateOrganizationInput, UpdateOrganizationOutput>(
    'POST',
    '/api/organizations/update',
    updateOrganizationSchema
  );
};