"use client";

import { columns } from "./columns";
import { invitationsApi } from "@/api/admin/invitationsApi";
import type { ListInvitationsParams } from "@/app/api/admin/invitations/schema";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";

export default function TeamInvitationsPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "invitations"],
    queryFn: ({ sort, order, page, perPage }) =>
      invitationsApi.listInvitations({
        sort: sort as ListInvitationsParams["sort"],
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
