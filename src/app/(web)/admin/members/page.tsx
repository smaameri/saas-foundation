"use client";

import { MemberDetailsSheet } from "./_components/member-details-sheet";
import { MembersProvider } from "./_components/members-provider";
import { columns } from "./columns";
import { membersApi } from "@/services/api/admin/membersApi";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListMembersParams } from "@/app/api/admin/members/schema";

function MembersTable() {
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

  return <DataTable table={table} />;
}

export default function MembersPage() {
  return (
    <div className="mt-6">
      <MembersProvider>
        <MembersTable />
        <MemberDetailsSheet />
      </MembersProvider>
    </div>
  );
}
