import { adminApiClient } from "@/services/api/client";
import type { UpdateMemberBody } from "@/app/api/admin/members/[id]/schema";
import type { ListOrganizationMembersParams } from "@/app/api/admin/members/schema";
import type { PaginationData } from "@/app/api/response";
import type { Member } from "@/types/member";

export const membersApi = {
  listMembers(
    params?: ListOrganizationMembersParams,
  ): Promise<{ data: Member[]; pagination: PaginationData }> {
    const filters: Record<string, string[]> = {};
    if (params?.status && params.status.length > 0) {
      filters.status = params.status;
    }

    return adminApiClient.getPaginated<Member>("/members", {
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
  },

  listOrganizationMembers(
    organizationId: string,
    params?: ListOrganizationMembersParams,
  ): Promise<{ data: Member[]; pagination: PaginationData }> {
    const filters: Record<string, string[]> = {};
    if (params?.status && params.status.length > 0) {
      filters.status = params.status;
    }
    if (organizationId) {
      filters.organizationIds = [organizationId];
    }

    return adminApiClient.getPaginated<Member>(`/members`, {
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
  },

  findMember(id: string): Promise<Member> {
    return adminApiClient.get<Member>(`/members/${id}`);
  },

  updateMember(id: string, body: UpdateMemberBody): Promise<Member> {
    return adminApiClient.patch<Member>(`/members/${id}`, body);
  },

  deleteMember(id: string): Promise<void> {
    return adminApiClient.delete(`/members/${id}`);
  },
};
