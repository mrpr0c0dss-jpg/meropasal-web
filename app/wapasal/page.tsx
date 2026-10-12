'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { WaPasalPage } from '@/components/landing/pages/WaPasalPage';

export default function WaPasalRoute() {
  const router = useRouter();

  const handleNavigateTab = (tab: string) => {
    if (tab === 'wapasal') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push(`/#${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors antialiased">
      {/* Navigation Header */}
      <LandingHeader
        activeTab="wapasal"
        onSelectTab={handleNavigateTab as any}
        onLaunchApp={() => router.push('/')}
        onLogin={() => router.push('/#login')}
        onRegister={() => router.push('/#register')}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full animate-in fade-in duration-300">
        <WaPasalPage
          onNavigateTab={handleNavigateTab as any}
          onLaunchApp={() => router.push('/')}
        />
      </main>

      {/* Footer */}
      <LandingFooter
        onSelectTab={handleNavigateTab as any}
        onLaunchApp={() => router.push('/')}
        onLogin={() => router.push('/#login')}
        onRegister={() => router.push('/#register')}
      />
    </div>
  );
}
