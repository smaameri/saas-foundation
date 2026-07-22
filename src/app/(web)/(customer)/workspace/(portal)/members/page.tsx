import { ContentLayout } from "@/components/platform/content-layout";

export default function MembersPage() {
  return (
    <ContentLayout title="Members" description="Manage workspace access for your organization.">
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Member management tools will appear here in a future update.
        </p>
      </div>
    </ContentLayout>
  );
}
