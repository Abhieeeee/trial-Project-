import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Privacy" title="Privacy policy" text="A concise privacy page for customer data, analytics, newsletter subscriptions, payment processing, and support tickets." />
      <Policy />
    </PageShell>
  );
}

function Policy() {
  return (
    <section className="px-6 md:px-12 max-w-4xl mx-auto pb-28 space-y-5 text-sm text-neutral-400 leading-relaxed">
      {["We collect account, order, support, and newsletter information needed to operate the storefront.", "Payment details should be processed by a PCI-compliant provider such as Stripe, not stored directly in this app.", "Analytics data should be used to improve product discovery, conversion tracking, and launch performance."].map((text) => (
        <p key={text} className="glass-panel rounded-xl border border-white/5 p-6">{text}</p>
      ))}
    </section>
  );
}
