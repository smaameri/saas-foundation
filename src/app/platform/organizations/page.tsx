import type { Metadata } from "next";

import { HeaderUserButton } from "@/components/app/header-user-button";

export const metadata: Metadata = {
  title: "Organizations",
};

export default function OrganizationsPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground">Manage your organizations here.</p>
        </div>
        <HeaderUserButton />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center text-sm text-muted-foreground">
        <p>No organizations yet.</p>
        <p>Create one to get started.</p>
      </section>
    </main>
  );
}
