import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Product, DashboardStats } from "@/types/database";

// ── Dashboard Stats ──────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  const [ordersResult, customersResult] = await Promise.all([
    supabase.from("orders").select("total, status, created_at"),
    supabase.from("profiles").select("id", { count: "exact" }),
  ]);

  const orders = ordersResult.data ?? [];
  const activeOrders = orders.filter((o) => o.status === "Pending" || o.status === "Shipped");
  const delivered = orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = delivered.reduce((sum, o) => sum + Number(o.total), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = delivered
    .filter((o) => new Date(o.created_at) >= monthStart)
    .reduce((sum, o) => sum + Number(o.total), 0);

  const avgOrderValue = delivered.length > 0 ? totalRevenue / delivered.length : 0;

  return {
    total_revenue: totalRevenue,
    active_orders: activeOrders.length,
    total_customers: customersResult.count ?? 0,
    conversion_rate: 3.2, // placeholder until analytics events are tracked
    monthly_revenue: monthlyRevenue,
    avg_order_value: avgOrderValue,
  };
}

// ── Orders ───────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("getOrders error:", error); return []; }
  return data as Order[];
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

// ── Products ─────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) { console.error("getProducts error:", error); return []; }
  return data as Product[];
}

export async function getTopProducts(limit = 5) {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("items, total, status")
    .neq("status", "Cancelled");

  if (error || !orders) return [];

  // Aggregate product sales from JSONB items array
  const productMap: Record<string, { name: string; units: number; revenue: number }> = {};
  for (const order of orders) {
    const items = order.items as Array<{ product_name: string; quantity: number; unit_price: number }>;
    for (const item of items) {
      const key = item.product_name;
      if (!productMap[key]) productMap[key] = { name: key, units: 0, revenue: 0 };
      productMap[key].units += item.quantity;
      productMap[key].revenue += item.quantity * item.unit_price;
    }
  }

  return Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((p, i) => ({ rank: i + 1, ...p }));
}

// ── Weekly Revenue ────────────────────────────────────────────
export async function getWeeklyRevenue() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .neq("status", "Cancelled")
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error || !data) return [];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const map: Record<string, number> = {};
  for (const order of data) {
    const day = days[new Date(order.created_at).getDay()];
    map[day] = (map[day] ?? 0) + Number(order.total);
  }

  return days.map((d) => ({ day: d, value: map[d] ?? 0 }));
}

// ── Order Pipeline ────────────────────────────────────────────
export async function getOrderPipeline() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("orders_by_status").select("*");
  if (error || !data) return [];
  return data as Array<{ status: string; count: number }>;
}
