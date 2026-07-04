"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { superAdminNavItems } from "@/lib/admin";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      navItems={superAdminNavItems}
      homeHref="/super-admin/dashboard"
      brandLabel="SUPER"
      roleLabel="Super Admin"
      personName="Emile Laurent"
      initials="EL"
      accessLabel="All permissions"
    >
      {children}
    </AdminShell>
  );
}
