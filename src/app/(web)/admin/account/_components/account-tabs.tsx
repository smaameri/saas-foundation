"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "@/components/users/change-password-form";
import { AccountApiKeysTab } from "@/app/(web)/admin/account/_components/account-api-keys-tab";
import { ProfileForm } from "@/app/(web)/admin/account/_components/profile-form";

export function AccountTabs({
  defaultFirstName,
  defaultLastName,
  defaultImage,
}: {
  defaultFirstName: string;
  defaultLastName: string;
  defaultImage: string;
}) {
  return (
    <Tabs defaultValue="profile">
      <TabsList variant="line">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileForm
          defaultFirstName={defaultFirstName}
          defaultLastName={defaultLastName}
          defaultImage={defaultImage}
        />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <ChangePasswordForm />
      </TabsContent>

      <TabsContent value="api-keys" className="mt-6">
        <AccountApiKeysTab />
      </TabsContent>
    </Tabs>
  );
}
