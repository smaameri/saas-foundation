import { requireSession } from "@/lib/auth/session";
import { findById } from "@/repositories/admin/organizationRepository";
import { ContentLayout } from "@/components/platform/content-layout";

export default async function CustomerHomePage() {
  const session = await requireSession();
  const organizationId = session.session.activeOrganizationId;
  const organization = organizationId ? await findById(organizationId) : null;

  return (
    <ContentLayout
      title={organization ? organization.name : "Customer Portal"}
      description={
        organization
          ? `You are viewing the customer portal for ${organization?.name}.`
          : "Select an organization to continue."
      }
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        {organization ? (
          <p>Welcome back! Use the navigation to manage this organization&apos;s data.</p>
        ) : (
          <p>You do not have an active organization selected.</p>
        )}
      </div>
    </ContentLayout>
  );
}
