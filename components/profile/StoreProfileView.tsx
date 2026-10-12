'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Share2,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  Search,
  ShoppingCart,
  Receipt,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Tag,
  MessageCircle,
  ChevronRight,
  Filter,
  ArrowRight,
  Printer,
  Download,
  Edit3,
  Save,
  Plus,
  X,
  Eye,
  Key,
  BadgeCheck,
  Layers,
  Coins,
  Package,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface StoreProfileViewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenPublicLanding?: () => void;
}

export const StoreProfileView: React.FC<StoreProfileViewProps> = ({
  onNavigateTab,
  onOpenPublicLanding,
}) => {
  const {
    shop,
    updateShop,
    products,
    paymentQR,
    updatePaymentQR,
    printerSettings,
    updatePrinterSettings,
    formatCurrency,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'payments' | 'credentials' | 'receipt' | 'hours'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPan, setCopiedPan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Edit Store Form State
  const [editForm, setEditForm] = useState({
    name: shop.name,
    ownerName: shop.ownerName,
    phone: shop.phone,
    email: shop.email,
    address: shop.address,
    panVat: shop.panVat || '',
    currency: shop.currency || 'NPR',
    // QR / Bank Attachments
    fonepayMerchantCode: paymentQR?.fonepayMerchantCode || 'MP-KTM-9841',
    esewaId: paymentQR?.esewaId || shop.phone || '',
    bankName: 'Nabil Bank Ltd. Nepal',
    bankAccountName: shop.name,
    bankAccountNumber: '0123456789012345',
    bankBranch: 'New Road Branch, Kathmandu',
    // Receipt / Delivery
    paperSize: printerSettings.paperSize || '58mm',
    footerMessage: printerSettings.footerMessage || 'धन्यवाद ! फेरी आउनुहोला',
    deliveryRadius: '3 km',
    minOrderAmount: '500',
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const handleCopyPublicLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/#store`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyShopCode = () => {
    navigator.clipboard.writeText(shop.shopCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPan = () => {
    if (shop.panVat) {
      navigator.clipboard.writeText(shop.panVat);
      setCopiedPan(true);
      setTimeout(() => setCopiedPan(false), 2000);
    }
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop({
      name: editForm.name,
      ownerName: editForm.ownerName,
      phone: editForm.phone,
      email: editForm.email,
      address: editForm.address,
      panVat: editForm.panVat || undefined,
    });

    updatePaymentQR({
      ...paymentQR,
      fonepayMerchantCode: editForm.fonepayMerchantCode,
      esewaId: editForm.esewaId,
    });

    updatePrinterSettings({
      ...printerSettings,
      paperSize: editForm.paperSize as '58mm' | '80mm',
      footerMessage: editForm.footerMessage,
    });

    setIsEditModalOpen(false);
  };

  const totalStockItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalStockValue = products.reduce((acc, p) => acc + p.sellingPrice * p.quantity, 0);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── TOP ACTION BAR ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {language === 'ne' ? 'पसल प्रोफाइल तथा सम्बद्ध विवरण' : 'Store Profile & Showcase'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Storefront
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official store branding, tax registrations, payment QR attachments, catalog, and receipt configuration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile &amp; Attachments</span>
          </button>

          {onOpenPublicLanding && (
            <button
              onClick={onOpenPublicLanding}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Public Storefront</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}

          <button
            onClick={handleCopyPublicLink}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Copy Public Storefront Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── STORE HERO SHOWCASE CARD (PROFESSIONAL SLEEK DESIGN) ── */}
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
        {/* Sleek Mesh Gradient Banner */}
        <div className="h-40 sm:h-52 w-full bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E1B4B] dark:from-[#0B0F19] dark:via-[#111827] dark:to-[#1E1B4B] p-6 flex items-start justify-between relative overflow-hidden">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Left Top Badges on Banner */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open for Business • Counter #1</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-300 text-xs font-semibold border border-blue-400/30">
              POS v2.4 Registered
            </span>
          </div>

          {/* Right Action on Banner */}
          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold transition flex items-center gap-2 border border-white/25 cursor-pointer shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Counter QR</span>
            </button>
          </div>
        </div>

        {/* Store Profile Info Body */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 -mt-14 sm:-mt-16 mb-6">
            {/* Logo Avatar + Main Store Identity */}
            <div className="flex items-end gap-4 sm:gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-[#111827] p-1.5 shadow-2xl border-4 border-white dark:border-[#111827] shrink-0 relative z-10">
                <div className="w-full h-full rounded-[20px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-3xl shadow-inner">
                  {shop.name ? shop.name.charAt(0) : 'M'}
                </div>
              </div>

              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {shop.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-800">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Nepal Merchant
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 flex-wrap">
                  <span>Owner: <strong className="text-slate-800 dark:text-slate-200 font-bold">{shop.ownerName}</strong></span>
                  <span>•</span>
                  <span>{shop.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics & Shop Join Passcode Pill */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:flex-initial p-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">6-Digit Staff Code</p>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm tracking-widest">{shop.shopCode}</span>
                    <button
                      onClick={handleCopyShopCode}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Copy Staff Join Code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Grid Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate font-medium">{shop.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-mono font-bold truncate">{shop.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span>PAN: <strong className="font-mono font-bold">{shop.panVat || '601239845'}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-medium">7:00 AM – 9:00 PM (Daily)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATTACHMENT TABS (MODERN SEGMENTED PILLS) ──────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'overview', label: 'Store Overview', icon: Store },
          { id: 'catalog', label: `Attached Inventory (${products.length})`, icon: ShoppingCart },
          { id: 'payments', label: 'Payment QR & Bank Info', icon: QrCode },
          { id: 'credentials', label: 'Tax & Ward Registrations', icon: ShieldCheck },
          { id: 'receipt', label: 'Thermal Slip Template', icon: Receipt },
          { id: 'hours', label: 'Hours & Delivery', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: STORE OVERVIEW & ATTACHMENTS HUB ───────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Summary Box (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Products</span>
                <p className="text-lg font-black text-slate-900 dark:text-white">{products.length} SKUs</p>
                <p className="text-[10px] text-blue-600 font-semibold">{totalStockItems} total units</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Inventory Value</span>
                <p className="text-lg font-black text-slate-900 dark:text-white">Rs. {(totalStockValue / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Retail valuation</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active QR Channels</span>
                <p className="text-lg font-black text-slate-900 dark:text-white">Fonepay + eSewa</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Live dynamic QR</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Printer Format</span>
                <p className="text-lg font-black text-slate-900 dark:text-white">{printerSettings.paperSize}</p>
                <p className="text-[10px] text-purple-600 font-semibold">ESC/POS Thermal</p>
              </div>
            </div>

            {/* Official Store Credentials Summary */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Verified Store Identity &amp; Fiscal Details
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Shop Name</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{shop.name}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Owner / Representative</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{shop.ownerName}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Government PAN / VAT Number</span>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-blue-600 text-sm">{shop.panVat || '601239845'}</p>
                    <button
                      onClick={handleCopyPan}
                      className="text-slate-400 hover:text-blue-600 cursor-pointer"
                      title="Copy PAN"
                    >
                      {copiedPan ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Store Ward / Location</span>
                  <p className="font-bold text-slate-900 dark:text-white truncate">{shop.address}</p>
                </div>
              </div>
            </div>

            {/* Attached Inventory Highlights */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Attached Store Items Preview ({products.length} SKUs)
                  </h3>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('products')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Full Products View →</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {products.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1.5"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 uppercase">
                      {prod.category}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white truncate">{prod.name}</p>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-blue-600 font-black text-sm">Rs. {prod.sellingPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Qty: {prod.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Counter QR & Fast Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-4">
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-900 dark:text-white">Counter QR &amp; Public Link</h3>
                <p className="text-xs text-slate-400">Customers can scan this to view your store catalog</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
                <div className="w-44 h-44 bg-slate-900 rounded-xl flex items-center justify-center text-white p-2">
                  <QrCode className="w-36 h-36 text-white" />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCopyPublicLink}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Store Web Link'}</span>
                </button>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print QR Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ATTACHED INVENTORY CATALOG ─────────────────── */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search items, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => {
              const margin = prod.sellingPrice > 0 ? (((prod.sellingPrice - prod.purchasePrice) / prod.sellingPrice) * 100).toFixed(0) : '0';
              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                        {prod.category}
                      </span>
                      <span className={`text-[10px] font-bold ${prod.quantity <= (prod.minStockLevel || 5) ? 'text-amber-600' : 'text-emerald-600'}`}>
                        Stock: {prod.quantity} {prod.unit}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{prod.name}</h4>
                    {prod.barcode && (
                      <p className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Barcode:</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{prod.barcode}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        Rs. {prod.sellingPrice.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-400">Cost: Rs. {prod.purchasePrice}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold text-[10px]">
                      +{margin}% margin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: PAYMENTS & QR ──────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto font-black text-sm">
              Fonepay
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Fonepay Merchant Attachment</h3>
              <p className="text-xs font-mono text-slate-400">Code: {paymentQR?.fonepayMerchantCode || 'MP-KTM-9841'}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-sm">
              <QrCode className="w-32 h-32 text-slate-900 mx-auto" />
            </div>
            <p className="text-[11px] text-slate-500">Connected to counter cashier screen</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto font-black text-sm">
              eSewa
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">eSewa Direct Wallet Attachment</h3>
              <p className="text-xs font-mono text-slate-400">ID: {paymentQR?.esewaId || shop.phone}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-sm">
              <QrCode className="w-32 h-32 text-emerald-900 mx-auto" />
            </div>
            <p className="text-[11px] text-slate-500">Instant scan-and-pay wallet checkout</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Bank Account Transfer Details</h3>
              <p className="text-xs text-slate-400">For Bulk Orders &amp; Wire Transfers</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2.5 font-mono">
              <div>
                <p className="text-[10px] text-slate-400">BANK NAME</p>
                <p className="font-bold text-slate-900 dark:text-white">Nabil Bank Ltd. Nepal</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">ACCOUNT NUMBER</p>
                <p className="font-bold text-blue-600 text-sm">0123456789012345</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">ACCOUNT NAME</p>
                <p className="font-bold text-slate-900 dark:text-white">{shop.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">BRANCH</p>
                <p className="font-bold text-slate-900 dark:text-white">New Road Branch, Kathmandu</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CREDENTIALS ───────────────────────────────── */}
      {activeTab === 'credentials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Inland Revenue PAN / VAT Certificate</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-bold">
                Tax Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Government PAN:</span>
                <span className="font-bold font-mono text-blue-600 text-sm">{shop.panVat || '601239845'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Registered Entity:</span>
                <span className="font-bold text-slate-900 dark:text-white">{shop.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Invoicing Status:</span>
                <span className="text-emerald-600 font-bold">Compliant Computerized Billing</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span>Ward &amp; Municipality Registration</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Municipality:</span>
                <span className="font-bold text-slate-900 dark:text-white">Kathmandu Metropolitan City (KMC)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Registered Address:</span>
                <span className="font-bold text-slate-900 dark:text-white">{shop.address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Trade License:</span>
                <span className="font-bold text-slate-900 dark:text-white">KMC-RET-2026/894</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: THERMAL RECEIPT PREVIEW ───────────────────── */}
      {activeTab === 'receipt' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Attached Thermal Receipt Template</h3>
            <p className="text-xs text-slate-400">Formatted for {printerSettings.paperSize} POS thermal receipt rolls</p>
          </div>

          <div className="flex justify-center">
            <div className="w-[300px] bg-[#FFFDF9] text-slate-900 p-5 rounded-xl shadow-xl border border-slate-300 font-mono text-[11px] leading-tight space-y-2">
              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-400">
                <p className="font-black text-xs uppercase">{shop.name}</p>
                <p className="text-[10px] text-slate-600">{shop.address}</p>
                <p className="text-[10px] text-slate-600">PAN: {shop.panVat || '601239845'}</p>
                <p className="text-[10px] text-slate-600">Tel: {shop.phone}</p>
              </div>

              <div className="flex justify-between text-[10px] text-slate-600 border-b border-dashed border-slate-300 pb-1">
                <span>Bill: #MP-2026-0089</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="space-y-1 py-1">
                <div className="flex justify-between font-bold text-[10px]">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>{products[0]?.name || 'Sample Item 1'}</span>
                  <span>2</span>
                  <span>Rs. {((products[0]?.sellingPrice || 150) * 2).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-400 text-center text-[10px]">
                <p className="font-bold">{printerSettings.footerMessage || 'धन्यवाद ! फेरी आउनुहोला'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: HOURS & DELIVERY ──────────────────────────── */}
      {activeTab === 'hours' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Operating Schedule</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Sunday – Friday:</span>
                <span className="font-bold text-emerald-600 font-mono">7:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Saturday (Holiday):</span>
                <span className="font-bold text-emerald-600 font-mono">8:00 AM – 8:30 PM</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Local Delivery &amp; Credit Terms</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2 text-slate-700 dark:text-slate-300">
              <p>• Doorstep Delivery: <strong>Within 3 km radius</strong> in Kathmandu</p>
              <p>• Minimum Order for Free Delivery: <strong>Rs. 500</strong></p>
              <p>• Payments: <strong>Cash on Delivery (COD) &amp; Fonepay QR</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT STORE PROFILE ATTACHMENTS MODAL ──────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Edit Store Profile &amp; Attachments</h3>
                <p className="text-xs text-slate-400">Changes update your POS receipts and public store profile immediately.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Shop / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Owner Name</label>
                  <input
                    type="text"
                    value={editForm.ownerName}
                    onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Inland Revenue PAN / VAT No.</label>
                  <input
                    type="text"
                    value={editForm.panVat}
                    onChange={(e) => setEditForm({ ...editForm, panVat: e.target.value })}
                    placeholder="e.g. 601239845"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Store Address / Ward Location *</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* QR Attachments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Fonepay Merchant Code</label>
                  <input
                    type="text"
                    value={editForm.fonepayMerchantCode}
                    onChange={(e) => setEditForm({ ...editForm, fonepayMerchantCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">eSewa ID Number</label>
                  <input
                    type="text"
                    value={editForm.esewaId}
                    onChange={(e) => setEditForm({ ...editForm, esewaId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Receipt Footer Attachment */}
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">Receipt Footer Greeting</label>
                <input
                  type="text"
                  value={editForm.footerMessage}
                  onChange={(e) => setEditForm({ ...editForm, footerMessage: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Attachments</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STORE COUNTER QR MODAL ────────────────────────────── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto font-bold">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{shop.name}</h3>
              <p className="text-xs text-slate-400">Scan to view attached store catalog &amp; profile</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
              <div className="w-44 h-44 bg-slate-900 rounded-xl flex items-center justify-center text-white p-2">
                <QrCode className="w-36 h-36 text-white" />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyPublicLink}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
