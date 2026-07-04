"use client";

import { usersApi } from "@/api/admin/usersApi";
import type { ListUsersParams } from "@/app/api/admin/users/schema";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { DataTable } from "@/components/connected-data-table/data-table";
import { columns } from "./columns";

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
