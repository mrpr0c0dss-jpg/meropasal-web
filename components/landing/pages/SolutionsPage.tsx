'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShoppingBag,
  Store,
  Shirt,
  Smartphone,
  Pill,
  Wrench,
  Coffee,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Printer,
  Barcode,
  Users,
  CreditCard,
  Building,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface SolutionsPageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
  onLogin: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  onNavigateTab,
  onLaunchApp,
}) => {
  const { language } = useApp();
  const [selectedSolution, setSelectedSolution] = useState<string>('kirana');

  const solutions = [
    {
      id: 'kirana',
      title: 'Kirana & Grocery Stores',
      titleNe: 'किराना तथा खाद्यान्न पसल',
      icon: Store,
      badge: 'Most Popular for Local Retail',
      tagline: 'Track hundreds of loose & packaged items with rapid WhatsApp credit khata.',
      challenges: [
        'Huge daily volume of small Udharo transactions written in vulnerable paper khata',
        'Frequent network cuts and load shedding in local neighborhoods',
        'Many products without pre-printed barcodes (sugar, rice bags, local spices)',
      ],
      solutions: [
        'Built-in Barcode Sticker Maker for loose grains and repackaged goods',
        '1-Click automated WhatsApp Udharo reminders with polite Nepali text templates',
        '100% offline billing that runs smoothly on low-cost mobile phones or laptops',
      ],
      recommendedHardware: '58mm Portable Bluetooth Thermal Printer + USB 1D Barcode Scanner Gun',
      testimonial: {
        author: 'Shyam Sundar Maharjan',
        shop: 'Maharjan Kirana Pasal, Patan',
        quote:
          'Before MeroPasal, we lost thousands every Dashain because customer credit pages were misplaced or scribbled over. Now our entire Udharo ledger is backed up on the cloud and customers settle bills without dispute.',
      },
    },
    {
      id: 'mart',
      title: 'Supermarkets & Marts',
      titleNe: 'डिपार्टमेन्ट स्टोर तथा मार्ट',
      icon: ShoppingBag,
      badge: 'High Volume Multi-Counter',
      tagline: 'High-speed multi-counter checkout with simultaneous staff access.',
      challenges: [
        'Long customer queues during evening peak rush hours',
        'Need multiple cashiers billing simultaneously without buying expensive servers',
        'Managing thousands of product SKUs, minimum stock alerts, and VAT compliance',
      ],
      solutions: [
        'Instant 6-digit staff join codes to add unlimited billing counters in seconds',
        'Keyboard shortcuts (⌘1 to ⌘9) and laser scanner gun support for 3-second checkout',
        'PAN/VAT compliant 80mm thermal receipts with detailed tax itemization',
      ],
      recommendedHardware: '80mm USB/LAN Thermal POS Printer + 2D Hands-free Scanner Gun + RJ11 Cash Drawer',
      testimonial: {
        author: 'Niraj Shrestha',
        shop: 'Green Supermart, Pokhara',
        quote:
          'We run 3 active checkout counters using MeroPasal. Setting up additional counters during festive sales took less than 2 minutes using staff join codes on tablets.',
      },
    },
    {
      id: 'clothing',
      title: 'Fashion & Clothing Stores',
      titleNe: 'कपडा तथा फेसन बुटिक',
      icon: Shirt,
      badge: 'Apparel & Footwear',
      tagline: 'Manage sizes, colors, categories, and custom branded barcode price tags.',
      challenges: [
        'Items arrive in bulk without barcode price tags attached',
        'Managing frequent seasonal sales, festive discounts, and loyal customer tabs',
        'Customers requesting itemized digital receipts via WhatsApp',
      ],
      solutions: [
        'Print custom price tag barcode labels with shop name and garment sizes',
        'Instant percentage or fixed rupee discounts applied at checkout',
        'WhatsApp tax invoices sent directly to customer phones with shop branding',
      ],
      recommendedHardware: 'Adhesive Barcode Label Printer + 58mm/80mm Thermal Printer',
      testimonial: {
        author: 'Suman Thapa',
        shop: 'Trendy Collection, Chitwan',
        quote:
          'Our garment tags look professional with custom barcodes. Customers love receiving their bills directly on WhatsApp!',
      },
    },
    {
      id: 'mobile',
      title: 'Mobile & Electronics Shops',
      titleNe: 'मोबाइल तथा इलेक्ट्रोनिक्स पसल',
      icon: Smartphone,
      badge: 'IMEI & Serial Management',
      tagline: 'Record device IMEIs, warranty receipts, and repair service payments.',
      challenges: [
        'Need to track serial numbers and accessories inventory',
        'High ticket transactions requiring digital payment split (Fonepay QR + Cash)',
        'Managing supplier purchase invoices and technician expenses',
      ],
      solutions: [
        'Quick serial/IMEI barcode scanner input directly on POS invoices',
        'Comprehensive expense tracking for shop rent, repairs, and supplier payments',
        'Dual payment support with live Fonepay and eSewa QR display',
      ],
      recommendedHardware: '2D QR / Barcode Scanner + 80mm Thermal Receipt Printer',
      testimonial: {
        author: 'Dipak Acharya',
        shop: 'Smart Tech Hub, Biratnagar',
        quote:
          'Tracking both sales and daily repair expenses in one app has streamlined our financial audits completely.',
      },
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy & Healthcare',
      titleNe: 'औषधि पसल तथा हेल्थकेयर',
      icon: Pill,
      badge: 'Fast Billing & Customer History',
      tagline: 'Quick customer search, medicine dosage notes, and rapid billing.',
      challenges: [
        'Emergency rush requiring rapid medicine search by name or barcode',
        'Regular chronic disease patients maintaining monthly medicine credit',
        'Preserving clear transaction audit history for safety and accounts',
      ],
      solutions: [
        'Instant Global Search (⌘K) to find any medicine or customer profile in 0.1s',
        'Customer credit history showing exact previous medicine purchases',
        'Clean printed thermal prescription receipts with shop license details',
      ],
      recommendedHardware: 'Desktop POS or Laptop + 58mm Bluetooth/USB Printer',
      testimonial: {
        author: 'Dr. Praveen Giri',
        shop: 'Giri Medical & Surgical, Butwal',
        quote:
          'Regular patients who take BP or Diabetes medication monthly can be billed in seconds with complete credit history.',
      },
    },
    {
      id: 'hardware',
      title: 'Hardware & Sanitary Stores',
      titleNe: 'हार्डवेयर तथा निर्माण सामग्री',
      icon: Wrench,
      badge: 'Heavy Credit & Construction Billing',
      tagline: 'Track contractor credit ledgers, heavy items, and multiple partial repayments.',
      challenges: [
        'Large contractor Udharo balances requiring multiple installments over months',
        'Bulky materials, pipes, fittings, and variable unit measurements',
        'Need clear statement of accounts for contractors and builders',
      ],
      solutions: [
        'Comprehensive Udharo ledger showing all historical payments and balance statements',
        'WhatsApp account statements dispatched to contractors with one tap',
        'Supplier payable management to balance incoming and outgoing credit',
      ],
      recommendedHardware: 'Standard Windows/Mac Desktop or Laptop + 80mm Thermal Printer',
      testimonial: {
        author: 'Kedar Sharma',
        shop: 'Sharma Hardware Suppliers, Hetauda',
        quote:
          'Contractor credit accounting used to cause huge friction. With MeroPasal, every single bag of cement and fitting is logged with date and time.',
      },
    },
  ];

  const current = solutions.find((s) => s.id === selectedSolution) || solutions[0];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Building className="w-3.5 h-3.5 text-blue-500" />
          <span>Tailored For Your Business</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Solutions Customized For Every Nepali Retailer
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From neighborhood grocery stores in Kathmandu to bustling marts in Pokhara and wholesale suppliers in Birgunj — discover how MeroPasal adapts to your specific shop workflow.
        </p>

        {/* Industry Selector Grid */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            const isSelected = selectedSolution === sol.id;
            return (
              <button
                key={sol.id}
                onClick={() => setSelectedSolution(sol.id)}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold leading-tight">
                  {language === 'ne' ? sol.titleNe : sol.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── ACTIVE SOLUTION DETAIL SHOWCASE ───────────────────── */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800">
                {current.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {language === 'ne' ? current.titleNe : current.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{current.tagline}</p>
            </div>
          </div>

          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-2"
          >
            <span>Launch POS Demo For This Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column: Problem vs MeroPasal Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Everyday Challenges */}
          <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 space-y-4">
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wide flex items-center gap-2">
              <span>⚠️ Common Bottlenecks in Traditional Setup</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {current.challenges.map((ch, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How MeroPasal Solves It */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-4">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-2">
              <span>✅ How MeroPasal Empowers You</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {current.solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Setup & Verified Testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Printer className="w-4 h-4" />
              <span>Recommended Hardware Setup</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {current.recommendedHardware}
            </p>
            <button
              onClick={() => onNavigateTab('hardware')}
              className="text-[11px] font-bold text-blue-600 hover:underline pt-1 inline-flex items-center gap-1"
            >
              <span>View Hardware Compatibility Guide →</span>
            </button>
          </div>

          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              &ldquo;{current.testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div>
                <strong className="text-slate-900 dark:text-white">{current.testimonial.author}</strong>
                <p className="text-[11px] text-slate-400">{current.testimonial.shop}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                Verified Merchant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Don&apos;t see your exact shop type listed?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          MeroPasal is completely customizable. Contact our Kathmandu support engineers for a customized demonstration.
        </p>
        <button
          onClick={() => onNavigateTab('contact')}
          className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
        >
          Book a Free Consultation →
        </button>
      </section>
    </div>
  );
};
