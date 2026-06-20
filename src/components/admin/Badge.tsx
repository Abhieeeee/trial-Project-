export function Badge({ 
  status 
}: { 
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled" 
}) {
  const styles = {
    Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Shipped: "bg-brand-sky/10 text-brand-sky border-brand-sky/20",
    Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] uppercase tracking-widest font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
}
