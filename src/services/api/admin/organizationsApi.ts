import { apiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type { Invitation } from "@/services/api/types/invitation";
import type {
  Organization,
  OrganizationDetail,
  OrganizationMember,
} from "@/services/api/types/organization";
import type { ListOrganizationInvitationsParams } from "@/app/api/admin/customers/organizations/[id]/invitations/schema";
import type { ListOrganizationMembersParams } from "@/app/api/admin/customers/organizations/[id]/members/schema";
import type { PaginationData } from "@/app/api/response";

export const organizationsApi = {
  listOrganizations(
    params?: ListParams,
  ): Promise<{ data: Organization[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Organization>("/admin/organizations", params);
  },

  getOrganization(id: string): Promise<OrganizationDetail> {
    return apiClient.get<OrganizationDetail>(`/admin/organizations/${id}`);
  },

  listOrganizationMembers(
    id: string,
    params?: ListParams & Partial<ListOrganizationMembersParams>,
  ): Promise<{ data: OrganizationMember[]; pagination: PaginationData }> {
    return apiClient.getPaginated<OrganizationMember>(`/admin/organizations/${id}/members`, {
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
    });
  },

  listOrganizationInvitations(
    id: string,
    params?: ListParams & Partial<ListOrganizationInvitationsParams>,
  ): Promise<{ data: Invitation[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Invitation>(`/admin/organizations/${id}/invitations`, {
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters:
        params?.filters ??
        (params?.status && params.status.length > 0 ? { status: params.status } : undefined),
    });
  },
};
