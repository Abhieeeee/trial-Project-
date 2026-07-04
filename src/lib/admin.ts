import {
  Activity,
  BarChart3,
  Boxes,
  ClipboardList,
  KeyRound,
  PackageCheck,
  Settings,
  ShieldCheck,
  ShoppingBag,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";

export const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/products", icon: Boxes },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: PackageCheck },
  { name: "My Access", href: "/admin/access", icon: KeyRound },
];

export const superAdminNavItems = [
  { name: "Command Center", href: "/super-admin/dashboard", icon: ShieldCheck },
  { name: "Sales & Finance", href: "/super-admin/sales", icon: WalletCards },
  { name: "All Orders", href: "/super-admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/super-admin/products", icon: Boxes },
  { name: "Customers", href: "/super-admin/customers", icon: Users },
  { name: "Inventory", href: "/super-admin/inventory", icon: PackageCheck },
  { name: "Staff", href: "/super-admin/admins", icon: UserCog },
  { name: "Permissions", href: "/super-admin/permissions", icon: KeyRound },
  { name: "Audit Log", href: "/super-admin/audit", icon: ClipboardList },
  { name: "System Settings", href: "/super-admin/settings", icon: Settings },
];

export const rolePermissions = [
  { area: "Orders", admin: "View and update fulfillment", superAdmin: "Full access, refunds, deletion" },
  { area: "Products", admin: "Create and edit catalog", superAdmin: "Full access and bulk deletion" },
  { area: "Inventory", admin: "Adjust stock and locations", superAdmin: "Full warehouse controls" },
  { area: "Customers", admin: "View and support customers", superAdmin: "Export, segment, suspend" },
  { area: "Sales & payouts", admin: "View sales summaries", superAdmin: "Payouts, tax, finance exports" },
  { area: "Staff & roles", admin: "No access", superAdmin: "Create, remove, assign permissions" },
  { area: "System settings", admin: "No access", superAdmin: "Full access" },
  { area: "Audit logs", admin: "Own activity only", superAdmin: "All staff and system activity" },
];

export const weeklySales = [
  { day: "Mon", value: 54, amount: "EUR 12.8K" },
  { day: "Tue", value: 68, amount: "EUR 16.2K" },
  { day: "Wed", value: 43, amount: "EUR 10.4K" },
  { day: "Thu", value: 82, amount: "EUR 19.6K" },
  { day: "Fri", value: 73, amount: "EUR 17.4K" },
  { day: "Sat", value: 96, amount: "EUR 23.1K" },
  { day: "Sun", value: 77, amount: "EUR 18.5K" },
];

export const operationalQueue = [
  { label: "Orders awaiting confirmation", count: 18, tone: "text-amber-300", icon: ShoppingBag },
  { label: "Shipments due today", count: 31, tone: "text-brand-sky", icon: PackageCheck },
  { label: "Low-stock variants", count: 7, tone: "text-red-400", icon: Activity },
  { label: "Open customer tickets", count: 12, tone: "text-violet-300", icon: Users },
];

export const staffMembers = [
  { name: "Emile Laurent", email: "emile@aurastreet.com", role: "Super Admin", status: "Active", lastSeen: "Now" },
  { name: "Maya Rivera", email: "maya@aurastreet.com", role: "Admin", status: "Active", lastSeen: "8 min ago" },
  { name: "Noah Williams", email: "noah@aurastreet.com", role: "Admin", status: "Active", lastSeen: "1 hour ago" },
  { name: "Iris Chen", email: "iris@aurastreet.com", role: "Admin", status: "Invited", lastSeen: "Invite pending" },
];

export const auditEvents = [
  { id: "AUD-1049", actor: "Emile Laurent", event: "Changed Admin inventory permission", target: "Maya Rivera", time: "Jul 04, 2026 09:42" },
  { id: "AUD-1048", actor: "Maya Rivera", event: "Updated order status to Shipped", target: "ORD-8923", time: "Jul 04, 2026 09:31" },
  { id: "AUD-1047", actor: "System", event: "Low-stock threshold triggered", target: "ASP-004 / M", time: "Jul 04, 2026 09:15" },
  { id: "AUD-1046", actor: "Emile Laurent", event: "Approved refund", target: "ORD-8914", time: "Jul 04, 2026 08:54" },
  { id: "AUD-1045", actor: "Noah Williams", event: "Edited product price", target: "ASH-001", time: "Jul 04, 2026 08:27" },
];
