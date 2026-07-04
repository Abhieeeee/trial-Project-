import CustomCursor from "@/components/CustomCursor";
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
    <main className={`relative min-h-screen bg-black text-white w-full overflow-hidden ${className}`}>
      <CustomCursor />
      <Header />
      {children}
      <Footer />
    </main>
  );
}
