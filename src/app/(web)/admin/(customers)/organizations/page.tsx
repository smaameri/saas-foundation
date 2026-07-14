"use client";

import { organizationsApi } from "@/services/api/admin/organizationsApi";
import { DataTable } from "@/components/data-table/data-table";
import { ContentLayout } from "@/components/platform/content-layout";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { columns } from "@/app/(web)/admin/(customers)/organizations/columns";

export default function OrganizationsPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "organizations"],
    queryFn: (params) => organizationsApi.listOrganizations(params),
    columns,
  });

  return (
    <ContentLayout title="Organizations" description="Manage organizations on the platform.">
      <DataTable table={table} />
    </ContentLayout>
  );
}
