import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function ShippingPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Shipping"
        title="Global shipping and delivery tracking"
        text="A shipping page for duty notes, delivery windows, tracking statuses, and launch-day fulfillment expectations."
      />
      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          ["Processing", "Orders are reviewed, payment is verified, and stock is reserved before packing."],
          ["Packed", "A tracking number is generated and the shipping label is prepared."],
          ["Shipped", "Customers receive automated shipping updates and delivery confirmation."],
        ].map(([title, text]) => (
          <div key={title} className="glass-panel-glow rounded-xl p-6">
            <h2 className="text-xs uppercase tracking-[0.22em] font-bold mb-3">{title}</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
