"use client";

import { columns } from "./columns";
import { membersApi } from "@/services/api/admin/membersApi";
import { DataTable } from "@/components/data-table/data-table";
import { ContentLayout } from "@/components/platform/content-layout";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListAllOrganizationMembersParams } from "@/app/api/admin/organizations/members/schema";

export default function UsersPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "organizations", "members"],
    queryFn: ({ sort, order, page, perPage, search, filters }) =>
      membersApi.listMembers({
        sort: sort as ListAllOrganizationMembersParams["sort"],
        order,
        page,
        perPage,
        search,
        organizationId: (filters?.organizationId as string[] | undefined) ?? undefined,
      }),
    columns,
  });

  return (
    <ContentLayout title="People" description="Manage organization members">
      <DataTable table={table} showSearch searchPlaceholder="Search by name or email..." />
    </ContentLayout>
  );
}
