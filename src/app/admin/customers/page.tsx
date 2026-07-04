"use client";

import { motion } from "framer-motion";
import { Mail, Search, UserRound } from "lucide-react";

const customers = [
  ["Alex Chen", "alex@example.com", "EUR 1,420", "VIP"],
  ["Sarah Miller", "sarah@example.com", "EUR 920", "Returning"],
  ["David Kim", "david@example.com", "EUR 2,110", "VIP"],
  ["Emma Wilson", "emma@example.com", "EUR 680", "New"],
  ["Maria Garcia", "maria@example.com", "EUR 1,030", "Returning"],
];

export default function AdminCustomersPage() {
  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">Customers</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Customer details, segmentation, purchase history, and support context.
          </p>
        </div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input className="w-full bg-black border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-sky text-white placeholder:text-neutral-600" placeholder="Search customers..." />
        </div>
      </div>
      <div className="grid gap-4">
        {customers.map(([name, email, value, segment], index) => (
          <motion.div
            key={email}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-brand-sky/10 border border-brand-sky/20 flex items-center justify-center">
                <UserRound className="w-5 h-5 text-brand-sky" />
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-[0.16em] font-bold">{name}</h2>
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 flex items-center gap-2 mt-1">
                  <Mail className="w-3 h-3" />
                  {email}
                </p>
              </div>
            </div>
            <div className="flex gap-6 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              <div><span className="block text-white">{value}</span>LTV</div>
              <div><span className="block text-brand-sky">{segment}</span>Segment</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
