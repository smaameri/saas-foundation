import {headers} from "next/headers";

import {auth} from "@/lib/auth";

type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function fetchSession(): Promise<SessionResult | null> {
  try {
    const headerList = await headers();
    const result = await auth.api.getSession({
      headers: headerList,
    });

    if (!result || ("error" in result && result.error)) {
      return null;
    }

    return result;
  } catch (error) {
    return null;
  }
}
