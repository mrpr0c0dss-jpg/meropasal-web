'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Store,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Sparkles,
  Truck,
  Clock,
  CheckCircle2,
  ChevronRight,
  Filter,
  Plus,
  Minus,
  Trash2,
  X,
  BadgeCheck,
  Star,
  ExternalLink,
  MessageCircle,
  Share2,
  Check,
  Building2,
  Flame,
  ArrowRight,
  Layers,
  Compass,
  Navigation,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { LandingPageTab } from '../LandingHeader';
import {
  mockNearbySellers,
  mockNearbyProducts,
  NearbySeller,
  NearbySellerProduct,
} from '@/lib/mockNearbySellers';

interface WaPasalPageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
}

interface CartItemWithSeller {
  product: NearbySellerProduct;
  quantity: number;
}

export const WaPasalPage: React.FC<WaPasalPageProps> = ({ onNavigateTab, onLaunchApp }) => {
  const { shop, formatCurrency, language } = useApp();

  // Active View Tab: 'products' (overall aggregated catalog) | 'sellers' (nearby stores)
  const [viewMode, setViewMode] = useState<'products' | 'sellers'>('products');

  // Location & Filter States
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('New Baneshwor');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsDetectedText, setGpsDetectedText] = useState<string | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItemWithSeller[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'Cash on Delivery' | 'Fonepay QR' | 'eSewa'>('Cash on Delivery');

  // Area options
  const areaOptions = [
    { name: 'All Areas', city: 'All' },
    { name: 'New Baneshwor', city: 'Kathmandu' },
    { name: 'Pulchowk', city: 'Lalitpur' },
    { name: 'Thamel', city: 'Kathmandu' },
    { name: 'Jhamsikhel', city: 'Lalitpur' },
    { name: 'Koteshwor', city: 'Kathmandu' },
    { name: 'Mangal Bazaar', city: 'Lalitpur' },
    { name: 'Lakeside', city: 'Pokhara' },
  ];

  const categories = [
    'All',
    'Groceries',
    'Snacks',
    'Dairy & Bakery',
    'Fresh Produce',
    'Beverages',
    'Spices',
    'Personal Care',
  ];

  // GPS Simulation
  const handleDetectLocation = () => {
    setIsDetectingGps(true);
    setGpsDetectedText('Detecting coordinates...');
    setTimeout(() => {
      setIsDetectingGps(false);
      setSelectedArea('New Baneshwor');
      setSelectedCity('Kathmandu');
      setGpsDetectedText('📍 GPS: New Baneshwor, Kathmandu (Ward 10)');
      setTimeout(() => setGpsDetectedText(null), 4000);
    }, 1000);
  };

  // Filtered Sellers
  const filteredSellers = useMemo(() => {
    return mockNearbySellers.filter((seller) => {
      const matchCity = selectedCity === 'All' || seller.city === selectedCity;
      const matchArea = selectedArea === 'All Areas' || seller.area.toLowerCase().includes(selectedArea.toLowerCase());
      const matchDist = seller.distanceKm <= maxDistanceKm;
      const matchSearch =
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.category.toLowerCase().includes(searchQuery.toLowerCase());
      return (selectedCity === 'All' && selectedArea === 'All Areas' ? matchDist : (matchCity || matchArea) && matchDist) && matchSearch;
    });
  }, [selectedCity, selectedArea, maxDistanceKm, searchQuery]);

  // Filtered Products across nearby sellers
  const filteredProducts = useMemo(() => {
    return mockNearbyProducts.filter((product) => {
      const matchCat = selectedCategory === 'All' || product.category === selectedCategory;
      const matchDist = product.sellerDistanceKm <= maxDistanceKm;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = selectedCity === 'All' || product.sellerCity === selectedCity;
      return matchCat && matchDist && matchSearch && matchCity;
    });
  }, [selectedCategory, maxDistanceKm, searchQuery, selectedCity]);

  // Cart Handlers
  const addToCart = (product: NearbySellerProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setToastMessage(`Added "${product.name}" to cart!`);
    setTimeout(() => setToastMessage(null), 2000);
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
        .filter(Boolean) as CartItemWithSeller[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  const deliveryCharge = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 40;
  const cartGrandTotal = cartSubtotal + deliveryCharge;

  // Single Product Instant WhatsApp Order
  const handleInstantWhatsAppOrder = (product: NearbySellerProduct) => {
    const message = `🛍️ *WaPasal Instant Order - ${product.sellerName}*\n\n` +
      `नमस्ते! I would like to order:\n` +
      `• *${product.name}* (1 ${product.unit}) = Rs. ${product.sellingPrice}\n` +
      `📍 My Location: ${selectedArea || 'Kathmandu'}\n\n` +
      `Please confirm availability & delivery. Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/977${product.sellerPhone}?text=${encoded}`, '_blank');
  };

  // Full Cart WhatsApp Checkout
  const handleCartCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName || !customerPhone) return;

    // Group items by seller
    const sellerMap: { [sellerId: string]: CartItemWithSeller[] } = {};
    cart.forEach((item) => {
      const sId = item.product.sellerId;
      if (!sellerMap[sId]) sellerMap[sId] = [];
      sellerMap[sId].push(item);
    });

    // Generate slip for the primary seller
    const firstSellerId = Object.keys(sellerMap)[0];
    const sellerItems = sellerMap[firstSellerId];
    const seller = mockNearbySellers.find((s) => s.id === firstSellerId) || {
      name: sellerItems[0].product.sellerName,
      phone: sellerItems[0].product.sellerPhone,
    };

    const itemsSummary = sellerItems
      .map((item) => `• ${item.product.name} (Qty: ${item.quantity} ${item.product.unit}) = Rs. ${(item.product.sellingPrice * item.quantity).toLocaleString()}`)
      .join('\n');

    const message = `🛍️ *नयाँ WaPasal अर्डर - ${seller.name}*\n\n` +
      `👤 *ग्राहक:* ${customerName}\n` +
      `📞 *सम्पर्क:* ${customerPhone}\n` +
      `📍 *डेलिभरी ठेगाना:* ${deliveryAddress || selectedArea}\n` +
      `💳 *भुक्तानी:* ${paymentPreference}\n\n` +
      `📦 *अर्डर गरिएका सामग्रीहरू:*\n${itemsSummary}\n\n` +
      `💰 *कुल रकम:* Rs. ${cartGrandTotal.toLocaleString()}\n\n` +
      `कृपया अर्डर डेलिभरी कन्फर्म गरिदिनुहोला। धन्यवाद!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/977${seller.phone}?text=${encoded}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* ── TOAST ALERT ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-900 dark:bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── HERO BANNER: WAPASAL HYPERLOCAL NETWORK ───────────── */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl relative border border-emerald-500/20">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>WaPasal Hyperlocal Commerce</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>15–30 Min WhatsApp Delivery</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              0% Commission
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Order Groceries &amp; Essentials from <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Nearby Verified Pasals in Nepal
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Fetch real-time stock and prices from verified grocery shops, dairies, bakeries, and organic marts in your neighborhood. Order directly on WhatsApp with itemized slips.
          </p>

          {/* Quick GPS & Stats Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingGps}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition border border-white/15 cursor-pointer active:scale-95"
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>{isDetectingGps ? 'Detecting GPS...' : 'Auto-Detect Nearby Pasals'}</span>
            </button>

            {gpsDetectedText && (
              <span className="text-emerald-400 font-bold animate-in fade-in">
                {gpsDetectedText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── HYPERLOCAL LOCATION & RADIUS FILTER BAR ───────────── */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Location Area Picker */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>Area:</span>
            </span>
            {areaOptions.map((area) => (
              <button
                key={area.name}
                onClick={() => {
                  setSelectedArea(area.name);
                  setSelectedCity(area.city);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedArea === area.name
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>

          {/* Distance Radius Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Radius:</span>
            {[1, 3, 5, 10].map((km) => (
              <button
                key={km}
                onClick={() => setMaxDistanceKm(km)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  maxDistanceKm === km
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                ≤ {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={`Search products or sellers near ${selectedArea}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden text-slate-900 dark:text-white"
            />
          </div>

          {/* View Mode Toggle: Products vs Sellers */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setViewMode('products')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                viewMode === 'products'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Fetch Overall Products ({filteredProducts.length})</span>
            </button>

            <button
              onClick={() => setViewMode('sellers')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                viewMode === 'sellers'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Nearby Sellers ({filteredSellers.length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills (Visible when in Products Mode) */}
        {viewMode === 'products' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── VIEW MODE 1: OVERALL PRODUCTS FROM NEARBY SELLERS ─── */}
      {viewMode === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Fresh Products Available Near {selectedArea}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 font-bold">
                {filteredProducts.length} items
              </span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Showing sellers within {maxDistanceKm} km
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              const inCart = cart.find((item) => item.product.id === product.id);
              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-2xs flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    {/* Top Seller Info & Distance */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3" />
                        <span>{product.sellerDistanceKm} km • {product.sellerAddress.split(',')[0]}</span>
                      </span>
                      <span className="text-slate-400 font-semibold">{product.deliveryTime}</span>
                    </div>

                    {/* Product Name & Category */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    {/* Seller Link Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <Store className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {product.sellerName}
                      </span>
                      <span className="inline-flex items-center text-[10px] text-amber-500 font-bold ml-auto">
                        ★ {product.sellerRating}
                      </span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          Rs. {product.sellingPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">/ {product.unit}</span>
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 p-1 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-600">
                          <button
                            onClick={() => updateCartQuantity(product.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center">{inCart.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>

                    {/* 1-Click WhatsApp Instant Order */}
                    <button
                      onClick={() => handleInstantWhatsAppOrder(product)}
                      className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800/80 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">No products found in this radius</p>
              <p className="text-xs text-slate-400">Try expanding your distance radius (e.g. 5 km or 10 km) or selecting &quot;All Areas&quot;.</p>
            </div>
          )}
        </div>
      )}

      {/* ── VIEW MODE 2: NEARBY SELLERS DIRECTORY ──────────────── */}
      {viewMode === 'sellers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Verified Pasals Near {selectedArea}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800 font-bold">
                {filteredSellers.length} stores
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Seller Header Banner */}
                  <div className={`p-4 bg-gradient-to-r ${seller.bannerGradient} text-white flex items-center justify-between`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg">
                        {seller.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                          {seller.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-white truncate max-w-[180px]">
                            {seller.name}
                          </h3>
                          {seller.verified && (
                            <BadgeCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-black">
                        ★ {seller.rating}
                      </span>
                      <p className="text-[10px] text-white/70 font-mono mt-0.5">{seller.distanceKm} km away</p>
                    </div>
                  </div>

                  {/* Seller Details */}
                  <div className="p-4 space-y-3 text-xs">
                    <div className="space-y-1 text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{seller.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{seller.openingHours} • <strong className="text-emerald-600">Open Now</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Delivery: {seller.deliveryTime} (Free above Rs. {seller.freeDeliveryAbove})</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {seller.productsCount} items in stock
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-[10px] font-bold text-emerald-600">
                        {seller.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <a
                    href={`https://wa.me/977${seller.whatsappPhone}?text=${encodeURIComponent(`नमस्ते ${seller.name}! I am browsing your WaPasal catalog.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/store/${seller.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Store Link</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CALL TO ACTION: SHOPKEEPERS JOIN WAPASAL ──────────── */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            🏪 For Nepali Shopkeepers &amp; Retailers
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Create Your Own Free WaPasal Store in 90 Seconds
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Get your instant store website link, itemized WhatsApp order slips, 0% commission, and reach thousands of nearby customers.
          </p>
        </div>

        <button
          onClick={onLaunchApp}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Claim Your Free Store Link</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── FLOATING STICKY CHECKOUT BAR (ACTIVE MULTI-ITEM CART) */}
      {cartTotalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-6 inset-x-0 z-40 px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-6 fade-in duration-300">
          <div className="pointer-events-auto bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md px-5 py-3.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/15 flex items-center gap-4 sm:gap-6 max-w-xl w-full justify-between hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center relative">
                <ShoppingCart className="w-5 h-5 text-amber-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                  {cartTotalItems}
                </span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-300">
                  {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} from nearby pasals
                </div>
                <div className="text-sm sm:text-base font-black text-white">
                  Rs. {cartGrandTotal.toLocaleString()}
                  {deliveryCharge === 0 && <span className="text-[10px] text-emerald-400 ml-1.5 font-bold">(Free Delivery)</span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            >
              <span>View Cart &amp; Order</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      {/* ── CUSTOMER SHOPPING CART DRAWER ─────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">WaPasal Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold">
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

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      <span>{item.product.sellerName}</span>
                    </p>
                    <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                      Rs. {item.product.sellingPrice} × {item.quantity} = <strong className="text-slate-900 dark:text-white">Rs. {(item.product.sellingPrice * item.quantity).toLocaleString()}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="text-slate-500 hover:text-emerald-600 cursor-pointer font-bold px-1"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        className="text-slate-500 hover:text-emerald-600 cursor-pointer font-bold px-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                <div className="space-y-1 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charge:</span>
                    <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `Rs. ${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1">
                    <span>Grand Total:</span>
                    <span className="text-emerald-600 text-base">Rs. {cartGrandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleCartCheckout} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Phone *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Delivery Address / Ward Location"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Order via WhatsApp (Rs. {cartGrandTotal.toLocaleString()})</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
