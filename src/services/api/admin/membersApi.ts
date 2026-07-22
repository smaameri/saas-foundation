import { adminApiClient } from "@/services/api/client";
import type { OrganizationMemberUser } from "@/services/api/types/organizationMemberUser";
import type { UpdateMemberBody } from "@/app/api/admin/members/[memberId]/schema";
import type { ListOrganizationMembersParams } from "@/app/api/admin/members/schema";
import type { PaginationData } from "@/app/api/response";
import type { Member } from "@/types/member";

export const membersApi = {
  listMembers(
    params?: ListOrganizationMembersParams,
  ): Promise<{ data: OrganizationMemberUser[]; pagination: PaginationData }> {
    const filters: Record<string, string[]> = {};
    if (params?.status && params.status.length > 0) {
      filters.status = params.status;
    }

    return adminApiClient.getPaginated<OrganizationMemberUser>("/organizations/members", {
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
  },

  getMember(id: string): Promise<Member> {
    return adminApiClient.get<Member>(`/members/${id}`);
  },

  updateMember(id: string, body: UpdateMemberBody): Promise<Member> {
    return adminApiClient.patch<Member>(`/members/${id}`, body);
  },

  deleteMember(id: string): Promise<void> {
    return adminApiClient.delete(`/members/${id}`);
  },
};
