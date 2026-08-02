export type UserRole = "super_admin" | "admin" | "staff" | "user";

export const SEED_EMAILS: Record<string, UserRole> = {
  "super@aurastreet.com": "super_admin",
  "admin@aurastreet.com": "admin",
  "staff@aurastreet.com": "staff",
};

export function resolveRole(email?: string | null, dbRole?: string | null): UserRole {
  if (email && SEED_EMAILS[email]) {
    return SEED_EMAILS[email];
  }
  if (dbRole === "super_admin" || dbRole === "admin" || dbRole === "staff" || dbRole === "user") {
    return dbRole;
  }
  return "user";
}
