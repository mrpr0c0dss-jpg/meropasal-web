'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Receipt,
  ShoppingBag,
  CreditCard,
  QrCode,
  Shield,
  Smartphone,
  Printer,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Share2,
  Users,
  Star,
  Zap,
  ChevronDown,
  Calculator,
  Store,
  Clock,
  Laptop,
  Coins,
  ShieldCheck,
  Check,
  MessageCircle,
  Package,
  Globe,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface HomePageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
  onLogin: () => void;
  onRegister?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateTab,
  onLaunchApp,
  onLogin,
  onRegister,
}) => {
  const { shop, updateShop, language, t } = useApp();

  // WAStore Style Claim Store Input State
  const [claimSlug, setClaimSlug] = useState<string>('');
  const [demoOrderAdded, setDemoOrderAdded] = useState<boolean>(false);

  const handleClaimStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (claimSlug.trim()) {
      updateShop({
        name: claimSlug.trim().replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) + ' Store',
        shopCode: `MP${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
    if (onRegister) {
      onRegister();
    } else {
      onLaunchApp();
    }
  };

  return (
    <div className="space-y-20 lg:space-y-28">
      {/* ── HERO SECTION (WASTORE INSPIRED 90-SECOND STORE BUILDER) ── */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>90-Second WhatsApp Store &amp; POS • 100% Free Forever</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.08]">
            Your shop on one link.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent block sm:inline">
              Every order in one place.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Build a real online store in about 90 seconds. Share one link anywhere — customers browse, pick and order, and itemized slips land straight in your WhatsApp and dashboard. <strong>0% commission.</strong>
          </p>

          {/* ── INSTANT STORE CLAIM INPUT BAR (WASTORE STYLE) ──── */}
          <div className="max-w-lg mx-auto pt-2">
            <form onSubmit={handleClaimStore} className="w-full">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 shadow-xl shadow-slate-900/5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <div className="flex items-center flex-1 w-full pl-4 pr-2">
                  <input
                    type="text"
                    placeholder="your-shop-name"
                    value={claimSlug}
                    onChange={(e) => setClaimSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full py-2.5 text-xs sm:text-sm font-semibold bg-transparent text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400"
                  />
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap">.meropasal.app</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md whitespace-nowrap active:scale-95"
                >
                  <span>Claim your store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Setup in 90 seconds</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Up to 50 products free</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>0% Commission</span>
            </span>
          </div>

          {/* ── LIVE INTERACTIVE STORE & DASHBOARD PREVIEW ─────── */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="p-3 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 shadow-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 text-left space-y-4 relative">
                {/* Browser Tab Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <div className="hidden sm:block ml-2 px-3 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500">
                      kathmandumart.meropasal.app
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Store Active &amp; Receiving Orders
                  </span>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Store Orders</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">148 Orders</p>
                    <p className="text-[10px] text-emerald-600 font-bold">+24 this week</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Online Sales (NPR)</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">Rs. 84,200</p>
                    <p className="text-[10px] text-emerald-600 font-bold">0% commission taken</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Catalog Capacity</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">50 / 50 SKUs</p>
                    <p className="text-[10px] text-blue-600 font-bold">Free Forever Tier</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Direct Channel</p>
                    <p className="text-xl font-black text-emerald-600 mt-0.5">WhatsApp + POS</p>
                    <p className="text-[10px] text-slate-400">Instant slip alerts</p>
                  </div>
                </div>

                {/* Floating WhatsApp Order Notification Pill */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-slate-900 dark:text-white">New WhatsApp Order • Rs. 1,450</p>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                          Just now
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Bikash Sharma • Basmati Rice 5kg, Wai Wai 10pcs • Delivery in New Baneshwor
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('store')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition whitespace-nowrap cursor-pointer"
                  >
                    View Storefront →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-STEP 90-SECOND SETUP PROCESS ───────────────────── */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">How It Works</h2>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            From zero to selling in 90 seconds
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            No complex developer setup. No monthly hosting fees. Just your store and your customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black text-base">
              01
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Add your products</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload product photos, set prices in Nepali Rupees, and organize them into categories like snacks, groceries, and beverages. Up to 50 products free.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-base">
              02
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Share your link anywhere</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Share your custom link on WhatsApp Status, Facebook, Instagram Bio, or print your QR code to place right at your cashier counter.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-black text-base">
              03
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Receive itemized orders</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Customers pick items and check out. You receive an instant pre-filled order slip on WhatsApp with customer name, items, address, and total amount.
            </p>
          </div>
        </div>
      </section>

      {/* ── KEY CAPABILITIES GRID ────────────────────────────── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Free Forever Features</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Everything You Need To Sell Online
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Up to 50 Products Free</h5>
            <p className="text-slate-500">List all your popular inventory items with images, units, and custom prices.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">0% Commission on Sales</h5>
            <p className="text-slate-500">Keep 100% of your earnings. No hidden transaction percentages taken.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Itemized WhatsApp Order Slips</h5>
            <p className="text-slate-500">Clean receipt text sent straight to your WhatsApp with full customer delivery details.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Fonepay &amp; eSewa QR Attached</h5>
            <p className="text-slate-500">Counter QR codes embedded directly on your store website for cashless payments.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Mobile-First Shopping Cart</h5>
            <p className="text-slate-500">Works smoothly on any smartphone with slide-out cart drawer and instant checkout.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Point of Sale (POS) Sync</h5>
            <p className="text-slate-500">In-store barcode billing and online catalog stay in perfect sync in one system.</p>
          </div>
        </div>
      </section>

      {/* ── WAPASAL HYPERLOCAL SPOTLIGHT ────────────────────── */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>WaPasal Local Discovery</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Looking to Buy from Nearby Stores in Nepal?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore <strong>WaPasal</strong> to fetch live products, pricing, and availability from verified Kirana stores, bakeries, dairies, and marts near your neighborhood.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-emerald-400">
              <span>✓ 15–30 Min WhatsApp Delivery</span>
              <span>✓ Direct Shopkeeper Prices</span>
              <span>✓ Fonepay / eSewa / Cash</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onNavigateTab('wapasal')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Nearby Products on WaPasal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CLAIM STORE CTA BANNER ────────────────────── */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
              100% Free Forever • No Setup Cost
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Create your free WhatsApp store now.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Join retail shops and marts across Nepal. Setup takes about 90 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Free Store Setup (90s)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('store')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
            >
              View Live Storefront Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
