import type { OrganizationDetail } from "@/services/api/types/organization";

const DETAILS: Array<{ label: string; getValue: (org: OrganizationDetail) => string }> = [
  {
    label: "Slug",
    getValue: (org) => org.slug ?? "—",
  },
  {
    label: "Created",
    getValue: (org) => new Date(org.createdAt).toLocaleDateString(),
  },
  {
    label: "Members",
    getValue: (org) => String(org.memberCount),
  },
];

export function OrganizationSummary({ organization }: { organization: OrganizationDetail }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted-foreground">
        Manage members and invitations for{" "}
        <span className="font-medium text-foreground">{organization.name}</span>.
      </p>
      <dl className="space-y-2">
        {DETAILS.map(({ label, getValue }) => (
          <div key={label} className="flex items-center gap-2">
            <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm text-foreground">{getValue(organization)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
