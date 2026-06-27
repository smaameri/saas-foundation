import type { Metadata } from "next";

import { ContentLayout } from "@/components/platform/content-layout";
import { AccountTabs } from "@/components/account/account-tabs";
import { fetchSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const session = await fetchSession();

  return (
    <ContentLayout
      title="Account"
      description="Manage your profile and security settings."
    >
      <AccountTabs
        defaultName={session?.user?.name ?? ""}
        defaultImage={session?.user?.image ?? ""}
      />
    </ContentLayout>
  );
}
