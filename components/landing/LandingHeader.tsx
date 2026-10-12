'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import {
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Receipt,
  LayoutGrid,
  ShoppingBag,
  Tag,
  Printer,
  PhoneCall,
  LogIn,
  UserPlus,
  Store,
  Compass,
} from 'lucide-react';

export type LandingPageTab = 'home' | 'wapasal' | 'features' | 'solutions' | 'store' | 'pricing' | 'hardware' | 'contact';

interface LandingHeaderProps {
  activeTab: LandingPageTab;
  onSelectTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
  onLogin: () => void;
  onRegister?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  activeTab,
  onSelectTab,
  onLaunchApp,
  onLogin,
  onRegister,
}) => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: { id: LandingPageTab; label: string; labelNe: string; icon: React.ElementType; highlight?: boolean }[] = [
    { id: 'home', label: 'Home', labelNe: 'गृहपृष्ठ', icon: LayoutGrid },
    { id: 'wapasal', label: 'WaPasal (Nearby)', labelNe: 'वा-पसल (नजिकै)', icon: Compass, highlight: true },
    { id: 'features', label: 'Features', labelNe: 'सुविधाहरू', icon: Sparkles },
    { id: 'solutions', label: 'Solutions', labelNe: 'पसल अनुसार', icon: ShoppingBag },
    { id: 'store', label: 'Store Profile', labelNe: 'पसल प्रोफाइल', icon: Store },
    { id: 'pricing', label: 'Pricing', labelNe: 'मूल्य योजना', icon: Tag },
    { id: 'hardware', label: 'Hardware & Printers', labelNe: 'प्रिन्टर र उपकरण', icon: Printer },
    { id: 'contact', label: 'Contact & Support', labelNe: 'सम्पर्क र सहयोग', icon: PhoneCall },
  ];

  const handleNavClick = (tab: LandingPageTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
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
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                {t.appTitle}
              </span>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                POS Nepal
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold -mt-0.5">
              {language === 'ne' ? 'स्मार्ट बिलिङ र उधारो खाता' : 'Smart POS & Udharo Ledger'}
            </p>
          </div>
        </div>

        {/* Desktop Multi-Page Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? item.id === 'wapasal'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : item.id === 'wapasal'
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-slate-700/40'
                }`}
              >
                {item.id === 'wapasal' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                <span>{language === 'ne' ? item.labelNe : item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions (Language, Theme, Auth & Launch) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 text-[11px] font-bold border border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ne')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'ne'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              नेपाली
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Sign In Button */}
          <button
            onClick={onLogin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'ne' ? 'लगइन' : 'Sign In'}</span>
          </button>

          {/* Launch POS Demo */}
          <button
            onClick={onLaunchApp}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ne' ? 'प्रत्यक्ष डेमो खोल्नुहोस्' : 'Live POS Demo'}</span>
            <span className="sm:hidden">{language === 'ne' ? 'डेमो' : 'POS'}</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Pages</p>
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{language === 'ne' ? item.labelNe : item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'लगइन' : 'Sign In'}</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onRegister) onRegister();
                else onLaunchApp();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'खाता खोल्नुहोस्' : 'Get Started'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
