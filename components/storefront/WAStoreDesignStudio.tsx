'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Smartphone,
  Monitor,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check,
  Palette,
  Download,
  X,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Tag,
  FileText,
  Share2,
  Save,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  Search,
  ShoppingCart,
  ArrowRight,
  Info,
  Layers,
  Store,
  MessageCircle,
  QrCode,
  Globe,
  Sliders,
  PanelLeftClose,
  PanelLeft,
  Upload,
  HelpCircle,
  Clock,
  MapPin,
  Phone,
  Building2,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { ProductModel } from '@/lib/types';

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  bgLight: string;
  textClass: string;
}

const COLOR_THEMES: ColorTheme[] = [
  { id: 'emerald', name: 'Emerald', primary: '#10b981', primaryHover: '#059669', bgLight: '#ecfdf5', textClass: 'text-emerald-600' },
  { id: 'ocean', name: 'Ocean', primary: '#0284c7', primaryHover: '#0369a1', bgLight: '#f0f9ff', textClass: 'text-sky-600' },
  { id: 'sunset', name: 'Sunset', primary: '#ea580c', primaryHover: '#c2410c', bgLight: '#fff7ed', textClass: 'text-orange-600' },
  { id: 'lavender', name: 'Lavender', primary: '#8b5cf6', primaryHover: '#7c3aed', bgLight: '#f5f3ff', textClass: 'text-purple-600' },
  { id: 'midnight', name: 'Midnight', primary: '#2563eb', primaryHover: '#1d4ed8', bgLight: '#eff6ff', textClass: 'text-blue-600' },
  { id: 'slate', name: 'Slate', primary: '#334155', primaryHover: '#1e293b', bgLight: '#f8fafc', textClass: 'text-slate-700' },
  { id: 'ruby', name: 'Ruby', primary: '#dc2626', primaryHover: '#b91c1c', bgLight: '#fef2f2', textClass: 'text-red-600' },
  { id: 'coral', name: 'Coral', primary: '#e11d48', primaryHover: '#be123c', bgLight: '#fff1f2', textClass: 'text-rose-600' },
  { id: 'mint', name: 'Mint', primary: '#0d9488', primaryHover: '#0f766e', bgLight: '#f0fdfa', textClass: 'text-teal-600' },
];

interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  description: string;
  variants?: { name: string; price: number }[];
  isCustom?: boolean;
}

const INITIAL_DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'dp-1',
    name: 'Hand-Knit Poncho',
    category: 'Tops & Knit',
    price: 78.0,
    originalPrice: 95.0,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    description: 'Open-weave cotton knitted by hand, finished with a fringed hem. One size.',
  },
  {
    id: 'dp-2',
    name: 'Leather Shoulder Bag',
    category: 'Accessories',
    price: 165.0,
    unit: 'bag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    description: 'Smooth calf leather in blush with a woven stripe, a chain strap and a magnetic flap.',
    variants: [
      { name: 'L', price: 32.0 },
      { name: 'XL', price: 32.0 },
    ],
  },
  {
    id: 'dp-3',
    name: 'Round Metal Sunglasses',
    category: 'Accessories',
    price: 49.0,
    originalPrice: 58.0,
    unit: 'pair',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight gold frames with green polarised lenses. Comes with a linen pouch.',
  },
  {
    id: 'dp-4',
    name: 'Gold Pendant Necklace',
    category: 'Accessories',
    price: 65.0,
    originalPrice: 145.0,
    unit: 'item',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    description: 'A single freshwater pearl on a fine 14k gold-filled chain. Arrives gift-boxed.',
  },
  {
    id: 'dp-5',
    name: 'Wai Wai Noodles (Chicken Special)',
    category: 'Nepali Essentials',
    price: 25.0,
    unit: 'pack',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic Nepali instant chowchow with chili powder and onion flavor oil.',
  },
  {
    id: 'dp-6',
    name: 'Himalayan Organic Honey 500g',
    category: 'Organic Mart',
    price: 450.0,
    unit: 'jar',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: '100% pure wild honey harvested from the pristine high-altitude forests of Nepal.',
  },
];

interface WAStoreDesignStudioProps {
  onBackToApp?: () => void;
}

