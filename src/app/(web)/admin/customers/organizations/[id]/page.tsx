import { redirect } from "next/navigation";

export default async function OrganizationDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/customers/organizations?organizationId=${id}`);
}
