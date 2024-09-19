import { MembershipType } from '@type/user';

export interface Organization {
  id: string;
  name: string;
  githubRepo?: string;
  languages?: string[];
  description?: string;
  inputFile?: string;
  outputFile?: string;
  baseLanguage?: string;
  lastCommit?: string;
  mainBranch?: string;
  created_at: string;
  updated_at: string;
}

export interface OrgUser {
  id: string;
  organization_id: string;
  user_id: string;
  email: string;
  membership_type: MembershipType;
  created_at: string;
  updated_at: string;
}
