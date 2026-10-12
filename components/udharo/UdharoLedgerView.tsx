'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { CustomerModel, UdharoTransactionModel } from '@/lib/types';
import {
  Search,
  UserPlus,
  Share2,
  Receipt,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';

export const UdharoLedgerView: React.FC = () => {
  const {
    customers,
    udharoTransactions,
    addCustomer,
    recordRepayment,
    formatCurrency,
    shop,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'due' | 'cleared'>('due');

  // Selected customer for history drawer / repayment modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Repayment form state
  const [repayAmount, setRepayAmount] = useState('');
  const [repayMethod, setRepayMethod] = useState('Cash');
  const [repayNotes, setRepayNotes] = useState('');

  // Add Customer state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Computations
  const totalPendingDue = useMemo(() => {
    return customers.reduce((acc, c) => acc + c.totalDue, 0);
  }, [customers]);

  const debtorsCount = useMemo(() => {
    return customers.filter((c) => c.totalDue > 0).length;
  }, [customers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const q = searchQuery.toLowerCase().trim();
        const matchQuery = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.address && c.address.toLowerCase().includes(q));
        if (filterType === 'due') return matchQuery && c.totalDue > 0;
        if (filterType === 'cleared') return matchQuery && c.totalDue <= 0;
        return matchQuery;
      })
      .sort((a, b) => b.totalDue - a.totalDue);
  }, [customers, searchQuery, filterType]);

  // Customer transactions history
  const customerHistory = useMemo(() => {
    if (!selectedCustomer) return [];
    return udharoTransactions
      .filter((tx) => tx.customerId === selectedCustomer.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedCustomer, udharoTransactions]);

  const handleOpenRepayment = (c: CustomerModel) => {
    setSelectedCustomer(c);
    setRepayAmount(String(c.totalDue));
    setIsRepayModalOpen(true);
  };

  const handleSaveRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amount = parseFloat(repayAmount);
    if (isNaN(amount) || amount <= 0) return;

    recordRepayment(selectedCustomer.id, amount, repayMethod, repayNotes);
    setIsRepayModalOpen(false);
    setRepayAmount('');
    setRepayNotes('');
  };

  const handleSaveNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim() || undefined,
    });

    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  const handleSendWhatsAppReminder = (customer: CustomerModel) => {
    const message = `नमस्ते ${customer.name} ज्यू 🙏,\n` +
      `यो *${shop.name}* बाट विनम्र अनुरोध हो।\n\n` +
      `तपाईंको पसलमा उठ्न बाँकी उधारो रकम: *Rs. ${customer.totalDue}* रहेको छ।\n` +
      `कृपया समयमै भुक्तानी गरिदिनुहुन अनुरोध गर्दछौं।\n\n` +
      `भुक्तानीका लागि eSewa / Fonepay / Cash सम्पर्क: ${shop.phone}\n` +
      `धन्यवाद!`;

    const encoded = encodeURIComponent(message);
    const phone = customer.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/977${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.udharoKhata}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Digital customer credit register, balance tracking, repayments and WhatsApp reminders
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addNewCustomer}</span>
        </button>
      </div>

      {/* ── STATS CARDS ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg shadow-amber-500/15 flex flex-col justify-between">
          <div className="flex justify-between items-center opacity-90 text-xs font-bold uppercase">
            <span>{t.totalPendingAmount}</span>
            <Wallet className="w-5 h-5" />
          </div>
          <div className="my-2">
            <h3 className="text-2xl lg:text-3xl font-black">{formatCurrency(totalPendingDue)}</h3>
            <p className="text-xs text-amber-100 mt-1">Pending collection from customers</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>{t.totalDebtors}</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="my-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{debtorsCount} Customers</h3>
            <p className="text-xs text-slate-400 mt-1">Active credit accounts</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Total Customers</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <div className="my-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{customers.length} Registered</h3>
            <p className="text-xs text-slate-400 mt-1">Total Khata customer base</p>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER ──────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone number, address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'due', label: 'Pending Dues' },
            { id: 'cleared', label: 'All Cleared' },
            { id: 'all', label: 'All Accounts' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id as typeof filterType)}
              className={`px-3.5 py-2 rounded-xl transition ${
                filterType === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CUSTOMER CARDS GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No customers found</p>
            <p className="text-xs mt-1">Try a different search or add a customer to your ledger</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition flex flex-col justify-between group"
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                      {cust.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      cust.totalDue > 0
                        ? 'bg-red-100 dark:bg-red-950 text-red-600'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                    }`}
                  >
                    {cust.totalDue > 0 ? 'DUE PENDING' : 'CLEAR'}
                  </span>
                </div>

                {cust.address && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{cust.address}</span>
                  </div>
                )}

                {/* Due Balance Display */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 my-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Due Balance</span>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                    {formatCurrency(cust.totalDue)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                >
                  View Khata
                </button>

                {cust.totalDue > 0 && (
                  <>
                    <button
                      onClick={() => handleOpenRepayment(cust)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                      title="Record Payment"
                    >
                      Repay
                    </button>
                    <button
                      onClick={() => handleSendWhatsAppReminder(cust)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition"
                      title="Send WhatsApp Reminder"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── CUSTOMER KHATA HISTORY MODAL / DRAWER ─────────────── */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {selectedCustomer.name}&apos;s Credit Ledger
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Phone: {selectedCustomer.phone} • {selectedCustomer.address || 'Kathmandu'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Outstanding Due */}
            <div className="my-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">Outstanding Balance</span>
                <h4 className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-0.5">
                  {formatCurrency(selectedCustomer.totalDue)}
                </h4>
              </div>

              {selectedCustomer.totalDue > 0 && (
                <button
                  onClick={() => handleOpenRepayment(selectedCustomer)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Record Repayment
                </button>
              )}
            </div>

            {/* Transaction Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Transaction History
              </h4>

              {customerHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No credit transactions recorded yet.</p>
              ) : (
                customerHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          tx.type === 'payment_repaid'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                        }`}
                      >
                        {tx.type === 'payment_repaid' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {tx.type === 'payment_repaid' ? 'Repayment Received' : `Credit Purchase (${tx.invoiceNumber || 'POS'})`}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(tx.createdAt).toLocaleString()} {tx.paymentMethod ? `• ${tx.paymentMethod}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-bold ${
                          tx.type === 'payment_repaid' ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {tx.type === 'payment_repaid' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Bal: {formatCurrency(tx.balanceAfter)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RECORD REPAYMENT MODAL ───────────────────────────── */}
      {isRepayModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Record Payment from {selectedCustomer.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current total balance due: <span className="font-bold text-amber-600">{formatCurrency(selectedCustomer.totalDue)}</span>
            </p>

            <form onSubmit={handleSaveRepayment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Amount Received (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedCustomer.totalDue}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Method
                </label>
                <select
                  value={repayMethod}
                  onChange={(e) => setRepayMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Cash">Cash (नगद)</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                  <option value="Fonepay">Fonepay / Mobile Banking</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={repayNotes}
                  onChange={(e) => setRepayNotes(e.target.value)}
                  placeholder="e.g. Cleared September dues"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRepayModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
                >
                  Save Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD NEW CUSTOMER MODAL ───────────────────────────── */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Add New Customer to Khata
            </h3>

            <form onSubmit={handleSaveNewCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Sita Shrestha"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. 9841234567"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="e.g. Ward 3, Baneshwor"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
