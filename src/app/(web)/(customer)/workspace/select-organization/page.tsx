import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import { listUserOrganizations } from "@/repositories/customers/organizationRepository";
import { serializeOrganization } from "@/serializers/organizationSerializer";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { ContentLayout } from "@/components/platform/content-layout";

async function setActiveOrganization(formData: FormData) {
  "use server";

  const organizationId = formData.get("organizationId");
  const organizationSlug = formData.get("organizationSlug");

  await auth.api.setActiveOrganization({
    body: {
      organizationId: typeof organizationId === "string" ? organizationId : null,
      organizationSlug:
        typeof organizationSlug === "string" && organizationSlug.length > 0
          ? organizationSlug
          : undefined,
    },
    headers: await headers(),
  });

  redirect("/workspace");
}

export default async function SelectOrganizationPage() {
  const session = await requireSession();
  const organizations = await listUserOrganizations(session.user.id);

  if (organizations.length === 0) {
    redirect("/workspace/no-organization");
  }

  if (
    session.session.activeOrganizationId &&
    organizations.some((organization) => organization.id === session.session.activeOrganizationId)
  ) {
    redirect("/workspace");
  }

  const serializedOrganizations = organizations.map(serializeOrganization);

  return (
    <ContentLayout
      title="Choose an organization"
      description="Select the organization you would like to access."
    >
      <div className="grid gap-4">
        {serializedOrganizations.map((organization) => (
          <form
            key={organization.id}
            action={setActiveOrganization}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">{organization.name}</p>
              {organization.slug ? (
                <p className="text-sm text-muted-foreground">{organization.slug}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <input type="hidden" name="organizationId" value={organization.id} />
              <input type="hidden" name="organizationSlug" value={organization.slug ?? ""} />
              <PrimaryButton type="submit">Continue</PrimaryButton>
            </div>
          </form>
        ))}
      </div>
    </ContentLayout>
  );
}
