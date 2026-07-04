import Image from "next/image";

import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

const looks = [
  ["/hero-editorial.png", "Look 01 // Heavy Fleece"],
  ["/collections-banner.png", "Look 02 // Arctic Tech"],
  ["/editorial-spread.png", "Look 03 // Studio Shadow"],
  ["/moto-jacket.png", "Look 04 // Moto Leather"],
  ["/tech-cargos.png", "Look 05 // Modular Cargo"],
  ["/street-sneaker.png", "Look 06 // Street Runner"],
];

export default function LookbookPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Lookbook"
        title="SS26 editorial looks"
        text="A visual index for campaign styling, product storytelling, and social-first outfit direction."
      />
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {looks.map(([image, label]) => (
          <figure key={label} className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel-glow">
            <Image src={image} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <figcaption className="absolute left-5 bottom-5 text-[10px] uppercase tracking-[0.24em] text-white bg-black/60 border border-white/10 rounded px-3 py-2">
              {label}
            </figcaption>
          </figure>
        ))}
      </section>
    </PageShell>
  );
}
