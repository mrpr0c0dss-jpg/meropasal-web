'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Share2,
  Copy,
  Check,
  X,
  QrCode,
  Printer,
  ExternalLink,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface ShareStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareStoreModal: React.FC<ShareStoreModalProps> = ({ isOpen, onClose }) => {
  const { shop } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://meropasal.app';
  const storeUrl = `${origin}/store?shop=${shop.shopCode || 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Namaste! 🛍️ Browse our full digital catalog and order easily on WhatsApp from ${shop.name || 'our store'}:\n${storeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Share Your Store</h3>
              <p className="text-xs text-slate-500">Send your catalog link to customers anywhere</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Link Copy Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Public Web &amp; WhatsApp Storefront Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <input
              type="text"
              readOnly
              value={storeUrl}
              className="flex-1 bg-transparent px-2.5 text-xs text-slate-800 dark:text-slate-200 font-mono truncate focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp 1-Click Action */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Share Directly on WhatsApp</span>
        </button>

        {/* Counter QR Code Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
            <QrCode className="w-12 h-12 text-slate-800" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Counter QR Code</h4>
            <p className="text-[11px] text-slate-500">
              Customers scan this to open your store on their smartphone.
            </p>
            <button
              onClick={() => window.print()}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 pt-0.5"
            >
              <Printer className="w-3 h-3" />
              <span>Print Counter Stand Card</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
