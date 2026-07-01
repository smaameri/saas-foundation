export type Organization = {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  metadata: string | null;
  portals: string[];
  createdAt: string;
  updatedAt: string;
};
