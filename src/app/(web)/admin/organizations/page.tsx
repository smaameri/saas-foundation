"use client";

import { organizationsApi } from "@/services/api/admin/organizationsApi";
import { DataTable } from "@/components/data-table/data-table";
import { AddOrganizationModal } from "@/components/organizations/add-organization-modal";
import { ContentLayout } from "@/components/platform/content-layout";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { columns } from "@/app/(web)/admin/organizations/columns";

export default function OrganizationsPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "organizations"],
    queryFn: (params) => organizationsApi.listOrganizations(params),
    columns,
  });

  return (
    <ContentLayout title="Organizations" description="Manage organizations and members">
      <div className="space-y-4">
        <div className="flex justify-end">
          <AddOrganizationModal />
        </div>
        <DataTable table={table} />
      </div>
    </ContentLayout>
  );
}
