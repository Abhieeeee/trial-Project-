import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Terms" title="Terms of use" text="Terms for browsing, purchasing, account usage, drops, returns, and customer support." />
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-28 space-y-5 text-sm text-neutral-400 leading-relaxed">
        {["Product availability may change during limited drops while carts and checkout sessions are active.", "Orders may be reviewed for payment security, inventory accuracy, and shipping validation.", "Returns, refunds, gift cards, and store credits should follow the policies published at the time of purchase."].map((text) => (
          <p key={text} className="glass-panel rounded-xl border border-white/5 p-6">{text}</p>
        ))}
      </section>
    </PageShell>
  );
}
