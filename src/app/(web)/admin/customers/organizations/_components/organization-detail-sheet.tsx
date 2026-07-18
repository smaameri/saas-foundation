"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { InviteOrganizationMemberModal } from "./invite-organization-member-modal";
import { OrganizationInvitationsTable } from "./organization-invitations-table";
import { OrganizationMembersTable } from "./organization-members-table";
import { OrganizationSummary } from "./organization-summary";
import { useOrganizations } from "./organizations-provider";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { organizationsApi } from "@/services/api/admin/organizationsApi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrganizationDetailSheet() {
  const { open, setOpen, currentOrganizationId, setCurrentOrganizationId } = useOrganizations();
  const isOpen = open === "details" && currentOrganizationId !== null;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: organization,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "organizations", currentOrganizationId, "detail"],
    queryFn: () => organizationsApi.getOrganization(currentOrganizationId ?? ""),
    enabled: isOpen,
  });

  useEffect(() => {
    const requestedId = searchParams.get("organizationId");
    if (requestedId && requestedId !== currentOrganizationId) {
      setCurrentOrganizationId(requestedId);
      setOpen("details");
    }
  }, [searchParams, currentOrganizationId, setCurrentOrganizationId, setOpen]);

  const inviteButton = useMemo(() => {
    if (!organization) return null;
    return <InviteOrganizationMemberModal organizationId={organization.id} />;
  }, [organization]);

  const clearQueryParam = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("organizationId");
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setOpen(null);
      setCurrentOrganizationId(null);
      clearQueryParam();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-4xl">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="inline-flex items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Back to organizations"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="flex flex-col">
              <SheetTitle>{organization?.name ?? "Organization"}</SheetTitle>
              <SheetDescription>
                View organization details, members, and invitations.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          {isPending ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : isError || !organization ? (
            <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">
              {error instanceof Error ? error.message : "Unable to load organization."}
            </div>
          ) : (
            <>
              <OrganizationSummary organization={organization} />

              <div className="flex justify-end">{inviteButton}</div>

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
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
