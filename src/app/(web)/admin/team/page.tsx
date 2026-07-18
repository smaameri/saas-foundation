"use client";

import { BanUserDialog } from "./_components/ban-user-dialog";
import { ChangeRoleDialog } from "./_components/change-role-dialog";
import { DeleteUserDialog } from "./_components/delete-user-dialog";
import { MemberDetailsSheet } from "./_components/member-details-sheet";
import { MembersProvider } from "./_components/members-provider";
import { UnbanUserDialog } from "./_components/unban-user-dialog";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { teamApi } from "@/services/api/admin/teamApi";
import { authApi } from "@/services/api/auth/authApi";
import { DataTable } from "@/components/data-table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { ListTeamMembersParams } from "@/app/api/admin/team/members/schema";

function MembersTable() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "team"],
    queryFn: ({ sort, order, page, perPage, filters }) =>
      teamApi.listTeamMembers({
        sort: sort as ListTeamMembersParams["sort"],
        order,
        page,
        perPage,
        filters,
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

export default function MembersPage() {
  const {
    data: session,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authApi.getSession(),
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load session.";
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">{message}</div>
    );
  }

  return (
    <MembersProvider currentUserId={session?.id ?? null}>
      <MembersTable />
      <MemberDetailsSheet />
      <ChangeRoleDialog />
      <BanUserDialog />
      <UnbanUserDialog />
      <DeleteUserDialog />
    </MembersProvider>
  );
}
