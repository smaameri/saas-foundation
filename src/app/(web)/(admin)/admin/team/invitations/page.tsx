"use client";

import { invitationsApi } from "@/api/admin/invitationsApi";
import type { ListInvitationsParams } from "@/app/api/admin/invitations/schema";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { DataTable } from "@/components/connected-data-table/data-table";
import { columns } from "./columns";

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
