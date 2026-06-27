import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";
import { UserButton } from "@/components/app/user-button";

export async function HeaderUserButton() {
  const session = await fetchSession();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, platformRole: true },
  });

  return (
    <UserButton
      name={user?.name ?? session.user.name ?? ""}
      email={user?.email ?? session.user.email ?? ""}
      role={user?.platformRole}
      image={user?.image}
      compact
    />
  );
}
