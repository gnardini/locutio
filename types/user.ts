export interface User {
  id: string;
  email: string;
  password?: string;
  last_access: string | null;
  active_org: string | null;
  created_at: string;
  updated_at: string;
}

export type MembershipType = 'owner' | 'admin' | 'member' | 'guest';
