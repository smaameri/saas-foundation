import { redirect } from "next/navigation";
import { CustomerDashboard } from "./_components/customer-dashboard";
import { requireSession } from "@/lib/auth/session";
import { findOrganizationById } from "@/repositories/customers/organizationRepository";
import { ContentLayout } from "@/components/platform/content-layout";

export default async function CustomerHomePage() {
  const session = await requireSession();
  const organizationId = session.session.activeOrganizationId!;
  const organization = await findOrganizationById(organizationId);
  if (!organization) {
    redirect("/workspace/no-organization");
  }

  return (
    <ContentLayout
      title={organization.name}
      description={`You are viewing the workspace for ${organization.name}.`}
    >
      <CustomerDashboard />
    </ContentLayout>
  );
}
