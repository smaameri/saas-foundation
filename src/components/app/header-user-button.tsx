import { fetchSession } from "@/lib/auth/session";
import { UserButton } from "@/components/app/user-button";

export async function HeaderUserButton() {
  const session = await fetchSession();
  if (!session?.user) return null;

  const { user } = session;

  return (
    <UserButton
      name={user.name ?? ""}
      email={user.email ?? ""}
      role={user.role}
      image={user.image}
      compact
    />
  );
}
