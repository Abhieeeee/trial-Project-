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
    <main className={`relative min-h-screen bg-black text-white w-full overflow-x-hidden ${className}`}>
      <Header />
      <div className="pt-[80px] md:pt-[100px]">
        {children}
      </div>
      <Footer />
    </main>
  );
}
