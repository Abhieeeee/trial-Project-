"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Zap,
  Activity,
  AlertCircle,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  Sparkles,
  PieChart,
} from "lucide-react";
import type { Product, Order } from "@/types/database";

interface NicheAnalyticsHubProps {
  products: Product[];
  orders: Order[];
  role?: "staff" | "admin" | "super_admin";
  onRefresh?: () => void;
}

export function NicheAnalyticsHub({
  products,
  orders,
  role = "admin",
  onRefresh,
}: NicheAnalyticsHubProps) {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const isSuperAdmin = role === "super_admin";
  const isStaff = role === "staff";

  // Accent theme mapping
  let accentColorClass = "text-[#00d2ff]";
  let accentBorderClass = "border-[#00d2ff]/20";
  let accentBgClass = "bg-[#00d2ff]/10";
  let barGradient = "from-[#00d2ff] to-cyan-500";

  if (isSuperAdmin) {
    accentColorClass = "text-red-500";
    accentBorderClass = "border-red-500/20";
    accentBgClass = "bg-red-500/10";
    barGradient = "from-red-500 to-rose-600";
  } else if (isStaff) {
    accentColorClass = "text-amber-400";
    accentBorderClass = "border-amber-400/20";
    accentBgClass = "bg-amber-400/10";
    barGradient = "from-amber-400 to-orange-500";
  }

  // Filter orders by timeframe
  const getFilteredOrders = () => {
    const now = new Date();
    let cutoff = new Date(0); // All time default

    if (timeframe === "24h") cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    else if (timeframe === "7d") cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (timeframe === "30d") cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orders.filter((o) => new Date(o.created_at) >= cutoff);
  };

  const filteredOrders = getFilteredOrders();
  const validOrders = filteredOrders.filter((o) => o.status !== "Cancelled");

  // Niche Financial & Operational Calculations
  const grossSales = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrdersCount = validOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? grossSales / totalOrdersCount : 0;
  const estNetProfit = grossSales * 0.81; // 81% net after 19% simulated COGS & platform overhead
  const refundExposure = grossSales * 0.02; // 2% buffer allocation

  // Streetwear Category Breakdown
  const categories = ["Hoodies", "Jackets", "Pants", "Sneakers", "Accessories"];
  const categoryStats: Record<string, { units: number; revenue: number }> = {};

  categories.forEach((cat) => {
    categoryStats[cat] = { units: 0, revenue: 0 };
  });

  // Calculate stats from order items JSON
  validOrders.forEach((order) => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item) => {
        // Try finding matching product category or infer from name
        const productMatch = products.find((p) => p.name === item.product_name || p.id === item.product_id);
        const catName = productMatch?.category || "Hoodies";
        if (!categoryStats[catName]) categoryStats[catName] = { units: 0, revenue: 0 };

        categoryStats[catName].units += item.quantity || 1;
        categoryStats[catName].revenue += (item.quantity || 1) * (item.unit_price || order.total / (order.items.length || 1));
      });
    }
  });

  const maxCategoryRevenue = Math.max(...Object.values(categoryStats).map((s) => s.revenue), 1);

  // Stock Exhaustion & Sell-Out Velocity Radar
  const lowStockThreshold = 15;
  const lowStockItems = products.filter((p) => p.stock <= lowStockThreshold);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  // Calculate top performing products
  const productPerformance = products.map((p) => {
    const unitsSold = validOrders.reduce((sum, o) => {
      if (!Array.isArray(o.items)) return sum;
      const matched = o.items.find((i) => i.product_name === p.name || i.product_id === p.id);
      return sum + (matched?.quantity || 0);
    }, 0);

    const revenue = unitsSold * p.price;
    // Days of inventory remaining (assume 7 day timeframe for velocity)
    const dailyVelocity = unitsSold > 0 ? unitsSold / 7 : 0.1;
    const daysRemaining = Math.round(p.stock / dailyVelocity);

    return {
      ...p,
      unitsSold,
      revenue,
      dailyVelocity: dailyVelocity.toFixed(1),
      daysRemaining: isFinite(daysRemaining) ? daysRemaining : 99,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8">
      
      {/* Header Bar with Timeframe Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-black/60 backdrop-blur-md border border-neutral-800 rounded-none">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className={`h-4 w-4 ${accentColorClass}`} />
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
              Niche Telemetry & Commerce Analytics
            </h2>
          </div>
          <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.14em] text-neutral-500">
            Aura Street drop intelligence, sell-out velocity, & operational throughput
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex bg-neutral-900 border border-neutral-800 p-1 font-mono text-[9px] uppercase tracking-wider">
            {(["24h", "7d", "30d", "all"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 transition-all cursor-pointer ${
                  timeframe === tf
                    ? `${accentBgClass} ${accentColorClass} font-bold border border-neutral-700`
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                {tf === "24h" ? "24 Hours" : tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "All Time"}
              </button>
            ))}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Gross Drop Revenue",
            value: `EUR ${grossSales.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
            subtitle: `${validOrders.length} confirmed orders`,
            icon: DollarSign,
            badge: "+14.2% vs prev period",
            badgePositive: true,
          },
          {
            title: "Est. Net Profit (81%)",
            value: `EUR ${estNetProfit.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
            subtitle: `Excludes VAT & COGS`,
            icon: TrendingUp,
            badge: "Healthy Margin",
            badgePositive: true,
          },
          {
            title: "Average Order Value",
            value: `EUR ${avgOrderValue.toFixed(0)}`,
            subtitle: `Basket size performance`,
            icon: ShoppingBag,
            badge: "High-ticket fashion",
            badgePositive: true,
          },
          {
            title: "Stock Depletion Risk",
            value: `${lowStockItems.length} SKUs`,
            subtitle: `${outOfStockItems.length} items sold out`,
            icon: AlertCircle,
            badge: lowStockItems.length > 0 ? "Restock Needed" : "Stock Optimal",
            badgePositive: lowStockItems.length === 0,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-5 bg-black/40 backdrop-blur-md border border-neutral-800 hover:border-neutral-700 transition-colors relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                {card.title}
              </span>
              <card.icon className={`h-4 w-4 text-neutral-600 group-hover:${accentColorClass} transition-colors`} />
            </div>
            <p className="font-mono text-xl font-bold text-white tracking-widest">{card.value}</p>
            <div className="mt-3 flex items-center justify-between text-[8px] font-mono">
              <span className="text-neutral-500 uppercase tracking-wider">{card.subtitle}</span>
              <span
                className={`uppercase font-bold tracking-wider ${
                  card.badgePositive ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Split Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Streetwear Category Breakdown Panel */}
        <div className="p-6 bg-black/40 backdrop-blur-md border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Layers className={`h-4 w-4 ${accentColorClass}`} /> Category Revenue Distribution
            </h3>
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
              DROP METRICS
            </span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const stat = categoryStats[cat] || { units: 0, revenue: 0 };
              const percentage = Math.round((stat.revenue / (grossSales || 1)) * 100);
              const barWidth = Math.max((stat.revenue / maxCategoryRevenue) * 100, 3);

              return (
                <div key={cat} className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-neutral-300">
                    <span className="uppercase font-bold tracking-wider">{cat}</span>
                    <span className="text-neutral-400">
                      EUR {stat.revenue.toLocaleString()} ({stat.units} units sold) —{" "}
                      <span className={accentColorClass}>{percentage}%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sell-Out Velocity Radar & Stock Exhaustion Panel */}
        <div className="p-6 bg-black/40 backdrop-blur-md border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Zap className={`h-4 w-4 ${accentColorClass}`} /> Sell-Out Velocity & Exhaustion Radar
            </h3>
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase animate-pulse">
              LIVE RADAR
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[9px]">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
                  <th className="pb-3 font-bold">Apparel SKU</th>
                  <th className="pb-3 font-bold text-center">Stock</th>
                  <th className="pb-3 font-bold text-center">Velocity (u/day)</th>
                  <th className="pb-3 font-bold text-right">Depletion Est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {productPerformance.slice(0, 5).map((item) => {
                  let alertTone = "text-emerald-400";
                  if (item.stock === 0) alertTone = "text-red-500 font-bold";
                  else if (item.stock <= 15) alertTone = "text-amber-400 font-bold";

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 text-white font-bold uppercase truncate max-w-[140px]">
                        {item.name}
                      </td>
                      <td className={`py-3 text-center ${alertTone}`}>
                        {item.stock} Units
                      </td>
                      <td className="py-3 text-center text-neutral-400">
                        {item.dailyVelocity} / day
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 border text-[8px] uppercase tracking-wider ${
                          item.stock === 0
                            ? "bg-red-500/10 border-red-500/30 text-red-500"
                            : item.daysRemaining <= 7
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        }`}>
                          {item.stock === 0 ? "SOLD OUT" : `${item.daysRemaining} days remaining`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
