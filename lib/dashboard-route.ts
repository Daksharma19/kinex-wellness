import type { UserRole } from "@/lib/database.types";

export function dashboardPathForRole(role: UserRole | null | undefined): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "doctor":
      return "/dashboard/doctor";
    default:
      return "/dashboard/patient";
  }
}
