import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc as defaultAdminRole,
  memberAc as defaultMemberRole,
  ownerAc as defaultOwnerRole,
  defaultStatements,
} from "better-auth/plugins/organization/access";

export const organizationAccessControl = createAccessControl({
  ...defaultStatements,
});

export const organizationOwnerRole = organizationAccessControl.newRole({
  ...defaultOwnerRole.statements,
});

export const organizationAdminRole = organizationAccessControl.newRole({
  ...defaultAdminRole.statements,
});

export const organizationMemberRole = organizationAccessControl.newRole({
  ...defaultMemberRole.statements,
});

export type OrganizationPermissions = {
  [
    K in keyof typeof organizationAccessControl.statements
  ]?: (typeof organizationAccessControl.statements)[K][number][];
};
