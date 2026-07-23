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
    const { messages, pathname, profile } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Retrieve active store metrics, products, and orders from database
    const [products, stats, topProducts, weeklyRev, pipeline, orders] = await Promise.all([
      getProducts().catch(() => []),
      getDashboardStats().catch(() => ({ total_revenue: 0, monthly_revenue: 0, active_orders: 0, total_customers: 0, avg_order_value: 0, conversion_rate: 0 })),
      getTopProducts(5).catch(() => []),
      getWeeklyRevenue().catch(() => []),
      getOrderPipeline().catch(() => []),
      getOrders().catch(() => []),
    ]);

    const userRole = profile?.role || "customer";
    const userName = profile?.name || "Guest";
    const currentPath = pathname || "/";

    // Format catalog data for AI context
    const catalogText = products.length > 0
      ? products
          .map(
            (p) =>
              `- ${p.name} (ID: ${p.id}, Category: ${p.category}): Price: €${p.price}, Material: ${p.material}, Stock: ${p.stock} units. ${p.description}`
          )
          .join("\n")
      : "No live products retrieved.";

    // Format analytics text for staff/admin users
    const analyticsText = (userRole === "admin" || userRole === "super_admin" || userRole === "staff")
      ? `
SYSTEM ANALYTICS & DASHBOARD METRICS (AUTHORIZED VIEW FOR ${userRole.toUpperCase()}):
- Total Store Revenue: €${stats.total_revenue.toFixed(2)}
- Current Month Revenue: €${stats.monthly_revenue.toFixed(2)}
- Active Orders (Pending/Shipped): ${stats.active_orders}
- Total Customers: ${stats.total_customers}
- Average Order Value: €${stats.avg_order_value.toFixed(2)}
- Top Selling Items: ${topProducts.map((p) => `${p.name} (${p.units} sold)`).join(", ")}
`
      : "";

    const systemInstruction = `You are AURA STYLIST, the official AI fashion consultant & operational intelligence engine for AURA STREET.
AURA STREET is an ultra-premium, futuristic luxury techwear fashion house blending brutalist architecture, cybernetic elements, and Japanese technical fabrics.

Your role:
1. Provide expert streetwear styling recommendations, outfit pairing ideas, and fabric details based on our catalog.
2. Answer sizing and fit questions (oversized boxy fits, recommend sizing up/down).
3. Help users navigate the store by referencing exact site paths.
4. For staff/admin users, answer operational questions about stock, revenue, and orders using provided telemetry data.

CURRENT USER CONTEXT:
- Name: ${userName}
- Role: ${userRole}
- Active Location: ${currentPath}

AURA STREET CATALOG:
${catalogText}
${analyticsText}

STORE DIRECTORY & LINKS:
- Shop All Catalog: /shop
- Hoodies & Outerwear: /shop?category=Hoodies
- Lookbook: /lookbook
- Sizing Guide: /sizing
- Cart Overview: /cart
- Customer Orders: /user-dashboard
- Operations Dashboard (Staff/Admin): /admin/dashboard
- Inventory Control (Admin): /admin/inventory

RULES:
- Maintain a sleek, futuristic, high-fashion, diagnostic tone (e.g. "Protocol initialized...", "Style analysis compiled...", "Recommendation generated...").
- Keep responses clear, beautifully formatted with markdown bullet points or bold text.
- If recommending a page, mention the path clearly (e.g. "Visit /shop to explore our Hoodies").
- Be helpful and enthusiastic about techwear fashion.`;

    // Attempt calling Gemini API with fallback endpoints
    if (apiKey && apiKey.length > 5) {
      const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

      for (const model of models) {
        try {
          const apiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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

          if (apiResponse.ok) {
            const data = await apiResponse.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              return NextResponse.json({ text: replyText });
            }
          }
        } catch (e) {
          console.warn(`Model ${model} failed, trying fallback...`);
        }
      }
    }

    // Intelligent Local Fallback Engine if API key is unconfigured or rate limited
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let fallbackReply = "";

    if (lastUserMessage.includes("outfit") || lastUserMessage.includes("recommend") || lastUserMessage.includes("style") || lastUserMessage.includes("look")) {
      const topHoodie = products.find((p) => p.category === "Hoodies") || products[0];
      const topPants = products.find((p) => p.category === "Pants") || products[1];
      fallbackReply = `SYSTEM ANALYSIS COMPLETE // RECOMMENDED TECHWEAR OUTFIT:\n\n` +
        `• **Top**: ${topHoodie?.name || "Cyber Oversized Hoodie"} (€${topHoodie?.price || 160})\n` +
        `• **Bottom**: ${topPants?.name || "Tactical Cargo Pants"} (€${topPants?.price || 180})\n\n` +
        `*Styling Tip*: Layer with Japanese techweave fabrics for a boxy cybernetic silhouette. Visit /shop to explore all items!`;
    } else if (lastUserMessage.includes("size") || lastUserMessage.includes("fit") || lastUserMessage.includes("sizing")) {
      fallbackReply = `FIT PROTOCOL INFORMATION:\n\n` +
        `• All AURA STREET apparel features an **oversized, boxy techwear cut**.\n` +
        `• For a true cyberpunk oversized silhouette, order your standard size.\n` +
        `• For a standard fitted look, order one size down.\n\n` +
        `Check our full interactive guide at /sizing.`;
    } else if (lastUserMessage.includes("fabric") || lastUserMessage.includes("material")) {
      fallbackReply = `MATERIAL & FABRIC SPECS:\n\n` +
        `• Constructed using 450 GSM Heavyweight Japanese Organic Cotton.\n` +
        `• Reinforced with DWR (Durable Water Repellent) stormproof coating.\n` +
        `• Designed for maximum durability, breathability, and structural drape.`;
    } else if (lastUserMessage.includes("order") || lastUserMessage.includes("ship") || lastUserMessage.includes("track")) {
      fallbackReply = `ORDER TELEMETRY DIRECTORY:\n\n` +
        `To view your active order dispatches and delivery timelines, visit your dashboard at /user-dashboard.\n\n` +
        `All orders are dispatched via express courier with real-time tracking code.`;
    } else if (lastUserMessage.includes("sales") || lastUserMessage.includes("revenue") || lastUserMessage.includes("admin")) {
      if (userRole === "admin" || userRole === "super_admin" || userRole === "staff") {
        fallbackReply = `ADMIN TELEMETRY STATUS:\n\n` +
          `• Gross Store Revenue: €${stats.total_revenue.toLocaleString()}\n` +
          `• Active Pipeline Orders: ${stats.active_orders}\n` +
          `• Total Customers: ${stats.total_customers}\n\n` +
          `Access full operations console at /admin/dashboard.`;
      } else {
        fallbackReply = `Access Restricted: Operations telemetry requires Administrative privileges. Please visit /admin/login.`;
      }
    } else {
      fallbackReply = `SYSTEM ONLINE // AURA STREET AI Stylist at your service.\n\n` +
        `I can assist you with:\n` +
        `• **Styling & Outfit Recommendations**\n` +
        `• **Sizing & Fabric Details**\n` +
        `• **Catalog Search** (Hoodies, Jackets, Pants, Accessories)\n` +
        `• **Order Tracking & Account Navigation**\n\n` +
        `How can I elevate your style today? (Explore our shop at /shop)`;
    }

    return NextResponse.json({ text: fallbackReply });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { text: "System gateway connection restored. Explore our catalog at /shop." },
      { status: 200 }
    );
  }
}
