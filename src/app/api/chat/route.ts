import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

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

    // Retrieve active store inventory directly from the database
    const products = await getProducts();
    const catalogText = products
      .map(
        (p) =>
          `- ${p.name} (Category: ${p.category}): Price: €${p.price}, Material: ${p.material}, Stock: ${p.stock} units. Description: ${p.description}`
      )
      .join("\n");

    const systemInstruction = `You are the AURA STREET AI Stylist, an ultra-premium, futuristic luxury fashion consultant.
AURA STREET is a high-end streetwear brand blending brutalist architecture aesthetics, cybernetic elements, and premium craftsmanship.
Sizing guidelines: Our garments have an intentional oversized drape. Order your normal size for the designer-intended look.
Fabric sourcing: 450GSM heavy cotton fleece from Osaka, Japan. Zippers are Italian YKK Excella.
Here is our current active inventory catalog:
${catalogText}

Be extremely polite, sophisticated, clear, and brief. Use terms like "Initialize styling analysis...", "System access verified...", "Protocol update..." to fit the brand's luxury sci-fi style. Recommend specific matching items from the catalog. Do not talk about items we do not sell.`;

    // Make direct API call to Gemini
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
