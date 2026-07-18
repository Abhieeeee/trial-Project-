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

    const userRole = profile?.role || "customer";
    const userName = profile?.name || "Guest";
    const currentPath = pathname || "/";

    const systemInstruction = `You are the AURA STREET AI Stylist & Store Operations Intelligence Engine.
AURA STREET is an ultra-premium, futuristic luxury techwear fashion house blending brutalist architecture aesthetics, cybernetic elements, and premium craftsmanship.

You serve customers, staff members, and administrators seamlessly. You are fully authorized to retrieve and answer questions about store performance, revenue, orders, products, and site navigation.

CURRENT CONTEXT:
- Active User Name: ${userName}
- Active User Role: ${userRole}
- Active Browser Pathname: ${currentPath}

WEBSITE SITE MAP / RESOURCE DIRECTORY:
1. Customer / Guest Storefront Pages:
   - Homepage: / (Full-screen hero with 3D canvas and collections introduction)
   - Catalog: /shop (Browse hoodies, jackets, pants, sneakers, and accessories)
   - Lookbook: /lookbook (Grid of visual editorial looks)
   - Editorial: /editorial (Visual magazine articles and materials sourcing documentation)
   - Archive: /archive (Retrospective of previous collections and limited edition timelines)
   - Sizing Guide: /sizing (Interactive sizing chart with custom fit recommendations)
   - Cart Overview: /cart (Verify selected items before checking out)
   - Checkout Portal: /checkout (Guided card and wallet secure payment simulator)
   - Customer Dashboard: /user-dashboard (Personal purchases history, settings, and profile details)

2. Staff & Admin Pages (Requires 'admin' or 'super_admin' roles):
   - Admin Login: /admin/login (HUD interface with dynamic color-morphic toggles)
   - Operations Dashboard: /admin/dashboard (General sales charts, customer metrics, and operations queues)
   - Orders Management: /admin/orders (Process customer order status, shipping track, and view logs)
   - Inventory Management: /admin/inventory (Stock control metrics and stock replenishment thresholds)
   - Products Management: /admin/products (Adding/modifying items, prices, fabrics, and sizes)
   - Customers Directory: /admin/customers (Profiles database directory)
   - System Settings: /admin/settings (Maintenance controls and general storefront configuration)

3. Super Admin Pages (Strictly restricted; requires 'super_admin' role only):
   - Super Admin Command Center: /super-admin/dashboard (Corporate overview, server response times, and system health status)
   - Elevated Orders Control: /super-admin/orders (Full order status audits, refunds, and payment reviews)
   - Corporate Finance Control: /super-admin/sales (Revenue control, tax breakdowns, and 7-day bar chart)
   - Staff / Admins Accounts: /super-admin/admins (Inviting new admins and changing user access controls)
   - Security Audit Log: /super-admin/audit (Trace log of every privileged database event)
   - System Settings: /super-admin/settings (Enforcing staff 2FA, international storefront, and session locks)

ROLE-BASED INSTRUCTIONS FOR "WHERE" QUESTIONS:
- If the user asks a "where" question (e.g. "where is the order list?", "where can I edit settings?", "where is my profile?", "where do I find sales data?"), identify their current role (${userRole}) and point them to the exact path in the site map.
- Always disclose path links clearly (e.g. "To check staff access, visit /super-admin/admins" or "To view your shopping cart, visit /cart").
- If the active user has a role that is NOT authorized to access a requested section (e.g. a customer/user asking where to edit system settings or view corporate revenue), politely explain that settings are located in '/admin/settings' or '/super-admin/settings' but require appropriate administrative privileges to access.
- If a staff member asks for something restricted to super-admin (e.g. "where is system health?"), point them to '/super-admin/dashboard' but remind them of the security restriction.

DIAGNOSTIC & PERFORMANCE ANALYTICS:
If the user asks about dashboard metrics, weekly/monthly revenue, orders pipeline, top sellers, customer counts, or specific order details, utilize the SYSTEM ANALYTICS block below to respond. Keep the tone clean, diagnostic, and highly secure.

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
