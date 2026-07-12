import { apiClient } from "@/services/api/client";
import type { Member } from "@/services/api/types/member";
import type { ListMembersParams } from "@/app/api/admin/members/schema";
import type { PaginationData } from "@/app/api/response";

export const membersApi = {
  listMembers(params?: ListMembersParams): Promise<{ data: Member[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Member>("/admin/members", params);
  },
};
