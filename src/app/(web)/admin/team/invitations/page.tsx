"use client";

import { columns } from "./columns";
import { invitationsApi } from "@/services/api/admin/invitationsApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListAdminPortalInvitationsParams } from "@/app/api/admin/team/invitations/schema";

function InvitationsTable() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "team", "invitations"],
    queryFn: ({ sort, order, page, perPage }) =>
      invitationsApi.listAdminPortalInvitations({
        sort: sort as ListAdminPortalInvitationsParams["sort"],
        order,
        page,
        perPage,
      }),
    columns,
  });

  return <DataTable table={table} />;
}

export default function InvitationsPage() {
  return <InvitationsTable />;
}
