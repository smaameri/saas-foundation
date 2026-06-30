import type {Metadata} from "next";

import {ContentLayout} from "@/components/platform/content-layout";
import {fetchSession} from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await fetchSession();
  const rawName = session?.user?.name ?? "";
  const userName = rawName
    ? rawName.split(/\s+/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
    : "there";

  return (
    <ContentLayout title={`Welcome back, ${userName}`}>
      {null}
    </ContentLayout>
  );
}
