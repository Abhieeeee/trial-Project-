'use client';

import { useState, useMemo } from 'react';
import PageShell from '@/components/PageShell';
import PageIntro from '@/components/PageIntro';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Package,
  CreditCard,
  Truck,
  RefreshCcw,
  Ruler,
  Shield,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

/* ──────────────────────────── Data ──────────────────────────── */

type Category = 'Orders' | 'Shipping' | 'Returns' | 'Sizing' | 'Payment';

interface FaqItem {
  id: number;
  category: Category;
  question: string;
  answer: string;
}

const categoryMeta: Record<Category, { icon: typeof Package; color: string }> = {
  Orders:   { icon: Package,    color: 'text-sky-400' },
  Shipping: { icon: Truck,      color: 'text-emerald-400' },
  Returns:  { icon: RefreshCcw, color: 'text-amber-400' },
  Sizing:   { icon: Ruler,      color: 'text-violet-400' },
  Payment:  { icon: CreditCard, color: 'text-rose-400' },
};

const faqs: FaqItem[] = [
  /* ── Orders ── */
  {
    id: 1,
    category: 'Orders',
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you will receive an email with a tracking number and a direct link to the carrier\'s tracking page. You can also view real-time status updates inside your AURA.STREET account under "Order History".',
  },
  {
    id: 2,
    category: 'Orders',
    question: 'Can I modify my order after placing it?',
    answer:
      'Modifications are possible within the first 30 minutes of placing your order, provided it has not moved to "Packed" status. Contact our support team immediately through live chat or email — we operate 24/7 during drop windows.',
  },
  {
    id: 3,
    category: 'Orders',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and select regional wallets. Cryptocurrency payments via USDC are available for orders over $500.',
  },

  /* ── Shipping ── */
  {
    id: 4,
    category: 'Shipping',
    question: 'What are the shipping options?',
    answer:
      'We offer Standard (5–7 business days), Express (2–3 business days), and Next-Day Priority. All orders over $300 qualify for complimentary Express shipping. Limited-edition capsules always ship Express at no extra cost.',
  },
  {
    id: 5,
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer:
      'Yes. We ship to over 60 countries worldwide. International duties and taxes are calculated and collected at checkout so there are no surprise fees on delivery. Typical international delivery is 7–14 business days.',
  },
  {
    id: 6,
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer:
      'Domestic orders typically arrive within 2–7 business days depending on the shipping tier selected. Limited drops and pre-order items may have extended timelines noted on the product page.',
  },

  /* ── Returns ── */
  {
    id: 7,
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return window from the delivery date. Items must be unworn, unwashed, and in original packaging with all tags attached. Limited-edition numbered pieces are final sale.',
  },
  {
    id: 8,
    category: 'Returns',
    question: 'How do I start a return?',
    answer:
      'Navigate to "Order History" in your account, select the order, and click "Request Return". You will receive a prepaid return label via email within 24 hours. Drop the package at any authorized carrier location.',
  },
  {
    id: 9,
    category: 'Returns',
    question: 'When will I receive my refund?',
    answer:
      'Refunds are processed within 3–5 business days after we receive and inspect the returned item. The credit will appear on your original payment method within one billing cycle.',
  },

  /* ── Sizing ── */
  {
    id: 10,
    category: 'Sizing',
    question: 'How do I find my size?',
    answer:
      'Each product page includes a detailed size guide with measurements in both centimeters and inches. We also provide a body-measurement calculator — enter your chest, waist, and hip measurements to receive a personalized recommendation.',
  },
  {
    id: 11,
    category: 'Sizing',
    question: 'Do your clothes run true to size?',
    answer:
      'Most AURA.STREET pieces are designed with an intentional oversized techwear silhouette. If you prefer a closer fit, we recommend sizing down. Specific fit notes are listed on every product page.',
  },
  {
    id: 12,
    category: 'Sizing',
    question: 'Can I exchange for a different size?',
    answer:
      'Absolutely. Size exchanges are free of charge within 30 days. Initiate an exchange through your account or contact support. We will ship the new size as soon as the return is scanned by the carrier.',
  },
];

const categories: Array<'All' | Category> = [
  'All',
  'Orders',
  'Shipping',
  'Returns',
  'Sizing',
  'Payment',
];

