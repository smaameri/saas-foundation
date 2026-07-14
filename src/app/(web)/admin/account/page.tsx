import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/session";
import { serializeUser } from "@/serializers/userSerializer";
import { ProfileForm } from "@/app/(web)/admin/account/profile-form";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await requireSession();

  return <ProfileForm user={serializeUser(session.user)} />;
}
