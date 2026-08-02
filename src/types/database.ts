export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "super_admin" | "admin" | "staff" | "user";
export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type ProductCategory = "Hoodies" | "Jackets" | "Pants" | "Sneakers" | "Accessories";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  images: string[];
  material: string;
  colorways: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  product_id: string | null;
  order_id: string | null;
  metadata: Json;
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  active_orders: number;
  total_customers: number;
  conversion_rate: number;
  monthly_revenue: number;
  avg_order_value: number;
}
