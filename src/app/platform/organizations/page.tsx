import type { Metadata } from "next";

import { ContentLayout } from "@/components/platform/content-layout";

export const metadata: Metadata = {
  title: "Organizations",
};

export default function OrganizationsPage() {
  return (
    <ContentLayout
      title="Organizations"
      description="Manage your organizations here."
    >
      <p className="text-sm text-muted-foreground">No organizations yet.</p>
    </ContentLayout>
  );
}
