import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`relative min-h-screen bg-[#030305] text-white w-full overflow-x-hidden ${className}`}>
      <Header />
      <div className="pt-[96px] sm:pt-[110px] md:pt-[120px]">
        {children}
      </div>
      <Footer />
    </main>
  );
}
