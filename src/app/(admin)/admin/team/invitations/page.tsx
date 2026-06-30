import {listAdminInvitations} from "@/repositories/admin/adminOrganizationRepository";
import {DataTable} from "@/components/data-table/data-table";

import {columns} from "./columns";

interface TeamInvitationsPageProps {
  searchParams: Promise<{ sort?: string; order?: string }>;
}

export default async function TeamInvitationsPage({searchParams}: TeamInvitationsPageProps) {
  const {sort, order} = await searchParams;
  const invitations = await listAdminInvitations({sort, order});

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={invitations} emptyMessage="No invitations sent yet."/>
    </div>
  );
}
