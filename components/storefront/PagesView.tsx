'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FileText,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  Globe,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface StorePage {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPublished: boolean;
  lastUpdated: string;
}

const defaultPages: StorePage[] = [
  {
    id: 'p1',
    slug: 'about-us',
    title: 'About Our Store',
    description: 'Our origin story, local neighbourhood roots, fresh daily supply guarantee.',
    isPublished: true,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'p2',
    slug: 'delivery-info',
    title: 'Home Delivery & Pickup',
    description: 'Instant 30-min local dispatch, delivery radius, COD and WhatsApp pickup slots.',
    isPublished: true,
    lastUpdated: 'Oct 11, 2026',
  },
  {
    id: 'p3',
    slug: 'returns-policy',
    title: 'Returns & Replacements',
    description: 'Same-day return policy for fresh items, damaged package replacement guide.',
    isPublished: true,
    lastUpdated: 'Sep 28, 2026',
  },
  {
    id: 'p4',
    slug: 'contact-whatsapp',
    title: 'WhatsApp Ordering Guide',
    description: 'How to order via WhatsApp voice note, photo list, or quick product share.',
    isPublished: true,
    lastUpdated: 'Oct 05, 2026',
  },
];

export const PagesView: React.FC<{ onBack?: () => void }> = () => {
  const { shop } = useApp();
  const [pages, setPages] = useState<StorePage[]>(defaultPages);
  const [selectedPage, setSelectedPage] = useState<StorePage | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Store Pages</h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                NEW
              </span>
            </div>
            <p className="text-xs text-slate-500">Custom informative content pages for your public store website</p>
          </div>
        </div>

        <button
          onClick={() => alert('New page editor launched!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Page</span>
        </button>
      </div>

      {/* Pages Table / Grid */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {page.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                      /{page.slug}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{page.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Published
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                  Updated {page.lastUpdated}
                </span>
                <button
                  onClick={() => setSelectedPage(page)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedPage.title}</h3>
                <span className="text-xs text-slate-400 font-mono">/{selectedPage.slug}</span>
              </div>
              <button
                onClick={() => setSelectedPage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="prose dark:prose-invert text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p>{selectedPage.description}</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-slate-500">
                This page is automatically published to your live storefront at:{' '}
                <strong className="text-blue-600">https://meropasal.app/store/{shop.shopCode || 'demo'}/{selectedPage.slug}</strong>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPage(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
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
