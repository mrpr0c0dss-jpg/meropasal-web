'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { db, rtdb, auth } from '@/lib/firebase';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { ref, set as setRtdb } from 'firebase/database';
import {
  Store,
  Key,
  MapPin,
  Phone,
  Mail,
  Receipt,
  LogOut,
  ChevronDown,
  Loader2,
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clipboard,
  Sparkles,
  Printer,
  CreditCard,
  Building2,
  Check,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface ShopSetupViewProps {
  onNavigateAuth: (view: 'login' | 'register' | 'forgot' | 'shop-setup' | 'privacy' | 'app') => void;
}

export const SHOP_CATEGORIES = [
  { id: 'grocery', name: 'Grocery & Kirana', icon: '🛒' },
  { id: 'medical', name: 'Medical & Pharmacy', icon: '💊' },
  { id: 'clothing', name: 'Clothing & Fashion', icon: '👗' },
  { id: 'footwear', name: 'Footwear & Shoes', icon: '👟' },
  { id: 'electronics', name: 'Electronics & Appliances', icon: '📱' },
  { id: 'mobileAccessories', name: 'Mobile & Computer Repair', icon: '🎧' },
  { id: 'hardware', name: 'Hardware & Construction', icon: '🔧' },
  { id: 'bathware', name: 'Bathware & Sanitary', icon: '🚿' },
  { id: 'restaurant', name: 'Restaurant & Cafe', icon: '🍽️' },
  { id: 'bakery', name: 'Bakery & Sweets', icon: '🧁' },
  { id: 'cosmetics', name: 'Cosmetics & Beauty', icon: '💄' },
  { id: 'jewelry', name: 'Jewelry & Ornaments', icon: '💍' },
  { id: 'furniture', name: 'Furniture & Home Decor', icon: '🛋️' },
  { id: 'autoParts', name: 'Auto Parts & Workshop', icon: '🏍️' },
  { id: 'books', name: 'Books & Stationery', icon: '📚' },
  { id: 'Agro', name: 'Agro & Veterinary', icon: '🌱' },
  { id: 'liquor', name: 'Wine & Beverages', icon: '🍾' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
  { id: 'toyGift', name: 'Toys, Gifts & Fancy', icon: '🎁' },
  { id: 'general', name: 'General / Other Store', icon: '🏪' },
];

export const ShopSetupView: React.FC<ShopSetupViewProps> = ({ onNavigateAuth }) => {
  const { user, shop, updateShop, setHasShop, paymentQR, updatePaymentQR, printerSettings, updatePrinterSettings, logout } = useApp();

  // Basic Details
  const [shopName, setShopName] = useState(shop.name && shop.name !== 'My Store' ? shop.name : '');
  const [selectedCategory, setSelectedCategory] = useState<typeof SHOP_CATEGORIES[0] | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  // Owner & Contact
  const [ownerName, setOwnerName] = useState(user?.displayName || (shop.ownerName && shop.ownerName !== 'Store Owner' ? shop.ownerName : ''));
  const [phone, setPhone] = useState(user?.phoneNumber || shop.phone || '');
  const [email, setEmail] = useState(user?.email || auth.currentUser?.email || shop.email || '');

  // Location & Tax
  const [address, setAddress] = useState(shop.address || '');
  const [panNumber, setPanNumber] = useState(shop.panNumber || shop.panVat || '');

  // Hardware & Digital Attachments (Optional desktop accordion)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fonepayMerchantCode, setFonepayMerchantCode] = useState(paymentQR?.fonepayMerchantCode || 'MP-KTM-9841');
  const [esewaId, setEsewaId] = useState(paymentQR?.esewaId || shop.phone || '');
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>(printerSettings?.paperSize || '58mm');
  const [footerMessage, setFooterMessage] = useState(printerSettings?.footerMessage || 'धन्यवाद ! फेरी आउनुहोला');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Staff Join Modal State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [staffName, setStaffName] = useState(user?.displayName || '');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Pre-fill email and name from auth if available
  useEffect(() => {
    if (auth.currentUser?.email && !email) {
      setEmail(auth.currentUser.email);
    }
    if (auth.currentUser?.displayName && !ownerName) {
      setOwnerName(auth.currentUser.displayName);
    }
  }, [email, ownerName]);

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setErrorMsg('Please enter your Shop Name');
      return;
    }
    if (!selectedCategory) {
      setErrorMsg('Please select a Shop Category');
      return;
    }
    if (!ownerName.trim()) {
      setErrorMsg('Please enter Owner Full Name');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter Mobile / Phone Number');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const currentUid = user?.uid || (auth.currentUser ? auth.currentUser.uid : `owner_${Date.now()}`);
      const currentEmail = email.trim() || user?.email || (auth.currentUser ? auth.currentUser.email : '') || '';

      // Generate Flutter-standard 6-character alphanumeric invite code (e.g. MP8X2K)
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randomChars = '';
      for (let i = 0; i < 4; i++) {
        randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const inviteCode = `MP${randomChars}`;
      const shopId = shop.id && shop.id !== 'shop_001' ? shop.id : `shop_${Date.now()}`;

      const cleanShopData = {
        id: shopId,
        shopName: shopName.trim(),
        name: shopName.trim(),
        ownerName: ownerName.trim(),
        ownerId: currentUid,
        email: currentEmail,
        phone: phone.trim(),
        address: address.trim() || 'Kathmandu, Nepal',
        panNumber: panNumber.trim() || null,
        panVat: panNumber.trim() || '',
        category: selectedCategory.id,
        memberIds: [currentUid],
        inviteCode: inviteCode,
        shopCode: inviteCode,
        createdAt: new Date().toISOString(),
      };

      // 1. Write shop doc to Firestore shops/{shopId} (matches Flutter ShopRepository.createShop)
      await setDoc(doc(db, 'shops', shopId), cleanShopData, { merge: true });

      // 2. Add owner to subcollection shops/{shopId}/members/{ownerId}
      await setDoc(
        doc(db, 'shops', shopId, 'members', currentUid),
        {
          uid: currentUid,
          name: ownerName.trim(),
          email: currentEmail,
          phone: phone.trim(),
          role: 'owner',
          joinedAt: new Date().toISOString(),
          isActive: true,
          isApproved: true,
        },
        { merge: true }
      );

      // 3. Update user doc users/{ownerId}
      if (currentUid) {
        await setDoc(
          doc(db, 'users', currentUid),
          {
            id: currentUid,
            currentShopId: shopId,
            role: 'owner',
            name: ownerName.trim(),
            phone: phone.trim(),
            email: currentEmail,
          },
          { merge: true }
        );
      }

      // 4. Update RTDB
      await setRtdb(ref(rtdb, `shops/${shopId}`), cleanShopData).catch(() => {});
      await setRtdb(ref(rtdb, 'shops/main_shop'), cleanShopData).catch(() => {});

      // 5. Update local store state
      setHasShop(true);
      updateShop(cleanShopData);

      updatePaymentQR({
        ...paymentQR,
        fonepayMerchantCode: fonepayMerchantCode.trim(),
        esewaId: esewaId.trim() || phone.trim(),
      });

      updatePrinterSettings({
        ...printerSettings,
        paperSize,
        footerMessage,
      });

      onNavigateAuth('app');
    } catch (err: any) {
      console.warn('Create shop notice:', err);
      onNavigateAuth('app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinShop = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsJoining(true);
    setJoinError(null);

    try {
      const q = query(collection(db, 'shops'), where('inviteCode', '==', cleanCode));
      const snap = await getDocs(q);

      if (snap.empty) {
        setJoinError(`Code "${cleanCode}" does not match any registered shop.`);
        setIsJoining(false);
        return;
      }

      const shopDoc = snap.docs[0];
      const shopData = shopDoc.data();
      const currentUid = user?.uid || (auth.currentUser ? auth.currentUser.uid : `staff_${Date.now()}`);

      // Add user to shops/{shopId}/members/{uid}
      await setDoc(
        doc(db, 'shops', shopDoc.id, 'members', currentUid),
        {
          uid: currentUid,
          name: staffName.trim() || 'Staff Member',
          email: email.trim() || user?.email || '',
          role: 'cashier',
          joinedAt: new Date().toISOString(),
          isActive: true,
          isApproved: false,
        },
        { merge: true }
      );

      // Update user doc with currentShopId
      await setDoc(
        doc(db, 'users', currentUid),
        {
          currentShopId: shopDoc.id,
          role: 'cashier',
        },
        { merge: true }
      );

      setHasShop(true);
      updateShop({ ...shopData, id: shopDoc.id });
      setIsJoinModalOpen(false);
      onNavigateAuth('app');
    } catch (err: any) {
      setJoinError(err?.message || 'Failed to join shop. Please check code.');
    } finally {
      setIsJoining(false);
    }
  };

  const filteredCategories = SHOP_CATEGORIES.filter((cat) => {
    if (!categorySearch.trim()) return true;
    return cat.name.toLowerCase().includes(categorySearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#0D1117] text-slate-800 dark:text-slate-100 flex flex-col justify-start items-center py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Responsive Container: Max width 6xl on Desktop, 5xl on Tablet, Full/lg on Mobile */}
      <div className="w-full max-w-lg lg:max-w-6xl space-y-6">
        
        {/* Top Header Navigation Bar */}
        <header className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  MeroPasal
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
                  Cloud POS
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Setup Your Shop
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Join with Code</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await logout();
                onNavigateAuth('login');
              }}
              title="Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Staff Shortcut Banner on Mobile */}
        <div className="block lg:hidden bg-indigo-50/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl px-4 py-3 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Key className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                Invited as a staff member?
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Enter Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs px-4 py-3 rounded-2xl font-medium animate-in fade-in flex items-center gap-2">
            <X className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── RESPONSIVE GRID LAYOUT (2 COLUMNS ON DESKTOP, 1 COLUMN ON MOBILE) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT DESKTOP SIDEBAR / HERO OVERVIEW (lg:col-span-4 or 5) ── */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">
            {/* Hero Blue Gradient Card */}
            <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  🏪
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white leading-tight">
                    Setup Your New Shop
                  </h2>
                  <p className="text-xs text-blue-100/90 font-medium mt-0.5">
                    Enter your business details to get started.
                  </p>
                </div>
              </div>

              <p className="text-xs text-blue-50/80 leading-relaxed pb-4 border-b border-white/15">
                Register your business once to unlock real-time Cloud Inventory, thermal POS billing, and digital Udharo ledger on Web, Android and iOS.
              </p>

              {/* Feature Highlights on Desktop */}
              <div className="pt-4 space-y-2.5 text-xs text-blue-50 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px]">✓</div>
                  <span>Real-time Cloud Sync with Firebase &amp; RTDB</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px]">✓</div>
                  <span>Instant 58mm &amp; 80mm Thermal POS Bills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px]">✓</div>
                  <span>Digital Udharo / Khata Ledger with Reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px]">✓</div>
                  <span>Nepali &amp; English Multi-language Support</span>
                </div>
              </div>
            </div>

            {/* Desktop Staff Banner Card */}
            <div className="hidden lg:block bg-white dark:bg-[#161B26] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Joining an existing store?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Staff members don't need to register a new store.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>Enter 6-Digit Shop Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reassurance Info Card */}
            <div className="hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Your store data is secured with Google Cloud Firestore encrypted storage.</span>
            </div>
          </div>

          {/* ── RIGHT MAIN FORM CONTAINER (lg:col-span-7) ── */}
          <div className="lg:col-span-7 space-y-5">
            <form onSubmit={handleCreateShop} className="space-y-5">
              
              {/* SECTION 1: Basic Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-slate-800 dark:text-slate-200 font-bold text-sm">
                  <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Basic Details</span>
                </div>

                <div className="bg-white dark:bg-[#161B26] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Shop Name */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Shop Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Store className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="e.g. Shrestha General Store"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Shop Category */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Shop Category <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-medium flex items-center justify-between text-left hover:border-slate-300 dark:hover:border-slate-600 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">
                            {selectedCategory ? selectedCategory.icon : '🏷️'}
                          </span>
                          <span
                            className={
                              selectedCategory
                                ? 'text-slate-900 dark:text-white font-semibold truncate'
                                : 'text-slate-400 font-normal truncate'
                            }
                          >
                            {selectedCategory ? selectedCategory.name : 'Select Category *'}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Owner & Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-slate-800 dark:text-slate-200 font-bold text-sm">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Owner &amp; Contact</span>
                </div>

                <div className="bg-white dark:bg-[#161B26] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Owner Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Owner Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Mobile Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Mobile / Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 98XXXXXXXX"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. yourshop@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Location & Tax */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-slate-800 dark:text-slate-200 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Location &amp; Tax</span>
                </div>

                <div className="bg-white dark:bg-[#161B26] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Shop Location / Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. New Road, Kathmandu"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* PAN / VAT */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        PAN / VAT Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value)}
                          placeholder="9-digit PAN/VAT number"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700/80 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4 (OPTIONAL): QR & POS Printer Attachments Toggle */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-[#161B26]/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Payment QR &amp; Receipt Printer Attachments
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Optional
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                {showAdvanced && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-white dark:bg-[#161B26] animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Fonepay Merchant Code
                        </label>
                        <input
                          type="text"
                          value={fonepayMerchantCode}
                          onChange={(e) => setFonepayMerchantCode(e.target.value)}
                          placeholder="e.g. MP-KTM-9841"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          eSewa ID / Wallet
                        </label>
                        <input
                          type="text"
                          value={esewaId}
                          onChange={(e) => setEsewaId(e.target.value)}
                          placeholder="e.g. 9841234567"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Receipt Paper Size
                        </label>
                        <select
                          value={paperSize}
                          onChange={(e) => setPaperSize(e.target.value as '58mm' | '80mm')}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                        >
                          <option value="58mm">58mm (2-inch Mini Thermal Printer)</option>
                          <option value="80mm">80mm (3-inch Standard POS Printer)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Receipt Footer Note
                        </label>
                        <input
                          type="text"
                          value={footerMessage}
                          onChange={(e) => setFooterMessage(e.target.value)}
                          placeholder="धन्यवाद ! फेरी आउनुहोला"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Launch Shop Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Launching Store on Cloud...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Create &amp; Launch Shop</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Category Picker Responsive Modal ───────────────────────────────── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#161B26] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Select Shop Category
                </h3>
                <p className="text-xs text-slate-400">Choose the type of store you operate</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search category (e.g. Grocery, Pharmacy, Electronics)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            {/* List */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 max-h-[50vh]">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryModalOpen(false);
                      setCategorySearch('');
                    }}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-left transition ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Join Staff Member Responsive Modal ─────────────────────────────── */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#161B26] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Join as Staff Member
                  </h3>
                  <p className="text-xs text-slate-400">Enter 6-digit code from shop owner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {joinError && (
              <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs px-3.5 py-2.5 rounded-xl font-medium">
                {joinError}
              </div>
            )}

            <form onSubmit={handleJoinShop} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  6-Digit Invite Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MP8X2K"
                    className="w-full text-center tracking-widest uppercase font-mono font-black text-lg py-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) setJoinCode(text.trim().toUpperCase());
                      } catch {}
                    }}
                    title="Paste from clipboard"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-600 p-1"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Staff Member"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Shop...</span>
                  </>
                ) : (
                  <>
                    <span>🤝 Join with this Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsJoinModalOpen(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                🏪 Setup My Own Shop Instead
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
