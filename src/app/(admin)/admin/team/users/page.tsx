import {DataTable} from "@/components/data-table/data-table";
import {columns} from "@/app/(admin)/admin/team/users/columns";
import {usersApi} from "@/api/admin/usersApi";

export default function TeamUsersPage() {
  return (
    <div className="mt-6">
      <DataTable
        columns={columns}
        fetcher={usersApi.listUsers}
        emptyMessage="No users yet."
      />
    </div>
  );
}
