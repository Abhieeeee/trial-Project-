'use client';

import { motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Shield,
  User,
} from 'lucide-react';

import PageIntro from '@/components/PageIntro';
import PageShell from '@/components/PageShell';

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { label: 'Orders', value: '23' },
  { label: 'Wishlist', value: '8' },
  { label: 'Returns', value: '1' },
  { label: 'Points', value: '4,280' },
];

const menuItems = [
  {
    icon: Package,
    title: 'Order History',
    description: 'Track your orders and manage returns',
  },
  {
    icon: MapPin,
    title: 'Saved Addresses',
    description: 'Manage shipping destinations',
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Cards, wallets and billing',
  },
  {
    icon: Heart,
    title: 'Wishlist',
    description: 'Your saved items',
    badge: '8 items',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Manage your preferences',
  },
  {
    icon: Shield,
    title: 'Account Security',
    description: 'Password, 2FA, privacy',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AccountPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Account"
        title="Your Account"
        text="Manage your profile, orders, saved items and account settings — all in one place."
      />

      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-32 space-y-12">
        {/* -------------------------------------------------------- */}
        {/*  Profile Header                                          */}
        {/* -------------------------------------------------------- */}
        <motion.div
          className="glass-panel-glow rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Avatar */}
          <motion.div variants={staggerItem} className="shrink-0">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-sky/60 to-purple-500/60 p-[2px]">
              <div className="w-full h-full rounded-full bg-brand-dark flex items-center justify-center">
                <span className="text-2xl font-extrabold tracking-wider text-white/90 font-[family-name:var(--font-syne)]">
                  MR
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div variants={staggerItem} className="text-center md:text-left flex-1">
            <h2 className="text-xl font-bold tracking-tight text-white font-[family-name:var(--font-syne)]">
              Maya Rivera
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Member since June 2024</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-brand-sky/10 border border-brand-sky/20 text-[10px] uppercase tracking-[0.25em] font-extrabold text-brand-sky">
              Platinum Member
            </span>
          </motion.div>

          {/* Edit Button */}
          <motion.button
            variants={staggerItem}
            className="shrink-0 px-5 py-2.5 rounded-lg border border-white/10 text-xs uppercase tracking-[0.2em] font-bold text-white/70 hover:text-white hover:border-white/25 transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
          >
            Edit Profile
          </motion.button>
        </motion.div>

        {/* -------------------------------------------------------- */}
        {/*  Stats Row                                               */}
        {/* -------------------------------------------------------- */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              className="glass-panel-glow rounded-xl p-6 text-center"
            >
              <p className="text-2xl font-extrabold text-white font-[family-name:var(--font-syne)]">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-500 mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* -------------------------------------------------------- */}
        {/*  Menu Sections                                           */}
        {/* -------------------------------------------------------- */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {menuItems.map((item) => (
            <motion.button
              key={item.title}
              variants={staggerItem}
              className="w-full glass-panel-glow rounded-xl p-5 md:p-6 flex items-center gap-5 group cursor-pointer text-left transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/10"
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center transition-colors duration-[220ms] group-hover:bg-brand-sky/10 group-hover:border-brand-sky/20">
                <item.icon className="w-4 h-4 text-neutral-400 group-hover:text-brand-sky transition-colors duration-[220ms]" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors duration-[220ms]">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-sky/10 text-[10px] uppercase tracking-[0.2em] font-extrabold text-brand-sky">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 shrink-0 text-neutral-600 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-[220ms]" />
            </motion.button>
          ))}
        </motion.div>

        {/* -------------------------------------------------------- */}
        {/*  Sign Out                                                */}
        {/* -------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-[0.25em] font-extrabold text-neutral-500 hover:text-red-500 hover:border-red-500/25 hover:bg-red-500/[0.04] transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </section>
    </PageShell>
  );
}
