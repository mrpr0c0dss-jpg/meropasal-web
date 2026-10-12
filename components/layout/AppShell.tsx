'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import {
  LayoutDashboard,
  Receipt,
  Package,
  History,
  BookOpen,
  Truck,
  Wallet,
  Users,
  Settings,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Store,
  LogOut,
  Sparkles,
  Search,
  Shield,
  Command,
  Plus,
  Clock,
  Pin,
  Barcode,
  Rocket,
  ChevronRight,
  ChevronDown,
  Compass,
  Palette,
  TrendingUp,
  Tag,
  ShoppingBag,
  BarChart3,
  FileText,
  Share2,
  LayoutList,
} from 'lucide-react';
import { DashboardView } from '../dashboard/DashboardView';
import { PosView } from '../pos/PosView';
import { ProductsView } from '../products/ProductsView';
import { SalesHistoryView } from '../sales/SalesHistoryView';
import { UdharoLedgerView } from '../udharo/UdharoLedgerView';
import { SuppliersView } from '../suppliers/SuppliersView';
import { ExpensesView } from '../expenses/ExpensesView';
import { StaffView } from '../staff/StaffView';
import { SettingsView } from '../settings/SettingsView';
import { LoginView } from '../auth/LoginView';
import { RegisterView } from '../auth/RegisterView';
import { ForgotPasswordView } from '../auth/ForgotPasswordView';
import { ShopSetupView } from '../auth/ShopSetupView';
import { PrivacyPolicyView } from '../auth/PrivacyPolicyView';
import { LandingPage } from '../landing/LandingPage';
import { StoreProfileView } from '../profile/StoreProfileView';
import { DedicatedStoreWebsite } from '../storefront/DedicatedStoreWebsite';
import { WAStoreDesignStudio } from '../storefront/WAStoreDesignStudio';
import { WaPasalPage } from '../landing/pages/WaPasalPage';
import { BarcodeGeneratorModal } from '../products/BarcodeGeneratorModal';
import { AppUpdateModal } from '../shared/AppUpdateModal';
import { CategoriesView } from '../storefront/CategoriesView';
import { CouponsView } from '../storefront/CouponsView';
import { PagesView } from '../storefront/PagesView';
import { ShareStoreModal } from '../shared/ShareStoreModal';

type AuthViewMode = 'app' | 'landing' | 'login' | 'register' | 'forgot' | 'shop-setup' | 'privacy' | 'dedicated-store' | 'design-studio';

