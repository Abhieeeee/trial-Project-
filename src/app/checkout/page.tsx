"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Home,
  PackageCheck,
  Truck,
  ShieldCheck,
  Globe,
  Lock,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";
import { checkoutFeatures } from "@/lib/catalog";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cartContext";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center font-mono text-[10px] uppercase text-[#00d2ff]">Loading checkout path...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, subtotal: cartSubtotal, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();

  const amountFromUrl = searchParams.get("amount");
  const subtotal = amountFromUrl ? Number(amountFromUrl) : cartSubtotal > 0 ? cartSubtotal : 245;

  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [zip, setZip] = useState("44600");
  const [country, setCountry] = useState("Nepal");

  // Region Tab & Selected Payment Method
  const [regionTab, setRegionTab] = useState<"nepal" | "international">(currency === "NPR" ? "nepal" : "international");
  const [paymentMethod, setPaymentMethod] = useState<string>("esewa");

  // Gateway Specific Input States
  const [esewaPhone, setEsewaPhone] = useState("");
  const [khaltiPhone, setKhaltiPhone] = useState("");
  const [khaltiPin, setKhaltiPin] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderCode: string;
    method: string;
    total: number;
    timestamp: string;
  } | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const supabase = createClient();

  // Convert NPR for Nepal market estimation (1 EUR ~ 145 NPR)
  const nprAmount = Math.round(subtotal * 145);

  const nepalMethods = [
    { id: "esewa", label: "eSewa Wallet", icon: Wallet, tone: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { id: "khalti", label: "Khalti Digital", icon: Smartphone, tone: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { id: "fonepay", label: "Fonepay QR / Bank", icon: QrCode, tone: "text-red-400 border-red-500/30 bg-red-500/10" },
    { id: "imepay", label: "IME Pay", icon: Wallet, tone: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { id: "cod_nepal", label: "Cash on Delivery (Nepal)", icon: Truck, tone: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  ];

  const intlMethods = [
    { id: "stripe_card", label: "Credit / Debit Card", icon: CreditCard, tone: "text-[#00d2ff] border-[#00d2ff]/30 bg-[#00d2ff]/10" },
    { id: "paypal", label: "PayPal Express", icon: Globe, tone: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
    { id: "apple_google", label: "Apple / Google Pay", icon: Smartphone, tone: "text-neutral-200 border-white/30 bg-white/10" },
    { id: "crypto", label: "Crypto / Web3 Wallet", icon: Wallet, tone: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      alert("Please enter customer name and email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const isNepal = regionTab === "nepal";
      const generatedCode = `AUR-${isNepal ? "NP" : "INT"}${Math.floor(10000 + Math.random() * 90000)}`;

      const orderPayload = {
        order_code: generatedCode,
        customer_name: name,
        customer_email: email,
        status: "Pending",
        total: subtotal,
        items: items.length > 0
          ? items.map((i) => ({ product_id: i.id, product_name: i.name, quantity: i.quantity, unit_price: i.numericPrice }))
          : [{ product_name: "Aura Street Apparel Piece", quantity: 1, unit_price: subtotal }],
        shipping_address: `${address || "Street Address"}, ${city}, ${zip}, ${country}`,
        notes: `Payment via ${paymentMethod.toUpperCase()} (${isNepal ? "Nepal Market" : "International"})`,
      };

      const { error } = await supabase.from("orders").insert([orderPayload]);

      if (error) throw error;

      // Reset cart and display confirmation
      clearCart();
      setOrderSuccess({
        orderCode: generatedCode,
        method: paymentMethod.toUpperCase().replace("_", " "),
        total: subtotal,
        timestamp: new Date().toLocaleString(),
      });
    } catch (err: any) {
      console.error("Checkout order error:", err);
      alert(`Order processing failed: ${err.message || "Please check details."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBankDetails = () => {
    navigator.clipboard.writeText("Aura Street Trade Pvt Ltd | Nabil Bank A/C: 0010017502941 | Fonepay ID: 9801234567");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <PageShell>
      <PageIntro
        eyebrow="Checkout Path"
        title="Domestic & International Payment Portal"
        text="Support for Nepal Local Wallets (eSewa, Khalti, Fonepay QR, IME Pay, COD) and International Gateways (Card, PayPal, Apple Pay, Web3)."
      />

      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
        
        {/* Left Entry Form */}
        <form id="checkoutForm" onSubmit={handlePlaceOrder} className="space-y-8">
          
          {/* Shipping Info Panel */}
          <Panel icon={Home} title="Customer & Shipping Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <UnderlineCheckoutInput label="FULL NAME *" placeholder="e.g. Aarav Sharma" value={name} onChange={setName} required />
              <UnderlineCheckoutInput label="EMAIL ADDRESS *" placeholder="e.g. aarav@aurastreet.com" value={email} onChange={setEmail} required />
              <UnderlineCheckoutInput label="PHONE NUMBER (OPTIONAL)" placeholder="e.g. +977 9801234567" value={phone} onChange={setPhone} />
              <UnderlineCheckoutInput label="STREET ADDRESS" placeholder="e.g. Durbar Marg, Ward 1" value={address} onChange={setAddress} />
              <UnderlineCheckoutInput label="CITY / DISTRICT" placeholder="e.g. Kathmandu" value={city} onChange={setCity} />
              <UnderlineCheckoutInput label="COUNTRY" placeholder="e.g. Nepal" value={country} onChange={setCountry} />
            </div>
          </Panel>

          {/* Payment Gateways Selection Panel */}
          <Panel icon={CreditCard} title="Select Gateway & Payment Method">
            
            {/* Region Selector Tabs */}
            <div className="flex border-b border-white/10 mb-6 font-mono text-[10px] uppercase tracking-[0.2em] bg-black/40 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRegionTab("nepal");
                  setPaymentMethod("esewa");
                  setCountry("Nepal");
                }}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
                  regionTab === "nepal"
                    ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                🇳🇵 Nepal Market Methods
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegionTab("international");
                  setPaymentMethod("stripe_card");
                  setCountry("International");
                }}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
                  regionTab === "international"
                    ? "bg-[#00D2FF]/10 border border-[#00D2FF]/40 text-[#00D2FF] font-bold shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                🌐 International Gateways
              </button>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 font-mono">
              {(regionTab === "nepal" ? nepalMethods : intlMethods).map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border text-left text-[10px] uppercase tracking-[0.16em] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? method.tone + " font-bold shadow-lg ring-1 ring-white/20"
                        : "border-white/10 bg-black/60 text-neutral-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <method.icon className="w-4 h-4 shrink-0" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Gateway Specific Input & Details Box */}
            <div className="p-5 rounded-xl border border-white/10 bg-black/80 font-mono text-xs space-y-4 shadow-inner">
              
              {/* eSewa Wallet Inputs */}
              {paymentMethod === "esewa" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>eSewa Direct Express Wallet</span>
                    <span>NPR {nprAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] text-neutral-300 uppercase tracking-widest leading-relaxed">
                    Enter your eSewa registered mobile number to receive payment authorization prompt.
                  </p>
                  <input
                    type="text"
                    placeholder="eSewa Mobile ID (e.g. 98XXXXXXXX)"
                    aria-label="eSewa Mobile ID"
                    value={esewaPhone}
                    onChange={(e) => setEsewaPhone(e.target.value)}
                    className="w-full bg-black/90 border border-white/15 focus:border-emerald-400 rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase tracking-wider font-mono"
                  />
                </div>
              )}

              {/* Khalti Inputs */}
              {paymentMethod === "khalti" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-purple-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>Khalti Digital Wallet Gateway</span>
                    <span>NPR {nprAmount.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Khalti Mobile Number"
                      aria-label="Khalti Mobile Number"
                      value={khaltiPhone}
                      onChange={(e) => setKhaltiPhone(e.target.value)}
                      className="bg-black/90 border border-white/15 focus:border-purple-400 rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase font-mono"
                    />
                    <input
                      type="password"
                      placeholder="Transaction PIN"
                      aria-label="Transaction PIN"
                      value={khaltiPin}
                      onChange={(e) => setKhaltiPin(e.target.value)}
                      className="bg-black/90 border border-white/15 focus:border-purple-400 rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Fonepay QR & Bank Transfer */}
              {paymentMethod === "fonepay" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-red-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>Fonepay Interbank QR Scanner</span>
                    <span>NPR {nprAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/90 p-4 rounded-xl border border-white/10">
                    <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center border border-neutral-700 shrink-0">
                      <QrCode className="w-20 h-20 text-black" />
                    </div>
                    <div className="space-y-1.5 text-[9px] text-neutral-300 uppercase tracking-widest">
                      <p className="font-bold text-white">Scan using any Nepal Mobile Banking App</p>
                      <p>Fonepay ID: <span className="text-red-400 font-bold">9801234567</span></p>
                      <p>A/C: Nabil Bank (0010017502941)</p>
                      <button
                        type="button"
                        onClick={copyBankDetails}
                        className="mt-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono text-[8px] uppercase tracking-widest rounded flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedAccount ? "Bank Info Copied" : "Copy Fonepay Details"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* IME Pay */}
              {paymentMethod === "imepay" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>IME Pay Digital Wallet</span>
                    <span>NPR {nprAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] text-neutral-300 uppercase tracking-widest leading-relaxed">
                    You will be redirected to IME Pay portal to confirm wallet balance transfer.
                  </p>
                </div>
              )}

              {/* Cash on Delivery (Nepal) */}
              {paymentMethod === "cod_nepal" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>Domestic Cash on Delivery</span>
                    <span>Kathmandu & Major Cities</span>
                  </div>
                  <p className="text-[9px] text-neutral-300 uppercase tracking-widest leading-relaxed">
                    Pay in Cash/NPR upon physical parcel inspection at your delivery address.
                  </p>
                </div>
              )}

              {/* Credit Card Inputs */}
              {paymentMethod === "stripe_card" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[#00D2FF] font-bold uppercase tracking-wider text-[10px]">
                    <span>Card Checkout (Visa, Mastercard, Amex)</span>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="CARD NUMBER (4000 0000 0000 0000)"
                    aria-label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-black/90 border border-white/15 focus:border-[#00D2FF] rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="EXPIRY (MM/YY)"
                      aria-label="Card Expiry Date"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="bg-black/90 border border-white/15 focus:border-[#00D2FF] rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase font-mono"
                    />
                    <input
                      type="text"
                      placeholder="CVC / CVV"
                      aria-label="Card CVC Code"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="bg-black/90 border border-white/15 focus:border-[#00D2FF] rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase font-mono"
                    />
                  </div>
                </div>
              )}

              {/* PayPal */}
              {paymentMethod === "paypal" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sky-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>PayPal One-Touch Checkout</span>
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    placeholder="PAYPAL ACCOUNT EMAIL"
                    aria-label="PayPal Email Address"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full bg-black/90 border border-white/15 focus:border-sky-400 rounded-lg p-3.5 text-white focus:outline-none text-[10px] uppercase font-mono"
                  />
                </div>
              )}

              {/* Apple / Google Pay */}
              {paymentMethod === "apple_google" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white font-bold uppercase tracking-wider text-[10px]">
                    <span>Apple Pay / Google Pay</span>
                    <Smartphone className="w-3.5 h-3.5 text-[#00D2FF]" />
                  </div>
                  <p className="text-[9px] text-neutral-300 uppercase tracking-widest leading-relaxed">
                    Biometric 1-tap checkout enabled for supported browser sessions.
                  </p>
                </div>
              )}

              {/* Crypto / Web3 Wallet */}
              {paymentMethod === "crypto" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>USDT / ETH / BTC Web3 Transfer</span>
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[9px] text-neutral-300 uppercase tracking-widest leading-relaxed">
                    Pay using USDT (TRC20/ERC20) or ETH. Web3 wallet prompt will execute on confirmation.
                  </p>
                </div>
              )}

            </div>
          </Panel>

        </form>

        {/* Right Summary View */}
        <aside className="glass-panel-glow rounded-2xl p-6 sm:p-8 h-fit lg:sticky lg:top-28 font-mono bg-[#0a0a0c]/90 border border-white/15 shadow-2xl space-y-6 backdrop-blur-2xl">
          <h2 className="flex items-center gap-3 text-sm font-display font-bold uppercase tracking-[0.18em] border-b border-white/10 pb-4 text-white">
            <PackageCheck className="w-5 h-5 text-[#00D2FF]" />
            Order Summary
          </h2>

          <div className="space-y-3.5 text-xs uppercase tracking-[0.18em] text-neutral-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-bold">{formatPrice(subtotal)}</span>
            </div>
            
            {regionTab === "nepal" && (
              <div className="flex justify-between text-[10px] text-emerald-400 font-semibold">
                <span>Nepal NPR Est.</span>
                <span>NPR {nprAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-[#00D2FF] font-bold">EXPRESS FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="text-white font-bold">{paymentMethod.toUpperCase().replace("_", " ")}</span>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-1">
              <div className="flex justify-between text-base font-extrabold text-white">
                <span>Total Payable</span>
                <span className={regionTab === "nepal" ? "text-emerald-400 font-mono" : "text-[#00D2FF]"}>
                  {regionTab === "nepal" ? `NPR ${nprAmount.toLocaleString()}` : formatPrice(subtotal)}
                </span>
              </div>
              {regionTab === "nepal" && (
                <span className="text-[9px] text-neutral-400 font-mono text-right uppercase tracking-wider">
                  (Approx. {formatPrice(subtotal)})
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            form="checkoutForm"
            disabled={isSubmitting}
            className={`mt-8 w-full py-4 rounded-xl font-extrabold transition-all text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${
              regionTab === "nepal"
                ? "bg-emerald-400 text-black hover:bg-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                : "bg-[#00D2FF] text-black hover:bg-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.4)]"
            }`}
          >
            {isSubmitting ? (
              <span>Authorizing Gateway...</span>
            ) : (
              <>
                Confirm & Pay ({regionTab === "nepal" ? `NPR ${nprAmount.toLocaleString()}` : formatPrice(subtotal)}) <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest text-neutral-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-BIT ENCRYPTED GATEWAY SESSION
          </div>
        </aside>

      </section>

      {/* Checkout Guarantee Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20 md:mb-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 font-mono">
        {checkoutFeatures.map((item) => (
          <div key={item.title} className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3 bg-[#0a0a0c]/60 hover:border-white/20 transition-all">
            <item.icon className="w-5 h-5 text-[#00D2FF]" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">{item.title}</h3>
            <p className="text-[10px] text-neutral-300 leading-relaxed uppercase">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono">
          <div className="w-full max-w-lg bg-neutral-950 border border-[#00D2FF]/40 rounded-2xl p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/40 flex items-center justify-center mx-auto text-[#00D2FF]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#00D2FF] font-bold">
                PAYMENT AUTHORIZED // DISPATCH INITIATED
              </span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-[0.15em] text-white">
                Order Confirmed!
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Thank you for your order, <strong className="text-white">{name}</strong>. A confirmation receipt has been dispatched to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black text-left text-[10px] uppercase space-y-2.5">
              <div className="flex justify-between text-neutral-400">
                <span>Order Reference Code</span>
                <span className="text-[#00D2FF] font-bold">{orderSuccess.orderCode}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Gateway Paid Via</span>
                <span className="text-white font-bold">{orderSuccess.method}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Total Amount Paid</span>
                <span className="text-white font-bold">{formatPrice(orderSuccess.total)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Timestamp</span>
                <span className="text-neutral-300">{orderSuccess.timestamp}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/shop")}
                className="flex-1 py-3.5 border border-white/10 rounded-xl text-neutral-300 hover:text-white active:scale-95 uppercase tracking-widest text-[9px] cursor-pointer transition-all"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push("/user-dashboard")}
                className="flex-1 py-3.5 bg-[#00D2FF] text-black font-bold uppercase tracking-widest text-[9px] hover:bg-cyan-400 active:scale-95 rounded-xl cursor-pointer transition-all"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel-glow rounded-2xl p-6 sm:p-8 bg-[#0a0a0c]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6">
      <h2 className="flex items-center gap-3 text-sm sm:text-base font-display font-bold uppercase tracking-[0.2em] text-white border-b border-white/10 pb-4">
        <div className="p-2 rounded-lg bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF]">
          <Icon className="w-4 h-4" />
        </div>
        {title}
      </h2>
      {children}
    </section>
  );
}

function UnderlineCheckoutInput({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const displayLabel = label || placeholder;

  return (
    <div className="relative w-full font-mono mb-2">
      <label className="block text-[9px] uppercase tracking-[0.2em] text-neutral-300 font-semibold mb-1.5">
        {displayLabel}
      </label>
      <div className={`relative rounded-xl bg-white/[0.03] border transition-all duration-300 ${
        focused ? "border-[#00D2FF] bg-white/[0.06] shadow-[0_0_15px_rgba(0,210,255,0.15)]" : "border-white/10 hover:border-white/20"
      }`}>
        <input
          required={required}
          placeholder={placeholder}
          aria-label={displayLabel}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent py-3.5 px-4 text-xs uppercase tracking-[0.15em] focus:outline-none text-white placeholder:text-neutral-500"
        />
      </div>
    </div>
  );
}
