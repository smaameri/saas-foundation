import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";
import { ProfileForm } from "@/app/(web)/admin/account/_components/profile-form";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await fetchSession();

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true, lastName: true, image: true },
      })
    : null;

  return (
    <div className="mt-6">
      <ProfileForm
        defaultFirstName={user?.firstName ?? ""}
        defaultLastName={user?.lastName ?? ""}
        defaultImage={user?.image ?? ""}
      />
    </div>
  );
}
