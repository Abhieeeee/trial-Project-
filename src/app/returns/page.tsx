import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function ReturnsPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Returns"
        title="Return requests and refund workflow"
        text="A customer-facing policy page for return windows, approvals, label generation, refunds, and store credit."
      />
      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-4 gap-5">
        {["Request", "Approval", "Received", "Refunded"].map((step, index) => (
          <div key={step} className="glass-panel-glow rounded-xl p-6">
            <span className="text-5xl font-display font-bold text-white/10">0{index + 1}</span>
            <h2 className="text-xs uppercase tracking-[0.22em] font-bold mt-4 mb-3">{step}</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {step} status is tracked in the customer panel and can be managed from the admin order workspace.
            </p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
