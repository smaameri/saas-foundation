"use client";

import { columns } from "./columns";
import { invitationsApi } from "@/services/api/admin/invitationsApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListInvitationsParams } from "@/app/api/admin/invitations/schema";

export default function InvitationsPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "users", "invitations"],
    queryFn: ({ sort, order, page, perPage, filters }) =>
      invitationsApi.listInvitations({
        sort: sort as ListInvitationsParams["sort"],
        order,
        page,
        perPage,
        status: (filters?.status as string[] | undefined) ?? undefined,
        portals: (filters?.portal as ListInvitationsParams["portals"]) ?? undefined,
      }),
    columns,
    initialFilters: [{ id: "status", value: ["pending"] }],
  });

  return (
    <DataTable
      table={table}
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" },
            { label: "Canceled", value: "canceled" },
          ],
        },
        {
          columnId: "portal",
          title: "Portal",
          options: [
            { label: "Admin Portal", value: "admin" },
            { label: "Customer Portal", value: "customer" },
          ],
        },
      ]}
    />
  );
}
