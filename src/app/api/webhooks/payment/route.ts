import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_code, provider, transaction_id, status } = body;

    if (!order_code || !provider) {
      return NextResponse.json(
        { error: "Missing required order_code or payment provider parameter." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify order exists
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_code, status")
      .eq("order_code", order_code)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: `Order code ${order_code} not found.` },
        { status: 404 }
      );
    }

    // Update payment authorization status
    const isSuccess = status === "SUCCESS" || status === "COMPLETED" || status === "paid";
    const newStatus = isSuccess ? "Processing" : "Payment_Failed";

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        notes: `Payment confirmed via ${provider.toUpperCase()} (TxID: ${transaction_id || "N/A"})`,
      })
      .eq("order_code", order_code);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update order status: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${order_code} payment status updated to ${newStatus}.`,
      provider,
      order_code,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal payment webhook server error." },
      { status: 500 }
    );
  }
}
