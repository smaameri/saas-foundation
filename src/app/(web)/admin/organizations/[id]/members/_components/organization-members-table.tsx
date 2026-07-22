"use client";

import { memberColumns } from "./members-columns";
import { membersApi } from "@/services/api/admin/membersApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";

export function OrganizationMembersTable({ organizationId }: { organizationId: string }) {
  const { table } = useConnectedTable({
    queryKey: ["admin", "organizations", organizationId, "members"],
    queryFn: (params) => membersApi.listOrganizationMembers(organizationId, params),
    columns: memberColumns,
  });

  return <DataTable table={table} />;
}
