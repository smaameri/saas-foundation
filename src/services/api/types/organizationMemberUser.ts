export type OrganizationMemberUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string;
  email: string;
  role: string | null;
  createdAt: string;
  organizations: Array<{
    id: string;
    name: string;
  }>;
};
