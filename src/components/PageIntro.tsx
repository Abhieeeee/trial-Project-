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
    <section className="px-6 md:px-12 max-w-7xl mx-auto pt-[140px] md:pt-[180px] pb-16">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6 font-mono">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-neutral-300">{eyebrow}</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wider font-sans text-white max-w-5xl">
        {title}
      </h1>
      <p className="text-sm md:text-base text-neutral-400 max-w-2xl tracking-wide leading-relaxed mt-6">
        {text}
      </p>
    </section>
  );
}

