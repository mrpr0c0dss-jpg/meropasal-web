'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { ProductModel } from '@/lib/types';
import { getProductImageUrl } from '@/lib/mockData';
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
  Plus,
  Minus,
  Trash2,
  X,
  BadgeCheck,
  Send,
  Heart,
  HelpCircle,
} from 'lucide-react';

interface CartItem {
  product: ProductModel;
  quantity: number;
}

interface DedicatedStoreWebsiteProps {
  onBackToApp?: () => void;
  standalone?: boolean;
}

export const DedicatedStoreWebsite: React.FC<DedicatedStoreWebsiteProps> = ({
  onBackToApp,
  standalone = false,
}) => {
  const { shop, products, paymentQR, formatCurrency, language, setLanguage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Customer Checkout Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Fonepay QR' | 'eSewa'>('Cash on Delivery');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  const catalogRef = React.useRef<HTMLElement>(null);
  const themeColor = shop.themeColor || '#0284c7';

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const displayLimit = shop.productsPerPage && shop.productsPerPage !== 'all' ? parseInt(shop.productsPerPage, 10) : undefined;
  const displayedProducts = displayLimit ? sortedProducts.slice(0, displayLimit) : sortedProducts;

  // Dynamic Design Styles from shop (Storefront appearance)
  const cornerClass = shop.corners === 'sharp' ? 'rounded-none' : shop.corners === 'rounded' ? 'rounded-3xl' : 'rounded-2xl';
  const cardStyleClass = shop.productCardStyle === 'shadow'
    ? 'shadow-lg border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#111827]'
    : shop.productCardStyle === 'flat'
    ? 'bg-slate-100/70 dark:bg-slate-800/50 border-0 shadow-none'
    : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs';

  const imgAspectClass = shop.productImageShape === 'square'
    ? 'aspect-square'
    : shop.productImageShape === 'landscape'
    ? 'aspect-[4/3]'
    : 'aspect-[3/4]';

  const desktopColsClass = shop.productsPerRowDesktop === '2'
    ? 'md:grid-cols-2 lg:grid-cols-2'
    : shop.productsPerRowDesktop === '3'
    ? 'md:grid-cols-3 lg:grid-cols-3'
    : shop.productsPerRowDesktop === '5'
    ? 'md:grid-cols-4 lg:grid-cols-5'
    : 'md:grid-cols-3 lg:grid-cols-4';
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const addToCart = (product: ProductModel) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setLastAddedItem(product.name);
    setTimeout(() => {
      setLastAddedItem((curr) => (curr === product.name ? null : curr));
    }, 2000);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  const deliveryFee = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 50;
  const cartGrandTotal = cartSubtotal + deliveryFee;

  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || cart.length === 0) return;

    const itemsSummary = cart
      .map((item) => `• ${item.product.name} (Qty: ${item.quantity} ${item.product.unit || 'pcs'}) = Rs. ${(item.product.sellingPrice * item.quantity).toLocaleString()}`)
      .join('\n');

    const message = `🛍️ *नयाँ अनलाइन अर्डर - ${shop.name}*\n\n` +
      `👤 *ग्राहकको नाम:* ${customerName}\n` +
      `📞 *सम्पर्क नम्बर:* ${customerPhone}\n` +
      `📍 *डेलिभरी ठेगाना:* ${deliveryAddress || 'Pickup at Store'}\n` +
      `💳 *भुक्तानी माध्यम:* ${paymentMethod}\n\n` +
      `📦 *अर्डर गरिएका सामग्रीहरू:*\n${itemsSummary}\n\n` +
      `💰 *कुल रकम (Grand Total):* Rs. ${cartGrandTotal.toLocaleString()}\n\n` +
      `कृपया अर्डर पुष्टि गरिदिनुहोला। धन्यवाद!`;

    const encoded = encodeURIComponent(message);
    const storePhone = shop.phone.replace(/[^0-9]/g, '') || '9800000000';
    window.open(`https://wa.me/977${storePhone}?text=${encoded}`, '_blank');

    setOrderPlacedSuccess(true);
    setCart([]);
    setTimeout(() => {
      setOrderPlacedSuccess(false);
      setIsCartOpen(false);
    }, 4000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors antialiased">
      {/* ── TOP NOTIFICATION BAR ──────────────────────────────── */}
      {shop.showAnnouncement !== false && (
        <div
          className="text-white py-2 px-4 text-xs font-semibold text-center flex items-center justify-between transition-colors shadow-xs"
          style={{ backgroundColor: themeColor }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{shop.announcementText || `Welcome to the Official Storefront of ${shop.name}`}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="hidden sm:inline">🚚 Free Delivery on orders over Rs. 500</span>
              {onBackToApp && (
                <button
                  onClick={onBackToApp}
                  className="px-2.5 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Back to POS</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN STORE NAVBAR ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo & Store Name */}
          <div className={`flex items-center gap-3 cursor-pointer select-none ${shop.headerLayout === 'centered' ? 'md:mx-auto' : ''}`}>
            {shop.logoUrl ? (
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md bg-white">
                <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-black text-xl shadow-md"
                style={{ backgroundColor: themeColor }}
              >
                {shop.name ? shop.name.charAt(0) : 'M'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  {shop.name}
                </span>
                {shop.headerLayout !== 'minimal' && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    <BadgeCheck className="w-3 h-3 text-emerald-500" />
                    Verified
                  </span>
                )}
              </div>
              {shop.headerLayout !== 'minimal' && (
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 -mt-0.5">
                  <MapPin className="w-3 h-3" style={{ color: themeColor }} />
                  <span>{shop.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Center Search Bar (Desktop) */}
          {!shop.hideSearchBar && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="w-full relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={`Search ${products.length} products in store...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Right Action Icons (WhatsApp, Share, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              title="Share Store Website"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="hidden sm:inline-flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              title="Store Payment QR"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
            </button>

            <a
              href={`https://wa.me/977${shop.phone.replace(/[^0-9]/g, '') || '9800000000'}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Shopping Cart Button with Dynamic Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95 relative"
              style={{ backgroundColor: themeColor }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{shop.cartLabel || 'Cart'}</span>
              {cartTotalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-black text-[11px] flex items-center justify-center animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── STORE HERO BANNER & NOTICE ───────────────────────── */}
      {shop.showBanner !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
          <div className="rounded-3xl overflow-hidden relative shadow-xl min-h-[220px] sm:min-h-[290px] flex items-center p-6 sm:p-10 text-white group">
            {/* Background Image */}
            <img
              src={
                shop.bannerUrl ||
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
              }
              alt="Store Banner"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl space-y-3.5">
              <div className="inline-flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1.5"
                  style={{ backgroundColor: themeColor }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{shop.bannerTag || '🔥 Direct Online Storefront • Fast Home Delivery'}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
                {shop.bannerTitle || 'Order Groceries & Daily Essentials Online'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                {shop.bannerSubtitle ||
                  'Browse our fresh stock below, add items to your cart, and place your order directly via WhatsApp or Phone.'}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer hover:opacity-95"
                  style={{ backgroundColor: themeColor }}
                >
                  <span>{shop.bannerBtnText || 'Browse Catalog 🛒'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Delivery within 3 km in Kathmandu</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Open Today: 7:00 AM – 9:00 PM</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>Fonepay / eSewa / Cash on Delivery</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCT CATALOG SECTION ───────────────────────────── */}
      <main ref={catalogRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Category Pill Filters, Sorting & Mobile Search */}
        {(!shop.hideCategoryFilters || !shop.hideSearchBar || !shop.hideSortingMenu) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            {!shop.hideCategoryFilters && (
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                    style={selectedCategory === cat ? { backgroundColor: themeColor } : {}}
                  >
                    {cat === 'all' ? 'All Catalog' : cat}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {!shop.hideSortingMenu && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer outline-hidden"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              )}

              {!shop.hideSearchBar && (
                <div className="w-full sm:w-64 relative sm:hidden">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Cards Grid - Adapts to productLayout & productsPerRowDesktop */}
        <div
          className={
            shop.productLayout === 'list'
              ? 'space-y-3'
              : `grid grid-cols-2 sm:grid-cols-2 ${desktopColsClass} gap-2.5 sm:gap-5`
          }
        >
          {displayedProducts.map((product) => {
            const inCart = cart.find((item) => item.product.id === product.id);
            const pImage = getProductImageUrl(product);

            {/* 1. LIST LAYOUT */}
            if (shop.productLayout === 'list') {
              return (
                <div
                  key={product.id}
                  className={`p-3 sm:p-4 ${cornerClass} ${cardStyleClass} flex items-center justify-between gap-3 sm:gap-4 transition-all group hover:border-blue-400`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-18 h-18 sm:w-22 sm:h-22 ${cornerClass} overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative`}>
                      <img
                        src={pImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        Rs. {product.sellingPrice.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">/ {product.unit || 'pc'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {inCart ? (
                      <div
                        className="flex items-center gap-1.5 p-1 rounded-xl border text-xs font-bold"
                        style={{ borderColor: `${themeColor}40`, color: themeColor, backgroundColor: `${themeColor}15` }}
                      >
                        <button
                          onClick={() => updateCartQuantity(product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs">{inCart.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: themeColor }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{shop.addToCartBtnText || 'Add to Cart'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            {/* 2. GALLERY LAYOUT (Big photos, minimal text) */}
            if (shop.productLayout === 'gallery') {
              return (
                <div
                  key={product.id}
                  className={`${cornerClass} ${cardStyleClass} overflow-hidden flex flex-col justify-between group hover:border-blue-400 transition-all p-2.5 sm:p-3 space-y-2`}
                >
                  <div className={`w-full ${imgAspectClass} ${cornerClass} overflow-hidden bg-slate-100 dark:bg-slate-800 relative`}>
                    <img
                      src={pImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs sm:text-base font-black text-slate-900 dark:text-white">
                        Rs. {product.sellingPrice.toLocaleString()}
                      </span>

                      {inCart ? (
                        <div
                          className="flex items-center gap-1 p-0.5 rounded-lg border text-[11px] font-bold"
                          style={{ borderColor: `${themeColor}40`, color: themeColor, backgroundColor: `${themeColor}15` }}
                        >
                          <button
                            onClick={() => updateCartQuantity(product.id, -1)}
                            className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-4 text-center">{inCart.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, 1)}
                            className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="px-2.5 py-1 rounded-lg text-white text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer hover:opacity-90 flex items-center gap-1"
                          style={{ backgroundColor: themeColor }}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{shop.addToCartBtnText || 'Add'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            {/* 3. COMPACT LAYOUT (Small tiles, 2 per row on phones) */}
            if (shop.productLayout === 'compact') {
              return (
                <div
                  key={product.id}
                  className={`${cornerClass} ${cardStyleClass} overflow-hidden p-2 sm:p-2.5 flex flex-col justify-between group hover:border-blue-400 transition-all space-y-1.5`}
                >
                  <div className={`w-full aspect-square ${cornerClass} overflow-hidden bg-slate-100 dark:bg-slate-800 relative`}>
                    <img
                      src={pImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white line-clamp-1 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        Rs. {product.sellingPrice}
                      </span>

                      {inCart ? (
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: themeColor }}
                        >
                          {inCart.quantity} in cart
                        </span>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-6 h-6 rounded-lg text-white flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer hover:opacity-90"
                          style={{ backgroundColor: themeColor }}
                          title={shop.addToCartBtnText || 'Add to Cart'}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            {/* 4. STANDARD GRID LAYOUT */}
            return (
              <div
                key={product.id}
                className={`${cornerClass} ${cardStyleClass} overflow-hidden p-3 sm:p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-2.5 sm:space-y-3 group`}
              >
                {/* Product Photo */}
                <div className={`w-full ${imgAspectClass} ${cornerClass} overflow-hidden bg-slate-100 dark:bg-slate-800 relative`}>
                  <img
                    src={pImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider truncate">
                      {product.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-lg bg-emerald-500/90 text-[9px] font-bold text-white shrink-0">
                      In Stock
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.barcode && (
                    <p className="text-[9px] font-mono text-slate-400 truncate">Barcode: {product.barcode}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs sm:text-base font-black text-slate-900 dark:text-white">
                      Rs. {product.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 ml-1">/ {product.unit || 'pc'}</span>
                  </div>

                  {inCart ? (
                    <div
                      className="flex items-center justify-between sm:justify-center gap-1.5 p-1 rounded-xl border text-xs font-bold w-full sm:w-auto"
                      style={{
                        borderColor: `${themeColor}40`,
                        color: themeColor,
                        backgroundColor: `${themeColor}15`,
                      }}
                    >
                      <button
                        onClick={() => updateCartQuantity(product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-xs">{inCart.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-white text-[11px] sm:text-xs font-bold shadow-md transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: themeColor }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{shop.addToCartBtnText || 'Add to Cart'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-sm text-slate-600 dark:text-slate-300">No products found</p>
            <p className="text-xs text-slate-400">Try searching for something else or browse all categories.</p>
          </div>
        )}

        {/* ── STOREFRONT FAQ SECTION (FROM DESIGN STUDIO) ─── */}
        {shop.showFaq !== false && shop.faqs && shop.faqs.length > 0 && (
          <section className="pt-6 pb-2">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="space-y-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  FAQ &amp; Help
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs text-slate-400">Everything you need to know about ordering and home deliveries.</p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {shop.faqs.map((faq) => (
                  <div key={faq.id} className="py-3.5 space-y-1.5 first:pt-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-3.5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── CUSTOMER SHOPPING CART DRAWER ─────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">Your Shopping Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 text-xs font-bold">
                  {cartTotalItems} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3 text-slate-400">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Your cart is currently empty</p>
                  <p className="text-xs">Add items from the store catalog to place your online order.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                      <p className="text-slate-400 font-mono text-[11px]">
                        Rs. {item.product.sellingPrice} × {item.quantity} = <strong className="text-blue-600">Rs. {(item.product.sellingPrice * item.quantity).toLocaleString()}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="text-slate-500 hover:text-blue-600 cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="text-slate-500 hover:text-blue-600 cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Checkout Form & Summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Items Subtotal:</span>
                    <span>Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery Charge:</span>
                    <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `Rs. ${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1">
                    <span>Grand Total:</span>
                    <span className="text-blue-600 text-base">Rs. {cartGrandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Inputs */}
                <form onSubmit={handleCheckoutWhatsApp} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Delivery Address / Ward Location in Kathmandu"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Preference:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Cash on Delivery', 'Fonepay QR', 'eSewa'] as const).map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-1 text-center rounded-xl font-bold transition text-[11px] cursor-pointer ${
                            paymentMethod === method
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{shop.whatsappOrderBtnText || 'Send Order via WhatsApp'} (Rs. {cartGrandTotal.toLocaleString()})</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STORE PAYMENT QR MODAL ────────────────────────────── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto font-black text-sm">
              Fonepay
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{shop.name}</h3>
              <p className="text-xs text-slate-400 font-mono">Merchant: {paymentQR?.fonepayMerchantCode || 'MP-KTM-9841'}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
              <div className="w-44 h-44 bg-slate-900 rounded-xl flex items-center justify-center text-white p-2">
                <QrCode className="w-36 h-36 text-white" />
              </div>
            </div>

            <p className="text-xs text-slate-500">Scan via any Nepali Mobile Banking or eSewa App</p>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION WHEN ITEM ADDED ───────────────── */}
      {lastAddedItem && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Added &quot;{lastAddedItem}&quot; to cart!</span>
          </div>
        </div>
      )}

      {/* ── FLOATING STICKY CHECKOUT BAR (ACTIVE CART) ─────────── */}
      {cartTotalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-6 inset-x-0 z-40 px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-6 fade-in duration-300">
          <div className="pointer-events-auto bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md px-5 py-3.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/15 flex items-center gap-4 sm:gap-6 max-w-xl w-full justify-between hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center relative">
                <ShoppingCart className="w-5 h-5 text-amber-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                  {cartTotalItems}
                </span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-300">
                  {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} in cart
                </div>
                <div className="text-sm sm:text-base font-black text-white">
                  Rs. {cartGrandTotal.toLocaleString()}
                  {deliveryFee === 0 && <span className="text-[10px] text-emerald-400 ml-1.5 font-bold">(Free Delivery)</span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            >
              <span>{shop.checkoutBtnText || 'View Cart & Checkout'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      {/* ── DEDICATED STOREFOOTER ──────────────────────────────── */}
      <footer className="bg-white dark:bg-[#080C14] border-t border-slate-200/80 dark:border-slate-800 text-xs mt-16 pb-32 sm:pb-24">
        {/* Trust & Guarantee Banner */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0B101D]/70 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs"
                  style={{ backgroundColor: themeColor }}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Fast Delivery</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Quick delivery in your area</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">100% Genuine</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Verified quality products</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">WhatsApp Order</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct chat &amp; instant confirm</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Easy Payment</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Fonepay QR, eSewa &amp; COD</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation & Store Information */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Col 1: Store Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 select-none">
                {shop.logoUrl ? (
                  <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white shrink-0 shadow-xs">
                    <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0"
                    style={{ backgroundColor: themeColor }}
                  >
                    {shop.name ? shop.name.charAt(0) : 'M'}
                  </div>
                )}
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white tracking-tight">
                    {shop.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">Curated Essentials &amp; Verified Store</p>
                </div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
                {shop.aboutStory ||
                  'Your trusted neighborhood store providing hand-picked essentials, fast delivery, and seamless WhatsApp ordering.'}
              </p>

              <div className="pt-1 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <span>{shop.address || 'Kathmandu, Nepal'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`tel:${shop.phone}`} className="font-mono hover:underline">
                    {shop.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{shop.storeHours || 'Everyday: 7:00 AM – 9:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Catalog Categories */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Shop Catalog
              </h5>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-slate-900 dark:hover:text-white transition capitalize text-left cursor-pointer"
                    >
                      {cat === 'all' ? 'All Products' : cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Service & Delivery */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Delivery &amp; Coverage
              </h5>
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <p>
                  Coverage: <strong className="text-slate-700 dark:text-slate-300">{shop.deliveryArea || 'Kathmandu, Lalitpur, Bhaktapur'}</strong>
                </p>
                <p>
                  Free Delivery on orders over <strong className="text-emerald-600 dark:text-emerald-400">Rs. 500</strong>
                </p>
                {shop.panVat && (
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      PAN: {shop.panVat}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Col 4: Direct WhatsApp & Payment */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Order &amp; Connect
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Have questions or want a custom order? Chat directly on WhatsApp.
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/977${shop.phone.replace(/[^0-9]/g, '') || '9800000000'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Accepted Payments
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 border border-red-200 dark:border-red-800 font-bold text-[10px]">
                    Fonepay
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px]">
                    eSewa
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-[10px]">
                    Cash on Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Branding Bar */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} <strong className="text-slate-700 dark:text-slate-300">{shop.name}</strong>. All rights reserved.
            </p>

            {!shop.removeCreateStoreFooter && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px]">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Powered by <strong className="text-emerald-600 dark:text-emerald-400">MeroPasal WAStore</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <a
                  href="/"
                  className="font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
                >
                  Create your own free store
                </a>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
