import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizationDetailView } from "./organization-detail-view";
import { findById } from "@/repositories/admin/organizationRepository";
import { serializeOrganization } from "@/serializers/organizationSerializer";

export const metadata: Metadata = {
  title: "Organization",
};

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const organization = await findById(id);
  if (!organization) {
    notFound();
  }

  return <OrganizationDetailView organization={serializeOrganization(organization)} />;
}
