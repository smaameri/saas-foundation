import { ContentLayout } from "@/components/platform/content-layout";

export default function OrganizationPage() {
  return (
    <ContentLayout
      title="Organization"
      description="Review the organization details for this workspace."
    >
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Organization profile information will surface here soon. For now, this page is a
          placeholder.
        </p>
      </div>
    </ContentLayout>
  );
}
