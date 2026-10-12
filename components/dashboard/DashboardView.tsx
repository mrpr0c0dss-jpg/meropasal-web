'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Receipt,
  Users,
  Wallet,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Calendar,
  Layers,
  CheckCircle2,
  DollarSign,
  ArrowDownRight,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    products,
    sales,
    customers,
    expenses,
    formatCurrency,
    t,
    shop,
    theme,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today');
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue');

  // Low stock and expiring items computation
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.quantity <= p.minStockLevel);
  }, [products]);

  const expiringProducts = useMemo(() => {
    const today = new Date();
    return products.filter((p) => {
      if (!p.expiryDate) return false;
      const exp = new Date(p.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });
  }, [products]);

  // Filter sales by time period
  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfWeek = startOfToday - 7 * 86400000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return sales.filter((s) => {
      const saleTime = new Date(s.createdAt).getTime();
      if (timeRange === 'today') return saleTime >= startOfToday;
      if (timeRange === 'yesterday') return saleTime >= startOfYesterday && saleTime < startOfToday;
      if (timeRange === 'week') return saleTime >= startOfWeek;
      if (timeRange === 'month') return saleTime >= startOfMonth;
      return true;
    });
  }, [sales, timeRange]);

  // Key Metric Totals
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((acc, s) => (s.status === 'completed' ? acc + s.total : acc), 0);
  }, [filteredSales]);

  const totalCost = useMemo(() => {
    return filteredSales.reduce((acc, s) => {
      if (s.status !== 'completed') return acc;
      const saleCost = s.items.reduce((c, item) => c + (item.purchasePrice || 0) * item.quantity, 0);
      return acc + saleCost;
    }, 0);
  }, [filteredSales]);

  const netProfit = Math.max(0, totalRevenue - totalCost);
  const profitMarginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const totalUdharoToCollect = useMemo(() => {
    return customers.reduce((acc, c) => acc + c.totalDue, 0);
  }, [customers]);

  // Chart Data Preparation (Daily aggregation)
  const chartData = useMemo(() => {
    const dayMap: Record<string, { label: string; revenue: number; orders: number; profit: number }> = {};
    const now = new Date();

    // Prepare last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      dayMap[key] = { label, revenue: 0, orders: 0, profit: 0 };
    }

    sales.forEach((s) => {
      if (s.status !== 'completed') return;
      const key = s.createdAt.split('T')[0];
      if (dayMap[key]) {
        dayMap[key].revenue += s.total;
        dayMap[key].orders += 1;
        const sCost = s.items.reduce((c, it) => c + (it.purchasePrice || 0) * it.quantity, 0);
        dayMap[key].profit += Math.max(0, s.total - sCost);
      }
    });

    return Object.values(dayMap);
  }, [sales]);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── TOP HERO BANNER & TIME SELECTOR ──────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {shop.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase border border-emerald-200 dark:border-emerald-800">
              ● Live POS Terminal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {shop.address}
          </p>
        </div>

        {/* Time Period Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-x-auto text-xs font-bold">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'week', label: '7 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id as typeof timeRange)}
              className={`px-3.5 py-1.5 rounded-xl transition whitespace-nowrap ${
                timeRange === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS CARDS GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
        {/* Total Sales */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {timeRange === 'today' ? t.todaySales : t.totalSales}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalRevenue)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{filteredSales.length} Bills Completed</span>
          </div>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.totalProfit}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(netProfit)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <span>Avg margin: ~{profitMarginPercent}%</span>
          </div>
        </div>

        {/* Udharo To Collect */}
        <div
          onClick={() => onNavigate('udharo')}
          className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.udharoDue}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl lg:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {formatCurrency(totalUdharoToCollect)}
          </h3>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500 font-medium">
            <span>{customers.filter((c) => c.totalDue > 0).length} Debtors pending</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-red-400 dark:hover:border-red-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.lowStock}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl lg:text-2xl font-black text-red-600 dark:text-red-400 tracking-tight">
            {lowStockProducts.length} Items
          </h3>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500 font-medium">
            <span>Needs replenishment</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ── NOTIFICATION BANNERS ──────────────────────────────── */}
      {(lowStockProducts.length > 0 || expiringProducts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {lowStockProducts.length > 0 && (
            <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-amber-900 dark:text-amber-200">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">
                    {lowStockProducts.length} Products running low on stock!
                  </p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                    {lowStockProducts.slice(0, 2).map((p) => p.name).join(', ')}...
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs"
              >
                Restock
              </button>
            </div>
          )}

          {expiringProducts.length > 0 && (
            <div className="p-4 rounded-3xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-rose-900 dark:text-rose-200">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">
                    {expiringProducts.length} Items expiring within 30 days!
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
                    {expiringProducts.slice(0, 2).map((p) => `${p.name} (${p.expiryDate})`).join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 shadow-xs"
              >
                Inspect
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── QUICK ACTION SHORTCUTS BANNER ────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-black text-lg">{t.quickActions}</h3>
            <p className="text-xs text-blue-100">Speed up your counter billing with 1-click tools</p>
          </div>
          <button
            onClick={() => onNavigate('pos')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-blue-700 font-extrabold text-xs shadow-md hover:bg-blue-50 transition active:scale-95"
          >
            <Receipt className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <button
            onClick={() => onNavigate('pos')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center gap-2.5 transition"
          >
            <PlusCircle className="w-4 h-4 text-blue-200" />
            <span>{t.newSale}</span>
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center gap-2.5 transition"
          >
            <ShoppingBag className="w-4 h-4 text-blue-200" />
            <span>{t.addProduct}</span>
          </button>
          <button
            onClick={() => onNavigate('udharo')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center gap-2.5 transition"
          >
            <Users className="w-4 h-4 text-blue-200" />
            <span>{t.addUdharo}</span>
          </button>
          <button
            onClick={() => onNavigate('expenses')}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center gap-2.5 transition"
          >
            <Wallet className="w-4 h-4 text-blue-200" />
            <span>{t.recordExpense}</span>
          </button>
        </div>
      </div>

      {/* ── CHARTS & RECENT INVOICES GRID ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Trends Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Revenue & Invoicing Performance
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Daily financial trends overview</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 rounded-lg transition ${
                  chartType === 'revenue'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Revenue (Rs.)
              </button>
              <button
                onClick={() => setChartType('orders')}
                className={`px-3 py-1 rounded-lg transition ${
                  chartType === 'orders'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Bills Count
              </button>
            </div>
          </div>

          <div className="h-[260px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'revenue' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1E293B' : '#F1F5F9'} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E2E8F0',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1E293B' : '#F1F5F9'} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar dataKey="orders" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Recent Transactions */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t.recentTransactions}
            </h4>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                onClick={() => onNavigate('sales')}
                className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                      {sale.invoiceNumber}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        sale.paymentMethod === 'Cash'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : sale.paymentMethod === 'Fonepay'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                          : sale.paymentMethod === 'Credit'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                      }`}
                    >
                      {sale.paymentMethod}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                    {sale.customerName || 'Walk-in'} • {sale.items.length} items
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-black text-xs text-slate-900 dark:text-white">
                    {formatCurrency(sale.total)}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
