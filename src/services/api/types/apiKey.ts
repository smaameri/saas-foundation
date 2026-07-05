export type ApiKey = {
  id: string;
  name: string | null;
  start: string | null;
  prefix: string | null;
  enabled: boolean | null;
  expiresAt: string | null;
  createdAt: string;
};

export type CreatedApiKey = ApiKey & {
  key: string;
};
