import type { Organization } from "./organization";

export type User = {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
  organizations: Organization[];
};
