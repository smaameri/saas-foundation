import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { fetchSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await fetchSession();

  if (!session?.data) {
    return <LoginForm />;
  }

  redirect("/dashboard");
}
