"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Activity, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "€124,500",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Active Orders",
    value: "142",
    change: "+5.2%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "8,234",
    change: "+18.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    trend: "down",
    icon: Activity,
  },
];

const recentActivity = [
  { id: 1, action: "Order #8924 placed", user: "Alex Chen", time: "2 min ago", amount: "€680" },
  { id: 2, action: "Order #8923 shipped", user: "System", time: "15 min ago", amount: "" },
  { id: 3, action: "New customer registered", user: "Sarah Miller", time: "1 hour ago", amount: "" },
  { id: 4, action: "Order #8922 placed", user: "David Kim", time: "2 hours ago", amount: "€245" },
  { id: 5, action: "Inventory warning: Tech Cargo Pants (M)", user: "System", time: "3 hours ago", amount: "" },
];

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">
            Dashboard
          </h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Welcome back, Émile. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 font-bold bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5">
          <span>Date:</span>
          <span className="text-white">Jun 20, 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg border border-neutral-800">
                <stat.icon className="w-4 h-4 text-brand-sky" />
              </div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">{stat.title}</h3>
            </div>
            
            <div className="text-3xl font-display font-bold text-white mb-2">{stat.value}</div>
            
            <div className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{stat.change}</span>
              <span className="text-neutral-600 ml-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mock Chart Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 p-6 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">Revenue Overview</h3>
            <select className="bg-black border border-neutral-800 text-neutral-400 text-[10px] uppercase tracking-widest rounded px-2 py-1 outline-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] flex items-end gap-2 pt-4">
            {/* Mock CSS Bar Chart */}
            {[40, 60, 35, 80, 50, 90, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-black border border-neutral-800 rounded-t-sm relative flex items-end justify-center overflow-hidden h-full">
                  <div 
                    className="w-full bg-brand-sky/20 border-t border-brand-sky/50 group-hover:bg-brand-sky/40 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-6">Recent Activity</h3>
          
          <div className="flex-1 flex flex-col gap-6">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-black border border-neutral-800 flex items-center justify-center z-10 relative">
                    <Package className="w-3.5 h-3.5 text-brand-sky" />
                  </div>
                  {idx !== recentActivity.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-10 bg-neutral-800" />
                  )}
                </div>
                <div className="pt-1 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-white">{activity.action}</p>
                    {activity.amount && (
                      <span className="text-[10px] font-bold text-brand-sky">{activity.amount}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500">
                    <span>{activity.user}</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-3 border border-neutral-800 rounded text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
            View All Activity
          </button>
        </motion.div>

      </div>
    </div>
  );
}
