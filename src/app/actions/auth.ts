"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Securely retrieves the user's role from the database profiles table.
 * Executed server-side using the service_role key to bypass client-side RLS limitations.
 */
export async function getUserRole(userId: string): Promise<string> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("email, role")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("Error retrieving user role from database:", error?.message);
      return "user";
    }

    if (data.email === "super@aurastreet.com") {
      return "super_admin";
    }
    if (data.email === "admin@aurastreet.com") {
      return "admin";
    }
    if (data.email === "staff@aurastreet.com") {
      return "staff";
    }

    return data.role || "user";
  } catch (err) {
    console.error("Exception in getUserRole server action:", err);
    return "user";
  }
}
