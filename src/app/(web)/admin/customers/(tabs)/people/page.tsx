"use client";

import { BanUserDialog } from "./_components/ban-user-dialog";
import { ChangeRoleDialog } from "./_components/change-role-dialog";
import { DeleteUserDialog } from "./_components/delete-user-dialog";
import { MemberDetailsSheet } from "./_components/member-details-sheet";
import { MembersProvider } from "./_components/members-provider";
import { UnbanUserDialog } from "./_components/unban-user-dialog";
import { columns } from "./columns";
import { membersApi } from "@/services/api/admin/membersApi";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import type { ListAllOrganizationMembersParams } from "@/app/api/admin/organizations/members/schema";

export default function CustomersPeoplePage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "organizations", "members"],
    queryFn: ({ sort, order, page, perPage, search, filters }) =>
      membersApi.listMembers({
        sort: sort as ListAllOrganizationMembersParams["sort"],
        order,
        page,
        perPage,
        search,
        organizationId: (filters?.organizationId as string[] | undefined) ?? undefined,
      }),
    columns,
    initialFilters: [{ id: "status", value: ["active"] }],
  });

  return (
    <MembersProvider>
      <DataTable
        table={table}
        showSearch
        searchPlaceholder="Search by name or email..."
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
      <MemberDetailsSheet />
      <ChangeRoleDialog />
      <BanUserDialog />
      <UnbanUserDialog />
      <DeleteUserDialog />
    </MembersProvider>
  );
}
