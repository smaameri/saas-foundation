import type { Metadata } from "next";

import { HeaderUserButton } from "@/components/app/header-user-button";
import { InviteUserForm } from "@/components/settings/invite-user-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage platform access for your team.</p>
        </div>
        <HeaderUserButton />
      </header>

      <section className="flex flex-1 flex-col gap-8 px-6 py-8">
        <InviteUserForm />
      </section>
    </main>
  );
}
