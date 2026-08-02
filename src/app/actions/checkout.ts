"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface CheckoutOrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  items: CheckoutOrderItem[];
  subtotal: number;
  paymentMethod: string;
  region: "nepal" | "international";
}

export async function placeOrderAction(payload: CheckoutPayload) {
  try {
    if (!payload.name?.trim() || !payload.email?.trim()) {
      return { success: false, error: "Name and email address are required." };
    }

    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: "Cart cannot be empty for order processing." };
    }

    // Recalculate order total server-side to prevent price manipulation
    const calculatedTotal = payload.items.reduce(
      (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
      0
    );

    const supabase = createAdminClient();
    const isNepal = payload.region === "nepal";
    const generatedCode = `AUR-${isNepal ? "NP" : "INT"}${Math.floor(10000 + Math.random() * 90000)}`;

    const orderRecord = {
      order_code: generatedCode,
      customer_name: payload.name.trim(),
      customer_email: payload.email.trim(),
      status: "Pending",
      total: calculatedTotal > 0 ? calculatedTotal : payload.subtotal,
      items: payload.items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        quantity: i.quantity,
        unit_price: i.unitPrice,
      })),
      shipping_address: `${payload.address || "Street Address"}, ${payload.city || ""}, ${payload.zip || ""}, ${payload.country || ""}`.replace(/(,\s*)+$/, ""),
      notes: `Payment via ${payload.paymentMethod.toUpperCase()} (${isNepal ? "Nepal Market" : "International"})`,
    };

    const { error } = await supabase.from("orders").insert([orderRecord]);

    if (error) {
      console.error("Server Action placeOrder error:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      orderCode: generatedCode,
      total: calculatedTotal > 0 ? calculatedTotal : payload.subtotal,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error occurred.";
    console.error("placeOrderAction exception:", err);
    return { success: false, error: message };
  }
}
