import type { Metadata } from "next";
import { AccountApiKeysTab } from "@/app/(web)/admin/account/_components/account-api-keys-tab";

export const metadata: Metadata = { title: "API Keys" };

export default function AccountApiKeysPage() {
  return <AccountApiKeysTab />;
}
