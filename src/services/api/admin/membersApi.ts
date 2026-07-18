import { apiClient } from "@/services/api/client";
import type { Member } from "@/services/api/types/member";
import type { OrganizationMemberUser } from "@/services/api/types/organizationMemberUser";
import type { UpdateMemberBody } from "@/app/api/admin/members/[id]/schema";
import type { ListAllOrganizationMembersParams } from "@/app/api/admin/organizations/members/schema";
import type { PaginationData } from "@/app/api/response";

export const membersApi = {
  listMembers(
    params?: ListAllOrganizationMembersParams,
  ): Promise<{ data: OrganizationMemberUser[]; pagination: PaginationData }> {
    return apiClient.getPaginated<OrganizationMemberUser>("/admin/organizations/members", {
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters:
        params?.organizationId && params.organizationId.length > 0
          ? { organizationId: params.organizationId }
          : undefined,
    });
  },

  getMember(id: string): Promise<Member> {
    return apiClient.get<Member>(`/admin/members/${id}`);
  },

  updateMember(id: string, body: UpdateMemberBody): Promise<Member> {
    return apiClient.patch<Member>(`/admin/members/${id}`, body);
  },
};
