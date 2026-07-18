export type Organization = {
  id: string;
  name: string;
  slug: string | null;
  memberCount: number;
  createdAt: string;
};

export type OrganizationMember = {
  id: string;
  role: string;
  platformRole: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
  };
};

export type OrganizationDetail = {
  id: string;
  name: string;
  slug: string | null;
  createdAt: string;
  memberCount: number;
  members: OrganizationMember[];
};
