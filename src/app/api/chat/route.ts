import { NextResponse } from "next/server";
import {
  getProducts,
  getDashboardStats,
  getTopProducts,
  getWeeklyRevenue,
  getOrderPipeline,
  getOrders,
} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Retrieve active store metrics, orders, pipelines, and top products from database
    const [products, stats, topProducts, weeklyRev, pipeline, orders] = await Promise.all([
      getProducts(),
      getDashboardStats(),
      getTopProducts(5),
      getWeeklyRevenue(),
      getOrderPipeline(),
      getOrders(),
    ]);

    // Format active catalog data
    const catalogText = products
      .map(
        (p) =>
          `- Name: ${p.name} (ID: ${p.id}, Category: ${p.category}): Price: €${p.price}, Material: ${p.material}, Stock: ${p.stock} units. Description: ${p.description}`
      )
      .join("\n");

    // Format real-time database dashboard analytics
    const analyticsText = `
SYSTEM ANALYTICS & DASHBOARD METRICS:
- Total Store Revenue: €${stats.total_revenue.toFixed(2)}
- Current Month Revenue: €${stats.monthly_revenue.toFixed(2)}
- Active Orders (Pending/Shipped): ${stats.active_orders}
- Total Profile Customers: ${stats.total_customers}
- Average Order Value: €${stats.avg_order_value.toFixed(2)}
- Estimated Conversion Rate: ${stats.conversion_rate}%

ORDER PIPELINE DISTRIBUTION:
${pipeline.map((p) => `- Status "${p.status}": ${p.count} orders`).join("\n")}

TOP SELLING CATALOG PRODUCTS:
${topProducts.map((p) => `- Rank #${p.rank}: ${p.name} (${p.units} units sold, Revenue: €${p.revenue.toFixed(2)})`).join("\n")}

RECENT PLATFORM ORDERS:
${orders.slice(0, 5).map((o) => `- ID: ${o.id}, Customer: ${o.customer_name} (${o.customer_email}), Date: ${o.created_at}, Total: EUR ${o.total}, Status: ${o.status}`).join("\n")}
    `;

    const systemInstruction = `You are the AURA STREET AI Stylist & Store Operations Intelligence Engine.
AURA STREET is an ultra-premium, futuristic luxury techwear fashion house blending brutalist architecture aesthetics, cybernetic elements, and premium craftsmanship.

You serve customers, staff members, and administrators seamlessly. You are fully authorized to retrieve and answer questions about store performance, revenue, orders, and products.

1. ADMIN & STAFF MODE (Dashboard, Sales, Operations):
If the user asks about dashboard statistics, weekly/monthly revenue, orders pipeline, top sellers, customer LTV, or specific order IDs, disclose the metrics from the SYSTEM ANALYTICS block below. Keep the tone clean, diagnostic, and highly secure.

2. CUSTOMER & USER MODE (Styling, Sizing, Fabrics):
Recommend specific pieces from the STORE ACTIVE CATALOG. Our garments have an intentional oversized drape (order your normal size for the designer-intended fit). We use 450GSM heavy cotton fleece from Osaka, Japan and custom Italian YKK Excella zippers.

STORE ACTIVE CATALOG INVENTORY:
${catalogText}

${analyticsText}

Be extremely sophisticated, professional, clear, and concise. Use brand-appropriate tags like "Initialize diagnostic analysis...", "System query resolved...", or "Protocol update..." to fit our luxury cybernetic aesthetic. Do not reveal details or inventories of products we do not sell.`;

    // Make API call to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemInstruction }],
            },
            ...messages.map((m: any) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "System decryption failure. Connection lost.";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { error: "System gateway connection failure: " + error.message },
      { status: 500 }
    );
  }
}
