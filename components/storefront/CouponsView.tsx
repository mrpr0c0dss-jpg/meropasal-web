'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  Check,
  Copy,
  Trash2,
  Sparkles,
  Ticket,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface CouponItem {
  id: string;
  code: string;
  title: string;
  type: 'percent' | 'fixed';
  discount: number;
  minSpend: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

const initialCoupons: CouponItem[] = [
  {
    id: 'c1',
    code: 'WELCOME10',
    title: 'First Order Welcome Offer',
    type: 'percent',
    discount: 10,
    minSpend: 500,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 28,
  },
  {
    id: 'c2',
    code: 'DASHAIN50',
    title: 'Festive Special Discount',
    type: 'fixed',
    discount: 100,
    minSpend: 1500,
    expiresAt: '2026-11-15',
    isActive: true,
    usageCount: 42,
  },
  {
    id: 'c3',
    code: 'FREESHIP',
    title: 'Free Local Home Delivery',
    type: 'fixed',
    discount: 50,
    minSpend: 1000,
    expiresAt: '2026-10-31',
    isActive: false,
    usageCount: 15,
  },
];

export const CouponsView: React.FC<{ onBack?: () => void }> = () => {
  const { formatCurrency } = useApp();
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed'>('percent');
  const [newDiscount, setNewDiscount] = useState('10');
  const [newMinSpend, setNewMinSpend] = useState('500');
  const [newExpiry, setNewExpiry] = useState('2026-12-31');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon: CouponItem = {
      id: `c_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim() || 'Store Promo Offer',
      type: newType,
      discount: parseFloat(newDiscount) || 10,
      minSpend: parseFloat(newMinSpend) || 0,
      expiresAt: newExpiry,
      isActive: true,
      usageCount: 0,
    };

    setCoupons([coupon, ...coupons]);
    setNewCode('');
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Coupons &amp; Promo Codes</h1>
            <p className="text-xs text-slate-500">Run discounts to boost repeat orders on WhatsApp and storefront</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupon List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white dark:bg-[#111827] border rounded-2xl p-5 shadow-xs transition ${
              coupon.isActive
                ? 'border-slate-200/90 dark:border-slate-800'
                : 'border-slate-200/50 dark:border-slate-800/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-black text-sm tracking-wide border border-purple-200 dark:border-purple-800">
                {coupon.code}
              </span>
              <button
                onClick={() => handleToggle(coupon.id)}
                className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                {coupon.isActive ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Paused</span>
                )}
              </button>
            </div>

            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {coupon.title}
            </h4>

            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p>
                Discount:{' '}
                <strong className="text-purple-600 dark:text-purple-400">
                  {coupon.type === 'percent' ? `${coupon.discount}% OFF` : `${formatCurrency(coupon.discount)} OFF`}
                </strong>
              </p>
              <p>Min Order: {formatCurrency(coupon.minSpend)}</p>
              <p>Expires: {coupon.expiresAt}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Used: <strong className="font-mono text-slate-700 dark:text-slate-300">{coupon.usageCount} times</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  title="Copy Coupon Code"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {copiedCode === coupon.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  title="Delete Coupon"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs uppercase font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Offer Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 20% off on snacks"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed NPR (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount</label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Spend (NPR)</label>
                  <input
                    type="number"
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
