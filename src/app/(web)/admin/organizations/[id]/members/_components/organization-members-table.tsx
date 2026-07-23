"use client";

import { memberColumns } from "./members-columns";
import { membersApi } from "@/services/api/admin/membersApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";

const ROLE_FILTER_OPTIONS = [
  { label: "Member", value: "member" },
  { label: "Owner", value: "owner" },
  { label: "Admin", value: "admin" },
] as const;

export function OrganizationMembersTable({ organizationId }: { organizationId: string }) {
  const { table } = useConnectedTable({
    queryKey: ["admin", "organizations", organizationId, "members"],
    queryFn: (params) => membersApi.listOrganizationMembers(organizationId, params),
    columns: memberColumns,
  });

  return (
    <DataTable
      table={table}
      showSearch
      searchPlaceholder="Search by name or email..."
      filters={[
        {
          columnId: "role",
          title: "Role",
          options: Array.from(ROLE_FILTER_OPTIONS),
        },
      ]}
    />
  );
}
