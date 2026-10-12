'use client';

import React, { useState, useEffect } from 'react';
import { LandingHeader, LandingPageTab } from './LandingHeader';
import { LandingFooter } from './LandingFooter';
import { HomePage } from './pages/HomePage';
import { WaPasalPage } from './pages/WaPasalPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { PricingPage } from './pages/PricingPage';
import { HardwarePage } from './pages/HardwarePage';
import { StoreProfilePage } from './pages/StoreProfilePage';
import { ContactPage } from './pages/ContactPage';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLogin: () => void;
  onRegister?: () => void;
  initialPage?: LandingPageTab;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLogin,
  onRegister,
  initialPage = 'home',
}) => {
  const [activeTab, setActiveTab] = useState<LandingPageTab>(initialPage);

  // Sync with window hash if present on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'wapasal', 'features', 'solutions', 'pricing', 'hardware', 'store', 'contact'].includes(hash)) {
      setActiveTab(hash as LandingPageTab);
    }
  }, []);

  const handleSelectTab = (tab: LandingPageTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors antialiased">
      {/* ── SHARED MULTI-PAGE NAVIGATION HEADER ─────────────────── */}
      <LandingHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onLaunchApp={onLaunchApp}
        onLogin={onLogin}
        onRegister={onRegister}
      />

      {/* ── ACTIVE PAGE CONTENT CONTAINER ─────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full animate-in fade-in duration-300">
        {activeTab === 'home' && (
          <HomePage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
            onLogin={onLogin}
            onRegister={onRegister}
          />
        )}
        {activeTab === 'wapasal' && (
          <WaPasalPage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
          />
        )}
        {activeTab === 'features' && (
          <FeaturesPage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
            onLogin={onLogin}
          />
        )}
        {activeTab === 'solutions' && (
          <SolutionsPage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
            onLogin={onLogin}
          />
        )}
        {activeTab === 'store' && (
          <StoreProfilePage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
          />
        )}
        {activeTab === 'pricing' && (
          <PricingPage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
            onLogin={onLogin}
            onRegister={onRegister}
          />
        )}
        {activeTab === 'hardware' && (
          <HardwarePage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
          />
        )}
        {activeTab === 'contact' && (
          <ContactPage
            onNavigateTab={handleSelectTab}
            onLaunchApp={onLaunchApp}
          />
        )}
      </main>

      {/* ── SHARED MULTI-PAGE FOOTER ──────────────────────────── */}
      <LandingFooter
        onSelectTab={handleSelectTab}
        onLaunchApp={onLaunchApp}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </div>
  );
};
