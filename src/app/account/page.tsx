import { Gift, Heart, Package, RefreshCcw, User } from "lucide-react";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function AccountPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Account"
        title="Customer panel"
        text="A themed customer dashboard for profile management, addresses, orders, tracking, wishlist, returns, invoices, rewards, referrals, and support."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: User, title: "Profile", text: "Maya Rivera // verified customer" },
          { icon: Package, title: "Orders", text: "2 active orders with tracking" },
          { icon: Heart, title: "Wishlist", text: "6 saved pieces and shared list support" },
          { icon: Gift, title: "Rewards", text: "2,840 points // Sky tier" },
          { icon: RefreshCcw, title: "Returns", text: "Request returns and download labels" },
        ].map((item) => (
          <div key={item.title} className="glass-panel-glow rounded-xl p-6">
            <item.icon className="w-5 h-5 text-brand-sky mb-5" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-3">{item.title}</h2>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
