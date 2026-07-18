"use client";

import Link from "next/link";
import { useMemo } from "react";
import { InviteOrganizationMemberModal } from "./_components/invite-organization-member-modal";
import { OrganizationInvitationsTable } from "./_components/organization-invitations-table";
import { OrganizationMembersTable } from "./_components/organization-members-table";
import { OrganizationSummary } from "./_components/organization-summary";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { organizationsApi } from "@/services/api/admin/organizationsApi";
import { ContentLayout } from "@/components/platform/content-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function LoadingState() {
  return (
    <ContentLayout title="Organization" description="Loading organization details...">
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </ContentLayout>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <ContentLayout title="Organization" description="Unable to load organization.">
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
    <ContentLayout
      title={
        <span className="flex items-center gap-2">
          <Link
            href="/admin/organizations"
            className="inline-flex items-center justify-center rounded-sm p-1 text-foreground transition-colors hover:text-foreground"
            aria-label="Back to organizations"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
            <span className="sr-only">Back to organizations</span>
          </Link>
          <span className="text-lg font-semibold text-foreground">{organization.name}</span>
        </span>
      }
      actions={inviteButton}
    >
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
