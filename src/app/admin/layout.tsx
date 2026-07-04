"use client";

import { usePathname } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { adminNavItems } from "@/lib/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  return (
    <AdminShell
      navItems={adminNavItems}
      homeHref="/admin/dashboard"
      brandLabel="ADMIN"
      roleLabel="Operations Admin"
      personName="Maya Rivera"
      initials="MR"
      accessLabel="Operational access"
    >
      {children}
    </AdminShell>
  );
}
