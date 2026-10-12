'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Building,
  Headphones,
  Search,
  ChevronDown,
} from 'lucide-react';
import { LandingPageTab } from '../LandingHeader';

interface ContactPageProps {
  onNavigateTab: (tab: LandingPageTab) => void;
  onLaunchApp: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateTab,
  onLaunchApp,
}) => {
  const { language } = useApp();

  // Contact Form State
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    city: 'Kathmandu',
    shopType: 'Kirana & Grocery',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchFaq, setSearchFaq] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.phone) return;
    setIsSubmitted(true);
  };

  const offices = [
    {
      city: 'Kathmandu (Headquarters)',
      address: 'Star Mall, Putalisadak & New Road, Kathmandu',
      phone: '+977 01-4400000 / 9801234567',
      email: 'ktm@meropasal.com.np',
      hours: 'Sun - Fri: 7:00 AM - 9:00 PM NPT',
    },
    {
      city: 'Pokhara Regional Hub',
      address: 'New Road, Near Chipledhunga, Pokhara',
      phone: '+977 061-550000 / 9802345678',
      email: 'pokhara@meropasal.com.np',
      hours: 'Sun - Fri: 8:00 AM - 8:00 PM NPT',
    },
    {
      city: 'Biratnagar & East Nepal',
      address: 'Main Road, Traffic Chowk, Biratnagar',
      phone: '+977 021-440000 / 9803456789',
      email: 'biratnagar@meropasal.com.np',
      hours: 'Sun - Fri: 8:00 AM - 7:30 PM NPT',
    },
    {
      city: 'Chitwan & Central Region',
      address: 'Lions Chowk, Narayangarh, Bharatpur',
      phone: '+977 056-520000 / 9804567890',
      email: 'chitwan@meropasal.com.np',
      hours: 'Sun - Fri: 8:00 AM - 8:00 PM NPT',
    },
  ];

  const faqs = [
    {
      q: 'How fast can I set up MeroPasal for my shop?',
      a: 'You can be up and running in under 2 minutes! Just launch the app, enter your shop name and registered PAN (optional), and you can immediately start adding inventory items and processing customer bills.',
    },
    {
      q: 'Can MeroPasal staff visit my shop in Kathmandu/Pokhara for on-site setup?',
      a: 'Yes! For our Pro Business and Enterprise Mart customers in Kathmandu Valley, Pokhara, Chitwan, and Biratnagar, our technicians provide on-site hardware setup and staff training assistance.',
    },
    {
      q: 'Can I import my existing product list from Excel / CSV?',
      a: 'Yes, MeroPasal allows you to import your existing stock inventory from CSV/Excel spreadsheets with one click.',
    },
    {
      q: 'How do customer WhatsApp invoices work without costing SMS fees?',
      a: 'MeroPasal utilizes WhatsApp direct web intent links. It automatically populates the customer receipt and sends it through your WhatsApp account, completely free with zero per-SMS charges.',
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes. All shop database records are encrypted with end-to-end security on Google Cloud / Firebase Firestore infrastructure. Only you and your authorized staff can access your shop accounts.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Headphones className="w-3.5 h-3.5 text-blue-500" />
          <span>Nepali Support Team</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          We&apos;re Here To Support Your Business
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Have questions about hardware, need help setting up thermal printers, or want a customized demonstration? Get in touch with our team in Nepal.
        </p>
      </section>

      {/* ── 2-COL: CONTACT FORM & DIRECT CHANNELS ────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form Box (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Book a Free On-Site / Remote Demo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fill out your details below and our retail specialist will reach out within 30 minutes.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-emerald-800 dark:text-emerald-200">
                Thank You, {formData.ownerName || 'Merchant'}!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                We received your request for <strong>{formData.shopName || 'your shop'}</strong>. Our representative will contact you at <strong>{formData.phone}</strong> shortly.
              </p>
              <div className="pt-3">
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  Meanwhile, Try Live POS Demo →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bikash Sharma"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Shop / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kathmandu Kirana & Mart"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Mobile Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Location / City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="Kathmandu">Kathmandu Valley (KTM, Lalitpur, Bhaktapur)</option>
                    <option value="Pokhara">Pokhara / Kaski</option>
                    <option value="Chitwan">Chitwan / Bharatpur</option>
                    <option value="Butwal">Butwal / Bhairahawa</option>
                    <option value="Biratnagar">Biratnagar / Dharan / Itahari</option>
                    <option value="Nepalgunj">Nepalgunj / West Nepal</option>
                    <option value="Other">Other District</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Shop Category</label>
                <select
                  value={formData.shopType}
                  onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="Kirana & Grocery">Kirana &amp; Grocery Store</option>
                  <option value="Department Store / Mart">Department Store / Supermart</option>
                  <option value="Clothing & Fashion">Clothing, Boutique &amp; Footwear</option>
                  <option value="Electronics & Mobile">Electronics, Mobile &amp; Gadgets</option>
                  <option value="Pharmacy & Health">Pharmacy &amp; Health Store</option>
                  <option value="Hardware & Sanitary">Hardware &amp; Sanitary</option>
                  <option value="Restaurant / Cafe">Cafe / Restaurant / Bakery</option>
                  <option value="Wholesale">Wholesale &amp; Distributor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">How Can We Help You?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your current billing setup or hardware requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Demo Request</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Direct Hotlines (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg">Instant WhatsApp &amp; Phone Hotline</h3>
              <p className="text-xs text-blue-100 mt-1">Speak directly to an engineer in Nepali.</p>
            </div>
            <div className="pt-2 space-y-2 text-xs font-mono">
              <a
                href="https://wa.me/9779800000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp: +977 980-0000000</span>
              </a>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 text-white">
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Landline: +977 01-4400000</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Clock className="w-4 h-4" />
              <span>Customer Support Operating Hours</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our merchant support desk is active <strong>7 Days a Week</strong> from <strong>7:00 AM to 9:00 PM Nepal Time</strong> to ensure zero disruptions during your morning and evening shop rush hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── REGIONAL OFFICES IN NEPAL ────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Our Regional Presence in Nepal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Local physical presence for on-site hardware deliveries and support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{office.city}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono space-y-1">
                <p>{office.phone}</p>
                <p className="text-[10px] text-slate-400">{office.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCHABLE HELP & FAQS ───────────────────────────── */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search help articles or questions..."
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden shadow-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#111827] transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    activeFaq === i ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching questions found. Please submit your inquiry through our form above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
