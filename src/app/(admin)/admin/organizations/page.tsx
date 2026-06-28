import type { Metadata } from "next";

import { AddOrganizationModal } from "@/components/organizations/add-organization-modal";
import { ContentLayout } from "@/components/platform/content-layout";

export const metadata: Metadata = {
  title: "Organizations",
};

export default function OrganizationsPage() {
  return (
    <ContentLayout
      title="Organizations"
      description="Manage your organizations here."
      actions={<AddOrganizationModal />}
    >
      <p className="text-sm text-muted-foreground">No organizations yet.</p>
    </ContentLayout>
  );
}
