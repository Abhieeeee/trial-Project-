import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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
    const { messages, pathname } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Verify caller session server-side via Supabase Auth
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    let userRole = "customer";
    let userName = "Guest";

    if (user) {
      userName = user.user_metadata?.name || user.email || "Member";
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .single();

      if (profile) {
        userRole = profile.role || "customer";
        userName = profile.name || userName;
      }
    }

    const currentPath = pathname || "/";
    const isAuthorizedStaff = userRole === "admin" || userRole === "super_admin" || userRole === "staff";

    // Retrieve active store metrics, products, and orders from database
    const [products, stats, topProducts] = await Promise.all([
      getProducts().catch(() => []),
      isAuthorizedStaff
        ? getDashboardStats().catch(() => ({ total_revenue: 0, monthly_revenue: 0, active_orders: 0, total_customers: 0, avg_order_value: 0, conversion_rate: 0 }))
        : Promise.resolve(null),
      isAuthorizedStaff ? getTopProducts(5).catch(() => []) : Promise.resolve([]),
    ]);

    // Format catalog data for AI context
    const catalogText = products.length > 0
      ? products
          .map(
            (p) =>
              `- ${p.name} (ID: ${p.id}, Category: ${p.category}): Price: €${p.price}, Material: ${p.material}, Stock: ${p.stock} units. ${p.description}`
          )
          .join("\n")
      : "No live products retrieved.";

    // Format financial analytics text strictly if caller session is authorized staff/admin
    const analyticsText = (isAuthorizedStaff && stats)
      ? `
SYSTEM ANALYTICS & DASHBOARD METRICS (VERIFIED AUTHORIZED SESSION FOR ${userRole.toUpperCase()}):
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

GUIDELINES FOR RESPONSE:
- Keep answers concise, highly stylish, professional, and formatted in clean markdown.
- Suggest direct navigation paths when relevant (e.g. [Go to /shop], [Go to /checkout], [Go to /lookbook]).
- Respond in the language of the user query.
`;

    // Call Gemini API if API key is present
    if (apiKey) {
      try {
        const geminiModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
        let apiResponse = null;

        for (const model of geminiModels) {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: messages.map((m: any) => ({
                  role: m.role === "user" ? "user" : "model",
                  parts: [{ text: m.content }],
                })),
              }),
            }
          );

          if (res.ok) {
            apiResponse = await res.json();
            break;
          }
        }

        if (apiResponse && apiResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
          const replyText = apiResponse.candidates[0].content.parts[0].text;
          return NextResponse.json({ reply: replyText });
        }
      } catch (geminiErr) {
        console.error("Gemini API call failed, using rule engine fallback:", geminiErr);
      }
    }

    // Smart Local Fallback Response Engine
    const lastUserMessage = (messages[messages.length - 1]?.content || "").toLowerCase();
    let fallbackReply = "Welcome to AURA STREET. Explore our luxury Japanese technical fabric outerwear and streetwear collections.";

    if (lastUserMessage.includes("hoodie") || lastUserMessage.includes("fleece")) {
      fallbackReply = "Our Essential Hoodie and Shadow Hoodie II feature 450-480GSM organic heavy fleece with dropped shoulder boxy draping. Check [Go to /shop] to view sizes.";
    } else if (lastUserMessage.includes("size") || lastUserMessage.includes("fit")) {
      fallbackReply = "Aura Street pieces feature a signature fashion geometry boxy silhouette. We recommend taking your standard size for an oversized streetwear look. Visit [Go to /sizing] for exact measurements.";
    } else if (lastUserMessage.includes("shipping") || lastUserMessage.includes("delivery") || lastUserMessage.includes("nepal")) {
      fallbackReply = "We offer Express Shipping across Kathmandu & Major Nepal cities via eSewa/Khalti/Fonepay payments, and international express delivery worldwide. Free shipping unlocks over €200. Check [Go to /shipping].";
    } else if (lastUserMessage.includes("stock") || lastUserMessage.includes("revenue") || lastUserMessage.includes("sales")) {
      if (isAuthorizedStaff && stats) {
        fallbackReply = `📊 **Operational Telemetry Report**:\n- Monthly Revenue: €${stats.monthly_revenue.toFixed(2)}\n- Active Orders: ${stats.active_orders}\n- Top Seller: ${topProducts[0]?.name || "Essential Hoodie"}. See [Go to /dashboard/admin].`;
      } else {
        fallbackReply = "Items are minted in limited batch quantities. Review current inventory states at [Go to /shop].";
      }
    }

    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ reply: "Aura AI Telemetry offline. Please try again." });
  }
}
