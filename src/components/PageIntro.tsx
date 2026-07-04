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
    <section className="px-6 md:px-12 max-w-7xl mx-auto pt-36 md:pt-44 pb-16">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-white">{eyebrow}</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-brand-sky text-glow-sky font-bold mb-5">
        {eyebrow}
      </p>
      <h1 className="text-4xl md:text-7xl font-extrabold uppercase tracking-[0.09em] font-display text-white max-w-5xl">
        {title}
      </h1>
      <p className="text-sm md:text-base text-neutral-400 max-w-2xl tracking-wide leading-relaxed mt-8">
        {text}
      </p>
    </section>
  );
}
