import { z } from "zod";
import { listSchema } from "@/app/api/schemas";

export const listAllOrganizationMembersSchema = listSchema.extend({
  search: z.string().optional(),
  sort: z.enum(["createdAt", "firstName", "lastName", "email"]).optional(),
  organizationIds: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .optional(),
  status: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    )
    .optional(),
});

export type ListAllOrganizationMembersParams = z.infer<typeof listAllOrganizationMembersSchema>;
