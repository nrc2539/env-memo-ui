export const Role = {
  OWNER: "OWNER",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

const ROLE_HIERARCHY: Role[] = [Role.OWNER, Role.EDITOR, Role.VIEWER];

export function getAvailableRoles(role: Role): Role[] {
  const index = ROLE_HIERARCHY.indexOf(role);
  return ROLE_HIERARCHY.slice(index);
}
