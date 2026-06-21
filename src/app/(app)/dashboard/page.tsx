import type {Metadata} from "next";

import {LogoutButton} from "@/components/dashboard/logout-button";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-end gap-3 border-b px-6 py-4">
        <LogoutButton />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          You&apos;re signed in!
        </h1>
        <p className="max-w-md text-muted-foreground">
          This is a placeholder dashboard. Replace it with your real app once you&apos;re ready.
        </p>
      </section>
    </main>
  );
}
