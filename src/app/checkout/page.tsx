"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Home, PackageCheck, Truck, ShieldCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";
import { checkoutFeatures } from "@/lib/catalog";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const subtotal = searchParams.get("amount") || "245";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [selectedMethod, setSelectedMethod] = useState("Stripe Card");

  return (
    <PageShell>
      <PageIntro
        eyebrow="Checkout"
        title="Secure multi-step checkout"
        text="A production-ready checkout path can connect to Stripe, Apple Pay, Google Pay, cash on delivery, and bank transfer once environment keys are configured."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        
        {/* Left Form entries */}
        <div className="space-y-6">
          <Panel icon={Home} title="Shipping Address">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
              <UnderlineCheckoutInput placeholder="EMAIL ADDRESS" value={email} onChange={setEmail} />
              <UnderlineCheckoutInput placeholder="FULL NAME" value={name} onChange={setName} />
              <UnderlineCheckoutInput placeholder="ADDRESS LINE" value={address} onChange={setAddress} />
              <UnderlineCheckoutInput placeholder="CITY" value={city} onChange={setCity} />
              <UnderlineCheckoutInput placeholder="POSTAL CODE" value={zip} onChange={setZip} />
              <UnderlineCheckoutInput placeholder="COUNTRY" value={country} onChange={setCountry} />
            </div>
          </Panel>
          
          <Panel icon={CreditCard} title="Payment Method">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {["Stripe Card", "Apple Pay", "Google Pay", "Cash On Delivery", "Bank Transfer"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`rounded-lg border p-4 text-left text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
                    selectedMethod === method
                      ? "border-brand-sky bg-brand-sky/10 text-white shadow-[0_0_12px_rgba(125,211,252,0.15)]"
                      : "border-neutral-800 text-neutral-400 hover:border-brand-sky hover:text-white"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Summary view */}
        <aside className="glass-panel-glow rounded-xl p-6 h-fit lg:sticky lg:top-28">
          <h2 className="flex items-center gap-3 text-lg font-display font-bold uppercase tracking-[0.15em] mb-6">
            <PackageCheck className="w-5 h-5 text-brand-sky" />
            Review
          </h2>
          <div className="space-y-4 text-xs uppercase tracking-[0.18em] text-neutral-400">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-white">EUR {subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-white">EUR 0</span></div>
            <div className="flex justify-between"><span>Taxes</span><span className="text-neutral-500">At payment</span></div>
            <div className="border-t border-neutral-900 pt-4 flex justify-between text-white font-bold">
              <span>Total</span>
              <span className="text-brand-sky text-glow-sky">EUR {subtotal}</span>
            </div>
          </div>
          <button className="mt-8 w-full h-14 rounded bg-white text-black hover:bg-brand-sky hover:text-white transition-all text-[10px] uppercase tracking-[0.22em] font-extrabold cursor-pointer" data-magnetic>
            Place Order
          </button>
        </aside>

      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-4 gap-5">
        {checkoutFeatures.map((item) => (
          <div key={item.title} className="glass-panel rounded-xl border border-white/5 p-6">
            <item.icon className="w-5 h-5 text-brand-sky mb-5" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-3">{item.title}</h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel-glow rounded-xl p-6">
      <h2 className="flex items-center gap-3 text-sm font-display font-bold uppercase tracking-[0.2em] mb-6">
        <Icon className="w-5 h-5 text-brand-sky" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function UnderlineCheckoutInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative w-full mb-6 font-mono">
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-none py-3 px-1 text-[10px] uppercase tracking-[0.2em] focus:outline-none text-white placeholder:text-neutral-700"
      />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900" />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-sky shadow-[0_0_8px_#7dd3fc]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