export const WAStoreDesignStudio: React.FC<WAStoreDesignStudioProps> = ({ onBackToApp }) => {
  const { shop, updateShop, language } = useApp();

  // Design studio state
  const [selectedThemeId, setSelectedThemeId] = useState<string>('ocean');
  const [customColor, setCustomColor] = useState<string>(shop.themeColor || '#0284c7');
  const [useCustomColor, setUseCustomColor] = useState<boolean>(!!shop.themeColor);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);
  const [storeDomain, setStoreDomain] = useState<string>('shop.maisonnord.com');

  // Accordion expansion states matching exact screenshot
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState<boolean>(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState<boolean>(true);
  const [isHeroOpen, setIsHeroOpen] = useState<boolean>(false);
  const [isAboutHoursOpen, setIsAboutHoursOpen] = useState<boolean>(false);
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isButtonTextOpen, setIsButtonTextOpen] = useState<boolean>(false);

  const [announcementText, setAnnouncementText] = useState<string>(
    shop.announcementText || '⚡ Free shipping on orders over Rs. 500 • Worldwide delivery'
  );
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(
    shop.showAnnouncement !== undefined ? shop.showAnnouncement : true
  );

  // Logo & Branding state
  const [logoInitials, setLogoInitials] = useState<string>(
    shop.name ? shop.name.slice(0, 2).toUpperCase() : 'MN'
  );
  const [logoImageUrl, setLogoImageUrl] = useState<string>(shop.logoUrl || '');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');

  // Storefront appearance layout states (matching WAStore screenshots)
  const [productLayout, setProductLayout] = useState<'grid' | 'list' | 'gallery' | 'compact'>(
    shop.productLayout || 'gallery'
  );
  const [headerLayout, setHeaderLayout] = useState<'classic' | 'centered' | 'minimal'>(
    shop.headerLayout || 'classic'
  );
  const [productCardStyle, setProductCardStyle] = useState<'border' | 'shadow' | 'flat'>(
    shop.productCardStyle || 'border'
  );
  const [corners, setCorners] = useState<'soft' | 'rounded' | 'sharp'>(
    shop.corners || 'soft'
  );
  const [productImageShape, setProductImageShape] = useState<'portrait' | 'square' | 'landscape'>(
    shop.productImageShape || 'portrait'
  );
  const [productsPerRowDesktop, setProductsPerRowDesktop] = useState<'2' | '3' | '4' | '5'>(
    shop.productsPerRowDesktop || '4'
  );
  const [productsPerPage, setProductsPerPage] = useState<string>(
    shop.productsPerPage || '12'
  );
  const [hideSearchBar, setHideSearchBar] = useState<boolean>(
    shop.hideSearchBar || false
  );
  const [hideSortingMenu, setHideSortingMenu] = useState<boolean>(
    shop.hideSortingMenu || false
  );
  const [hideCategoryFilters, setHideCategoryFilters] = useState<boolean>(
    shop.hideCategoryFilters || false
  );
  const [removeCreateStoreFooter, setRemoveCreateStoreFooter] = useState<boolean>(
    shop.removeCreateStoreFooter !== undefined ? shop.removeCreateStoreFooter : true
  );

  // Mobile Device tab toggle between editor controls and live preview
  const [mobileStudioTab, setMobileStudioTab] = useState<'editor' | 'preview'>('editor');

  // Hero headline state
  const [showBanner, setShowBanner] = useState<boolean>(
    shop.showBanner !== undefined ? shop.showBanner : true
  );
  const [bannerImageUrl, setBannerImageUrl] = useState<string>(
    shop.bannerUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  );
  const [bannerTag, setBannerTag] = useState<string>(
    shop.bannerTag || '🔥 Exclusive Offers • 30-Min Fast Delivery'
  );
  const [bannerTitle, setBannerTitle] = useState<string>(
    shop.bannerTitle || 'Order Daily Groceries & Essentials Online'
  );
  const [bannerSubtitle, setBannerSubtitle] = useState<string>(
    shop.bannerSubtitle || 'Fresh farm produce, pantry staples, and bakery treats straight to your doorstep.'
  );
  const [bannerBtnText, setBannerBtnText] = useState<string>(
    shop.bannerBtnText || 'Browse Catalog 🛒'
  );
  const [bannerUrlInput, setBannerUrlInput] = useState<string>('');

  // About & hours state
  const [aboutStory, setAboutStory] = useState<string>(
    shop.aboutStory || 'Serving fresh groceries, organic staples, dairy, and household essentials directly to your neighborhood in Kathmandu with fast and friendly home delivery.'
  );
  const [storeHours, setStoreHours] = useState<string>(
    shop.storeHours || '7:00 AM – 9:00 PM (Open 7 Days a Week)'
  );
  const [deliveryArea, setDeliveryArea] = useState<string>(
    shop.deliveryArea || 'Kathmandu, Lalitpur & Bhaktapur (Free over Rs. 500)'
  );
  const [storeAddress, setStoreAddress] = useState<string>(shop.address || 'New Baneshwor, Kathmandu, Nepal');
  const [storePhone, setStorePhone] = useState<string>(shop.phone || '9841234567');
  const [panVat, setPanVat] = useState<string>(shop.panVat || '601239845');

  // Storefront FAQ state
  const [showFaq, setShowFaq] = useState<boolean>(
    shop.showFaq !== undefined ? shop.showFaq : true
  );
  const [faqs, setFaqs] = useState<{ id: string; question: string; answer: string }[]>(
    shop.faqs && shop.faqs.length > 0
      ? shop.faqs
      : [
          {
            id: 'faq_1',
            question: 'How do I place an order?',
            answer: 'Browse products, add items to your cart, and click "Send Order via WhatsApp". We will confirm your order and dispatch it immediately.',
          },
          {
            id: 'faq_2',
            question: 'What payment methods do you accept?',
            answer: 'We accept Cash on Delivery (COD), Fonepay QR code scanning, and eSewa payments upon arrival.',
          },
          {
            id: 'faq_3',
            question: 'How fast is delivery?',
            answer: 'Standard home deliveries within Kathmandu are completed in 30–60 minutes from order confirmation.',
          },
          {
            id: 'faq_4',
            question: 'Can I add or remove items after placing an order?',
            answer: 'Yes! Simply text us directly on WhatsApp before your order is dispatched from our store.',
          },
        ]
  );

  const handleAddFaq = () => {
    const newFaq = {
      id: `faq_${Date.now()}`,
      question: 'New Question',
      answer: 'Answer to this question...',
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleUpdateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Button & label text state
  const [addToCartBtnText, setAddToCartBtnText] = useState<string>(
    shop.addToCartBtnText || 'Add to Cart'
  );
  const [cartLabel, setCartLabel] = useState<string>(
    shop.cartLabel || 'Cart'
  );
  const [checkoutBtnText, setCheckoutBtnText] = useState<string>(
    shop.checkoutBtnText || 'View Cart & Checkout'
  );
  const [whatsappOrderBtnText, setWhatsappOrderBtnText] = useState<string>(
    shop.whatsappOrderBtnText || 'Send Order via WhatsApp'
  );

  const BANNER_PRESETS = [
    {
      name: 'Fresh Groceries',
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Organic Fruits',
      url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Bakery & Sweets',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Modern Mart',
      url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerImageUrl(reader.result);
          setShowBanner(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyBannerUrl = () => {
    if (bannerUrlInput.trim()) {
      setBannerImageUrl(bannerUrlInput.trim());
      setShowBanner(true);
      setBannerUrlInput('');
    }
  };

  // Live Preview Cart
  const [previewCart, setPreviewCart] = useState<{ [productId: string]: number }>({});
  const [isSaveToastVisible, setIsSaveToastVisible] = useState<boolean>(false);

  // Active theme calculation
  const currentTheme = COLOR_THEMES.find((t) => t.id === selectedThemeId) || COLOR_THEMES[1];
  const activeColorHex = useCustomColor ? customColor : currentTheme.primary;

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    setUseCustomColor(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setUseCustomColor(true);
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setLogoImageUrl(imageUrlInput.trim());
      setImageUrlInput('');
    }
  };

  const handleRemoveLogo = () => {
    setLogoImageUrl('');
  };

  const handleAddToCart = (productId: string) => {
    setPreviewCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const totalCartCount = Object.values(previewCart).reduce((a, b) => a + b, 0);

  // Auto-sync design changes to global shop state so /store reflects immediately!
  React.useEffect(() => {
    updateShop({
      themeColor: activeColorHex,
      logoUrl: logoImageUrl,
      bannerUrl: bannerImageUrl,
      bannerTag,
      bannerTitle,
      bannerSubtitle,
      bannerBtnText,
      showBanner,
      announcementText,
      showAnnouncement,
      aboutStory,
      storeHours,
      deliveryArea,
      address: storeAddress,
      phone: storePhone,
      panVat,
      showFaq,
      faqs,
      addToCartBtnText,
      cartLabel,
      checkoutBtnText,
      whatsappOrderBtnText,
      productLayout,
      headerLayout,
      productCardStyle,
      corners,
      productImageShape,
      productsPerRowDesktop,
      productsPerPage,
      hideSearchBar,
      hideSortingMenu,
      hideCategoryFilters,
      removeCreateStoreFooter,
    });
  }, [
    activeColorHex,
    logoImageUrl,
    bannerImageUrl,
    bannerTag,
    bannerTitle,
    bannerSubtitle,
    bannerBtnText,
    showBanner,
    announcementText,
    showAnnouncement,
    aboutStory,
    storeHours,
    deliveryArea,
    storeAddress,
    storePhone,
    panVat,
    showFaq,
    faqs,
    addToCartBtnText,
    cartLabel,
    checkoutBtnText,
    whatsappOrderBtnText,
    productLayout,
    headerLayout,
    productCardStyle,
    corners,
    productImageShape,
    productsPerRowDesktop,
    productsPerPage,
    hideSearchBar,
    hideSortingMenu,
    hideCategoryFilters,
    removeCreateStoreFooter,
    updateShop,
  ]);

  const handleSaveChanges = () => {
    const updatedPayload = {
      id: shop.id || 'shop_demo_001',
      name: shop.name || 'Mero Pasal Kirana & General Store',
      themeColor: activeColorHex,
      logoUrl: logoImageUrl,
      bannerUrl: bannerImageUrl,
      bannerTag,
      bannerTitle,
      bannerSubtitle,
      bannerBtnText,
      showBanner,
      announcementText,
      showAnnouncement,
      aboutStory,
      storeHours,
      deliveryArea,
      address: storeAddress,
      phone: storePhone,
      panVat,
      showFaq,
      faqs,
      addToCartBtnText,
      cartLabel,
      checkoutBtnText,
      whatsappOrderBtnText,
      productLayout,
      headerLayout,
      productCardStyle,
      corners,
      productImageShape,
      productsPerRowDesktop,
      productsPerPage,
      hideSearchBar,
      hideSortingMenu,
      hideCategoryFilters,
      removeCreateStoreFooter,
    };

    updateShop(updatedPayload);

    try {
      if (typeof window !== 'undefined') {
        const currentSaved = localStorage.getItem('mp_shop');
        const base = currentSaved ? JSON.parse(currentSaved) : shop;
        localStorage.setItem('mp_shop', JSON.stringify({ ...base, ...updatedPayload }));
        window.dispatchEvent(new CustomEvent('mp_shop_updated', { detail: { ...base, ...updatedPayload } }));
      }
    } catch {}

    setIsSaveToastVisible(true);
    setTimeout(() => {
      setIsSaveToastVisible(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* ── TOP LIVE STORE BAR ───────────────────────── */}
      <div className="bg-[#1C1917] text-white py-2 px-4 text-xs flex items-center justify-between border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-300">
            <span className="text-emerald-400">⚡</span>
            <span>Live Design Studio — Customize your storefront colors, banner, announcement &amp; layout.</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/store"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleSaveChanges()}
              className="px-3.5 py-1 rounded-md bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition cursor-pointer shadow-sm inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
              <span>View live store</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN STUDIO LAYOUT: EDITOR & LIVE PREVIEW ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── MAIN WORKSPACE (INSTALL BANNER + HEADER + 2-COL STUDIO) ─ */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-24">
          <div className="p-6 space-y-5 max-w-[1600px] mx-auto w-full">
            {/* ── TOP INSTALL APP BANNER (WASTORE LIGHT GREEN CARD) ── */}
            {showInstallBanner && (
              <div className="bg-[#E6F4EA] dark:bg-emerald-950/40 border border-[#CEEAD6] dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Install the app</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      Add wastore to your home screen for one-tap access to your store.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm">
                    <Download className="w-3.5 h-3.5" />
                    <span>Install</span>
                  </button>
                  <button
                    onClick={() => setShowInstallBanner(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Screen Segmented Tab Switcher (Design Controls vs Live Store Preview) */}
            <div className="lg:hidden flex items-center p-1 bg-slate-200/90 dark:bg-slate-800 rounded-2xl mb-2 shadow-inner">
              <button
                onClick={() => setMobileStudioTab('editor')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  mobileStudioTab === 'editor'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Design Controls</span>
              </button>
              <button
                onClick={() => setMobileStudioTab('preview')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  mobileStudioTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* ── 2-COLUMN SPLIT STUDIO (CONTROLS ON LEFT, LIVE CANVAS ON RIGHT) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-1">
              {/* ── LEFT COLUMN: DESIGN CONTROLS ACCORDIONS (EXACT MATCH TO WASTORE SCREENSHOT) ── */}
              <div className={`lg:col-span-4 space-y-3 ${mobileStudioTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
                <div className="flex items-center justify-between px-1 h-9">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Design
                  </h1>
                  <a
                    href="/store"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleSaveChanges()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>View live store</span>
                  </a>
                </div>

                <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                  {/* 1. Store Announcement */}
                <div>
                  <button
                    onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
                    className="w-full p-4.5 flex items-center justify-between text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span>Store Announcement</span>
                    {isAnnouncementOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isAnnouncementOpen && (
                    <div className="p-4.5 pt-0 space-y-3.5 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pt-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Enable Announcement Bar</label>
                        <input
                          type="checkbox"
                          checked={showAnnouncement}
                          onChange={(e) => setShowAnnouncement(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Announcement Text</label>
                        <input
                          type="text"
                          value={announcementText}
                          onChange={(e) => setAnnouncementText(e.target.value)}
                          placeholder="e.g. ⚡ Free shipping on orders over Rs. 500"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-400">Shown in the top notification banner across the storefront website.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Storefront appearance */}
                <div>
                  <button
                    onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                    className={`w-full p-4.5 flex items-center justify-between text-sm sm:text-base font-bold transition cursor-pointer ${
                      isAppearanceOpen
                        ? 'bg-[#F0FDF4] dark:bg-emerald-950/40 text-slate-900 dark:text-white border-b border-emerald-100 dark:border-emerald-900/50'
                        : 'text-slate-800 dark:text-slate-100 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span>Storefront appearance</span>
                    {isAppearanceOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isAppearanceOpen && (
                    <div className="p-4.5 space-y-5 text-xs animate-in fade-in duration-150">
                      {/* 1. Logo (optional) */}
                      <div>
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                          Logo <span className="text-slate-400 font-normal">(optional)</span>
                        </label>

                        <div className="flex items-center gap-3.5">
                          {/* Logo container with dark close badge */}
                          <div className="relative w-18 h-18 rounded-2xl bg-[#F6F3EC] dark:bg-slate-800/90 border border-[#E8E2D5] dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                            {logoImageUrl ? (
                              <img
                                src={logoImageUrl}
                                alt="Logo"
                                className="w-13 h-13 rounded-full object-cover border border-slate-300 dark:border-slate-600 shadow-inner"
                              />
                            ) : (
                              <div className="w-13 h-13 rounded-full border border-slate-700 dark:border-slate-300 flex items-center justify-center font-serif text-base font-bold text-slate-800 dark:text-slate-100 shadow-inner">
                                {logoInitials}
                              </div>
                            )}
                            <button
                              onClick={handleRemoveLogo}
                              title="Remove logo"
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1F2937] hover:bg-red-600 text-white flex items-center justify-center shadow-xs cursor-pointer transition"
                            >
                              <X className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Right links and URL input */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 text-xs font-semibold">
                              <button
                                onClick={() => {
                                  const next = prompt('Enter logo initials or name abbreviation:', logoInitials);
                                  if (next) setLogoInitials(next.toUpperCase());
                                }}
                                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                              >
                                Change image
                              </button>
                              <button
                                onClick={handleRemoveLogo}
                                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                placeholder="https://example.com"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:ring-2 focus:ring-emerald-500"
                              />
                              <button
                                onClick={handleAddImageUrl}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer shrink-0"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Store colour (i) */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Store colour
                          </label>
                          <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          {COLOR_THEMES.map((theme) => {
                            const isSelected = !useCustomColor && selectedThemeId === theme.id;
                            return (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => handleSelectTheme(theme.id)}
                                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative bg-white dark:bg-slate-800/40 ${
                                  isSelected
                                    ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-xs'
                                    : 'border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300'
                                }`}
                              >
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-xs flex items-center justify-center">
                                  <div
                                    className="absolute inset-0"
                                    style={{ backgroundColor: theme.primary }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/35 pointer-events-none" />
                                  {theme.id === 'slate' && (
                                    <span className="absolute -top-1 px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-[9px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
                                      Slate
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  {theme.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Brand colour */}
                      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 bg-white dark:bg-slate-900 space-y-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Brand colour</h4>
                          <p className="text-[11px] text-slate-400">
                            Match your storefront to your exact brand colour
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <div className="relative">
                            <input
                              type="color"
                              id="storeBrandColorPicker"
                              value={customColor}
                              onChange={handleCustomColorChange}
                              className="sr-only"
                            />
                            <label
                              htmlFor="storeBrandColorPicker"
                              className="w-8 h-8 rounded-full cursor-pointer block border border-slate-200 shadow-xs"
                              style={{ backgroundColor: activeColorHex }}
                              title="Pick custom color"
                            />
                          </div>

                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {activeColorHex}
                          </span>

                          <div className="flex items-center gap-3 ml-auto text-xs font-bold">
                            <label
                              htmlFor="storeBrandColorPicker"
                              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                            >
                              Change
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setUseCustomColor(false);
                                setSelectedThemeId('ocean');
                                setCustomColor('#0284c7');
                              }}
                              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 4. Banner image URL (optional) (i) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Banner image URL <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </div>

                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/photo-1542838132..."
                          value={bannerImageUrl}
                          onChange={(e) => setBannerImageUrl(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>

                      {/* 5. Product layout (i) */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Product layout
                          </label>
                          <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* 1. Grid Card */}
                          <button
                            type="button"
                            onClick={() => setProductLayout('grid')}
                            className={`p-3.5 rounded-2xl text-left flex flex-col justify-between relative transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                              productLayout === 'grid'
                                ? 'border-2 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                                : 'border border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            {productLayout === 'grid' && (
                              <div className="absolute -top-2 -right-2 w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}

                            {/* Grid Illustration Container */}
                            <div className="h-20 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-2 flex items-center justify-center gap-1.5 border border-slate-100 dark:border-slate-800/80 mb-3">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className={`w-7 h-15 rounded-md p-1 flex flex-col justify-between shadow-2xs ${
                                    productLayout === 'grid'
                                      ? 'bg-white border border-emerald-400'
                                      : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                                  }`}
                                >
                                  <div
                                    className={`w-full h-5.5 rounded-xs ${
                                      productLayout === 'grid'
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                  />
                                  <div className="space-y-0.5 pt-0.5">
                                    <div
                                      className={`h-0.5 w-full rounded-full ${
                                        productLayout === 'grid'
                                          ? 'bg-emerald-500'
                                          : 'bg-slate-300 dark:bg-slate-600'
                                      }`}
                                    />
                                    <div
                                      className={`h-0.5 w-4/5 rounded-full ${
                                        productLayout === 'grid'
                                          ? 'bg-emerald-500'
                                          : 'bg-slate-300 dark:bg-slate-600'
                                      }`}
                                    />
                                    <div
                                      className={`h-0.5 w-3/5 rounded-full ${
                                        productLayout === 'grid'
                                          ? 'bg-emerald-500'
                                          : 'bg-slate-300 dark:bg-slate-600'
                                      }`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Grid</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                Cards with description and button
                              </p>
                            </div>
                          </button>

                          {/* 2. List Card */}
                          <button
                            type="button"
                            onClick={() => setProductLayout('list')}
                            className={`p-3.5 rounded-2xl text-left flex flex-col justify-between relative transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                              productLayout === 'list'
                                ? 'border-2 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                                : 'border border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            {productLayout === 'list' && (
                              <div className="absolute -top-2 -right-2 w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}

                            {/* List Illustration Container */}
                            <div className="h-20 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-2 flex flex-col justify-center gap-1.5 border border-slate-100 dark:border-slate-800/80 mb-3">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className={`w-full h-4 rounded-md p-1 flex items-center justify-between gap-1 shadow-2xs ${
                                    productLayout === 'list'
                                      ? 'bg-white border border-emerald-400'
                                      : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-xs shrink-0 ${
                                      productLayout === 'list'
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                  />
                                  <div className="flex-1 space-y-0.5">
                                    <div
                                      className={`h-0.5 w-3/4 rounded-full ${
                                        productLayout === 'list'
                                          ? 'bg-emerald-500'
                                          : 'bg-slate-300 dark:bg-slate-600'
                                      }`}
                                    />
                                    <div
                                      className={`h-0.5 w-1/2 rounded-full ${
                                        productLayout === 'list'
                                          ? 'bg-emerald-400'
                                          : 'bg-slate-200 dark:bg-slate-700'
                                      }`}
                                    />
                                  </div>
                                  <div
                                    className={`w-3 h-1.5 rounded-xs shrink-0 ${
                                      productLayout === 'list'
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">List</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                One row per product — great for menus
                              </p>
                            </div>
                          </button>

                          {/* 3. Gallery Card */}
                          <button
                            type="button"
                            onClick={() => setProductLayout('gallery')}
                            className={`p-3.5 rounded-2xl text-left flex flex-col justify-between relative transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                              productLayout === 'gallery'
                                ? 'border-2 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                                : 'border border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            {productLayout === 'gallery' && (
                              <div className="absolute -top-2 -right-2 w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}

                            {/* Gallery Illustration Container */}
                            <div className="h-20 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-2 flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-800/80 mb-3">
                              {[0, 1].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                  <div
                                    className={`w-9 h-11 rounded-sm shadow-2xs ${
                                      productLayout === 'gallery'
                                        ? 'bg-emerald-500 border border-emerald-600'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                  />
                                  <div
                                    className={`h-0.5 w-6 rounded-full ${
                                      productLayout === 'gallery'
                                        ? 'bg-emerald-400'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                  />
                                  <div
                                    className={`h-0.5 w-4 rounded-full ${
                                      productLayout === 'gallery'
                                        ? 'bg-emerald-300'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Gallery</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                Big photos, minimal text — fashion &amp; art
                              </p>
                            </div>
                          </button>

                          {/* 4. Compact Card */}
                          <button
                            type="button"
                            onClick={() => setProductLayout('compact')}
                            className={`p-3.5 rounded-2xl text-left flex flex-col justify-between relative transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                              productLayout === 'compact'
                                ? 'border-2 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                                : 'border border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            {productLayout === 'compact' && (
                              <div className="absolute -top-2 -right-2 w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}

                            {/* Compact Illustration Container */}
                            <div className="h-20 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-2 flex items-center justify-center border border-slate-100 dark:border-slate-800/80 mb-3">
                              <div className="grid grid-cols-4 grid-rows-2 gap-1 w-full max-w-[130px]">
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`h-6 rounded-xs p-0.5 flex flex-col justify-between shadow-2xs ${
                                      productLayout === 'compact'
                                        ? 'bg-white border border-emerald-400'
                                        : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                                    }`}
                                  >
                                    <div
                                      className={`w-full h-3 rounded-2xs ${
                                        productLayout === 'compact'
                                          ? 'bg-emerald-500'
                                          : 'bg-slate-300 dark:bg-slate-600'
                                      }`}
                                    />
                                    <div
                                      className={`h-0.5 w-3/4 mx-auto rounded-full ${
                                        productLayout === 'compact'
                                          ? 'bg-emerald-400'
                                          : 'bg-slate-200 dark:bg-slate-700'
                                      }`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Compact</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                Small tiles, 2 per row on phones
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* 6. Dropdown controls */}
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Header layout
                          </label>
                          <div className="relative">
                            <select
                              value={headerLayout}
                              onChange={(e) => setHeaderLayout(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
                            >
                              <option value="classic">Classic (left aligned)</option>
                              <option value="centered">Centered</option>
                              <option value="minimal">Minimal</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Product card style
                          </label>
                          <div className="relative">
                            <select
                              value={productCardStyle}
                              onChange={(e) => setProductCardStyle(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
                            >
                              <option value="border">Border</option>
                              <option value="shadow">Shadow</option>
                              <option value="flat">Flat</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Corners
                          </label>
                          <div className="relative">
                            <select
                              value={corners}
                              onChange={(e) => setCorners(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
                            >
                              <option value="soft">Soft</option>
                              <option value="rounded">Rounded</option>
                              <option value="sharp">Sharp</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Product image shape
                          </label>
                          <div className="relative">
                            <select
                              value={productImageShape}
                              onChange={(e) => setProductImageShape(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
                            >
                              <option value="portrait">Portrait</option>
                              <option value="square">Square</option>
                              <option value="landscape">Landscape</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Products Per Row (Desktop)
                          </label>
                          <div className="relative">
                            <select
                              value={productsPerRowDesktop}
                              onChange={(e) => setProductsPerRowDesktop(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
                            >
                              <option value="4">4 columns</option>
                              <option value="3">3 columns</option>
                              <option value="2">2 columns</option>
                              <option value="5">5 columns</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Products Per Page
                          </label>
                          <div className="relative">
                            <select
                              value={productsPerPage}
                              onChange={(e) => setProductsPerPage(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
                            >
                              <option value="12">12 products</option>
                              <option value="8">8 products</option>
                              <option value="16">16 products</option>
                              <option value="24">24 products</option>
                              <option value="all">All products</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* 7. Storefront Visibility Checkboxes (Matching Screenshot 1 exactly) */}
                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={hideSearchBar}
                            onChange={(e) => setHideSearchBar(e.target.checked)}
                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Hide the search bar
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={hideSortingMenu}
                            onChange={(e) => setHideSortingMenu(e.target.checked)}
                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Hide the sorting menu
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={hideCategoryFilters}
                            onChange={(e) => setHideCategoryFilters(e.target.checked)}
                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Hide category filters
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={removeCreateStoreFooter}
                            onChange={(e) => setRemoveCreateStoreFooter(e.target.checked)}
                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Remove &ldquo;Create your store&rdquo; footer
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Hero headline */}
                <div>
                  <button
                    onClick={() => setIsHeroOpen(!isHeroOpen)}
                    className="w-full p-4.5 flex items-center justify-between text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span>Hero headline</span>
                    {isHeroOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isHeroOpen && (
                    <div className="p-4.5 pt-0 space-y-4 text-xs animate-in fade-in duration-150">
                      {/* Toggle */}
                      <div className="flex items-center justify-between pt-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          Show Hero Banner on Storefront
                        </label>
                        <input
                          type="checkbox"
                          checked={showBanner}
                          onChange={(e) => setShowBanner(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>

                      {/* Headline Text Customization */}
                      <div className="space-y-2.5 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            Headline Title
                          </label>
                          <input
                            type="text"
                            value={bannerTitle}
                            onChange={(e) => setBannerTitle(e.target.value)}
                            placeholder="e.g. Fresh Daily Groceries &amp; Essentials"
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            Subtitle Description
                          </label>
                          <textarea
                            rows={2}
                            value={bannerSubtitle}
                            onChange={(e) => setBannerSubtitle(e.target.value)}
                            placeholder="e.g. Order fresh organic fruits and vegetables..."
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            Banner Tag / Badge
                          </label>
                          <input
                            type="text"
                            value={bannerTag}
                            onChange={(e) => setBannerTag(e.target.value)}
                            placeholder="e.g. 🔥 Exclusive Deals"
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            Action Button Label
                          </label>
                          <input
                            type="text"
                            value={bannerBtnText}
                            onChange={(e) => setBannerBtnText(e.target.value)}
                            placeholder="e.g. Shop Now 🛒"
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* File Upload Box */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                          Upload Banner Image
                        </label>

                        <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-800/30 transition group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                              Click or Drag &amp; Drop Image
                            </span>
                            <span className="text-[10px] text-slate-400">
                              PNG, JPG, WebP from your device
                            </span>
                          </div>
                        </div>

                        {/* Current Banner Preview & Remove */}
                        {bannerImageUrl && (
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <img
                              src={bannerImageUrl}
                              alt="Current Banner"
                              className="w-16 h-10 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-600"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                                Active Store Banner
                              </p>
                              <span className="text-[10px] text-emerald-600 font-semibold">Live in Preview</span>
                            </div>
                            <button
                              onClick={() => setBannerImageUrl('')}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
                              title="Remove Banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Or Paste URL */}
                        <div className="pt-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Or Paste Image URL
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="https://example.com/banner.jpg"
                              value={bannerUrlInput}
                              onChange={(e) => setBannerUrlInput(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                            />
                            <button
                              onClick={handleApplyBannerUrl}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                        </div>

                        {/* 1-Click High-Quality Presets */}
                        <div className="pt-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                            Banner Presets
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {BANNER_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => {
                                  setBannerImageUrl(preset.url);
                                  setShowBanner(true);
                                }}
                                className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold text-left truncate transition cursor-pointer ${
                                  bannerImageUrl === preset.url
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. About & hours */}
                <div>
                  <button
                    onClick={() => setIsAboutHoursOpen(!isAboutHoursOpen)}
                    className="w-full p-4.5 flex items-center justify-between text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span>About &amp; hours</span>
                    {isAboutHoursOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isAboutHoursOpen && (
                    <div className="p-4.5 pt-0 space-y-3.5 text-xs animate-in fade-in duration-150">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          About Our Store (Bio / Story)
                        </label>
                        <textarea
                          rows={3}
                          value={aboutStory}
                          onChange={(e) => setAboutStory(e.target.value)}
                          placeholder="Tell your customers about your shop..."
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Opening Hours
                        </label>
                        <input
                          type="text"
                          value={storeHours}
                          onChange={(e) => setStoreHours(e.target.value)}
                          placeholder="e.g. 7:00 AM – 9:00 PM (Open 7 Days)"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Delivery Coverage &amp; Area
                        </label>
                        <input
                          type="text"
                          value={deliveryArea}
                          onChange={(e) => setDeliveryArea(e.target.value)}
                          placeholder="e.g. Delivery within 3 km in Kathmandu"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            Store Address
                          </label>
                          <input
                            type="text"
                            value={storeAddress}
                            onChange={(e) => setStoreAddress(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            WhatsApp / Phone
                          </label>
                          <input
                            type="text"
                            value={storePhone}
                            onChange={(e) => setStorePhone(e.target.value)}
                            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          PAN / VAT Registration No.
                        </label>
                        <input
                          type="text"
                          value={panVat}
                          onChange={(e) => setPanVat(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Storefront FAQ */}
                <div>
                  <button
                    onClick={() => setIsFaqOpen(!isFaqOpen)}
                    className="w-full p-4.5 flex items-center justify-between text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span>Storefront FAQ</span>
                    {isFaqOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isFaqOpen && (
                    <div className="p-4.5 pt-0 space-y-4 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pt-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          Show FAQ Section on Storefront
                        </label>
                        <input
                          type="checkbox"
                          checked={showFaq}
                          onChange={(e) => setShowFaq(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                          <div
                            key={faq.id}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 relative group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                FAQ #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                                title="Delete FAQ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                              placeholder="Question, e.g. How do I place an order?"
                              className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-emerald-500"
                            />

                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                              placeholder="Answer to the question..."
                              className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 outline-hidden focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        ))}

                        <button
                          onClick={handleAddFaq}
                          className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Question</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Button & label text */}
                <div>
                  <button
                    onClick={() => setIsButtonTextOpen(!isButtonTextOpen)}
                    className="w-full p-4.5 flex items-center justify-between text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span>Button &amp; label text</span>
                    {isButtonTextOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isButtonTextOpen && (
                    <div className="p-4.5 pt-0 space-y-3.5 text-xs animate-in fade-in duration-150">
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Product Card Button
                        </label>
                        <input
                          type="text"
                          value={addToCartBtnText}
                          onChange={(e) => setAddToCartBtnText(e.target.value)}
                          placeholder="e.g. Add to Cart"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Cart / Bag Navbar Label
                        </label>
                        <input
                          type="text"
                          value={cartLabel}
                          onChange={(e) => setCartLabel(e.target.value)}
                          placeholder="e.g. Cart, Bag, Basket"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Checkout Sticky Bar Button
                        </label>
                        <input
                          type="text"
                          value={checkoutBtnText}
                          onChange={(e) => setCheckoutBtnText(e.target.value)}
                          placeholder="e.g. View Cart &amp; Checkout"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          WhatsApp Submit Order Button
                        </label>
                        <input
                          type="text"
                          value={whatsappOrderBtnText}
                          onChange={(e) => setWhatsappOrderBtnText(e.target.value)}
                          placeholder="e.g. Send Order via WhatsApp"
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

              {/* ── RIGHT COLUMN: INTERACTIVE BROWSER LIVE PREVIEW ─── */}
              <div className={`lg:col-span-8 flex flex-col items-center space-y-3 lg:sticky lg:top-4 lg:self-start ${mobileStudioTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
                {/* Viewport Switcher & Reload Control aligned with Design Header */}
                <div className="w-full flex items-center justify-end gap-3 h-9">
                  <div className="flex items-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shadow-2xs">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        previewMode === 'desktop'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>

                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        previewMode === 'mobile'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setPreviewCart({})}
                    className="p-1.5 px-2.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Reset Preview"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reload</span>
                  </button>
                </div>
                <div
                  className={`w-full transition-all duration-300 ${
                    previewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-full'
                  }`}
                >
                  {/* Browser or Smartphone Mockup Chrome */}
                  <div
                    className={
                      previewMode === 'mobile'
                        ? 'rounded-[44px] border-[10px] border-slate-900 dark:border-slate-800 bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-800/80'
                        : 'rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-2xl'
                    }
                  >
                    {/* Frame Top Header */}
                    {previewMode === 'mobile' ? (
                      /* Smartphone Dynamic Island Status Bar */
                      <div className="bg-slate-900 pt-2.5 pb-2 px-6 flex items-center justify-between text-white text-[10px] font-semibold select-none border-b border-white/5">
                        <span className="font-mono">9:41</span>
                        <div className="w-20 h-4 bg-black rounded-full border border-white/10 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-slate-800" />
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold">
                          <span>5G</span>
                          <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5 flex items-center">
                            <div className="w-full h-full bg-white rounded-2xs" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* MacOS Window Top Bar */
                      <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block shadow-2xs" />
                          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block shadow-2xs" />
                          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block shadow-2xs" />
                        </div>

                        <div className="px-4 py-1 rounded-full bg-white dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 truncate max-w-[240px]">
                          {storeDomain}
                        </div>

                        <div className="flex items-center gap-2">
                          {totalCartCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                              🛒 {totalCartCount}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Storefront Website Canvas Content */}
                    <div className="bg-slate-50/50 dark:bg-[#0B0F19] min-h-[600px] text-slate-900 dark:text-slate-100 flex flex-col">
                      {/* Live Store Announcement */}
                      {showAnnouncement && (
                        <div
                          className="py-2 px-4 text-center text-white text-xs font-semibold shadow-xs"
                          style={{ backgroundColor: activeColorHex }}
                        >
                          {announcementText}
                        </div>
                      )}

                      {/* Store Header - Respects headerLayout */}
                      <div
                        className={`p-4 sm:p-5 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 ${
                          headerLayout === 'centered'
                            ? 'flex flex-col items-center text-center gap-3'
                            : 'flex items-center justify-between'
                        }`}
                      >
                        <div className={`flex items-center gap-3 ${headerLayout === 'centered' ? 'flex-col text-center' : ''}`}>
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-serif text-sm font-bold text-slate-700 dark:text-slate-200 overflow-hidden shrink-0 shadow-xs">
                            {logoImageUrl ? (
                              <img src={logoImageUrl} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              logoInitials
                            )}
                          </div>
                          <div>
                            <h2 className="font-serif font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                              {shop.name || 'Maison Nord'}
                            </h2>
                            {headerLayout !== 'minimal' && (
                              <p className="text-[10px] text-slate-400">Curated Goods &amp; Essentials</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            className="px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                            style={{ backgroundColor: activeColorHex }}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{cartLabel} ({totalCartCount})</span>
                          </button>
                        </div>
                      </div>

                      {/* Live Store Hero Banner */}
                      {showBanner && bannerImageUrl && (
                        <div className="p-4 sm:p-6 pb-0">
                          <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[160px] sm:min-h-[220px] flex items-center p-6 sm:p-8 text-white group">
                            {/* Background Image */}
                            <img
                              src={bannerImageUrl}
                              alt="Store Banner"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />

                            {/* Content */}
                            <div className="relative z-10 max-w-lg space-y-2">
                              {bannerTag && (
                                <span
                                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                                  style={{ backgroundColor: activeColorHex }}
                                >
                                  {bannerTag}
                                </span>
                              )}
                              <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-sm">
                                {bannerTitle}
                              </h3>
                              {bannerSubtitle && (
                                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                                  {bannerSubtitle}
                                </p>
                              )}
                              {bannerBtnText && (
                                <div className="pt-2">
                                  <button
                                    className="px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
                                    style={{ backgroundColor: activeColorHex }}
                                  >
                                    <span>{bannerBtnText}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Store Products Section */}
                      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Search, Category Filters & Sorting Preview */}
                        {(!hideCategoryFilters || !hideSearchBar || !hideSortingMenu) && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white dark:bg-[#111827] p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs shadow-2xs">
                            {!hideCategoryFilters && (
                              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
                                {['All Catalog', 'Apparel', 'Accessories', 'Groceries'].map((cat, idx) => (
                                  <span
                                    key={cat}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                                      idx === 0 ? 'text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}
                                    style={idx === 0 ? { backgroundColor: activeColorHex } : {}}
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                              {!hideSortingMenu && (
                                <select className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 outline-hidden">
                                  <option>Sort: Featured</option>
                                  <option>Price: Low to High</option>
                                  <option>Price: High to Low</option>
                                </select>
                              )}

                              {!hideSearchBar && (
                                <div className="w-full sm:w-44 relative">
                                  <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
                                  <input
                                    type="text"
                                    placeholder="Search products..."
                                    disabled
                                    className="w-full pl-7 pr-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] outline-hidden"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Product Cards Container - STRICT 2 PRODUCTS PER ROW ON MOBILE */}
                        <div
                          className={
                            productLayout === 'list'
                              ? 'space-y-2.5'
                              : previewMode === 'mobile'
                              ? 'grid grid-cols-2 gap-2.5'
                              : `grid grid-cols-2 ${
                                  productsPerRowDesktop === '2'
                                    ? 'sm:grid-cols-2'
                                    : productsPerRowDesktop === '3'
                                    ? 'sm:grid-cols-3'
                                    : productsPerRowDesktop === '5'
                                    ? 'sm:grid-cols-3 lg:grid-cols-5'
                                    : 'sm:grid-cols-2 lg:grid-cols-4'
                                } gap-3 sm:gap-4`
                          }
                        >
                          {INITIAL_DEMO_PRODUCTS.slice(0, previewMode === 'mobile' ? 4 : 4).map((product) => {
                            const inCartCount = previewCart[product.id] || 0;
                            const cornerClass = corners === 'sharp' ? 'rounded-none' : corners === 'rounded' ? 'rounded-3xl' : 'rounded-2xl';
                            const cardStyleClass = productCardStyle === 'shadow'
                              ? 'shadow-lg border-0 bg-white dark:bg-[#111827]'
                              : productCardStyle === 'flat'
                              ? 'bg-slate-100/70 dark:bg-slate-800/60 border-0 shadow-none'
                              : 'border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs';
                            const imgAspectClass = productImageShape === 'square'
                              ? 'aspect-square'
                              : productImageShape === 'landscape'
                              ? 'aspect-[4/3]'
                              : 'aspect-[3/4]';

                            {/* 1. LIST LAYOUT */}
                            if (productLayout === 'list') {
                              return (
                                <div
                                  key={product.id}
                                  className={`${cornerClass} ${cardStyleClass} p-2.5 sm:p-3 flex items-center justify-between gap-3 group hover:border-slate-300 transition-all`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 ${cornerClass} overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0`}>
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                      <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                                        {product.category}
                                      </span>
                                      <h3 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                        {product.name}
                                      </h3>
                                      <div className="text-xs font-black text-slate-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="px-3 py-1.5 rounded-xl text-white font-bold text-[11px] shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                                    style={{ backgroundColor: activeColorHex }}
                                  >
                                    {inCartCount > 0 ? `+${inCartCount}` : addToCartBtnText}
                                  </button>
                                </div>
                              );
                            }

                            {/* 2. GALLERY LAYOUT */}
                            if (productLayout === 'gallery') {
                              return (
                                <div
                                  key={product.id}
                                  className={`${cornerClass} ${cardStyleClass} overflow-hidden flex flex-col justify-between group relative shadow-md`}
                                >
                                  <div className={`relative ${imgAspectClass} overflow-hidden bg-slate-100 dark:bg-slate-800`}>
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2.5 text-white">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                                        {product.category}
                                      </span>
                                      <h3 className="font-extrabold text-xs text-white truncate drop-shadow-xs">
                                        {product.name}
                                      </h3>
                                      <div className="flex items-center justify-between pt-1">
                                        <span className="text-xs font-black text-white">${product.price.toFixed(2)}</span>
                                        <button
                                          onClick={() => handleAddToCart(product.id)}
                                          className="px-2 py-0.5 rounded-lg text-white font-bold text-[10px] shadow-xs cursor-pointer active:scale-95 transition"
                                          style={{ backgroundColor: activeColorHex }}
                                        >
                                          {inCartCount > 0 ? `(${inCartCount})` : addToCartBtnText}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            {/* 3. COMPACT LAYOUT */}
                            if (productLayout === 'compact') {
                              return (
                                <div
                                  key={product.id}
                                  className={`${cornerClass} ${cardStyleClass} p-2 flex flex-col justify-between group hover:shadow-xs transition`}
                                >
                                  <div>
                                    <div className={`w-full aspect-square ${cornerClass} overflow-hidden bg-slate-100 dark:bg-slate-800 mb-1.5`}>
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                    </div>
                                    <span className="text-[8px] font-bold text-sky-600 uppercase block truncate">
                                      {product.category}
                                    </span>
                                    <h3 className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                                      {product.name}
                                    </h3>
                                  </div>
                                  <div className="pt-1.5 flex items-center justify-between">
                                    <span className="text-[11px] font-black text-slate-900 dark:text-white">
                                      ${product.price.toFixed(2)}
                                    </span>
                                    <button
                                      onClick={() => handleAddToCart(product.id)}
                                      className="px-2 py-0.5 rounded-lg text-white font-bold text-[10px] cursor-pointer active:scale-95"
                                      style={{ backgroundColor: activeColorHex }}
                                    >
                                      {inCartCount > 0 ? inCartCount : '+'}
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            {/* 4. GRID LAYOUT (DEFAULT RICH CARD) */}
                            return (
                              <div
                                key={product.id}
                                className={`${cornerClass} ${cardStyleClass} overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow`}
                              >
                                <div>
                                  {/* Product Image */}
                                  <div className={`w-full ${imgAspectClass} bg-slate-100 dark:bg-slate-800 relative overflow-hidden`}>
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                    {product.variants && (
                                      <div className="absolute top-2 right-2 flex gap-1">
                                        {product.variants.map((v) => (
                                          <span
                                            key={v.name}
                                            className="px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-[9px] font-bold text-sky-600 border border-sky-200 dark:border-sky-800"
                                          >
                                            {v.name} - ${v.price.toFixed(2)}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Details */}
                                  <div className="p-2.5 sm:p-3.5 space-y-1">
                                    <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                                      {product.category}
                                    </span>

                                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                                      {product.name}
                                    </h3>

                                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Price & Add to Bag Button in Active Theme Color */}
                                <div className="p-2.5 sm:p-3.5 pt-0 space-y-2">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                      ${product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                      <span className="text-[9px] text-slate-400 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="w-full py-1.5 sm:py-2 rounded-xl text-white font-bold text-[11px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                                    style={{ backgroundColor: activeColorHex }}
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>{addToCartBtnText} {inCartCount > 0 ? `(${inCartCount})` : ''}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Storefront FAQ Section in Preview */}
                        {showFaq && faqs.length > 0 && (
                          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                              Frequently Asked Questions
                            </h3>
                            <div className="space-y-2">
                              {faqs.map((f) => (
                                <div
                                  key={f.id}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs"
                                >
                                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>{f.question}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {f.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Store Footer in Preview */}
                        <div className="pt-8 border-t border-slate-200/90 dark:border-slate-800 text-xs text-slate-500 space-y-5">
                          {/* Trust highlights in preview */}
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                              <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Fast Local Delivery</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300">100% Genuine</span>
                            </div>
                          </div>

                          {/* Brand Info & Story */}
                          <div className="space-y-1.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {logoImageUrl ? <img src={logoImageUrl} alt="Logo" className="w-full h-full object-cover" /> : logoInitials}
                              </div>
                              <span className="font-serif font-black text-slate-800 dark:text-slate-100 text-sm">
                                {shop.name || 'Maison Nord'}
                              </span>
                            </div>
                            {aboutStory && (
                              <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                                {aboutStory}
                              </p>
                            )}
                          </div>

                          {/* Store Details Grid */}
                          <div className="grid grid-cols-2 gap-2.5 text-[10px] text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Operating Hours</span>
                              <span>{storeHours}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Delivery Coverage</span>
                              <span>{deliveryArea}</span>
                            </div>
                            {storeAddress && (
                              <div className="col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                                <span>📍 {storeAddress} • 📞 {storePhone}</span>
                              </div>
                            )}
                          </div>

                          {/* Payment Icons */}
                          <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold">
                            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-600">Fonepay</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600">eSewa</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Cash on Delivery</span>
                          </div>

                          {/* Bottom Branding & Copyright */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 text-center space-y-1">
                            <p>© {new Date().getFullYear()} {shop.name || 'Maison Nord'}. All rights reserved.</p>
                            {!removeCreateStoreFooter && (
                              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Powered by <strong>MeroPasal WAStore</strong>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOAST CONFIRMATION WHEN SAVED ─────────────────────── */}
      {isSaveToastVisible && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-slate-900 dark:bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white" />
            <span>Storefront design saved successfully! Published to your live domain.</span>
          </div>
        </div>
      )}

      {/* ── BOTTOM STICKY SAVE BAR (MATCHING SCREENSHOT) ───────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0F766E] hover:bg-[#0D9488] transition-colors text-white py-3.5 px-6 shadow-2xl flex items-center justify-center cursor-pointer border-t border-white/10">
        <button
          onClick={handleSaveChanges}
          className="w-full max-w-lg flex items-center justify-center gap-2 font-black text-sm tracking-wide cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
