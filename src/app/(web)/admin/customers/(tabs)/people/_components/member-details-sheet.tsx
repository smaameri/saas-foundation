"use client";

import { useOrganizationMembers } from "./members-provider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserAvatar } from "@/components/users/user-avatar";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value ?? <span className="text-muted-foreground">—</span>}</span>
    </div>
  );
}

export function MemberDetailsSheet() {
  const { open, setOpen, currentRow } = useOrganizationMembers();

  if (!currentRow) return null;

  const user = currentRow;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name;

  return (
    <Sheet open={open === "view"} onOpenChange={(val) => !val && setOpen(null)}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                name: fullName,
                image: null,
              }}
              alt={fullName}
              className="h-12 w-12"
              fallbackClassName="text-lg font-semibold text-muted-foreground"
            />
            <div>
              <SheetTitle>{fullName}</SheetTitle>
              <SheetDescription>{user.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">Personal</h3>
            <DetailRow label="First name" value={user.firstName} />
            <DetailRow label="Last name" value={user.lastName} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow
              label="Status"
              value={
                user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )
              }
            />
            {user.banned && (
              <>
                <DetailRow label="Ban reason" value={user.banReason} />
                <DetailRow
                  label="Ban expires"
                  value={user.banExpires ? new Date(user.banExpires).toLocaleString() : null}
                />
              </>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">Admin role</h3>
            <span className="text-sm capitalize">
              {user.role ?? <span className="text-muted-foreground">—</span>}
            </span>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">Organizations</h3>
            {user.organizations.length === 0 ? (
              <span className="text-sm text-muted-foreground">No organizations.</span>
            ) : (
              <div className="flex flex-col gap-4">
                {user.organizations.map((membership) => (
                  <div key={membership.memberId} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{membership.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {membership.id}</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {membership.memberRole}
                      </Badge>
                    </div>
                    <DetailRow
                      label="Joined"
                      value={new Date(membership.joinedAt).toLocaleDateString()}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
