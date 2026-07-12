import type { User } from "./user";

export type Member = {
  id: string;
  role: string;
  createdAt: string;
  user: User;
};
