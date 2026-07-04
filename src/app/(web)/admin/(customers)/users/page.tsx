"use client";

import { useQuery } from "@tanstack/react-query";
import { customerUsersApi } from "@/api/admin/customerUsersApi";
import type { ListCustomerUsersParams } from "@/app/api/admin/customer-users/schema";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { ContentLayout } from "@/components/platform/content-layout";
import { DataTable } from "@/components/connected-data-table/data-table";
import { InviteUserModal } from "@/components/users/invite-user-modal";
import { columns } from "./columns";

export default function UsersPage() {
  const { data: organizations = [] } = useQuery({
    queryKey: ["admin", "organizations"],
    queryFn: () => customerUsersApi.listOrganizations(),
  });

  const { table } = useConnectedTable({
    queryKey: ["admin", "customer-users"],
    queryFn: ({ sort, order, page, perPage }) =>
      customerUsersApi.listCustomerUsers({
        sort: sort as ListCustomerUsersParams["sort"],
        order,
        page,
        perPage,
      }),
    columns,
  });

  return (
    <ContentLayout
      title="Users"
      description="Manage users on the platform."
      actions={<InviteUserModal organizations={organizations} />}
    >
      <DataTable table={table} />
    </ContentLayout>
  );
}
