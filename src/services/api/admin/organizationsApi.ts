import { adminApiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type {
  OrganizationDetail,
  OrganizationLegacy,
  OrganizationMember,
} from "@/services/api/types/organization";
import type { ListOrganizationInvitationsParams } from "@/app/api/admin/invitations/schema";
import type { ListOrganizationMembersParams } from "@/app/api/admin/organizations/[id]/members/schema";
import type { PaginationData } from "@/app/api/response";
import type { Invitation } from "@/types/invitation";

export const organizationsApi = {
  listOrganizations(
    params?: ListParams,
  ): Promise<{ data: OrganizationLegacy[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<OrganizationLegacy>("/organizations", params);
  },

  getOrganization(id: string): Promise<OrganizationDetail> {
    return adminApiClient.get<OrganizationDetail>(`/organizations/${id}`);
  },

  listOrganizationMembers(
    id: string,
    params?: ListParams & Partial<ListOrganizationMembersParams>,
  ): Promise<{ data: OrganizationMember[]; pagination: PaginationData }> {
    return adminApiClient.getPaginated<OrganizationMember>(`/organizations/${id}/members`, {
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
    return adminApiClient.getPaginated<Invitation>(`/organizations/${id}/invitations`, {
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
