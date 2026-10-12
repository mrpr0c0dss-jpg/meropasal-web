'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Store,
  Printer,
  QrCode,
  Calculator,
  Database,
  Moon,
  Sun,
  Globe,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Check,
  Building,
  Smartphone,
  CreditCard,
} from 'lucide-react';

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

  const [shopForm, setShopForm] = useState({ ...shop });
  const [qrForm, setQrForm] = useState({ ...paymentQR });
  const [printerForm, setPrinterForm] = useState({ ...printerSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop(shopForm);
    updatePaymentQR(qrForm);
    updatePrinterSettings(printerForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportFullBackup = () => {
    const data = {
      shop,
      printerSettings,
      paymentQR,
      timestamp: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = jsonStr;
    a.download = `MeroPasal_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.settings}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure business identity, receipts, QR channels, and POS hardware
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCalcOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Calculator Tool</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAllSettings} className="space-y-6">
        {/* ── SHOP PROFILE SECTION ───────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.shopProfile}</h3>
              <p className="text-xs text-slate-400">Printed on all customer invoices & tax receipts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t.shopName} *
              </label>
              <input
                type="text"
                required
                value={shopForm.name}
                onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t.ownerName}
              </label>
              <input
                type="text"
                value={shopForm.ownerName}
                onChange={(e) => setShopForm({ ...shopForm, ownerName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t.phone} *
              </label>
              <input
                type="tel"
                required
                value={shopForm.phone}
                onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t.panVatNumber}
              </label>
              <input
                type="text"
                value={shopForm.panVat || ''}
                onChange={(e) => setShopForm({ ...shopForm, panVat: e.target.value })}
                placeholder="e.g. 601239845"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t.address}
              </label>
              <input
                type="text"
                value={shopForm.address}
                onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ── THERMAL PRINTER SETTINGS ────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
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
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition ${
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ── QR PAYMENT CHANNELS ─────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.qrPaymentSettings}</h3>
              <p className="text-xs text-slate-400">Digital wallet IDs for cashier counter scan & pay</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                eSewa ID / Number
              </label>
              <input
                type="text"
                value={qrForm.esewaId || ''}
                onChange={(e) => setQrForm({ ...qrForm, esewaId: e.target.value })}
                placeholder="e.g. 9841234567"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Khalti ID / Number
              </label>
              <input
                type="text"
                value={qrForm.khaltiId || ''}
                onChange={(e) => setQrForm({ ...qrForm, khaltiId: e.target.value })}
                placeholder="e.g. 9841234567"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Fonepay Merchant Code
              </label>
              <input
                type="text"
                value={qrForm.fonepayMerchantCode || ''}
                onChange={(e) => setQrForm({ ...qrForm, fonepayMerchantCode: e.target.value })}
                placeholder="e.g. MEROPASAL998"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* ── APP PREFERENCES & TOGGLES ────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">App Preferences & Display</h3>

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
                  className={`flex-1 py-1.5 rounded-lg font-bold ${
                    language === 'en' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ne')}
                  className={`flex-1 py-1.5 rounded-lg font-bold ${
                    language === 'ne' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700'
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
                className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200"
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
                className={`w-full py-1.5 rounded-lg font-bold text-xs ${
                  isPrivacyMode ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isPrivacyMode ? 'Masked (Active)' : 'Normal (Visible)'}
              </button>
            </div>
          </div>
        </div>

        {/* ── SAVE BUTTON ─────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportFullBackup}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Full JSON Data</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all demo data back to defaults?')) resetToDemoData();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Data</span>
            </button>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* ── BUSINESS & MARGIN CALCULATOR MODAL ────────────────── */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Shop Business Calculator</span>
              </h3>
              <button
                onClick={() => setIsCalcOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Margin & Markup */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-3">
                <span className="font-bold text-blue-900 dark:text-blue-300 block uppercase text-[10px]">
                  Profit Margin & Markup Calculator
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
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
