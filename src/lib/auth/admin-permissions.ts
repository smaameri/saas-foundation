import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc as defaultAdminRole,
  defaultStatements,
  userAc as defaultUserRole,
} from "better-auth/plugins/admin/access";

export const adminAccessControl = createAccessControl({
  ...defaultStatements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"] as const,
  organization: ["create", "update", "delete"] as const,
  member: ["create", "update", "delete"] as const,
  invitation: ["create", "cancel"] as const,
});

export const adminRole = adminAccessControl.newRole({
  ...defaultAdminRole.statements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"],
  organization: ["create", "update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
});

export const userRole = adminAccessControl.newRole({
  ...defaultUserRole.statements,
  apiKey: ["create", "read", "update", "delete"],
});

/**
 * @example { user: ["create"], apiKey: ["read", "read:any"],  }
 */
export type AdminPermissions = {
  [
    K in keyof typeof adminAccessControl.statements
  ]?: (typeof adminAccessControl.statements)[K][number][];
};
