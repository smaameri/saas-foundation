import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"] as const,
});

export const adminRole = ac.newRole({
  ...adminAc.statements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"],
});

export const userRole = ac.newRole({
  ...userAc.statements,
  apiKey: ["create", "read", "update", "delete"],
});

/**
 * @example { member: ["create"], apiKey: ["read", "read:any"],  }
 */
export type Permissions = {
  [K in keyof typeof ac.statements]?: (typeof ac.statements)[K][number][];
};