/* ──────────────────────────── Animation Variants ──────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const answerVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }, opacity: { duration: 0.25, delay: 0.1 } },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }, opacity: { duration: 0.15 } },
  },
};

/* ──────────────────────────── Component ──────────────────────────── */

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch =
        search.trim() === '' ||
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <PageShell>
      <PageIntro
        eyebrow="FAQ"
        title="Questions before the drop"
        text="Answers for shipping, payments, order updates, returns, sizing, and limited releases."
      />

      {/* ── Search Bar ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 md:px-12 max-w-4xl mx-auto mt-4 mb-8"
      >
        <div className="glass-panel-glow rounded-2xl flex items-center gap-3 px-5 py-4">
          <Search className="w-5 h-5 text-neutral-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenId(null);
            }}
            placeholder="Search questions…"
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none caret-sky-400"
          />
          {search.length > 0 && (
            <button
              onClick={() => setSearch('')}
              className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors duration-[220ms]"
            >
              Clear
            </button>
          )}
        </div>
      </motion.section>

      {/* ── Category Filter Pills ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="px-6 md:px-12 max-w-4xl mx-auto mb-12"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const meta = cat !== 'All' ? categoryMeta[cat] : null;
            const Icon = meta?.icon ?? Shield;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] font-extrabold
                  transition-all duration-[220ms] border
                  ${
                    isActive
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/[0.06] bg-white/[0.02] text-neutral-500 hover:border-white/10 hover:text-neutral-300'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive && meta ? meta.color : 'text-neutral-600 group-hover:text-neutral-400'} transition-colors duration-[220ms]`} />
                {cat}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── FAQ Accordion List ── */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-16">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel-glow rounded-2xl p-12 text-center"
          >
            <Search className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
            <p className="text-sm text-neutral-400">
              No questions match your search. Try a different keyword or category.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-3"
            key={`${activeCategory}-${search}`}
          >
            {filtered.map((faq) => {
              const isOpen = openId === faq.id;
              const meta = categoryMeta[faq.category];
              const Icon = meta.icon;

              return (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  className="glass-panel-glow rounded-xl overflow-hidden"
                >
                  {/* Question Row */}
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left group transition-colors duration-[220ms] hover:bg-white/[0.03]"
                  >
                    {/* Category Icon */}
                    <div
                      className={`
                        shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                        bg-white/[0.04] border border-white/[0.06]
                        transition-all duration-[220ms] group-hover:border-white/10
                      `}
                    >
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                    </div>

                    {/* Question Text */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-600 block mb-1">
                        {faq.category}
                      </span>
                      <span className="text-sm text-neutral-200 font-medium leading-snug block group-hover:text-white transition-colors duration-[220ms]">
                        {faq.question}
                      </span>
                    </div>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-[220ms]" />
                    </motion.div>
                  </button>

                  {/* Answer Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        variants={answerVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 pl-[4.75rem]">
                          <div className="w-full h-px bg-gradient-to-r from-white/[0.06] via-white/[0.1] to-white/[0.06] mb-4" />
                          <p className="text-sm text-neutral-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ── Stats Ribbon ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 md:px-12 max-w-4xl mx-auto pb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Avg Response', value: '<2 hrs' },
            { label: 'Satisfaction', value: '98.7%' },
            { label: 'Countries', value: '60+' },
            { label: 'Return Window', value: '30 days' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="glass-panel-glow rounded-xl p-5 text-center"
            >
              <p className="text-lg font-bold text-white font-[family-name:var(--font-syne)]">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-600 mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Still Need Help? CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 md:px-12 max-w-4xl mx-auto pb-28"
      >
        <div className="glass-panel-glow rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          {/* Decorative gradient blob */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-500/[0.04] rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <Shield className="w-8 h-8 text-neutral-600 mx-auto mb-5" />
            <h2 className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-500 mb-3">
              Still need help?
            </h2>
            <p className="text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-syne)] mb-3">
              Our team is standing by
            </p>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Reach out directly and we&apos;ll
              get back to you within 2 hours — 24/7 during active drops.
            </p>
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                bg-white text-black text-[11px] uppercase tracking-[0.2em] font-extrabold
                hover:bg-neutral-200 transition-all duration-[220ms]
                hover:gap-3.5
              "
            >
              Contact Support
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.section>
    </PageShell>
  );
}
