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
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type OrganizationDetail = {
  id: string;
  name: string;
  slug: string | null;
  createdAt: string;
  members: OrganizationMember[];
};
