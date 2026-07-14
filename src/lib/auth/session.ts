import { headers } from "next/headers";
import type { Session, User } from "@generated/prisma/client";
import { auth } from "@/lib/auth/auth";

export type SessionResult = {
  user: User;
  session: Session;
} | null;

export async function fetchSession(): Promise<SessionResult> {
  try {
    const result = await auth.api.getSession({ headers: await headers() });

    if (!result || ("error" in result && result.error)) {
      return null;
    }

    return {
      user: result.user as User,
      session: result.session as Session,
    };
  } catch {
    return null;
  }
}
