import Link from "next/link";

export default function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="relative px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-14 border-b border-white/5 mb-10 overflow-hidden">
      {/* Subtle Background Cyber Ambient Light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#00D2FF]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-300 mb-5 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#00D2FF] font-bold">{eyebrow}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.12em] font-display text-white max-w-4xl leading-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl tracking-wider leading-relaxed mt-4 font-mono">
          {text}
        </p>
      </div>
    </section>
  );
}

