import Image from "next/image";
import { Beaker, Leaf, Shield, Sparkles } from "lucide-react";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="About"
        title="Luxury streetwear engineered for the modern city"
        text="AURA STREET builds quiet, technical silhouettes around heavyweight fabric, architectural patterning, and a precise sky-blue accent language."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel-glow">
          <Image src="/editorial-spread.png" alt="AURA STREET studio editorial" fill className="object-cover" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky font-bold mb-6">
            Brand System
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-[0.1em] mb-8">
            Restraint is the loudest detail.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed tracking-wide mb-10">
            Every garment is built as a long-term object: heavy cotton, water-ready shells, brushed hardware, clean labels,
            and fit blocks that feel oversized without losing structure.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: Beaker, title: "Material Research", text: "Cotton, leather, nylon, and technical shells selected for drape and durability." },
              { icon: Shield, title: "Performance", text: "Urban weather protection, reinforced seams, and production-grade hardware." },
              { icon: Leaf, title: "Small Batches", text: "Controlled inventory planning and limited releases to reduce overproduction." },
              { icon: Sparkles, title: "Sky Signature", text: "The brand accent appears through labels, glow states, and product finishes." },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-xl border border-white/5 p-5">
                <item.icon className="w-5 h-5 text-brand-sky mb-4" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-2">{item.title}</h3>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
