import type {Metadata} from "next";

import {ContentLayout} from "@/components/platform/content-layout";
import {AccountTabs} from "@/components/account/account-tabs";
import {fetchSession} from "@/lib/session";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const session = await fetchSession();

  const user = session?.user?.id
    ? await prisma.user.findUnique({
      where: {id: session.user.id},
      select: {firstName: true, lastName: true, image: true},
    })
    : null;

  return (
    <ContentLayout
      title="Account"
      description="Manage your profile and security settings."
    >
      <AccountTabs
        defaultFirstName={user?.firstName ?? ""}
        defaultLastName={user?.lastName ?? ""}
        defaultImage={user?.image ?? ""}
      />
    </ContentLayout>
  );
}
