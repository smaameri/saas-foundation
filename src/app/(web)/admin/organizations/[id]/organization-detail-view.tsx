"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/services/api/admin/organizationsApi";
import { ContentLayout } from "@/components/platform/content-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteOrganizationMemberModal } from "@/app/(web)/admin/organizations/[id]/_components/invitations/invite-organization-member-modal";
import { OrganizationInvitationsTable } from "@/app/(web)/admin/organizations/[id]/_components/invitations/organization-invitations-table";
import { OrganizationMembersTable } from "@/app/(web)/admin/organizations/[id]/_components/members/organization-members-table";
import { OrganizationSummary } from "@/app/(web)/admin/organizations/[id]/_components/organization-summary";

function LoadingState() {
  return (
    <ContentLayout title="Organization" backHref="/admin/organizations">
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </ContentLayout>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <ContentLayout title="Organization" backHref="/admin/organizations">
      <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">{message}</div>
    </ContentLayout>
  );
}

export function OrganizationDetailView({ organizationId }: { organizationId: string }) {
  const {
    data: organization,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "organizations", organizationId, "detail"],
    queryFn: () => organizationsApi.getOrganization(organizationId),
    enabled: Boolean(organizationId),
  });

  const inviteButton = useMemo(() => {
    if (!organization) return null;
    return <InviteOrganizationMemberModal organizationId={organization.id} />;
  }, [organization]);

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !organization) {
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
