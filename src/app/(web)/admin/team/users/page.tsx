"use client";

import { columns } from "./columns";
import type { ListUsersParams } from "@/app/api/admin/users/schema";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { usersApi } from "@/services/api/admin/usersApi";

export default function TeamUsersPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "users"],
    queryFn: ({ sort, order, page, perPage }) =>
      usersApi.listUsers({
        sort: sort as ListUsersParams["sort"],
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
