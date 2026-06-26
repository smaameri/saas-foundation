import type { Metadata } from "next";

import { AccountTabs } from "@/components/account/account-tabs";
import { fetchSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const session = await fetchSession();

  return (
    <main className="flex flex-1 flex-col bg-background">
      <header className="flex items-center border-b px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm text-muted-foreground">Manage your profile and security settings.</p>
        </div>
      </header>

      <section className="flex flex-1 flex-col px-6 py-8">
        <AccountTabs
          defaultName={session?.user?.name ?? ""}
          defaultImage={session?.user?.image ?? ""}
        />
      </section>
    </main>
  );
}
