import { UserButton } from "@/components/app/user-button";
import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";

export async function HeaderUserButton() {
  const session = await fetchSession();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, role: true },
  });

  return (
    <UserButton
      name={user?.name ?? session.user.name ?? ""}
      email={user?.email ?? session.user.email ?? ""}
      role={user?.role}
      image={user?.image}
      compact
    />
  );
}
