"use client";

import { columns } from "../columns";
import { BanUserDialog } from "./ban-user-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { MemberDetailsSheet } from "./member-details-sheet";
import { MembersProvider } from "./members-provider";
import { UnbanUserDialog } from "./unban-user-dialog";
import { teamApi } from "@/services/api/admin/teamApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListTeamMembersParams } from "@/app/api/admin/team/members/schema";

function MembersTable() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "team"],
    queryFn: ({ sort, order, page, perPage, filters }) =>
      teamApi.listTeamMembers({
        sort: sort as ListTeamMembersParams["sort"],
        order,
        page,
        perPage,
        filters: filters as Record<string, string[]> | undefined,
      }),
    columns,
    initialFilters: [{ id: "status", value: ["active"] }],
  });

  return (
    <DataTable
      table={table}
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Banned", value: "banned" },
          ],
        },
      ]}
    />
  );
}

export function MembersPageClient({ currentUserId }: { currentUserId: string }) {
  return (
    <MembersProvider currentUserId={currentUserId}>
      <MembersTable />
      <MemberDetailsSheet />
      <ChangeRoleDialog />
      <BanUserDialog />
      <UnbanUserDialog />
      <DeleteUserDialog />
    </MembersProvider>
  );
}
