'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Check,
  X,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Printer,
  Barcode,
  Users,
  CreditCard,
  CloudLightning,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface PricingPageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
  onLogin: () => void;
  onRegister?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateTab,
  onLaunchApp,
  onLogin,
  onRegister,
}) => {
  const { language } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const pricingPlans = [
    {
      name: 'Starter Kirana',
      nameNe: 'स्टार्टर किराना',
      tagline: 'Ideal for small local shops, single counters & micro-retailers',
      priceMonthly: 0,
      priceYearly: 0,
      badge: 'Free Forever',
      features: [
        'Up to 150 inventory products',
        'Standard Point of Sale (POS) billing',
        'Customer Udharo (Credit) Ledger',
        'Cash & Single QR payment',
        'Basic daily sales summary',
        'Offline browser memory backup',
        'Community email support',
      ],
      ctaText: 'Start Free Forever',
      popular: false,
    },
    {
      name: 'Pro Business',
      nameNe: 'प्रो बिजनेस',
      tagline: 'Best for busy retail shops, marts & growing general stores',
      priceMonthly: 499,
      priceYearly: 4490,
      badge: 'Most Popular ⭐',
      features: [
        'Unlimited products & categories',
        '58mm & 80mm Thermal Printer support',
        '1-Click WhatsApp Tax Invoice sharing',
        'Automated WhatsApp Udharo debt reminders',
        'Fonepay, eSewa & Khalti dynamic QR',
        'Barcode camera & scanner gun support',
        'Real-time Firestore cloud synchronization',
        'Multi-staff cashiers with 6-digit join codes',
        'Priority Phone & WhatsApp Support',
      ],
      ctaText: 'Launch Pro POS (Free Trial)',
      popular: true,
    },
    {
      name: 'Enterprise / Mart',
      nameNe: 'इन्टरप्राइज / मार्ट',
      tagline: 'For department stores, wholesalers & multi-branch operations',
      priceMonthly: 1299,
      priceYearly: 11990,
      badge: 'Advanced Marts',
      features: [
        'Everything in Pro Business',
        'Multi-branch / multi-location sync',
        'Supplier accounts & purchase orders',
        'PAN / VAT tax audit export (Excel & CSV)',
        'Staff permission matrix & cashier audit logs',
        'Dedicated VIP phone & WhatsApp support',
        'Free thermal printer setup assistance in Nepal',
        'Custom domain integration for web store',
      ],
      ctaText: 'Contact Enterprise Sales',
      popular: false,
    },
  ];

  const comparisonCategories = [
    {
      category: 'Point of Sale & Billing',
      rows: [
        { feature: 'POS Checkout Speed', starter: 'Standard', pro: 'Ultra-Fast (<3s)', enterprise: 'Dedicated Turbo Engine' },
        { feature: 'Barcode Scanner Gun Support', starter: false, pro: true, enterprise: true },
        { feature: 'Line Item & Bill Discounts', starter: true, pro: true, enterprise: true },
        { feature: 'Split Payments (Cash + QR + Credit)', starter: false, pro: true, enterprise: true },
        { feature: 'Thermal Receipt Printing (58mm/80mm)', starter: false, pro: true, enterprise: true },
        { feature: 'Custom Shop PAN/VAT on Receipts', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Udharo Khata & Customer Relations',
      rows: [
        { feature: 'Digital Customer Passbook', starter: true, pro: true, enterprise: true },
        { feature: '1-Click WhatsApp Invoices', starter: false, pro: true, enterprise: true },
        { feature: 'Automated WhatsApp Udharo Reminders', starter: false, pro: true, enterprise: true },
        { feature: 'Credit Limit Warnings', starter: false, pro: true, enterprise: true },
        { feature: 'Customer Transaction Statements', starter: 'Basic', pro: 'Itemized PDF/WhatsApp', enterprise: 'Full Historical Audit' },
      ],
    },
    {
      category: 'Inventory & Stock Control',
      rows: [
        { feature: 'Max Product SKUs', starter: '150 Items', pro: 'Unlimited', enterprise: 'Unlimited' },
        { feature: 'Low Stock Auto-Alerts', starter: false, pro: true, enterprise: true },
        { feature: 'Built-in Barcode Sticker Maker', starter: false, pro: true, enterprise: true },
        { feature: 'Supplier Ledger & Purchase Orders', starter: false, pro: false, enterprise: true },
        { feature: 'Profit Margin & Cost Tracking', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Staff, Multi-Counter & Cloud',
      rows: [
        { feature: '6-Digit Staff Join Code', starter: false, pro: true, enterprise: true },
        { feature: 'Simultaneous Cashier Counters', starter: '1 Counter', pro: 'Up to 5 Counters', enterprise: 'Unlimited Counters' },
        { feature: 'Role-Based Permissions & Lockout', starter: false, pro: 'Standard', enterprise: 'Advanced Matrix' },
        { feature: '100% Offline Resilience', starter: true, pro: true, enterprise: true },
        { feature: 'Realtime Cloud Database Sync', starter: false, pro: true, enterprise: true },
        { feature: 'Multi-Branch Sync', starter: false, pro: false, enterprise: true },
      ],
    },
  ];

  const pricingFaqs = [
    {
      q: 'Is the Starter Kirana plan really 100% free forever?',
      a: 'Yes! The Starter Kirana plan has zero monthly charges, zero setup fees, and no expiry date. It is built to help small neighborhood shops transition from paper khata to digital billing without any financial barrier.',
    },
    {
      q: 'How does payment work for Pro Business in Nepal?',
      a: 'We accept all major Nepali payment methods including Fonepay QR, eSewa, Khalti, ConnectIPS, and direct bank transfers. You receive a verified tax invoice immediately upon payment.',
    },
    {
      q: 'Can I switch from Monthly to Yearly anytime?',
      a: 'Yes, you can upgrade or adjust your billing cycle at any time from your shop settings. Upgrading to yearly instantly applies the 25% discount.',
    },
    {
      q: 'Do I need to purchase specific hardware or can I use my existing phone/laptop?',
      a: 'MeroPasal works on any device you already own! You can run it on an Android phone, iPhone, iPad, Windows PC, Mac, or dedicated POS terminal. Any standard Bluetooth/USB thermal printer is compatible.',
    },
    {
      q: 'What happens to my data if my internet connection is lost?',
      a: 'Your sales and customer balances continue working smoothly in offline mode. All data is saved on your device and uploads securely to the cloud as soon as you reconnect.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Simple, Transparent Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Affordable Plans For Every Shop Size
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No hidden fees. Switch or cancel anytime. All prices in Nepali Rupees (NPR).
        </p>

        {/* Monthly / Yearly Switch */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-bold">
          <span className={billingCycle === 'monthly' ? 'text-blue-600 font-black' : 'text-slate-500'}>
            Billed Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-13 h-7 rounded-full bg-blue-600 p-1 flex items-center transition relative shadow-inner"
            aria-label="Toggle Billing Cycle"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={billingCycle === 'yearly' ? 'text-blue-600 font-black' : 'text-slate-500'}>
            Billed Yearly <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 px-2 py-0.5 rounded-full font-extrabold ml-1">Save 25%</span>
          </span>
        </div>
      </section>

      {/* ── 3 PRICING TIERS ──────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pricingPlans.map((plan, idx) => {
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
          const period = billingCycle === 'yearly' ? '/ year' : '/ month';

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-white dark:bg-[#111827] border-2 border-blue-600 shadow-2xl shadow-blue-500/15 scale-102 z-10'
                  : 'bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  {plan.badge}
                </span>
              )}

              <div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                      {price === 0 ? 'Free' : `Rs. ${price.toLocaleString()}`}
                    </span>
                    {price > 0 && <span className="text-xs text-slate-400 font-semibold">{period}</span>}
                  </div>
                  {price > 0 && billingCycle === 'yearly' && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">
                      Equivalent to only Rs. {Math.round(price / 12)} / month
                    </p>
                  )}
                </div>

                {/* Feature checklist */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={onLaunchApp}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── FULL FEATURE COMPARISON TABLE ─────────────────────── */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Detailed Plan Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare all features side-by-side to choose the best tier for your shop.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white w-1/3">Features</th>
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white text-center">Starter Kirana (Free)</th>
                <th className="py-3 px-4 font-bold text-blue-600 text-center">Pro Business</th>
                <th className="py-3 px-4 font-bold text-indigo-600 text-center">Enterprise Mart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparisonCategories.map((cat, cIdx) => (
                <React.Fragment key={cIdx}>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td colSpan={4} className="py-2.5 px-4 font-black text-[11px] text-blue-600 uppercase tracking-wider">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{row.starter}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-blue-600">{row.pro}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-indigo-600">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── PRICING FAQS ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Pricing Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Clear answers to help you choose with full confidence.
          </p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#111827] transition"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    activeFaq === i ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
