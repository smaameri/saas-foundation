import { apiClient } from "@/services/api/client";
import type { Member } from "@/services/api/types/member";
import { ListTeamMembersParams } from "@/app/api/admin/team/schema";
import type { PaginationData } from "@/app/api/response";

export const teamApi = {
  listTeamMembers(
    params?: ListTeamMembersParams,
  ): Promise<{ data: Member[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Member>("/admin/team", params);
  },
};
