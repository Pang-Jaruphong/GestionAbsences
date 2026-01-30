export type Permission = "projects:read" | "projects:write";

export type UserRole = "admin" | "teacher" | "viewer";

// Mock permissions. Replace by auth/roles from API later.
export function getCurrentUserRole(): UserRole {
  return "admin";
}

export function hasPermission(permission: Permission): boolean {
  const role = getCurrentUserRole();
  if (role === "admin") return true;
  if (role === "teacher") return permission !== "projects:write" ? true : true;
  return permission === "projects:read";
}
