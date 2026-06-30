import { listAdminUsers } from "@/repositories/admin/adminOrganizationRepository";

import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";

interface TeamUsersPageProps {
  searchParams: Promise<{ sort?: string; order?: string }>;
}

export default async function TeamUsersPage({ searchParams }: TeamUsersPageProps) {
  const { sort, order } = await searchParams;
  const users = await listAdminUsers({ sort, order });

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={users} emptyMessage="No users yet." />
    </div>
  );
}
