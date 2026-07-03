import { prisma } from "@/lib/prisma";
import type { SortOrder } from "@/repositories/types";

export async function listApiKeys(params?: { sort?: string; order?: SortOrder }) {
  return prisma.apikey.findMany({
    orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "desc" },
  });
}
