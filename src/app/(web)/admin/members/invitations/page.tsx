"use client";

import { columns } from "./columns";
import { invitationsApi } from "@/services/api/admin/invitationsApi";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListInvitationsParams } from "@/app/api/admin/invitations/schema";

export default function MembersInvitationsPage() {
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

  return <DataTable table={table} />;
}
