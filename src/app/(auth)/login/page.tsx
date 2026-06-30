import {redirect} from "next/navigation";

import {LoginForm} from "@/components/auth/login-form";
import {fetchSession} from "@/lib/session";

export default async function LoginPage() {
  const session = await fetchSession();

  if (session?.session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col bg-zinc-900 p-10 md:flex">
        <div className="text-white">
          <p className="mt-1 text-xl font-semibold">SaaS Foundation</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {new Date().getFullYear()} Inc.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start px-16 pt-[30vh] md:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mb-8 text-sm text-muted-foreground">Sign in to access your dashboard.</p>
          <LoginForm/>
        </div>
      </div>
    </div>
  );
}
