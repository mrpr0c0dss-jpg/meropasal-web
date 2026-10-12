'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Printer,
  Barcode,
  Tv,
  Scale,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
  Check,
  Zap,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface HardwarePageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
}

export const HardwarePage: React.FC<HardwarePageProps> = ({
  onNavigateTab,
  onLaunchApp,
}) => {
  const { language } = useApp();

  // Interactive Live Receipt Simulator State
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');
  const [shopName, setShopName] = useState<string>('KATHMANDU MART & KIRANA');
  const [panNumber, setPanNumber] = useState<string>('601234567');
  const [includeVat, setIncludeVat] = useState<boolean>(true);
  const [includeNepaliFooter, setIncludeNepaliFooter] = useState<boolean>(true);
  const [discountPercent, setDiscountPercent] = useState<number>(5);

  const sampleItems = [
    { name: 'Wai Wai Noodles (Box)', qty: 1, rate: 720 },
    { name: 'Amul Pure Ghee 1L', qty: 2, rate: 1150 },
    { name: 'Dettol Soap 125g (Pack of 3)', qty: 1, rate: 240 },
    { name: 'Basmati Rice 5kg', qty: 1, rate: 950 },
  ];

  const subtotal = sampleItems.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = includeVat ? Math.round(taxableAmount * 0.13) : 0;
  const grandTotal = taxableAmount + vatAmount;

  const handlePrintSlip = () => {
    window.print();
  };

  const hardwareTypes = [
    {
      title: '58mm & 80mm Thermal Receipt Printers',
      icon: Printer,
      compatibility: '100% Plug-and-Play Compatible',
      description:
        'Supports all ESC/POS compliant thermal printers. Works seamlessly via Bluetooth (Android & iOS), USB cable (Windows & Mac), or Local WiFi network.',
      popularModels: ['Xprinter XP-58 / XP-80', 'Epson TM-T88 / TM-T20', 'Everycom POS', 'Zjiang Portable Bluetooth Printers'],
      bestFor: 'Daily checkout slips, customer receipts, and bill printing.',
    },
    {
      title: '1D / 2D Barcode Scanners & Gun Scanners',
      icon: Barcode,
      compatibility: 'Standard HID USB & Wireless Bluetooth',
      description:
        'Zero driver installation required. Just plug the scanner gun into your USB port or pair via Bluetooth, and start scanning items instantly.',
      popularModels: ['Honeywell Voyager', 'Zebra Symbol', 'Netum Wireless 2D QR Scanner', 'Built-in Smartphone Camera'],
      bestFor: 'High-speed counter checkout and fast stock counting.',
    },
    {
      title: 'Automated Cash Drawers',
      icon: Tv,
      compatibility: 'RJ11 Printer Connected',
      description:
        'Connects directly to the receipt printer via RJ11 cable. Pops open automatically as soon as a Cash sale is finalized.',
      popularModels: ['Standard 4-Bill / 5-Bill Metal Cash Drawers', 'Maken POS Cash Box'],
      bestFor: 'Safe physical currency storage and fast cash handling.',
    },
    {
      title: 'Digital Weighing Scales',
      icon: Scale,
      compatibility: 'Serial / USB & Manual Quick-Entry',
      description:
        'Easily sell items by kilogram, gram, or liter with automatic rate multiplication directly in the POS cart.',
      popularModels: ['Phoenix Scale', 'Essae Teraoka', 'Local Verified Digital Scales'],
      bestFor: 'Kirana loose grains, vegetables, meat shops, and sweets.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Printer className="w-3.5 h-3.5 text-blue-500" />
          <span>Hardware Compatibility &amp; Guide</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Works Seamlessly With The Devices You Already Own
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No locked-in proprietary hardware contracts. Use any PC, Mac, phone, tablet, thermal printer, or barcode gun available in the Nepali market.
        </p>
      </section>

      {/* ── INTERACTIVE LIVE THERMAL RECEIPT SIMULATOR ───────── */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
        <div className="text-center space-y-1">
          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 text-[10px] font-extrabold uppercase tracking-wide border border-purple-200 dark:border-purple-800">
            Interactive Live Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Live Thermal Receipt Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Customize your receipt settings below and see how your printed thermal bill renders in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-2">
          {/* Controls Form */}
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Receipt Customizer</h3>

            {/* Paper Width Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Paper Roll Format:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaperWidth('58mm')}
                  className={`py-2 px-3 rounded-xl font-bold transition ${
                    paperWidth === '58mm'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  58mm (2-Inch Mini Thermal)
                </button>
                <button
                  onClick={() => setPaperWidth('80mm')}
                  className={`py-2 px-3 rounded-xl font-bold transition ${
                    paperWidth === '80mm'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  80mm (3-Inch Standard POS)
                </button>
              </div>
            </div>

            {/* Shop Name Input */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Shop / Company Name:</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* PAN / VAT Input */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Registered Shop PAN / VAT Number:</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 space-y-2.5 border-t border-slate-200 dark:border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVat}
                  onChange={(e) => setIncludeVat(e.target.checked)}
                  className="rounded text-blue-600 accent-blue-600"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Include 13% VAT Calculation</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNepaliFooter}
                  onChange={(e) => setIncludeNepaliFooter(e.target.checked)}
                  className="rounded text-blue-600 accent-blue-600"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Include Nepali Greeting Footer (&ldquo;धन्यवाद ! फेरी आउनुहोला&rdquo;)
                </span>
              </label>
            </div>

            {/* Print Slip Action */}
            <div className="pt-3">
              <button
                onClick={handlePrintSlip}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Test Print Receipt Sample</span>
              </button>
            </div>
          </div>

          {/* Realistic Receipt Paper Canvas */}
          <div className="flex justify-center">
            <div
              id="printable-receipt"
              className={`bg-[#FFFDF9] text-slate-900 p-6 rounded-lg shadow-2xl border border-slate-300 font-mono text-[11px] leading-tight space-y-2 transition-all ${
                paperWidth === '58mm' ? 'w-[280px]' : 'w-[360px]'
              }`}
            >
              {/* Receipt Header */}
              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-400">
                <p className="font-black text-xs uppercase tracking-wide">{shopName || 'MEROPASAL STORE'}</p>
                <p className="text-[10px] text-slate-600">New Road, Kathmandu, Nepal</p>
                <p className="text-[10px] text-slate-600">PAN: {panNumber || 'N/A'}</p>
                <p className="text-[10px] text-slate-600">Tel: +977 9800000000</p>
              </div>

              {/* Bill Details */}
              <div className="flex justify-between text-[10px] text-slate-600 border-b border-dashed border-slate-300 pb-1">
                <span>Bill: #MP-2026-0042</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              {/* Item Rows */}
              <div className="space-y-1.5 py-1">
                <div className="flex justify-between font-bold text-[10px] text-slate-700 pb-0.5 border-b border-slate-300">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT (Rs.)</span>
                </div>
                {sampleItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-[10px]">
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <span className="text-slate-600">{item.qty}</span>
                    <span className="font-bold">{(item.qty * item.rate).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="pt-2 border-t border-dashed border-slate-400 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountPercent}%):</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {includeVat && (
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (13%):</span>
                    <span>Rs. {vatAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black pt-1 border-t border-slate-400">
                  <span>GRAND TOTAL:</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[10px]">
                  <span>Paid Via:</span>
                  <span className="font-bold">Fonepay Dynamic QR</span>
                </div>
              </div>

              {/* Footer */}
              {includeNepaliFooter && (
                <div className="text-center pt-3 border-t border-dashed border-slate-400 space-y-0.5 text-[10px]">
                  <p className="font-bold">धन्यवाद ! फेरी आउनुहोला</p>
                  <p className="text-slate-500 text-[9px]">Powered by MeroPasal POS</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── HARDWARE MATRIX CARDS ────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Supported Peripherals &amp; Equipment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Easily connect industry-standard hardware without technical headaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hardwareTypes.map((hw, idx) => {
            const Icon = hw.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">{hw.title}</h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {hw.compatibility}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{hw.description}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Common Compatible Brands in Nepal:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hw.popularModels.map((model, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HARDWARE SETUP ASSISTANCE BANNER ─────────────────── */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-black">Need assistance setting up your printer or scanner?</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Our Kathmandu support team provides free remote AnyDesk/TeamViewer assistance and WhatsApp video call setup support.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('contact')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition whitespace-nowrap"
        >
          Contact Hardware Support →
        </button>
      </section>
    </div>
  );
};
