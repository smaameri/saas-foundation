import { adminApiClient } from "@/services/api/client";
import type { ListParams } from "@/services/api/listParams";
import type { UpdateMemberBody } from "@/app/api/admin/members/[id]/schema";
import type { ListOrganizationMembersParams } from "@/app/api/admin/members/schema";
import type { PaginationData } from "@/app/api/response";
import type { Member } from "@/types/member";

export const membersApi = {
  listMembers(
    params?: ListOrganizationMembersParams,
  ): Promise<{ data: Member[]; pagination: PaginationData }> {
    const filters: Partial<Record<string, string[]>> = {};

    if (params?.status && params.status.length > 0) {
      filters.status = params.status;
    }
    if (params?.organizationIds && params.organizationIds.length > 0) {
      filters.organizationIds = params.organizationIds;
    }
    if (params?.role && params.role.length > 0) {
      filters.role = params.role;
    }

    return adminApiClient.getPaginated<Member>("/members", {
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: toRequestFilters(filters),
    });
  },

  listOrganizationMembers(
    organizationId: string,
    params?: ListParams,
  ): Promise<{ data: Member[]; pagination: PaginationData }> {
    const filters = normalizeFilters(params?.filters);
    const existingOrgIds = filters.organizationIds ?? [];
    const mergedOrgIds = Array.from(
      new Set(
        [organizationId, ...existingOrgIds].filter((value): value is string => Boolean(value)),
      ),
    );
    if (mergedOrgIds.length > 0) {
      filters.organizationIds = mergedOrgIds;
    }

    return adminApiClient.getPaginated<Member>("/members", {
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      filters: toRequestFilters(filters),
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

function normalizeFilters(filters?: ListParams["filters"]): Partial<Record<string, string[]>> {
  if (!filters) return {};
  return Object.entries(filters).reduce<Partial<Record<string, string[]>>>((acc, [key, value]) => {
    const values = toStringArray(value);
    if (values && values.length > 0) {
      acc[key] = values;
    }
    return acc;
  }, {});
}

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => (item != null ? String(item).trim() : ""))
      .filter((item) => item.length > 0);
    return normalized.length > 0 ? normalized : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : undefined;
  }
  return undefined;
}

function toRequestFilters(
  filters: Partial<Record<string, string[]>>,
): Record<string, string[]> | undefined {
  const entries = Object.entries(filters).filter(([, values]) => values && values.length > 0) as [
    string,
    string[],
  ][];
  if (entries.length === 0) {
    return undefined;
  }
  return Object.fromEntries(entries);
}
