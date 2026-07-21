import type { User } from "@/types/user";

export type Member = {
  id: string;
  role: string;
  user: User;
  createdAt: string;
};