export interface NavSubItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  highlight?: boolean;
  badge?: string;
  badgeColor?: string;
  isGreenHighlight?: boolean;
  onClick?: () => void;
  subItems?: NavSubItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AppShell: React.FC = () => {
  const {
    shop,
    user,
    authInitialized,
    hasShop,
    setUser,
    products,
    customers,
    sales,
    language,
    setLanguage,
    theme,
    toggleTheme,
    isPrivacyMode,
    togglePrivacyMode,
    addToCart,
    t,
  } = useApp();

  const [authView, setAuthView] = useState<AuthViewMode>('app');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(true);

  const isSidebarExpanded = isSidebarPinned || isSidebarHovered;

  // Real-time Badge Counts
  const lowStockCount = products.filter((p) => p.quantity <= (p.minStockLevel || 5)).length;
  const udharoDueCount = customers.filter((c) => c.totalDue > 0).length;
  const categoryCount = new Set(products.map((p) => p.category).filter(Boolean)).size || 4;
  const totalProductsCount = products.length || 14;
  const totalOrdersCount = sales.length || 13;

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Flutter-aligned route guard: enforce login and shop setup for new users
  useEffect(() => {
    if (!authInitialized) return;

    if (!user) {
      if (authView === 'app' || authView === 'shop-setup') {
        setAuthView('login');
      }
    } else {
      // User is logged in to Firebase / our server
      if (!hasShop) {
        // New user on our server: MUST show store setup!
        if (authView === 'app' || authView === 'login' || authView === 'register') {
          setAuthView('shop-setup');
        }
      } else {
        // Existing user with established store on our server
        if (authView === 'login' || authView === 'register' || authView === 'shop-setup') {
          setAuthView('app');
        }
      }
    }
  }, [authInitialized, user, hasShop, authView]);

  if (!authInitialized && authView === 'app') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 animate-pulse">
          <Store className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-bold text-white tracking-wide">MeroPasal</p>
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authView === 'landing') return <LandingPage onLaunchApp={() => setAuthView('app')} onLogin={() => setAuthView('login')} onRegister={() => setAuthView('register')} />;
  if (authView === 'dedicated-store') return <DedicatedStoreWebsite onBackToApp={() => setAuthView('app')} />;
  if (authView === 'design-studio') return <WAStoreDesignStudio onBackToApp={() => setAuthView('app')} />;
  if (authView === 'login') return <LoginView onNavigateAuth={setAuthView} />;
  if (authView === 'register') return <RegisterView onNavigateAuth={setAuthView} />;
  if (authView === 'forgot') return <ForgotPasswordView onNavigateAuth={setAuthView} />;
  if (authView === 'shop-setup') return <ShopSetupView onNavigateAuth={setAuthView} />;
  if (authView === 'privacy') return <PrivacyPolicyView onBack={() => setAuthView('app')} />;

  const navigationSections: NavSection[] = [
    {
      title: 'STORE',
      items: [
        { id: 'dashboard', label: 'Overview', icon: TrendingUp },
        {
          id: 'products-group',
          label: 'Products',
          icon: Package,
          subItems: [
            {
              id: 'products',
              label: 'All products',
              icon: LayoutList,
              badge: `${totalProductsCount}`,
            },
            {
              id: 'categories',
              label: 'Categories',
              icon: Tag,
              badge: `${categoryCount}`,
            },
          ],
        },
        {
          id: 'sales',
          label: 'Orders',
          icon: ShoppingBag,
          badge: `${totalOrdersCount}`,
          badgeColor: 'bg-rose-500 text-white font-bold font-mono rounded-full px-2 py-0.5 shadow-xs',
        },
        { id: 'customers', label: 'Customers', icon: Users },
      ],
    },
    {
      title: 'CONFIGURE',
      items: [
        {
          id: 'design-studio',
          label: 'Design',
          icon: Palette,
          isGreenHighlight: true,
        },
        { id: 'settings', label: 'Settings', icon: Settings },
        {
          id: 'staff',
          label: 'Staff & HRM',
          icon: Users,
          badge: 'HRM',
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded text-[9px]',
        },
      ],
    },
    {
      title: 'GROW',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'coupons', label: 'Coupons', icon: Tag },
        {
          id: 'pages',
          label: 'Pages',
          icon: FileText,
          badge: 'NEW',
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded text-[9px]',
        },
        {
          id: 'share',
          label: 'Share',
          icon: Share2,
          onClick: () => setIsShareModalOpen(true),
        },
      ],
    },
    {
      title: 'OPERATIONS & KHATA',
      items: [
        { id: 'pos', label: 'POS Billing', icon: Receipt, shortcut: '2' },
        {
          id: 'udharo',
          label: t.udharoKhata,
          icon: BookOpen,
          shortcut: '5',
          badge: udharoDueCount > 0 ? `${udharoDueCount} Due` : undefined,
          badgeColor: 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800',
        },
        { id: 'expenses', label: t.expenses, icon: Wallet, shortcut: '6' },
        { id: 'suppliers', label: t.suppliers, icon: Truck, shortcut: '7' },
        {
          id: 'wapasal',
          label: 'WaPasal Marketplace',
          icon: Compass,
          badge: 'Live',
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
        },
      ],
    },
  ];

  const navigationItems = navigationSections.flatMap((s) =>
    s.items.flatMap((item) =>
      item.subItems
        ? item.subItems.map((sub) => ({
            id: sub.id,
            label: sub.label,
            icon: sub.icon,
            shortcut: undefined,
            badge: sub.badge,
            badgeColor: sub.badgeColor,
            isGreenHighlight: false,
            onClick: sub.onClick,
          }))
        : [item]
    )
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsCommandPaletteOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
  };

  // Filtered search results for command palette
  const matchingProducts = products.filter((p) =>
    p.name.toLowerCase().includes(commandQuery.toLowerCase()) ||
    (p.barcode && p.barcode.includes(commandQuery))
  ).slice(0, 5);

  const matchingCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(commandQuery.toLowerCase()) ||
    c.phone.includes(commandQuery)
  ).slice(0, 4);

  return (
    <div className="h-screen bg-slate-50/70 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white antialiased overflow-hidden">
      {/* ── TOP MODERN APP BAR ───────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-16 px-4 lg:px-6 flex items-center justify-between transition-colors shrink-0">
        {/* Left: Mobile Menu Trigger & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => handleTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
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
                <span className="font-extrabold text-base lg:text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  {t.appTitle}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                  POS v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5 truncate max-w-[180px]">
                {shop.name}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Command Palette / Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full px-3.5 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-400 transition"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search products, customers, billing (⌘K)...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Live Clock & Counter Status */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-mono font-semibold">{currentTime}</span>
          </div>

          {/* Privacy Mask Toggle */}
          <button
            onClick={togglePrivacyMode}
            title={t.privacyModeDesc}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isPrivacyMode
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isPrivacyMode ? <EyeOff className="w-4 h-4 text-purple-600" /> : <Eye className="w-4 h-4" />}
            <span className="hidden lg:inline text-[11px] font-medium">{isPrivacyMode ? 'Masked' : 'Privacy'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-0.5 text-[11px] font-bold border border-slate-200/60 dark:border-slate-700/50">
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
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Launch POS (Desktop) */}
          <button
            onClick={() => handleTabChange('pos')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition active:scale-95 ${
              activeTab === 'pos'
                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{t.quickSale}</span>
          </button>

          {/* User Avatar Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-200 hover:ring-2 hover:ring-blue-500/30 transition shadow-2xs"
            >
              {user?.displayName ? user.displayName.charAt(0) : 'R'}
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user?.displayName || shop.ownerName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || shop.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    {user?.role || 'Shop Owner'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAuthView('landing');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Public Landing Page</span>
                </button>
                <button
                  onClick={() => {
                    handleTabChange('store-profile');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Store className="w-4 h-4 text-blue-500" />
                  <span>Store Profile &amp; Attachments</span>
                </button>
                <button
                  onClick={() => {
                    handleTabChange('settings');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Shop Settings</span>
                </button>
                <button
                  onClick={() => {
                    setAuthView('privacy');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Privacy Policy & Legal</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch / Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── BODY WITH SLEEK SIDEBAR ──────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ── DESKTOP SIDEBAR (AUTO-COLLAPSE ON MOUSE LEAVE / EXPAND ON HOVER) ─────────────────── */}
        <aside
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          className={`hidden lg:flex flex-col h-full bg-white dark:bg-[#111827] border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 ease-in-out shrink-0 z-30 ${
            isSidebarExpanded ? 'w-64 p-3.5' : 'w-[76px] p-2.5'
          } space-y-3 overflow-y-auto overflow-x-hidden select-none scrollbar-none`}
        >
          {/* Shop Card */}
          <div
            className={`rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 transition-all duration-300 ${
              isSidebarExpanded ? 'p-3' : 'p-2 flex flex-col items-center justify-center'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {shop.name ? shop.name.charAt(0) : 'M'}
                  </div>
                  {!isSidebarExpanded && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                  )}
                </div>
                {isSidebarExpanded && (
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{shop.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{shop.ownerName}</p>
                  </div>
                )}
              </div>
              {isSidebarExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSidebarPinned(!isSidebarPinned);
                  }}
                  title={isSidebarPinned ? 'Unpin Sidebar (Auto-collapse on mouse leave)' : 'Pin Sidebar Open'}
                  className={`p-1.5 rounded-lg transition text-xs shrink-0 ${
                    isSidebarPinned
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 ring-1 ring-blue-500/30'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Pin className={`w-3.5 h-3.5 transition-transform ${isSidebarPinned ? 'rotate-45 text-blue-600' : ''}`} />
                </button>
              )}
            </div>
            {isSidebarExpanded && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/40 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span>Code: <strong className="font-mono text-blue-600">{shop.shopCode}</strong></span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
            )}
          </div>

          {/* Quick Sale New Bill Action Button */}
          <button
            onClick={() => handleTabChange('pos')}
            className={`w-full flex items-center rounded-xl font-bold transition-all shadow-md active:scale-95 ${
              activeTab === 'pos'
                ? 'bg-blue-700 text-white ring-2 ring-blue-400 shadow-blue-500/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
            } ${isSidebarExpanded ? 'px-3.5 py-2.5 justify-between text-xs' : 'p-2.5 justify-center'}`}
            title="Start New POS Sale (⌘2)"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span className="truncate whitespace-nowrap">{t.quickSale}</span>}
            </div>
            {isSidebarExpanded && (
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
                ⌘2
              </span>
            )}
          </button>

          {/* Categorized Navigation List */}
          <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden pr-0.5 scrollbar-thin">
            {navigationSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {isSidebarExpanded && (
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-0.5">
                    {section.title}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    // Support nested group items (e.g. Products -> All products & Categories)
                    if (item.subItems && item.subItems.length > 0) {
                      const isAnySubActive = item.subItems.some((sub) => activeTab === sub.id);

                      if (!isSidebarExpanded) {
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.subItems![0].id)}
                            title={item.label}
                            className={`w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer ${
                              isAnySubActive
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${
                              isAnySubActive
                                ? 'text-blue-600 dark:text-blue-400 stroke-[2.2]'
                                : 'text-slate-400 group-hover:text-blue-600'
                            }`} />
                            <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700/50 flex items-center gap-2">
                              <span>{item.label}</span>
                              <span className="px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 text-[10px] font-mono">
                                {totalProductsCount}
                              </span>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <div key={item.id} className="space-y-1 pt-0.5">
                          {/* Products Parent Header with Dropdown Icon */}
                          <div
                            onClick={() => {
                              setIsProductsDropdownOpen(!isProductsDropdownOpen);
                            }}
                            className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition group select-none"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 stroke-[2.2] shrink-0" />
                              <span className="font-extrabold text-[13px] text-slate-900 dark:text-slate-100 tracking-tight">
                                {item.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400 transition">
                                {totalProductsCount}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-200 ${
                                  isProductsDropdownOpen ? 'rotate-0' : '-rotate-90'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Tree Sub-items with vertical guide line (Collapsible) */}
                          {isProductsDropdownOpen && (
                            <div className="ml-5 pl-2.5 border-l-2 border-slate-200/90 dark:border-slate-800 space-y-1.5 my-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                              {item.subItems.map((sub) => {
                                const SubIcon = sub.icon;
                                const isSubActive = activeTab === sub.id;

                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      if (sub.onClick) {
                                        sub.onClick();
                                      } else {
                                        handleTabChange(sub.id);
                                      }
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                                      isSubActive
                                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                                      <span className="truncate whitespace-nowrap">{sub.label}</span>
                                    </div>

                                    {sub.badge && (
                                      <span
                                        className={
                                          isSubActive
                                            ? 'font-bold text-xs text-white shrink-0 ml-2 font-mono'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full text-xs shrink-0 ml-2 font-mono'
                                        }
                                      >
                                        {sub.badge}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const isDesignActive = (item.id === 'design-studio' || item.id === 'design') && (activeTab === 'design-studio' || activeTab === 'design');
                    const isActive = activeTab === item.id || (item.id === 'customers' && activeTab === 'udharo') || (item.id === 'dashboard' && activeTab === 'overview') || (item.id === 'sales' && activeTab === 'orders') || (item.id === 'staff' && activeTab === 'team');
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                          } else {
                            handleTabChange(item.id);
                          }
                        }}
                        title={!isSidebarExpanded ? item.label : undefined}
                        className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative cursor-pointer ${
                          isSidebarExpanded ? 'px-3 py-2 justify-between' : 'p-2.5 justify-center'
                        } ${
                          isActive
                            ? isDesignActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold shadow-2xs'
                              : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className={`flex items-center ${isSidebarExpanded ? 'gap-2.5 min-w-0' : 'justify-center'}`}>
                          <Icon className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? isDesignActive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-white'
                              : 'text-slate-400 group-hover:text-blue-600'
                          }`} />
                          {isSidebarExpanded && (
                            <span className="truncate whitespace-nowrap">{item.label}</span>
                          )}
                        </div>

                        {/* Badges and Highlights */}
                        {isSidebarExpanded && item.badge && (
                          <span className={`px-2 py-0.5 text-[10px] shrink-0 font-medium ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono rounded-full'}`}>
                            {item.badge}
                          </span>
                        )}

                        {/* Collapsed Badge Dot Indicator */}
                        {!isSidebarExpanded && item.badge && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                        )}

                        {/* Floating tooltip when collapsed */}
                        {!isSidebarExpanded && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700/50 flex items-center gap-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[10px]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Operations Tools Direct Actions */}
            <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
              {isSidebarExpanded && (
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-0.5">
                  Tools & Shortcuts
                </p>
              )}

              {/* Barcode Generator Tool Modal Trigger */}
              <button
                onClick={() => setIsBarcodeModalOpen(true)}
                title="Barcode Label Generator"
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white ${
                  isSidebarExpanded ? 'px-3 py-2 justify-between' : 'p-2.5 justify-center'
                }`}
              >
                <div className={`flex items-center ${isSidebarExpanded ? 'gap-2.5 min-w-0' : 'justify-center'}`}>
                  <Barcode className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
                  {isSidebarExpanded && <span className="truncate whitespace-nowrap">Barcode Maker</span>}
                </div>
                {isSidebarExpanded && (
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[9px] font-bold shrink-0">
                    Tool
                  </span>
                )}
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700/50">
                    Barcode Maker Tool
                  </div>
                )}
              </button>

              {/* Check App Updates Modal Trigger */}
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                title="Check for App Updates"
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white ${
                  isSidebarExpanded ? 'px-3 py-2 justify-between' : 'p-2.5 justify-center'
                }`}
              >
                <div className={`flex items-center ${isSidebarExpanded ? 'gap-2.5 min-w-0' : 'justify-center'}`}>
                  <Rocket className="w-4 h-4 shrink-0 text-indigo-500 group-hover:animate-bounce" />
                  {isSidebarExpanded && <span className="truncate whitespace-nowrap">Check Updates</span>}
                </div>
                {isSidebarExpanded && (
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[9px] font-bold shrink-0">
                    v2.4
                  </span>
                )}
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700/50">
                    Check Updates (v2.4)
                  </div>
                )}
              </button>

              {/* Dedicated Public Store Website */}
              <button
                onClick={() => setAuthView('dedicated-store')}
                title="View Dedicated Store Website"
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2 justify-between' : 'p-2.5 justify-center'
                }`}
              >
                <div className={`flex items-center ${isSidebarExpanded ? 'gap-2.5 min-w-0' : 'justify-center'}`}>
                  <Globe className="w-4 h-4 shrink-0 text-emerald-500 group-hover:scale-110 transition-transform" />
                  {isSidebarExpanded && <span className="truncate whitespace-nowrap font-bold text-slate-900 dark:text-white">Store Website</span>}
                </div>
                {isSidebarExpanded && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[9px] font-bold shrink-0">
                    Live
                  </span>
                )}
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700/50">
                    Dedicated Store Website (Live)
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Quick Utility Strip (Theme, Language, Privacy, User) */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            {isSidebarExpanded ? (
              <div className="space-y-2">
                {/* Utilities Row */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/40 text-[10px] font-bold">
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title="Toggle Dark/Light Mode"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>

                  {/* Language Toggle */}
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title="Change Language"
                  >
                    <span>{language === 'en' ? 'नेपाली' : 'EN'}</span>
                  </button>

                  {/* Privacy Toggle */}
                  <button
                    onClick={togglePrivacyMode}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition ${
                      isPrivacyMode ? 'text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/60' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                    title="Toggle Privacy Amount Masking"
                  >
                    {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-purple-600" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isPrivacyMode ? 'Masked' : 'Mask'}</span>
                  </button>
                </div>

                {/* User Info & Logout Button */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.displayName ? user.displayName.charAt(0) : 'R'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{user?.displayName || shop.ownerName}</p>
                      <p className="text-[9px] text-slate-400 capitalize truncate">{user?.role || 'Admin'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Collapsed Action Icons */
              <div className="flex flex-col items-center space-y-1.5">
                <button
                  onClick={toggleTheme}
                  title="Toggle Theme"
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={togglePrivacyMode}
                  title="Toggle Privacy Mask"
                  className={`p-2 rounded-xl ${isPrivacyMode ? 'text-purple-600 bg-purple-50 dark:bg-purple-950' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {isPrivacyMode ? <EyeOff className="w-4 h-4 text-purple-600" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Footer Legal */}
            {isSidebarExpanded && (
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>MeroPasal v2.4</span>
                <button
                  onClick={() => setAuthView('privacy')}
                  className="hover:text-blue-600 transition"
                >
                  Privacy
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── MOBILE DRAWER NAVIGATION ─────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className="w-4/5 max-w-xs bg-white dark:bg-[#111827] h-full p-4 flex flex-col space-y-3 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {shop.name ? shop.name.charAt(0) : 'M'}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-blue-600">{shop.name}</span>
                    <p className="text-[10px] text-slate-400">{shop.ownerName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Sale Button in Mobile Drawer */}
              <button
                onClick={() => handleTabChange('pos')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-blue-500/20"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>{t.quickSale}</span>
                </div>
                <Receipt className="w-4 h-4" />
              </button>

              <nav className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {navigationSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      {section.title}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon;

                        // Support nested group items in mobile drawer (e.g. Products)
                        if (item.subItems && item.subItems.length > 0) {
                          return (
                            <div key={item.id} className="space-y-1 pt-0.5">
                              {/* Parent Group Header with Dropdown Icon */}
                              <div
                                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                                className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition select-none"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 stroke-[2.2] shrink-0" />
                                  <span className="font-extrabold text-[13px] text-slate-900 dark:text-slate-100">
                                    {item.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    {totalProductsCount}
                                  </span>
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                      isProductsDropdownOpen ? 'rotate-0' : '-rotate-90'
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* Tree Sub-items with vertical guide line (Collapsible) */}
                              {isProductsDropdownOpen && (
                                <div className="ml-5 pl-2.5 border-l-2 border-slate-200/90 dark:border-slate-800 space-y-1.5 my-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                  {item.subItems.map((sub) => {
                                    const SubIcon = sub.icon;
                                    const isSubActive = activeTab === sub.id;

                                    return (
                                      <button
                                        key={sub.id}
                                        onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          if (sub.onClick) {
                                            sub.onClick();
                                          } else {
                                            handleTabChange(sub.id);
                                          }
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                          isSubActive
                                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                                          <span className="truncate">{sub.label}</span>
                                        </div>
                                        {sub.badge && (
                                          <span
                                            className={
                                              isSubActive
                                                ? 'font-bold text-xs text-white shrink-0 ml-2 font-mono'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full text-xs shrink-0 ml-2 font-mono'
                                            }
                                          >
                                            {sub.badge}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        const isDesignActive = (item.id === 'design-studio' || item.id === 'design') && (activeTab === 'design-studio' || activeTab === 'design');
                        const isActive = activeTab === item.id || (item.id === 'customers' && activeTab === 'udharo') || (item.id === 'dashboard' && activeTab === 'overview') || (item.id === 'sales' && activeTab === 'orders') || (item.id === 'staff' && activeTab === 'team');
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              if (item.onClick) {
                                item.onClick();
                              } else {
                                handleTabChange(item.id);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                              isActive
                                ? isDesignActive
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold'
                                  : 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${isActive && isDesignActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Additional Mobile Tools */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Tools & Website
                  </p>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsBarcodeModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Barcode className="w-4 h-4 text-purple-500" />
                    <span>Barcode Generator</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsUpdateModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Rocket className="w-4 h-4 text-indigo-500" />
                    <span>Check Updates (v2.4)</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthView('landing');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Store Landing Website</span>
                  </button>
                </div>
              </nav>

              {/* Mobile Drawer Footer Utilities */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                  <button
                    onClick={toggleTheme}
                    className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
                    className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {language === 'en' ? 'नेपाली' : 'EN'}
                  </button>
                  <button
                    onClick={togglePrivacyMode}
                    className={`py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                      isPrivacyMode ? 'bg-purple-100 text-purple-700 dark:bg-purple-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>Mask</span>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* ── ACTIVE VIEW ROUTER ───────────────────────────────── */}
        <main
          className={`flex-1 min-h-0 h-full ${
            activeTab === 'pos' ? 'overflow-hidden p-0' : 'overflow-y-auto pb-20 lg:pb-6'
          }`}
        >
          {(activeTab === 'dashboard' || activeTab === 'overview') && <DashboardView onNavigate={handleTabChange} />}
          {activeTab === 'pos' && <PosView />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'categories' && (
            <CategoriesView onNavigateToProducts={() => handleTabChange('products')} />
          )}
          {(activeTab === 'sales' || activeTab === 'orders') && <SalesHistoryView />}
          {(activeTab === 'udharo' || activeTab === 'customers') && <UdharoLedgerView />}
          {activeTab === 'suppliers' && <SuppliersView />}
          {activeTab === 'expenses' && <ExpensesView />}
          {(activeTab === 'staff' || activeTab === 'team') && <StaffView />}
          {activeTab === 'wapasal' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-200">
              <WaPasalPage
                onNavigateTab={handleTabChange as any}
                onLaunchApp={() => handleTabChange('dashboard')}
              />
            </div>
          )}
          {(activeTab === 'design-studio' || activeTab === 'design') && (
            <WAStoreDesignStudio onBackToApp={() => handleTabChange('dashboard')} />
          )}
          {activeTab === 'store-profile' && (
            <StoreProfileView
              onNavigateTab={handleTabChange}
              onOpenPublicLanding={() => setAuthView('dedicated-store')}
            />
          )}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'analytics' && <DashboardView onNavigate={handleTabChange} />}
          {activeTab === 'coupons' && <CouponsView onBack={() => handleTabChange('dashboard')} />}
          {activeTab === 'pages' && <PagesView onBack={() => handleTabChange('dashboard')} />}
        </main>
      </div>

      {/* ── GLOBAL COMMAND PALETTE MODAL (⌘K) ────────────────── */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-16 lg:pt-24">
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Search products, customers, billing, or type a page name..."
                className="w-full text-sm bg-transparent outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
              />
              <button
                onClick={() => setIsCommandPaletteOpen(false)}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md"
              >
                ESC
              </button>
            </div>

            {/* Suggestions & Results */}
            <div className="p-3 max-h-80 overflow-y-auto space-y-4 text-xs">
              {/* Quick Jump Navigation */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <item.icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matching Products */}
              {matchingProducts.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Products ({matchingProducts.length})
                  </p>
                  <div className="space-y-1">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          addToCart(p, 1);
                          handleTabChange('pos');
                        }}
                        className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.category} • Qty: {p.quantity} {p.unit}</p>
                        </div>
                        <span className="font-bold text-blue-600">Rs. {p.sellingPrice} (+Add to POS)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Customers */}
              {matchingCustomers.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Customers / Khata ({matchingCustomers.length})
                  </p>
                  <div className="space-y-1">
                    {matchingCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleTabChange('udharo')}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.phone}</p>
                        </div>
                        <span className="font-bold text-amber-600">Due: Rs. {c.totalDue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAVIGATION BAR ─────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 h-16 px-2 flex items-center justify-around">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'pos', label: 'POS Billing', icon: Receipt, isCenter: true },
          { id: 'products', label: 'Items', icon: Package },
          { id: 'udharo', label: 'Udharo', icon: BookOpen },
          { id: 'sales', label: 'Bills', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition">
                  <Receipt className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 mt-1">POS</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── SHARED MODALS ACCESSIBLE FROM SIDEBAR & TOOLBAR ──── */}
      <BarcodeGeneratorModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
      />
      <AppUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
      <ShareStoreModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
