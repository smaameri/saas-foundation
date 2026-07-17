import { apiClient } from "@/services/api/client";
import type { User } from "@/services/api/types/user";
import { ListTeamMembersParams } from "@/app/api/admin/team/schema";
import type { PaginationData } from "@/app/api/response";

export const teamApi = {
  listTeamMembers(
    params?: ListTeamMembersParams,
  ): Promise<{ data: User[]; pagination: PaginationData }> {
    return apiClient.getPaginated<User>("/admin/team", params);
  },
};
