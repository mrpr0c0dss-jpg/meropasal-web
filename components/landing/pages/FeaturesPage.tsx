'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Receipt,
  Barcode,
  Share2,
  BookOpen,
  Users,
  Printer,
  CloudLightning,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Layers,
  Smartphone,
  CreditCard,
  QrCode,
  Tag,
  Clock,
  Laptop,
  Check,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface FeaturesPageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
  onLogin: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onNavigateTab,
  onLaunchApp,
}) => {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('pos');

  const categories = [
    { id: 'pos', name: 'High-Speed POS Billing', icon: Receipt },
    { id: 'udharo', name: 'WhatsApp & Udharo Khata', icon: BookOpen },
    { id: 'inventory', name: 'Inventory & Barcodes', icon: Barcode },
    { id: 'staff', name: 'Multi-Staff Join Codes', icon: Users },
    { id: 'printing', name: 'Thermal Printing Engine', icon: Printer },
    { id: 'offline', name: 'Offline & Cloud Sync', icon: CloudLightning },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ── HEADER INTRO ─────────────────────────────────────── */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Complete Feature Matrix</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Engineered For Speed, Simplicity &amp; Power
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Every tool in MeroPasal is built to reduce customer queue wait times, eliminate handwriting mistakes in Udharo books, and give shop owners absolute control.
        </p>

        {/* Category Tabs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── ACTIVE FEATURE SECTION DEEP DIVE ─────────────────── */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* TAB 1: POS Billing */}
        {activeCategory === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Ultra-Fast POS Checkout Under 5 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether you use a desktop PC, laptop, or mobile tablet, our POS checkout interface is designed for high rush hours.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Barcode &amp; Camera Scanning:</strong> Works with both USB handheld laser guns and mobile phone cameras.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Quick Keyboard Shortcuts (⌘1 - ⌘9):</strong> Switch between billing, stock, and credit ledgers in a flash without touching the mouse.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Split Payments:</strong> Accept partial Cash, Fonepay QR, and Udharo credit on the exact same invoice.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <span>Test Live POS Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Interactive POS Showcase */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500">
                <span>ITEM</span>
                <span>QTY x RATE</span>
                <span>TOTAL</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                <span>Wai Wai 2PM Noodles</span>
                <span>5 x Rs. 25</span>
                <span className="font-bold">Rs. 125</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                <span>Real Juice 1L Guava</span>
                <span>2 x Rs. 280</span>
                <span className="font-bold">Rs. 560</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                <span>Colgate Total 150g</span>
                <span>1 x Rs. 165</span>
                <span className="font-bold">Rs. 165</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 font-sans">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>Rs. 850</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-bold">
                  <span>Discount (5%)</span>
                  <span>- Rs. 42.50</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1">
                  <span>Net Payable</span>
                  <span className="text-blue-600 text-base">Rs. 807.50</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WhatsApp & Udharo */}
        {activeCategory === 'udharo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Digital Udharo Khata with 1-Tap WhatsApp Alerts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Say goodbye to missing ledger pages, torn notebooks, and forgotten credit amounts.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Individual Customer Passbook:</strong> Maintain exact chronological debt and payment records for every regular customer.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Polite WhatsApp Reminders:</strong> One click generates a courteous bilingual Nepali/English message with outstanding balance.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Credit Limits &amp; Warnings:</strong> Get warned automatically when a customer exceeds their permitted credit threshold.
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Message Preview */}
            <div className="p-5 rounded-2xl bg-[#EFEAE2] dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-3">
              <div className="p-3 bg-white dark:bg-[#111827] rounded-xl rounded-tl-none shadow-sm text-xs space-y-1.5 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <p className="font-bold text-emerald-600 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> MeroPasal Automated Reminder
                </p>
                <p className="text-[11px] leading-relaxed">
                  नमस्ते Bikash Sharma ज्यु, तपाइँको <strong>Kathmandu Kirana Pasal</strong> मा कुल बाँकी उधारो रकम <strong>रु. ३,४५०</strong> छ। कृपया सुविधा अनुसार भुक्तानी गरिदिनुहोला। धन्यवाद!
                </p>
                <p className="text-[10px] text-slate-400 text-right">10:45 AM ✓✓</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Inventory */}
        {activeCategory === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Barcode className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Live Inventory &amp; Built-In Barcode Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track stock in real-time. Even items without manufacturer barcodes (like fresh pulses, sugar, or local clothes) can have custom barcodes printed instantly.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Low Stock Alerts:</strong> Instant badge counts when quantities fall below your designated minimum threshold.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Custom Barcode Sticker Tool:</strong> Generate standard CODE128 labels and print to standard A4 or adhesive label rolls.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Sample Generated Barcode</p>
              <div className="p-4 bg-white rounded-xl inline-block shadow-sm">
                <div className="h-14 w-48 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 flex items-center justify-center text-white font-mono text-xs tracking-widest">
                  ||||| | |||| || |||
                </div>
                <p className="font-mono text-xs font-bold text-slate-900 mt-1">MP-98412026</p>
              </div>
              <p className="text-[11px] text-slate-400">Pure Ghee 1L (Shree Krishna) • Rs. 1,150</p>
            </div>
          </div>
        )}

        {/* TAB 4: Staff */}
        {activeCategory === 'staff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Multi-Counter Staff Access in 10 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Add cashiers, family members, or helper staff without sharing your master admin passwords.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">6-Digit Join Code:</strong> Staff members enter the shop code on their phone to start processing bills immediately.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Cashier Privacy Safeguard:</strong> Staff can make sales and collect money but cannot delete products or view profit margins.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-4 text-center">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Shop Join Passcode</p>
              <div className="flex justify-center gap-2">
                {['8', '4', '1', '9', '2', '0'].map((digit, i) => (
                  <div
                    key={i}
                    className="w-10 h-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-400 text-indigo-600 dark:text-indigo-400 font-mono font-black text-xl flex items-center justify-center shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Active for Cashier Counter #2 &amp; Counter #3
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Thermal Printing */}
        {activeCategory === 'printing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                58mm &amp; 80mm ESC/POS Thermal Printing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect to any portable Bluetooth receipt printer, desktop USB POS printer, or WiFi network printer.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">PAN/VAT Compliant Header:</strong> Displays your registered Shop PAN, address, invoice number, and cashier name.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Nepali Receipt Greetings:</strong> Add custom footer messages like &ldquo;धन्यवाद ! फेरी आउनुहोला&rdquo;.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('hardware')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-2"
                >
                  <span>Open Interactive Receipt Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-center space-y-2 max-w-xs mx-auto shadow-sm">
              <p className="font-bold text-slate-900 dark:text-white">*** KATHMANDU MART ***</p>
              <p className="text-slate-500">PAN: 601234567 • Tel: 01-4400000</p>
              <p className="border-b border-dashed border-slate-400 pb-1 text-slate-400">==========================</p>
              <div className="text-left space-y-1">
                <div className="flex justify-between">
                  <span>Rice 25kg Taichin</span>
                  <span>Rs. 2,450</span>
                </div>
                <div className="flex justify-between">
                  <span>Mustard Oil 2L</span>
                  <span>Rs. 580</span>
                </div>
              </div>
              <p className="border-b border-dashed border-slate-400 pb-1 text-slate-400">==========================</p>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>TOTAL:</span>
                <span>Rs. 3,030</span>
              </div>
              <p className="pt-2 text-slate-500">धन्यवाद ! फेरी आउनुहोला</p>
            </div>
          </div>
        )}

        {/* TAB 6: Offline & Cloud */}
        {activeCategory === 'offline' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <CloudLightning className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                100% Offline Resilience + Instant Cloud Backup
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Nepal&apos;s internet can drop, but your counter billing never stops.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Offline IndexedDB Storage:</strong> Sales, customers, and stock are saved locally on your device in real-time.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Auto-Sync On Reconnect:</strong> As soon as WiFi or mobile data restores, all sales sync smoothly to your private database.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CloudLightning className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Always Ready, Online or Offline</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No internet? No problem. Generate receipts seamlessly and let MeroPasal take care of background synchronization.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── SHORTCUTS CHEAT SHEET ────────────────────────────── */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xl sm:text-2xl font-black">Cashier Keyboard Hotkeys (Power Users)</h3>
          <p className="text-xs text-slate-400">Never take your fingers off the keyboard during peak checkout rush.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <span className="text-slate-400">Quick POS</span>
            <kbd className="px-2 py-1 bg-slate-700 text-blue-400 rounded-md font-bold">⌘ + 2</kbd>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <span className="text-slate-400">Global Search</span>
            <kbd className="px-2 py-1 bg-slate-700 text-emerald-400 rounded-md font-bold">⌘ + K</kbd>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <span className="text-slate-400">Stock Inventory</span>
            <kbd className="px-2 py-1 bg-slate-700 text-amber-400 rounded-md font-bold">⌘ + 3</kbd>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
            <span className="text-slate-400">Udharo Khata</span>
            <kbd className="px-2 py-1 bg-slate-700 text-purple-400 rounded-md font-bold">⌘ + 5</kbd>
          </div>
        </div>
      </section>
    </div>
  );
};
