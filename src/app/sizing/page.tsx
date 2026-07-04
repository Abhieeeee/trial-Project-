import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";

const rows = [
  ["S", "38 in", "25 in", "26 in"],
  ["M", "40 in", "26 in", "27 in"],
  ["L", "42 in", "27 in", "28 in"],
  ["XL", "45 in", "28 in", "29 in"],
];

export default function SizingPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Sizing"
        title="Oversized but controlled"
        text="AURA STREET fits relaxed. Size down for a cleaner silhouette or take your standard size for the intended drape."
      />
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-28">
        <div className="glass-panel-glow rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-[9px] uppercase tracking-[0.2em] text-neutral-500">
              <tr>
                <th className="p-5">Size</th>
                <th className="p-5">Chest</th>
                <th className="p-5">Length</th>
                <th className="p-5">Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-neutral-900">
                  {row.map((cell) => (
                    <td key={cell} className="p-5 text-neutral-300">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
