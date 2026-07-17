"use client";

import { ChangeRoleDialog } from "./_components/change-role-dialog";
import { DeleteUserDialog } from "./_components/delete-user-dialog";
import { MemberDetailsSheet } from "./_components/member-details-sheet";
import { MembersProvider } from "./_components/members-provider";
import { columns } from "./columns";
import { teamApi } from "@/services/api/admin/teamApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { ListTeamMembersParams } from "@/app/api/admin/team/schema";

function MembersTable() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "team"],
    queryFn: ({ sort, order, page, perPage }) =>
      teamApi.listTeamMembers({
        sort: sort as ListTeamMembersParams["sort"],
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
    <MembersProvider>
      <MembersTable />
      <MemberDetailsSheet />
      <ChangeRoleDialog />
      <DeleteUserDialog />
    </MembersProvider>
  );
}
