'use client';

import React from 'react';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 lg:p-10 space-y-6 text-slate-800 dark:text-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>

        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5 text-blue-600">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">
              Privacy Policy & Terms of Service
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Last Updated: September 2026 • MeroPasal Smart POS & Inventory Management
          </p>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Data Ownership & Storage</h3>
            <p>
              MeroPasal respects the privacy and confidentiality of your shop operations. All inventory records, customer phone numbers, sales receipts, and Udharo credit records entered into this system belong exclusively to the registered shop owner.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Offline & Local Storage</h3>
            <p>
              Your point-of-sale data is stored securely in your browser&apos;s local memory and synchronized in real-time with your private Firebase Firestore cloud database whenever an active internet connection is available.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Customer Information (Khata & Invoices)</h3>
            <p>
              Customer names and phone numbers used for WhatsApp billing or credit reminders are processed strictly for receipt delivery and debt reconciliation. We do not sell or share customer contact numbers with third parties.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">4. Account Deletion & Data Purge</h3>
            <p>
              Shop owners have the right to reset demo data, download complete JSON/CSV backups, or purge their shop database at any time through the Settings tab.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
