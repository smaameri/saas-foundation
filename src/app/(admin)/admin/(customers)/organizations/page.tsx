import type { Metadata } from "next";

import Link from "next/link";

import { AddOrganizationModal } from "@/components/organizations/add-organization-modal";
import { ContentLayout } from "@/components/platform/content-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listOrganizations } from "@/repositories/admin/organizationRepository";

export const metadata: Metadata = {
  title: "Organizations",
};

export default async function OrganizationsPage() {
  const organizations = await listOrganizations();

  return (
    <ContentLayout
      title="Organizations"
      description="Manage organizations on the platform."
      actions={<AddOrganizationModal />}
    >
      {organizations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No organizations yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/src/app/(admin)/admin/(customers)/organizations/${org.id}`}
                    className="hover:underline"
                  >
                    {org.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{org._count.members}</TableCell>
                <TableCell className="text-muted-foreground">{org.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </ContentLayout>
  );
}
