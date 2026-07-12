"use client";

import { columns } from "./columns";
import { membersApi } from "@/services/api/admin/membersApi";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListMembersParams } from "@/app/api/admin/members/schema";

export default function MembersPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "members"],
    queryFn: ({ sort, order, page, perPage }) =>
      membersApi.listMembers({
        sort: sort as ListMembersParams["sort"],
        order,
        page,
        perPage,
      }),
    columns,
  });

  return (
    <div className="mt-6">
      <DataTable table={table} />
    </div>
  );
}
