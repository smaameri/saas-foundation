import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InviteUserModal } from "@/components/organizations/invite-user-modal";
import { OrgDetailTabs } from "@/components/organizations/org-detail-tabs";
import { ContentLayout } from "@/components/platform/content-layout";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Organization",
};

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [org, invitations] = await Promise.all([
    prisma.organization.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.invitation.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        expiresAt: true,
      },
    }),
  ]);

  if (!org) notFound();

  return (
    <ContentLayout
      title={org.name}
      description={`/${org.slug}`}
      actions={<InviteUserModal organizationId={org.id} />}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-6 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </p>
            <p className="mt-1 font-medium">{org.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Slug
            </p>
            <p className="mt-1 font-medium">{org.slug ?? "—"}</p>
          </div>
        </div>

        <OrgDetailTabs members={org.members} invitations={invitations} />
      </div>
    </ContentLayout>
  );
}
