import { Headphones, Mail, MapPin, MessageCircle } from "lucide-react";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function ContactPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Contact"
        title="Support for orders, sizing, shipping, and private drops"
        text="Use this support surface for customer questions, order tracking, return requests, collaborations, and wholesale inquiries."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
        <form className="glass-panel-glow rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Name", "Email", "Subject"].map((field) => (
              <input
                key={field}
                placeholder={field.toUpperCase()}
                className={`${field === "Subject" ? "md:col-span-2" : ""} bg-black border border-neutral-800 rounded-lg py-4 px-4 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700`}
              />
            ))}
            <textarea
              placeholder="MESSAGE"
              rows={8}
              className="md:col-span-2 bg-black border border-neutral-800 rounded-lg py-4 px-4 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700 resize-none"
            />
          </div>
          <button className="mt-5 h-14 rounded bg-white text-black hover:bg-brand-sky transition-colors px-8 text-[10px] uppercase tracking-[0.22em] font-extrabold">
            Send Message
          </button>
        </form>
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", text: "support@aurastreet.com" },
            { icon: MessageCircle, title: "Live Chat", text: "Available during launch windows" },
            { icon: Headphones, title: "Customer Care", text: "Orders, invoices, returns, and sizing" },
            { icon: MapPin, title: "Atelier", text: "Le Marais, Paris // worldwide shipping" },
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-xl border border-white/5 p-6">
              <item.icon className="w-5 h-5 text-brand-sky mb-4" />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2">{item.title}</h2>
              <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
