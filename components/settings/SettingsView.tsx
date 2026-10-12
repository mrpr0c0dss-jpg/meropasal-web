'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { DeliveryZone } from '@/lib/types';
import {
  Store,
  Bell,
  Wallet,
  CreditCard,
  Search,
  BarChart2,
  Globe,
  Receipt,
  AlertTriangle,
  Printer,
  QrCode,
  Calculator,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Check,
  Plus,
  Trash2,
  MapPin,
  Info,
  ExternalLink,
  ShieldCheck,
  Copy,
  Sparkles,
  Smartphone,
  Building,
  CheckCircle2,
  Share2,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';

type SettingsTab =
  | 'general'
  | 'notifications'
  | 'pricing'
  | 'payment'
  | 'seo'
  | 'analytics'
  | 'domain'
  | 'billing'
  | 'advanced';

export const SettingsView: React.FC = () => {
  const {
    shop,
    updateShop,
    printerSettings,
    updatePrinterSettings,
    paymentQR,
    updatePaymentQR,
    language,
    setLanguage,
    theme,
    toggleTheme,
    isPrivacyMode,
    togglePrivacyMode,
    resetToDemoData,
    formatCurrency,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('pricing');
  const [shopForm, setShopForm] = useState({ ...shop });
  const [qrForm, setQrForm] = useState({ ...paymentQR });
  const [printerForm, setPrinterForm] = useState({ ...printerSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewQrImage, setPreviewQrImage] = useState<{ title: string; url: string } | null>(null);

  React.useEffect(() => {
    if (paymentQR) {
      setQrForm((prev) => ({ ...prev, ...paymentQR }));
    }
  }, [paymentQR]);

  const handleQrUpload = (
    key: 'esewaQrUrl' | 'fonepayQrUrl' | 'khaltiQrUrl' | 'otherQrUrl',
    file?: File
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('QR image file size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        setQrForm((prev) => ({ ...prev, [key]: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQr = (key: 'esewaQrUrl' | 'fonepayQrUrl' | 'khaltiQrUrl' | 'otherQrUrl') => {
    setQrForm((prev) => ({ ...prev, [key]: '' }));
  };

  // Business Calculator state
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [costPriceInput, setCostPriceInput] = useState('');
  const [sellingPriceInput, setSellingPriceInput] = useState('');
  const [calcBillTotal, setCalcBillTotal] = useState('');
  const [calcCashTendered, setCalcCashTendered] = useState('');

  const calcCost = parseFloat(costPriceInput) || 0;
  const calcSell = parseFloat(sellingPriceInput) || 0;
  const profitMargin = calcSell > 0 ? (((calcSell - calcCost) / calcSell) * 100).toFixed(1) : '0';
  const markupPercent = calcCost > 0 ? (((calcSell - calcCost) / calcCost) * 100).toFixed(1) : '0';

  const billAmt = parseFloat(calcBillTotal) || 0;
  const cashAmt = parseFloat(calcCashTendered) || 0;
  const changeToReturn = Math.max(0, cashAmt - billAmt);

  const handleSaveAllSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateShop(shopForm);
    updatePaymentQR(qrForm);
    updatePrinterSettings(printerForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportFullBackup = () => {
    const data = {
      shop: shopForm,
      printerSettings: printerForm,
      paymentQR: qrForm,
      timestamp: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = jsonStr;
    a.download = `MeroPasal_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Delivery Zones Handlers (matching WAStore screenshot)
  const handleAddZone = () => {
    const newZone: DeliveryZone = {
      id: `zone_${Date.now()}`,
      name: '',
      deliveryFee: 50,
      freeOver: undefined,
      minOrder: undefined,
      agreeWithCustomerLater: false,
    };
    setShopForm((prev) => ({
      ...prev,
      deliveryZones: [...(prev.deliveryZones || []), newZone],
    }));
  };

  const handleUpdateZone = (id: string, updates: Partial<DeliveryZone>) => {
    setShopForm((prev) => ({
      ...prev,
      deliveryZones: (prev.deliveryZones || []).map((z) =>
        z.id === id ? { ...z, ...updates } : z
      ),
    }));
  };

  const handleRemoveZone = (id: string) => {
    setShopForm((prev) => ({
      ...prev,
      deliveryZones: (prev.deliveryZones || []).filter((z) => z.id !== id),
    }));
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'pricing', label: 'Pricing', icon: Wallet },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'analytics', label: 'Analytics & pixels', icon: BarChart2 },
    { id: 'domain', label: 'Domain', icon: Globe },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'advanced', label: 'Advanced', icon: AlertTriangle },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto pb-28 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure delivery zones, payment gateways, WhatsApp notifications, and store preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCalcOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Calculator Tool</span>
          </button>
        </div>
      </div>

      {/* ── TOP TAB NAVIGATION BAR (MATCHING WASTORE SCREENSHOT) ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSaveAllSettings} className="space-y-6">
        {/* ── 1. GENERAL TAB ────────────────────────────────────────── */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Store Identity</h3>
                  <p className="text-xs text-slate-400">Basic shop credentials, branding, and contact details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shopForm.name}
                    onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={shopForm.ownerName}
                    onChange={(e) => setShopForm({ ...shopForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shopForm.phone}
                    onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={shopForm.email}
                    onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    PAN / VAT Number
                  </label>
                  <input
                    type="text"
                    value={shopForm.panVat || ''}
                    onChange={(e) => setShopForm({ ...shopForm, panVat: e.target.value })}
                    placeholder="e.g. 601239845"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Currency Symbol
                  </label>
                  <select
                    value={shopForm.currency}
                    onChange={(e) => setShopForm({ ...shopForm, currency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="NPR">NPR (Rs.) - Nepali Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Store Address / Location
                  </label>
                  <input
                    type="text"
                    value={shopForm.address}
                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                    placeholder="e.g. New Baneshwor, Kathmandu"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Store Hours / Delivery Schedule
                  </label>
                  <input
                    type="text"
                    value={shopForm.storeHours || ''}
                    onChange={(e) => setShopForm({ ...shopForm, storeHours: e.target.value })}
                    placeholder="e.g. 7:00 AM – 9:00 PM (Everyday)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. NOTIFICATIONS TAB ──────────────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Order Alerts & Notifications</h3>
                  <p className="text-xs text-slate-400">Configure how you receive new orders and update customers</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      WhatsApp Number for Receiving Orders
                    </label>
                    <input
                      type="text"
                      value={shopForm.orderWhatsAppNumber || shopForm.phone}
                      onChange={(e) => setShopForm({ ...shopForm, orderWhatsAppNumber: e.target.value })}
                      placeholder="e.g. 9841234567"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Customers will send their WhatsApp order chats to this number.</p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Order Notification Email
                    </label>
                    <input
                      type="email"
                      value={shopForm.orderNotificationEmail || shopForm.email}
                      onChange={(e) => setShopForm({ ...shopForm, orderNotificationEmail: e.target.value })}
                      placeholder="orders@yourstore.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Customer WhatsApp Order Template Message
                  </label>
                  <textarea
                    rows={3}
                    value={shopForm.orderReceiptTemplate || ''}
                    onChange={(e) => setShopForm({ ...shopForm, orderReceiptTemplate: e.target.value })}
                    placeholder="Hello {{shopName}}! I would like to place an order: {{items}} Total: {{total}}"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Tags available: {'{{shopName}}, {{items}}, {{total}}, {{address}}, {{deliveryZone}}'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopForm.soundAlertOnOrder ?? true}
                      onChange={(e) => setShopForm({ ...shopForm, soundAlertOnOrder: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Audio Sound Alert</span>
                      <span className="text-[10px] text-slate-400">Play chime on incoming sale/order</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopForm.lowStockAlerts ?? true}
                      onChange={(e) => setShopForm({ ...shopForm, lowStockAlerts: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Low Stock Alert</span>
                      <span className="text-[10px] text-slate-400">Notify when stock hits min level</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopForm.dailySummaryAlert ?? true}
                      onChange={(e) => setShopForm({ ...shopForm, dailySummaryAlert: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Daily Sales Summary</span>
                      <span className="text-[10px] text-slate-400">End of day closing breakdown</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. PRICING & DELIVERY ZONES TAB (EXACT MATCH TO WASTORE SCREENSHOT) ── */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Flat Delivery & Shipping Over */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Shipping & Minimum Orders</h3>
                    <p className="text-xs text-slate-400">Standard checkout rules when no specific delivery zone is chosen</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Flat Delivery Fee
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      {shopForm.currency === 'USD' ? '$' : 'Rs.'}
                    </span>
                    <input
                      type="number"
                      value={shopForm.flatDeliveryFee ?? 50}
                      onChange={(e) => setShopForm({ ...shopForm, flatDeliveryFee: parseFloat(e.target.value) || 0 })}
                      placeholder="50"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Free Shipping Over (optional)
                    </label>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      {shopForm.currency === 'USD' ? '$' : 'Rs.'}
                    </span>
                    <input
                      type="number"
                      value={shopForm.freeShippingOver ?? ''}
                      onChange={(e) => setShopForm({ ...shopForm, freeShippingOver: parseFloat(e.target.value) || undefined })}
                      placeholder="1000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Minimum order (optional)
                    </label>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      {shopForm.currency === 'USD' ? '$' : 'Rs.'}
                    </span>
                    <input
                      type="number"
                      value={shopForm.minimumOrderAmount ?? ''}
                      onChange={(e) => setShopForm({ ...shopForm, minimumOrderAmount: parseFloat(e.target.value) || undefined })}
                      placeholder="200"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── DELIVERY ZONES SECTION (DIRECT MATCH TO SCREENSHOT) ── */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delivery zones</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Charge a different delivery fee per area or city. When you add zones, they replace the flat fee above and customers pick their area at checkout.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddZone}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Zone</span>
                </button>
              </div>

              {/* List of Zone Cards */}
              <div className="space-y-4">
                {(shopForm.deliveryZones || []).length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
                    <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500">No custom delivery zones created yet.</p>
                    <button
                      type="button"
                      onClick={handleAddZone}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create your first delivery zone</span>
                    </button>
                  </div>
                ) : (
                  (shopForm.deliveryZones || []).map((zone, idx) => (
                    <div
                      key={zone.id || idx}
                      className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3.5 relative"
                    >
                      {/* Top: Area Name & Delete Icon */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                            Area name
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveZone(zone.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                            title="Delete this zone"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => handleUpdateZone(zone.id, { name: e.target.value })}
                          placeholder="e.g. Kathmandu Inside Ringroad, Brooklyn, Manhattan..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Middle: 3 columns (Delivery fee, Free over, Minimum order) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Delivery fee
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                              {shopForm.currency === 'USD' ? '$' : 'Rs.'}
                            </span>
                            <input
                              type="number"
                              disabled={zone.agreeWithCustomerLater}
                              value={zone.deliveryFee ?? ''}
                              onChange={(e) => handleUpdateZone(zone.id, { deliveryFee: parseFloat(e.target.value) || 0 })}
                              placeholder="5"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Free over <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                              {shopForm.currency === 'USD' ? '$' : 'Rs.'}
                            </span>
                            <input
                              type="number"
                              value={zone.freeOver ?? ''}
                              onChange={(e) => handleUpdateZone(zone.id, { freeOver: parseFloat(e.target.value) || undefined })}
                              placeholder="80"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Minimum order <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                              {shopForm.currency === 'USD' ? '$' : 'Rs.'}
                            </span>
                            <input
                              type="number"
                              value={zone.minOrder ?? ''}
                              onChange={(e) => handleUpdateZone(zone.id, { minOrder: parseFloat(e.target.value) || undefined })}
                              placeholder="--"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Checkbox: Agree delivery cost with customer later */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={zone.agreeWithCustomerLater ?? false}
                            onChange={(e) => handleUpdateZone(zone.id, { agreeWithCustomerLater: e.target.checked })}
                            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                              Agree the delivery cost with the customer later
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              No fee is added at checkout — customers see &quot;to be confirmed&quot; and you settle shipping when you reply on WhatsApp.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. PAYMENT TAB ────────────────────────────────────────── */}
        {activeTab === 'payment' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Payment Methods Activation */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Customer Payment Methods</h3>
                  <p className="text-xs text-slate-400">Enable or disable checkout payment options</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-slate-400">Customers pay in cash upon receiving goods</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shopForm.codEnabled ?? true}
                    onChange={(e) => setShopForm({ ...shopForm, codEnabled: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Online QR / Wallets</span>
                    <span className="text-[11px] text-slate-400">eSewa, Khalti &amp; Fonepay dynamic QR codes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shopForm.onlinePaymentEnabled ?? true}
                    onChange={(e) => setShopForm({ ...shopForm, onlinePaymentEnabled: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Direct Bank Transfer</span>
                    <span className="text-[11px] text-slate-400">Display your bank account number &amp; branch</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shopForm.bankTransferEnabled ?? true}
                    onChange={(e) => setShopForm({ ...shopForm, bankTransferEnabled: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">WhatsApp Pay Confirmation</span>
                    <span className="text-[11px] text-slate-400">Settle transaction details directly via WhatsApp</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shopForm.whatsappPaymentEnabled ?? true}
                    onChange={(e) => setShopForm({ ...shopForm, whatsappPaymentEnabled: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>

              {shopForm.bankTransferEnabled && (
                <div className="pt-2 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Bank Account Details (Displayed at Checkout)
                  </label>
                  <textarea
                    rows={2}
                    value={shopForm.bankDetails || ''}
                    onChange={(e) => setShopForm({ ...shopForm, bankDetails: e.target.value })}
                    placeholder="Bank: NIC Asia Bank | A/C: 1029384756012 | Acc Holder: Mero Pasal Kirana | Branch: New Baneshwor"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* QR Payment Channels & Uploaders */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      Payment QR Codes &amp; Merchant Accounts
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload your official QR codes (eSewa, Fonepay, Khalti, Bank/Other) for POS counter scanning and online checkout
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Scan Ready
                </div>
              </div>

              {/* 4 Gateway Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* 1. eSewa */}
                <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs tracking-wide shadow-xs">
                        eSewa
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Mobile Wallet</span>
                    </div>
                    {qrForm.esewaQrUrl ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> QR Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                        No QR Uploaded
                      </span>
                    )}
                  </div>

                  {/* QR Image Box */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      eSewa QR Code Image
                    </label>
                    {qrForm.esewaQrUrl ? (
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div
                          onClick={() => setPreviewQrImage({ title: 'eSewa QR Code', url: qrForm.esewaQrUrl! })}
                          className="relative group cursor-pointer shrink-0"
                          title="Click to zoom preview"
                        >
                          <img
                            src={qrForm.esewaQrUrl}
                            alt="eSewa QR"
                            className="w-24 h-24 object-contain rounded-xl border border-slate-100 dark:border-slate-800 bg-white p-1"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            Zoom
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            QR image is ready for cashier desk &amp; checkout.
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition">
                              <Upload className="w-3 h-3" />
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleQrUpload('esewaQrUrl', e.target.files[0])}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveQr('esewaQrUrl')}
                              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-900 cursor-pointer transition group text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Click to upload eSewa QR
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleQrUpload('esewaQrUrl', e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  {/* Merchant ID / Number */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      eSewa ID / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={qrForm.esewaId || ''}
                      onChange={(e) => setQrForm({ ...qrForm, esewaId: e.target.value })}
                      placeholder="e.g. 9841234567"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* 2. Fonepay / PhonePay */}
                <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-rose-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs tracking-wide shadow-xs">
                        Fonepay
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">PhonePay / Interbank</span>
                    </div>
                    {qrForm.fonepayQrUrl ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> QR Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                        No QR Uploaded
                      </span>
                    )}
                  </div>

                  {/* QR Image Box */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Fonepay QR Code Image
                    </label>
                    {qrForm.fonepayQrUrl ? (
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div
                          onClick={() => setPreviewQrImage({ title: 'Fonepay QR Code', url: qrForm.fonepayQrUrl! })}
                          className="relative group cursor-pointer shrink-0"
                          title="Click to zoom preview"
                        >
                          <img
                            src={qrForm.fonepayQrUrl}
                            alt="Fonepay QR"
                            className="w-24 h-24 object-contain rounded-xl border border-slate-100 dark:border-slate-800 bg-white p-1"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            Zoom
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Scannable by all Nepali Mobile Banking apps.
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition">
                              <Upload className="w-3 h-3" />
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleQrUpload('fonepayQrUrl', e.target.files[0])}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveQr('fonepayQrUrl')}
                              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 bg-white dark:bg-slate-900 cursor-pointer transition group text-center">
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Click to upload Fonepay QR
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleQrUpload('fonepayQrUrl', e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  {/* Merchant Code */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Fonepay Merchant Code / Terminal ID
                    </label>
                    <input
                      type="text"
                      value={qrForm.fonepayMerchantCode || ''}
                      onChange={(e) => setQrForm({ ...qrForm, fonepayMerchantCode: e.target.value })}
                      placeholder="e.g. MP-KTM-9841"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* 3. Khalti */}
                <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-purple-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs tracking-wide shadow-xs">
                        Khalti
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Digital Wallet</span>
                    </div>
                    {qrForm.khaltiQrUrl ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> QR Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                        No QR Uploaded
                      </span>
                    )}
                  </div>

                  {/* QR Image Box */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Khalti QR Code Image
                    </label>
                    {qrForm.khaltiQrUrl ? (
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div
                          onClick={() => setPreviewQrImage({ title: 'Khalti QR Code', url: qrForm.khaltiQrUrl! })}
                          className="relative group cursor-pointer shrink-0"
                          title="Click to zoom preview"
                        >
                          <img
                            src={qrForm.khaltiQrUrl}
                            alt="Khalti QR"
                            className="w-24 h-24 object-contain rounded-xl border border-slate-100 dark:border-slate-800 bg-white p-1"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            Zoom
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Khalti wallet scan &amp; pay QR is active.
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition">
                              <Upload className="w-3 h-3" />
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleQrUpload('khaltiQrUrl', e.target.files[0])}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveQr('khaltiQrUrl')}
                              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 bg-white dark:bg-slate-900 cursor-pointer transition group text-center">
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Click to upload Khalti QR
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleQrUpload('khaltiQrUrl', e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  {/* Merchant ID / Number */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Khalti ID / Registered Mobile
                    </label>
                    <input
                      type="text"
                      value={qrForm.khaltiId || ''}
                      onChange={(e) => setQrForm({ ...qrForm, khaltiId: e.target.value })}
                      placeholder="e.g. 9841234567"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* 4. Other (Bank QR / Smart QR / Custom) */}
                <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs tracking-wide shadow-xs">
                        Other QR
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Bank / Smart QR</span>
                    </div>
                    {qrForm.otherQrUrl ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> QR Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                        No QR Uploaded
                      </span>
                    )}
                  </div>

                  {/* QR Image Box */}
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Bank / Other QR Code Image
                    </label>
                    {qrForm.otherQrUrl ? (
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div
                          onClick={() => setPreviewQrImage({ title: qrForm.otherQrLabel || 'Bank QR Code', url: qrForm.otherQrUrl! })}
                          className="relative group cursor-pointer shrink-0"
                          title="Click to zoom preview"
                        >
                          <img
                            src={qrForm.otherQrUrl}
                            alt="Other QR"
                            className="w-24 h-24 object-contain rounded-xl border border-slate-100 dark:border-slate-800 bg-white p-1"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            Zoom
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Custom bank or merchant QR code is ready.
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition">
                              <Upload className="w-3 h-3" />
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleQrUpload('otherQrUrl', e.target.files[0])}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveQr('otherQrUrl')}
                              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 cursor-pointer transition group text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Click to upload Bank / Other QR
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleQrUpload('otherQrUrl', e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  {/* Other QR Label and Account */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        QR Title / Bank Name
                      </label>
                      <input
                        type="text"
                        value={qrForm.otherQrLabel || ''}
                        onChange={(e) => setQrForm({ ...qrForm, otherQrLabel: e.target.value })}
                        placeholder="e.g. NIC Asia QR, Nabil Bank"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Account / Ref Number <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={qrForm.generalQrUrl || ''}
                        onChange={(e) => setQrForm({ ...qrForm, generalQrUrl: e.target.value })}
                        placeholder="e.g. A/C: 1029384756"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info notice */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Where will these QR codes be displayed?</p>
                  <p className="text-blue-700/90 dark:text-blue-400/90 leading-relaxed">
                    Uploaded QR code images are automatically displayed on the POS Counter Screen (&quot;Show Counter QR&quot;) and presented to buyers at your online WhatsApp store checkout for fast payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. SEO TAB ────────────────────────────────────────────── */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Search Engine Optimization (SEO)</h3>
                  <p className="text-xs text-slate-400">Optimize how your WhatsApp storefront appears on Google and social media</p>
                </div>
              </div>

              {/* Google Snippet Live Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Google Search Live Preview
                </span>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono truncate">
                  https://meropasal.com/store/{shopForm.shopCode.toLowerCase()}
                </p>
                <h4 className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer truncate">
                  {shopForm.seoTitle || shopForm.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {shopForm.seoDescription || `Shop fresh items from ${shopForm.name}. Order directly via WhatsApp with speedy home delivery.`}
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={shopForm.seoTitle || ''}
                    onChange={(e) => setShopForm({ ...shopForm, seoTitle: e.target.value })}
                    placeholder="e.g. Mero Pasal - Fresh Groceries & Essentials Online Kathmandu"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={shopForm.seoDescription || ''}
                    onChange={(e) => setShopForm({ ...shopForm, seoDescription: e.target.value })}
                    placeholder="Brief description of your products, delivery coverage, and shop highlights..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={shopForm.seoKeywords || ''}
                      onChange={(e) => setShopForm({ ...shopForm, seoKeywords: e.target.value })}
                      placeholder="grocery, kirana pasal, kathmandu online store"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Social Share Image URL (OG Image)
                    </label>
                    <input
                      type="text"
                      value={shopForm.socialShareImage || ''}
                      onChange={(e) => setShopForm({ ...shopForm, socialShareImage: e.target.value })}
                      placeholder="https://yourstore.com/banner.jpg"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. ANALYTICS & PIXELS TAB ─────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Marketing Analytics &amp; Pixels</h3>
                  <p className="text-xs text-slate-400">Track website conversions and run targeted ad campaigns</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Meta / Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={shopForm.facebookPixelId || ''}
                    onChange={(e) => setShopForm({ ...shopForm, facebookPixelId: e.target.value })}
                    placeholder="e.g. 109284729182374"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Google Analytics 4 (GA4) ID
                  </label>
                  <input
                    type="text"
                    value={shopForm.googleAnalyticsId || ''}
                    onChange={(e) => setShopForm({ ...shopForm, googleAnalyticsId: e.target.value })}
                    placeholder="e.g. G-7483921820"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    TikTok Pixel ID
                  </label>
                  <input
                    type="text"
                    value={shopForm.tiktokPixelId || ''}
                    onChange={(e) => setShopForm({ ...shopForm, tiktokPixelId: e.target.value })}
                    placeholder="e.g. C8X90..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Google Tag Manager Container ID
                  </label>
                  <input
                    type="text"
                    value={shopForm.googleTagManagerId || ''}
                    onChange={(e) => setShopForm({ ...shopForm, googleTagManagerId: e.target.value })}
                    placeholder="e.g. GTM-MP99281"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 text-xs">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={shopForm.trackWhatsAppEvents ?? true}
                    onChange={(e) => setShopForm({ ...shopForm, trackWhatsAppEvents: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Track WhatsApp Order Clicks</span>
                    <span className="text-[10px] text-slate-400">Fire standard Purchase event when buyer clicks WhatsApp</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={shopForm.trackAddToCartEvents ?? true}
                    onChange={(e) => setShopForm({ ...shopForm, trackAddToCartEvents: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Track Add to Cart Events</span>
                    <span className="text-[10px] text-slate-400">Fire AddToCart pixel trigger upon product bag additions</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── 7. DOMAIN TAB ─────────────────────────────────────────── */}
        {activeTab === 'domain' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Free Store Subdomain */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Free WAStore URL</h3>
                    <p className="text-xs text-slate-400">Your complimentary online link hosted on MeroPasal</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Live &amp; Active</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 w-full flex items-center px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-200">
                  <span className="text-slate-400">https://meropasal.com/store/</span>
                  <input
                    type="text"
                    value={shopForm.subdomain || shopForm.shopCode.toLowerCase()}
                    onChange={(e) => setShopForm({ ...shopForm, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    className="flex-1 font-bold bg-transparent border-0 outline-hidden focus:ring-0 text-blue-600 dark:text-blue-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const url = `https://meropasal.com/store/${shopForm.subdomain || shopForm.shopCode.toLowerCase()}`;
                    navigator.clipboard.writeText(url);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Custom Domain Setup */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Connect Custom Domain</h3>
                  <p className="text-xs text-slate-400">Use your own branded web address (e.g. www.yourshop.com)</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Custom Domain
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shopForm.customDomain || ''}
                      onChange={(e) => setShopForm({ ...shopForm, customDomain: e.target.value })}
                      placeholder="e.g. store.meropasal.com or yourbrand.com"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => alert(`DNS check for ${shopForm.customDomain || 'domain'}: SSL Certificate is active and verified!`)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Verify DNS
                    </button>
                  </div>
                </div>

                {/* DNS Configuration Table */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700 font-bold text-[11px] text-slate-600 dark:text-slate-300">
                    DNS Records to add in your registrar (Cloudflare / GoDaddy / Namecheap):
                  </div>
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="text-[10px] uppercase text-slate-400 bg-slate-100/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3">Host / Name</th>
                        <th className="p-3">Points to / Value</th>
                        <th className="p-3">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-3 font-bold text-blue-600">CNAME</td>
                        <td className="p-3">store</td>
                        <td className="p-3">domains.meropasal.com</td>
                        <td className="p-3 text-slate-400">Automatic</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-blue-600">A</td>
                        <td className="p-3">@</td>
                        <td className="p-3">76.76.21.21</td>
                        <td className="p-3 text-slate-400">Automatic</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 8. BILLING TAB ────────────────────────────────────────── */}
        {activeTab === 'billing' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Current Plan Overview */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subscription &amp; Invoices</h3>
                    <p className="text-xs text-slate-400">Manage your business subscription tier and view past receipts</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800">
                  {shopForm.billingPlan || 'Pro Merchant'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Current Plan</span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">MeroPasal Pro VIP</h4>
                  <p className="text-[11px] text-emerald-600 font-bold">Unlimited Products &amp; WhatsApp Orders</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Next Renewal Date</span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{shopForm.billingRenewalDate || '2026-11-12'}</h4>
                  <p className="text-[11px] text-slate-400">Renews at Rs. 999 / month</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Billing Cycle</span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white capitalize">{shopForm.billingCycle || 'monthly'}</h4>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700">
                    Switch to Annual &amp; Save 20%
                  </span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="pt-2">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">Past Invoices</h4>
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase text-slate-400">
                      <tr>
                        <th className="p-3">Invoice</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-3 font-mono font-bold">INV-2026-091</td>
                        <td className="p-3 text-slate-500">2026-10-01</td>
                        <td className="p-3 font-bold font-mono">Rs. 999</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                            Paid
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => alert('Downloading official tax invoice PDF...')}
                            className="text-blue-600 font-bold hover:underline"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 9. ADVANCED TAB ───────────────────────────────────────── */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Thermal Printer Hardware */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.printerSettings}</h3>
                  <p className="text-xs text-slate-400">Bluetooth / USB thermal receipt printer configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.paperSize}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['58mm', '80mm'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPrinterForm({ ...printerForm, paperSize: size })}
                        className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition cursor-pointer ${
                          printerForm.paperSize === size
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {size} Format
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Receipt Footer Message
                  </label>
                  <input
                    type="text"
                    value={printerForm.footerMessage}
                    onChange={(e) => setPrinterForm({ ...printerForm, footerMessage: e.target.value })}
                    placeholder="धन्यवाद ! फेरी आउनुहोला"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* App Preferences & Toggles */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">App Preferences &amp; Display</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Language */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs">Language</span>
                  </div>
                  <div className="flex gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer ${
                        language === 'en' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('ne')}
                      className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer ${
                        language === 'ne' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      नेपाली
                    </button>
                  </div>
                </div>

                {/* Theme */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span className="font-bold text-xs">Theme Mode</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    Toggle {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                  </button>
                </div>

                {/* Privacy Mode */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    {isPrivacyMode ? <EyeOff className="w-4 h-4 text-purple-600" /> : <Eye className="w-4 h-4 text-purple-600" />}
                    <span className="font-bold text-xs">Privacy Masking</span>
                  </div>
                  <button
                    type="button"
                    onClick={togglePrivacyMode}
                    className={`w-full py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                      isPrivacyMode ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isPrivacyMode ? 'Masked (Active)' : 'Normal (Visible)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Scripts & Head Codes */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Custom Scripts &amp; Code Injection</h3>
              <p className="text-xs text-slate-400">Add custom CSS or external JavaScript tracking tags</p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Header Code (Inside &lt;head&gt;)
                  </label>
                  <textarea
                    rows={2}
                    value={shopForm.customHeaderCode || ''}
                    onChange={(e) => setShopForm({ ...shopForm, customHeaderCode: e.target.value })}
                    placeholder="<!-- Custom scripts or meta tags -->"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Footer Code (Before &lt;/body&gt;)
                  </label>
                  <textarea
                    rows={2}
                    value={shopForm.customFooterCode || ''}
                    onChange={(e) => setShopForm({ ...shopForm, customFooterCode: e.target.value })}
                    placeholder="<!-- Live chat scripts or footer tracking -->"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Backup & System Reset Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportFullBackup}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export JSON Backup</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all demo data back to defaults?')) resetToDemoData();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* ── STICKY BOTTOM SAVE CHANGES BAR (MATCHING SCREENSHOT) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 py-3.5 px-4 sm:px-8 shadow-2xl flex items-center justify-center">
        <button
          type="button"
          onClick={() => handleSaveAllSettings()}
          className="inline-flex items-center justify-center gap-2 w-full max-w-sm px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Settings Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* ── BUSINESS & MARGIN CALCULATOR MODAL ────────────────── */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Shop Business Calculator</span>
              </h3>
              <button
                onClick={() => setIsCalcOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Margin & Markup */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-3">
                <span className="font-bold text-blue-900 dark:text-blue-300 block uppercase text-[10px]">
                  Profit Margin &amp; Markup Calculator
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Cost Price (Rs.)</label>
                    <input
                      type="number"
                      value={costPriceInput}
                      onChange={(e) => setCostPriceInput(e.target.value)}
                      placeholder="100"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Selling Price (Rs.)</label>
                    <input
                      type="number"
                      value={sellingPriceInput}
                      onChange={(e) => setSellingPriceInput(e.target.value)}
                      placeholder="125"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-blue-600"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200 dark:border-blue-900 flex justify-between text-xs font-bold">
                  <span>Gross Margin: <span className="text-emerald-600">{profitMargin}%</span></span>
                  <span>Markup: <span className="text-blue-600">{markupPercent}%</span></span>
                </div>
              </div>

              {/* Cash Change Return Calculator */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block uppercase text-[10px]">
                  Cashier Change Return Calculator
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Bill Amount (Rs.)</label>
                    <input
                      type="number"
                      value={calcBillTotal}
                      onChange={(e) => setCalcBillTotal(e.target.value)}
                      placeholder="380"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Cash Tendered (Rs.)</label>
                    <input
                      type="number"
                      value={calcCashTendered}
                      onChange={(e) => setCalcCashTendered(e.target.value)}
                      placeholder="500"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900 flex justify-between items-center text-xs font-bold">
                  <span>Change to Return:</span>
                  <span className="text-base text-emerald-700 dark:text-emerald-300 font-black">
                    {formatCurrency(changeToReturn)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCalcOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

      {/* ── QR CODE FULL PREVIEW MODAL ───────────────────────── */}
      {previewQrImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{previewQrImage.title}</h3>
              <button
                onClick={() => setPreviewQrImage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <img
                src={previewQrImage.url}
                alt={previewQrImage.title}
                className="w-64 h-64 object-contain rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-500">Scan this QR code with your mobile banking or wallet app.</p>
            <button
              onClick={() => setPreviewQrImage(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
