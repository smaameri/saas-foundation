export type Invitation = {
  id: string;
  email: string;
  role: string;
  platformRole: string | null;
  status: string;
  createdAt: string;
  expiresAt: string;
};
