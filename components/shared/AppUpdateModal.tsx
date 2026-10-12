'use client';

import React from 'react';
import { Rocket, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion?: string;
  latestVersion?: string;
  isForceUpdate?: boolean;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  onClose,
  currentVersion = '2.4.0',
  latestVersion = '2.5.0',
  isForceUpdate = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
          <Rocket className="w-8 h-8" />
        </div>

        <h3 className="font-black text-xl text-slate-900 dark:text-white mt-4">
          New Update Available!
        </h3>

        <div className="flex items-center justify-center gap-2 my-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            v{currentVersion}
          </span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            v{latestVersion}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left my-4 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>What&apos;s New in this Version:</span>
          </div>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
            <li>Instant WhatsApp Tax Invoice generation with clickable bill link</li>
            <li>58mm & 80mm thermal receipt direct printing optimizations</li>
            <li>Nepali language localization and Rupee (Rs. / रू) currency formatting</li>
            <li>Real-time cloud database backup & offline sync</li>
          </ul>
        </div>

        <div className="flex gap-2">
          {!isForceUpdate && (
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Remind Later
            </button>
          )}
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};
