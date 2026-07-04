import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

const faqs = [
  ["When do limited drops ship?", "In-stock drops ship within 2 business days. Numbered capsules may ship by batch if production is staged."],
  ["Can I change my order?", "Contact support as soon as possible. If the order has not moved to packed status, the team can update address, size, or cancellation requests."],
  ["Do you support guest checkout?", "Yes. The checkout UI supports guest checkout and can later connect guest orders to a customer account."],
  ["Where is payment handled?", "The frontend is ready for Stripe Checkout plus wallet methods. Add Stripe keys in Vercel environment variables when backend integration is added."],
];

export default function FaqPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="FAQ" title="Questions before the drop" text="Answers for shipping, payments, order updates, returns, and limited releases." />
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-28 space-y-4">
        {faqs.map(([question, answer]) => (
          <div key={question} className="glass-panel-glow rounded-xl p-6">
            <h2 className="text-xs uppercase tracking-[0.22em] font-bold mb-3">{question}</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">{answer}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
