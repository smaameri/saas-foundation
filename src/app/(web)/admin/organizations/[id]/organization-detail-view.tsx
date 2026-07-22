"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/services/api/admin/organizationsApi";
import { ContentLayout } from "@/components/platform/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteOrganizationMemberModal } from "@/app/(web)/admin/organizations/[id]/_components/invitations/invite-organization-member-modal";
import { OrganizationInvitationsTable } from "@/app/(web)/admin/organizations/[id]/_components/invitations/organization-invitations-table";
import { OrganizationMembersTable } from "@/app/(web)/admin/organizations/[id]/_components/members/organization-members-table";
import { OrganizationSummary } from "@/app/(web)/admin/organizations/[id]/_components/organization-summary";
import type { Organization } from "@/types/organization";

function ErrorState({ message }: { message: string }) {
  return (
    <ContentLayout title="Organization" backHref="/admin/organizations">
      <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">{message}</div>
    </ContentLayout>
  );
}

export function OrganizationDetailView({
  organization: initialOrganization,
}: {
  organization: Organization;
}) {
  const organizationId = initialOrganization.id;
  const {
    data: organization = initialOrganization,
    isError,
    error,
  } = useQuery<Organization>({
    queryKey: ["admin", "organizations", organizationId, "detail"],
    queryFn: () => organizationsApi.getOrganization(organizationId),
    enabled: Boolean(organizationId),
    initialData: initialOrganization,
  });

  const inviteButton = useMemo(
    () => <InviteOrganizationMemberModal organizationId={organization.id} />,
    [organization.id],
  );

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Something went wrong. Please try again later.";
    return <ErrorState message={message} />;
  }

  return (
    <ContentLayout title={organization.name} actions={inviteButton} backHref="/admin/organizations">
      <div className="space-y-8">
        <OrganizationSummary organization={organization} />

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList variant="line">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <OrganizationMembersTable organizationId={organization.id} />
          </TabsContent>

          <TabsContent value="invitations">
            <OrganizationInvitationsTable organizationId={organization.id} />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
