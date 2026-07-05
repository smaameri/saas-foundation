"use client";

import { ProfileForm } from "@/components/account/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "@/components/users/change-password-form";

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
    </Tabs>
  );
}
