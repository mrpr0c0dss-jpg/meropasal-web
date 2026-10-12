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
  BadgeCheck,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface StoreProfilePageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
}

export const StoreProfilePage: React.FC<StoreProfilePageProps> = ({
  onNavigateTab,
  onLaunchApp,
}) => {
  const { shop, products, paymentQR, formatCurrency, language } = useApp();

  const [activeSection, setActiveSection] = useState<'catalog' | 'payments' | 'credentials' | 'policies' | 'receipt'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPan, setCopiedPan] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Categories extracted from active products
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/#store`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyPan = () => {
    if (shop.panVat) {
      navigator.clipboard.writeText(shop.panVat);
      setCopiedPan(true);
      setTimeout(() => setCopiedPan(false), 2000);
    }
  };

  const handleOrderWhatsApp = (productName: string, price: number) => {
    const text = encodeURIComponent(
      `नमस्ते ${shop.name}! म तपाइँको पसलबाट यो अर्डर गर्न चाहन्छु:\n• ${productName} (मूल्य: Rs. ${price})\nकृपया डेलिभरी / उपलब्धता जानकारी गराउनुहोला। धन्यवाद!`
    );
    window.open(`https://wa.me/977${shop.phone.replace(/[^0-9]/g, '') || '9800000000'}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* ── STORE HEADER / HERO BANNER ───────────────────────── */}
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
        {/* Sleek Mesh Gradient Background */}
        <div className="h-40 sm:h-52 w-full bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E1B4B] dark:from-[#0B0F19] dark:via-[#111827] dark:to-[#1E1B4B] p-6 flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'ne' ? 'अहिले खुला छ' : 'Open for Business'}</span>
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold transition flex items-center gap-2 border border-white/25 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Store QR</span>
            </button>
          </div>
        </div>

        {/* Store Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            {/* Shop Logo Avatar */}
            <div className="flex items-end gap-4 sm:gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-[#111827] p-1.5 shadow-2xl border-4 border-white dark:border-[#111827] shrink-0 relative z-10">
                <div className="w-full h-full rounded-[20px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-3xl shadow-inner">
                  {shop.name ? shop.name.charAt(0) : 'M'}
                </div>
              </div>
              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {shop.name || 'Kathmandu Mart & Kirana'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200/80 dark:border-emerald-800">
                    <BadgeCheck className="w-3 h-3 text-emerald-500" />
                    Verified Nepal Merchant
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {shop.ownerName} • Kathmandu Valley, Nepal
                </p>
              </div>
            </div>

            {/* Quick Actions (Share, Copy, WhatsApp) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share Store Link'}</span>
              </button>

              <a
                href={`https://wa.me/977${shop.phone.replace(/[^0-9]/g, '') || '9800000000'}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Shop</span>
              </a>
            </div>
          </div>

          {/* Quick Info Tags Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate">{shop.address || 'New Road, Kathmandu'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-mono font-bold truncate">{shop.phone || '+977 980-0000000'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span>PAN: <strong className="font-mono font-bold">{shop.panVat || '601239845'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>7:00 AM – 9:00 PM (Daily)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATTACHMENT SECTION TABS (SEGMENTED PILLS) ────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'catalog', label: 'Attached Products & Catalog', labelNe: 'सामग्री क्याटलग', icon: ShoppingCart, count: products.length },
          { id: 'payments', label: 'Payment & QR Attachments', labelNe: 'क्युआर र भुक्तानी', icon: QrCode },
          { id: 'credentials', label: 'Registration & Credentials', labelNe: 'दर्ता र प्यान', icon: ShieldCheck },
          { id: 'receipt', label: 'Sample Thermal Bill Slip', labelNe: 'थर्मल रसिद', icon: Receipt },
          { id: 'policies', label: 'Store Hours & Delivery Policy', labelNe: 'डेलिभरी र नियम', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'ne' ? tab.labelNe : tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── ATTACHMENT TAB 1: PRODUCT CATALOG ─────────────────── */}
      {activeSection === 'catalog' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
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
                placeholder="Search attached items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                      {product.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In Stock
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                  {product.barcode && (
                    <p className="text-[10px] font-mono text-slate-400">Barcode: {product.barcode}</p>
                  )}
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      Rs. {product.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/ {product.unit || 'pc'}</span>
                  </div>

                  <button
                    onClick={() => handleOrderWhatsApp(product.name, product.sellingPrice)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                    title="Order via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
              No products found matching your search.
            </div>
          )}
        </div>
      )}

      {/* ── ATTACHMENT TAB 2: PAYMENTS & QR ───────────────────── */}
      {activeSection === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto font-black text-sm">
              Fonepay
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Fonepay Dynamic QR</h3>
              <p className="text-xs text-slate-400">Merchant Code: {paymentQR?.fonepayMerchantCode || 'MP-KTM-9841'}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
              <div className="w-36 h-36 bg-slate-900 rounded-xl flex items-center justify-center text-white p-2">
                <QrCode className="w-28 h-28 text-white" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Scan via any Nepali Mobile Banking App</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto font-black text-sm">
              eSewa
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">eSewa Direct Wallet</h3>
              <p className="text-xs text-slate-400">eSewa ID: {paymentQR?.esewaId || shop.phone || '9841000000'}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
              <div className="w-36 h-36 bg-emerald-900 rounded-xl flex items-center justify-center text-white p-2">
                <QrCode className="w-28 h-28 text-white" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Scan via eSewa App or send to ID</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Attached Bank Wire Details</h3>
              <p className="text-xs text-slate-400">For Bulk Orders &amp; Wholesale Transfers</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-xs space-y-2.5 font-mono">
              <div>
                <p className="text-[10px] text-slate-400">BANK NAME</p>
                <p className="font-bold text-slate-900 dark:text-white">Nabil Bank Ltd. Nepal</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">ACCOUNT NAME</p>
                <p className="font-bold text-slate-900 dark:text-white">{shop.name || 'Kathmandu Mart'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">ACCOUNT NUMBER</p>
                <p className="font-bold text-blue-600 text-sm">0123456789012345</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">BRANCH</p>
                <p className="font-bold text-slate-900 dark:text-white">New Road Branch, Kathmandu</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTACHMENT TAB 3: CREDENTIALS & REGISTRATIONS ──────── */}
      {activeSection === 'credentials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Inland Revenue PAN / VAT Details</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-bold">
                Tax Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Government PAN Number:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
                  <span>{shop.panVat || '601239845'}</span>
                  <button onClick={handleCopyPan} className="text-blue-600 hover:opacity-80 cursor-pointer">
                    {copiedPan ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Registered Legal Entity:</span>
                <span className="font-bold text-slate-900 dark:text-white">{shop.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Invoicing Status:</span>
                <span className="text-emerald-600 font-bold">Computerized Thermal Billing Ready</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Local Ward &amp; Municipality Registration</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Municipality:</span>
                <span className="font-bold text-slate-900 dark:text-white">Kathmandu Metropolitan City (KMC)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ward Number:</span>
                <span className="font-bold text-slate-900 dark:text-white">Ward No. 22 (New Road)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Operating License:</span>
                <span className="font-bold text-slate-900 dark:text-white">KMC-RET-2026/894</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTACHMENT TAB 4: SAMPLE THERMAL RECEIPT ─────────── */}
      {activeSection === 'receipt' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Attached Thermal Receipt Format</h3>
            <p className="text-xs text-slate-500">Sample printed paper invoice attached to customer purchases</p>
          </div>

          <div className="flex justify-center">
            <div className="w-[300px] bg-[#FFFDF9] text-slate-900 p-5 rounded-xl shadow-xl border border-slate-300 font-mono text-[11px] leading-tight space-y-2">
              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-400">
                <p className="font-black text-xs uppercase">{shop.name || 'KATHMANDU MART'}</p>
                <p className="text-[10px] text-slate-600">{shop.address || 'New Road, Kathmandu'}</p>
                <p className="text-[10px] text-slate-600">PAN: {shop.panVat || '601239845'}</p>
                <p className="text-[10px] text-slate-600">Tel: {shop.phone || '+977 9800000000'}</p>
              </div>

              <div className="flex justify-between text-[10px] text-slate-600 border-b border-dashed border-slate-300 pb-1">
                <span>Bill: #MP-2026-0102</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="space-y-1 py-1">
                <div className="flex justify-between font-bold text-[10px]">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Wai Wai Noodles (10pcs)</span>
                  <span>10</span>
                  <span>Rs. 250</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Amul Butter 500g</span>
                  <span>1</span>
                  <span>Rs. 580</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-400 space-y-1 text-[10px]">
                <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-400">
                  <span>TOTAL PAID:</span>
                  <span>Rs. 830</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Paid Via:</span>
                  <span className="font-bold">Fonepay QR</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-400 text-[10px]">
                <p className="font-bold">धन्यवाद ! फेरी आउनुहोला</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTACHMENT TAB 5: POLICIES & HOURS ────────────────── */}
      {activeSection === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operating Hours */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Store Operating Schedule</h3>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Sunday - Thursday</span>
                <span className="font-mono font-bold text-emerald-600">7:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Friday</span>
                <span className="font-mono font-bold text-emerald-600">7:00 AM – 9:30 PM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Saturday (Public Holiday)</span>
                <span className="font-mono font-bold text-emerald-600">8:00 AM – 8:30 PM</span>
              </div>
            </div>
          </div>

          {/* Delivery & Udharo Policy */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Local Delivery &amp; Credit Terms</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Free doorstep delivery within 2 km radius for orders above Rs. 1,000.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Accepting Cash on Delivery (COD) &amp; Live Fonepay/eSewa QR on delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Customer credit (Udharo) recorded via digital WhatsApp passbook for approved regular customers.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ── SHARE STORE QR MODAL ──────────────────────────────── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
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
                onClick={handleCopyLink}
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
