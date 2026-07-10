import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

export const ac = createAccessControl({
  ...defaultStatements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"] as const,
});

export const owner = ac.newRole({
  ...ownerAc.statements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  apiKey: ["create", "read", "read:any", "update", "delete", "delete:any"],
});

export const member = ac.newRole({
  ...memberAc.statements,
  apiKey: ["create", "read", "update", "delete"],
});
