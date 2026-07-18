export type OrganizationMemberUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  organizations: Array<{
    id: string;
    name: string;
    memberId: string;
    memberRole: string;
    joinedAt: string;
  }>;
};
