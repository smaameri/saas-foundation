"use client";

import {DataTable} from "@/components/data-table/data-table";
import {columns} from "@/app/(web)/(admin)/admin/team/users/columns";
import {usersApi} from "@/api/admin/usersApi";
import type {ListUsersParams} from "@/app/api/admin/users/schema";

export default function TeamUsersPage() {
  return (
    <div className="mt-6">
      <DataTable
        columns={columns}
        fetcher={(params) => usersApi.listUsers(params as ListUsersParams)}
        emptyMessage="No users yet."
      />
    </div>
  );
}
