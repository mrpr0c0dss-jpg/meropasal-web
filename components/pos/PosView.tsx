'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { ProductModel, PaymentMethod, SaleModel } from '@/lib/types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  QrCode,
  CreditCard,
  Banknote,
  Smartphone,
  BookOpen,
  UserPlus,
  ShoppingBag,
  Sparkles,
  Receipt,
  ScanBarcode,
  PackagePlus,
  X,
  ArrowRight,
  Camera,
  Coffee,
  Apple,
  Milk,
  Cookie,
  Shirt,
  Sparkle,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReceiptModal } from './ReceiptModal';
import { ContinuousBarcodeScanner } from '../shared/ContinuousBarcodeScanner';

export const PosView: React.FC = () => {
  const {
    products,
    customers,
    addCustomer,
    addProduct,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQty,
    clearCart,
    completeSale,
    shop,
    printerSettings,
    paymentQR,
    formatCurrency,
    t,
  } = useApp();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Checkout State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [vatRate, setVatRate] = useState<number>(0.0); // 0%, 5%, 13%
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [customPaidAmount, setCustomPaidAmount] = useState<string>('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isQuickAddProductOpen, setIsQuickAddProductOpen] = useState(false);
  const [isBarcodeCameraOpen, setIsBarcodeCameraOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Completed sale for receipt modal
  const [completedSale, setCompletedSale] = useState<SaleModel | null>(null);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Quick Product Form State
  const [quickProdName, setQuickProdName] = useState('');
  const [quickProdPrice, setQuickProdPrice] = useState('');
  const [quickProdCost, setQuickProdCost] = useState('');
  const [quickProdQty, setQuickProdQty] = useState('10');
  const [quickProdCategory, setQuickProdCategory] = useState('Groceries');
  const [quickProdUnit, setQuickProdUnit] = useState('pieces');

  // Extract Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.batchNumber && p.batchNumber.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.total, 0);
  }, [cart]);

  const vatAmount = subtotal * vatRate;
  const grandTotal = Math.max(0, subtotal + vatAmount - discountAmount);

  // Paid & Due Calculations
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const calculatedPaidAmount = useMemo(() => {
    if (paymentMethod === 'Credit') return 0;
    if (paymentMethod === 'Split') {
      const parsed = parseFloat(customPaidAmount);
      return isNaN(parsed) ? 0 : Math.min(grandTotal, Math.max(0, parsed));
    }
    return grandTotal;
  }, [paymentMethod, customPaidAmount, grandTotal]);

  const calculatedDueAmount = useMemo(() => {
    if (paymentMethod === 'Credit') return grandTotal;
    if (paymentMethod === 'Split') return Math.max(0, grandTotal - calculatedPaidAmount);
    return 0;
  }, [paymentMethod, grandTotal, calculatedPaidAmount]);

  // Handle Checkout submission
  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (calculatedDueAmount > 0 && !selectedCustomerId) {
      alert('Please select or add a customer for credit (Udharo) sales!');
      return;
    }

    const sale = completeSale({
      paymentMethod,
      paidAmount: calculatedPaidAmount,
      dueAmount: calculatedDueAmount,
      vatRate,
      discount: discountAmount,
      customerId: selectedCustomerId || undefined,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer?.phone,
      customerAddress: selectedCustomer?.address,
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    setCompletedSale(sale);
    setIsMobileCartOpen(false);
    setDiscountAmount(0);
    setCustomPaidAmount('');
    setSelectedCustomerId('');
  };

  // Handle Barcode Scanned via Camera
  const handleBarcodeScanned = (scannedCode: string) => {
    const matched = products.find((p) => p.barcode === scannedCode);
    if (matched) {
      addToCart(matched, 1);
    } else {
      setSearchQuery(scannedCode);
    }
  };

  // Quick Add Customer Handler
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const created = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim() || undefined,
    });

    setSelectedCustomerId(created.id);
    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  // Quick Add Product Handler
  const handleSaveQuickProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickProdName.trim() || !quickProdPrice) return;

    const price = parseFloat(quickProdPrice) || 0;
    const cost = parseFloat(quickProdCost) || price * 0.8;
    const qty = parseInt(quickProdQty, 10) || 10;

    const created = addProduct({
      name: quickProdName.trim(),
      sellingPrice: price,
      purchasePrice: cost,
      quantity: qty,
      minStockLevel: 5,
      category: quickProdCategory,
      unit: quickProdUnit,
      barcode: `890${Date.now().toString().slice(-9)}`,
    });

    addToCart(created, 1);
    setIsQuickAddProductOpen(false);
    setQuickProdName('');
    setQuickProdPrice('');
    setQuickProdCost('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 p-3 lg:p-6 overflow-hidden">
      {/* ── LEFT COLUMN: PRODUCT SEARCH & GRID ───────────────── */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, barcode, batch... (e.g. Basmati, Wai Wai)"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Camera Barcode Scanner Trigger */}
            <button
              onClick={() => setIsBarcodeCameraOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 rounded-2xl text-xs font-semibold transition border border-slate-200/60 dark:border-slate-700/50"
              title="Open Barcode Scanner Camera"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Scan Barcode</span>
            </button>

            {/* Quick Add Custom Product Button */}
            <button
              onClick={() => setIsQuickAddProductOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-semibold transition border border-blue-200/60 dark:border-blue-800/60"
              title="Add temporary product"
            >
              <PackagePlus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.quickAddProduct}</span>
            </button>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-semibold transition text-xs ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80'
                }`}
              >
                {cat === 'All' ? t.allCategories : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-2 opacity-40" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No matching products found</p>
              <p className="text-xs mt-1">Try another search or click Quick Add Product above</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const inCartItem = cart.find((item) => item.productId === p.id);
              const isLow = p.quantity <= p.minStockLevel && p.quantity > 0;
              const isOut = p.quantity <= 0;

              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p, 1)}
                  disabled={isOut}
                  className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between bg-white dark:bg-slate-800/40 ${
                    inCartItem
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200/70 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md'
                  } ${isOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Category Tag & Cart Count */}
                  <div className="flex items-start justify-between gap-1 w-full">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                      {p.category}
                    </span>
                    {inCartItem && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black shadow-xs">
                        {inCartItem.quantity} in Cart
                      </span>
                    )}
                  </div>

                  {/* Title & Barcode */}
                  <div className="my-2.5">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {p.unit} {p.barcode ? `• ${p.barcode}` : ''}
                    </p>
                  </div>

                  {/* Price & Stock Badge */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-700/50 w-full">
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {formatCurrency(p.sellingPrice)}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isOut
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-600'
                          : isLow
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {isOut ? 'Out' : `Qty: ${p.quantity}`}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN: CART & CHECKOUT TERMINAL (DESKTOP) ─── */}
      <div className="hidden lg:flex w-[400px] xl:w-[440px] flex-col bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Current Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h3>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Customer Selector */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t.selectCustomer}
            </label>
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {t.addNewCustomer}
            </button>
          </div>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 outline-hidden"
          >
            <option value="">{t.walkInCustomer}</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) {c.totalDue > 0 ? `• Due: Rs. ${c.totalDue}` : ''}
              </option>
            ))}
          </select>
          {selectedCustomer && selectedCustomer.totalDue > 0 && (
            <div className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl">
              <span>Customer Khata Due:</span>
              <span>{formatCurrency(selectedCustomer.totalDue)}</span>
            </div>
          )}
        </div>

        {/* Cart Items Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-12 h-12 opacity-25 mb-2" />
              <p className="text-xs font-semibold">{t.emptyCart}</p>
              <p className="text-[11px] text-slate-400 mt-1">Tap any item from catalog to build invoice</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.productName}
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    {formatCurrency(item.price)} / {item.unit || 'pcs'}
                  </p>
                </div>

                {/* Qty Stepper */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5">
                  <button
                    onClick={() => updateCartItemQty(item.productId, item.quantity - 1)}
                    className="p-1 text-slate-500 hover:text-red-500 transition"
                  >
                    {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                  </button>
                  <span className="w-6 text-center text-xs font-black text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItemQty(item.productId, item.quantity + 1)}
                    className="p-1 text-slate-500 hover:text-blue-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[70px]">
                  <span className="font-black text-xs text-slate-900 dark:text-white">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Checkout Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 space-y-3">
          {/* Subtotal, Discount & VAT settings */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between font-medium">
              <span>{t.subtotal}</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>{t.discount}</span>
              <input
                type="number"
                min="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0"
                className="w-20 text-right px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>{t.vatTax}</span>
              <div className="flex items-center gap-1">
                {[0.0, 0.05, 0.13].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setVatRate(rate)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                      vatRate === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rate === 0 ? '0%' : `${rate * 100}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between font-black text-base text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>{t.grandTotal}</span>
              <span className="text-blue-600 dark:text-blue-400">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 uppercase">{t.paymentMethod}</label>
              {(paymentQR.esewaId || paymentQR.khaltiId || paymentQR.fonepayMerchantCode) && (
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Show Counter QR
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['Cash', 'Fonepay', 'eSewa', 'Khalti', 'Credit', 'Split'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2 rounded-xl font-bold border text-center transition flex flex-col items-center gap-0.5 ${
                    paymentMethod === method
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  {method === 'Cash' && <Banknote className="w-3.5 h-3.5" />}
                  {method === 'Fonepay' && <QrCode className="w-3.5 h-3.5" />}
                  {method === 'eSewa' && <Smartphone className="w-3.5 h-3.5" />}
                  {method === 'Khalti' && <CreditCard className="w-3.5 h-3.5" />}
                  {method === 'Credit' && <BookOpen className="w-3.5 h-3.5" />}
                  {method === 'Split' && <Sparkles className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{method}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Split Payment Input */}
          {paymentMethod === 'Split' && (
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span>Cash/Online Received:</span>
                <input
                  type="number"
                  value={customPaidAmount}
                  onChange={(e) => setCustomPaidAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-24 text-right px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-bold"
                />
              </div>
              <div className="flex justify-between text-red-600 font-bold">
                <span>Remaining Udharo Due:</span>
                <span>{formatCurrency(calculatedDueAmount)}</span>
              </div>
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 ${
              cart.length === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-[0.99]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{t.completeSale} ({formatCurrency(grandTotal)})</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE FLOATING CART BAR ─────────────────────────── */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-16 left-3 right-3 z-30">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-blue-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between font-black text-sm animate-in slide-in-from-bottom-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center text-xs">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
              <span>Checkout Order</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{formatCurrency(grandTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* ── CAMERA SCANNER MODAL ─────────────────────────────── */}
      <ContinuousBarcodeScanner
        isOpen={isBarcodeCameraOpen}
        onClose={() => setIsBarcodeCameraOpen(false)}
      />

      {/* ── COUNTER QR MODAL ─────────────────────────────────── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Payment QR Code (Counter Desk)
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
              <QrCode className="w-40 h-40 text-slate-900 dark:text-white" />
              <p className="font-black text-sm mt-3 text-slate-900 dark:text-white">{shop.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Fonepay / eSewa / Khalti / Mobile Banking</p>
              <div className="mt-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border">
                Merchant: {paymentQR.esewaId || paymentQR.fonepayMerchantCode || '9841234567'}
              </div>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

      {/* ── ADD NEW CUSTOMER MODAL ────────────────────────────── */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.addNewCustomer}
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.customerName} *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Bikash Sharma"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.customerPhone} *
                </label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. 9841234567"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.customerAddress}
                </label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="e.g. Ward 10, Kathmandu"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUICK ADD PRODUCT MODAL ──────────────────────────── */}
      {isQuickAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.quickAddProduct}
              </h3>
              <button
                onClick={() => setIsQuickAddProductOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={quickProdName}
                  onChange={(e) => setQuickProdName(e.target.value)}
                  placeholder="e.g. Lays Classic Salted"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quickProdPrice}
                    onChange={(e) => setQuickProdPrice(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cost Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={quickProdCost}
                    onChange={(e) => setQuickProdCost(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    value={quickProdQty}
                    onChange={(e) => setQuickProdQty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <select
                    value={quickProdUnit}
                    onChange={(e) => setQuickProdUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="packet">Packet</option>
                    <option value="kg">Kg</option>
                    <option value="liter">Liter</option>
                    <option value="box">Box</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddProductOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Add & Put in Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECEIPT / BILL MODAL ─────────────────────────────── */}
      <ReceiptModal
        sale={completedSale}
        shop={shop}
        printerSettings={printerSettings}
        onClose={() => setCompletedSale(null)}
      />
    </div>
  );
};
