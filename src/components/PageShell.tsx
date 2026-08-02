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
    <main id="main-content" className={`relative min-h-screen bg-[#030305] text-white w-full overflow-x-hidden ${className}`}>
      {/* Subtle Ambient Subpage Glow Orbs */}
      <div className="absolute top-[5%] left-[15%] w-[500px] h-[500px] rounded-full bg-[#00D2FF]/[0.025] blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[45%] right-[10%] w-[450px] h-[450px] rounded-full bg-[#0050AA]/[0.03] blur-[150px] pointer-events-none z-0" />
      
      <Header />
      <div className="relative z-10 pt-[96px] sm:pt-[110px] md:pt-[120px]">
        {children}
      </div>
      <Footer />
    </main>
  );
}
