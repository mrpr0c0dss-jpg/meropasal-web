'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { LandingPageTab } from './LandingHeader';

interface LandingFooterProps {
  onSelectTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
  onLogin: () => void;
  onRegister?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onSelectTab,
  onLaunchApp,
  onLogin,
  onRegister,
}) => {
  const { language, t } = useApp();

  const handleNav = (tab: LandingPageTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#080C14] text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* ── TOP PRE-FOOTER CTA STRIP ───────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'ne'
                ? 'आजै आफ्नो पसललाई डिजिटल र स्मार्ट बनाउनुहोस्'
                : 'Modernize Your Retail Shop with MeroPasal Today'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              {language === 'ne'
                ? '१ मिनेटमा नि:शुल्क सेटअप गर्नुहोस्। कुनै क्रेडिट कार्ड वा अग्रिम शुल्क आवश्यक छैन।'
                : 'Free instant setup in 1 minute. Works 100% offline with WhatsApp billing & Udharo ledger.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onLaunchApp}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black shadow-xl transition active:scale-95 flex items-center gap-2"
            >
              <span>{language === 'ne' ? 'नि:शुल्क सुरु गर्नुहोस्' : 'Launch Free POS Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="px-5 py-3 rounded-xl bg-blue-800/50 hover:bg-blue-800 text-white text-xs font-bold border border-white/20 transition"
            >
              {language === 'ne' ? 'हाम्रो टिमसँग कुरा गर्नुहोस्' : 'Book Free On-Site Demo'}
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER NAVIGATION ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 text-xs">
          {/* Col 1: Brand & Contact Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/transparentlogo.png"
                    alt="MeroPasal"
                    width={34}
                    height={34}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div>
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  {t.appTitle}
                </span>
                <p className="text-[10px] text-slate-400 font-semibold -mt-0.5">Nepal&apos;s Retail OS</p>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px] max-w-sm">
              MeroPasal is the modern offline-first Point of Sale (POS), barcode inventory, and WhatsApp Udharo Ledger platform designed exclusively for Nepali merchants, kirana stores, marts, and retailers.
            </p>

            <div className="space-y-2 pt-2 text-[11px]">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Putalisadak &amp; New Road, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>+977 980-0000000 / 01-4400000</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>support@meropasal.com.np</span>
              </div>
            </div>
          </div>

          {/* Col 2: Product & Features */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Product
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-blue-600 transition">
                  High-Speed POS Billing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-blue-600 transition">
                  WhatsApp Invoice Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-blue-600 transition">
                  Udharo (Credit) Khata
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-blue-600 transition">
                  Smart Inventory &amp; Barcodes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-blue-600 transition">
                  Multi-Staff Join Codes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-blue-600 transition">
                  Cloud &amp; Offline Sync
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Shop Solutions */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Shop Solutions
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => handleNav('solutions')} className="hover:text-blue-600 transition">
                  Kirana &amp; Grocery Stores
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('solutions')} className="hover:text-blue-600 transition">
                  Supermarkets &amp; Marts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('solutions')} className="hover:text-blue-600 transition">
                  Clothing &amp; Fashion
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('solutions')} className="hover:text-blue-600 transition">
                  Electronics &amp; Mobile
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('solutions')} className="hover:text-blue-600 transition">
                  Pharmacy &amp; Health
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('solutions')} className="hover:text-blue-600 transition">
                  Hardware &amp; Sanitary
                </button>
              </li>
            </ul>
          </div>

            {/* Col 4: Hardware & Plans */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Resources &amp; Marketplace
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => handleNav('wapasal')} className="hover:text-emerald-600 transition font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>🟢 WaPasal (Nearby Stores)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('store')} className="hover:text-blue-600 transition font-bold text-slate-800 dark:text-slate-200">
                    🏬 Public Store Profile
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('pricing')} className="hover:text-blue-600 transition">
                    Pricing Plans (Free / Pro)
                  </button>
                </li>
              <li>
                <button onClick={() => handleNav('hardware')} className="hover:text-blue-600 transition">
                  Thermal Printers &amp; Scanners
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('hardware')} className="hover:text-blue-600 transition">
                  Receipt Simulator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-blue-600 transition">
                  Contact Support Team
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-blue-600 transition">
                  Book On-Site Demo
                </button>
              </li>
              <li>
                <button onClick={onLogin} className="hover:text-blue-600 transition font-bold text-blue-600">
                  Shop Owner Login →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ── FOOTER BOTTOM ROW ──────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} MeroPasal Technologies Pvt. Ltd.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Nepal 🇳🇵
            </span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button onClick={() => handleNav('home')} className="hover:text-blue-600">
              Home
            </button>
            <button onClick={() => handleNav('store')} className="hover:text-blue-600">
              Store Profile
            </button>
            <button onClick={() => handleNav('pricing')} className="hover:text-blue-600">
              Pricing
            </button>
            <button onClick={() => handleNav('hardware')} className="hover:text-blue-600">
              Hardware
            </button>
            <button onClick={() => handleNav('contact')} className="hover:text-blue-600">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
