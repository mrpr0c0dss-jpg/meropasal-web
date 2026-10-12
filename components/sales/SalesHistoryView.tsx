'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { SaleModel, PaymentMethod } from '@/lib/types';
import {
  Search,
  FileSpreadsheet,
  Printer,
  Share2,
  XCircle,
  Eye,
  Calendar,
  Filter,
  CheckCircle2,
  X,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { ReceiptModal } from '../pos/ReceiptModal';

export const SalesHistoryView: React.FC = () => {
  const { sales, cancelSale, formatCurrency, shop, printerSettings, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('All');
  const [timePreset, setTimePreset] = useState<'today' | 'yesterday' | '15days' | 'month' | 'all'>('all');

  // Selected sale for detail modal / reprint
  const [detailSale, setDetailSale] = useState<SaleModel | null>(null);
  const [reprintSale, setReprintSale] = useState<SaleModel | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Filtered sales
  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOf15Days = startOfToday - 15 * 86400000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return sales.filter((s) => {
      // Payment method match
      const matchMethod = selectedPaymentMethod === 'All' || s.paymentMethod === selectedPaymentMethod;

      // Time match
      const saleTime = new Date(s.createdAt).getTime();
      let matchTime = true;
      if (timePreset === 'today') matchTime = saleTime >= startOfToday;
      if (timePreset === 'yesterday') matchTime = saleTime >= startOfYesterday && saleTime < startOfToday;
      if (timePreset === '15days') matchTime = saleTime >= startOf15Days;
      if (timePreset === 'month') matchTime = saleTime >= startOfMonth;

      // Query match
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.invoiceNumber.toLowerCase().includes(q) ||
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.customerPhone && s.customerPhone.includes(q)) ||
        s.items.some((item) => item.productName.toLowerCase().includes(q));

      return matchMethod && matchTime && matchQuery;
    });
  }, [sales, selectedPaymentMethod, timePreset, searchQuery]);

  // Group sales by Date
  const groupedSales = useMemo(() => {
    const groups: Record<string, { dateStr: string; sales: SaleModel[]; total: number }> = {};

    filteredSales.forEach((sale) => {
      const d = new Date(sale.createdAt);
      const dateKey = d.toISOString().split('T')[0];
      const dateStr = d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      if (!groups[dateKey]) {
        groups[dateKey] = { dateStr, sales: [], total: 0 };
      }
      groups[dateKey].sales.push(sale);
      if (sale.status === 'completed') {
        groups[dateKey].total += sale.total;
      }
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredSales]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Invoice #', 'Date & Time', 'Customer', 'Items Count', 'Payment Method', 'Subtotal', 'Discount', 'VAT', 'Total (Rs.)', 'Status'];
    const rows = filteredSales.map((s) => [
      s.invoiceNumber,
      new Date(s.createdAt).toLocaleString(),
      s.customerName || 'Walk-in',
      s.items.length,
      s.paymentMethod,
      s.subtotal,
      s.discount,
      s.vatAmount,
      s.total,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MeroPasal_Sales_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmCancel = () => {
    if (!detailSale) return;
    cancelSale(detailSale.id, cancelReason || 'Customer returned items');
    setIsCancelModalOpen(false);
    setDetailSale(null);
    setCancelReason('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── HEADER & EXPORT ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.sales}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit tax invoices, filter payment channels, and manage refunds
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* ── FILTER CONTROLS BAR ──────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice #, customer name, phone or product item..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Time Presets */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '15days', label: 'Last 15 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setTimePreset(p.id as typeof timePreset)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition ${
                  timePreset === p.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 scrollbar-none">
          {['All', 'Cash', 'Fonepay', 'eSewa', 'Khalti', 'Credit', 'Split'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedPaymentMethod(m)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedPaymentMethod === m
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {m === 'All' ? 'All Channels' : m}
            </button>
          ))}
        </div>
      </div>

      {/* ── GROUPED SALES CARDS LIST ─────────────────────────── */}
      <div className="space-y-6">
        {groupedSales.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2">
            <FileText className="w-12 h-12 mx-auto opacity-30" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No invoices found</p>
            <p className="text-xs">Try adjusting your filters or date range</p>
          </div>
        ) : (
          groupedSales.map(([dateKey, group]) => (
            <div key={dateKey} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{group.dateStr}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                    {group.sales.length} bills
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Total: <span className="text-blue-600 dark:text-blue-400">{formatCurrency(group.total)}</span>
                </div>
              </div>

              {/* Invoices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.sales.map((sale) => (
                  <div
                    key={sale.id}
                    className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition hover:shadow-md flex flex-col justify-between ${
                      sale.isCancelled
                        ? 'border-red-200 dark:border-red-950 bg-red-50/20 dark:bg-red-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {sale.invoiceNumber}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sale.isCancelled
                                ? 'bg-red-100 dark:bg-red-950 text-red-600'
                                : sale.paymentMethod === 'Cash'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                : sale.paymentMethod === 'Fonepay'
                                ? 'bg-red-100 dark:bg-red-950 text-red-600'
                                : sale.paymentMethod === 'Credit'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                                : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                            }`}
                          >
                            {sale.isCancelled ? 'VOID / CANCELLED' : sale.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {sale.customerName || 'Walk-in Customer'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sale.items.length} items
                      </p>

                      {/* Items Preview */}
                      <div className="mt-2 text-[11px] text-slate-500 line-clamp-1 bg-slate-50 dark:bg-slate-800/40 px-2 py-1 rounded-lg">
                        {sale.items.map((it) => `${it.productName} (${it.quantity})`).join(', ')}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Grand Total</span>
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {formatCurrency(sale.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailSale(sale)}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => setReprintSale(sale)}
                          className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── SALE DETAIL MODAL ────────────────────────────────── */}
      {detailSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Invoice Details ({detailSale.invoiceNumber})
                </h3>
                <p className="text-xs text-slate-400">
                  {new Date(detailSale.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setDetailSale(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Cashier info */}
            <div className="py-3 grid grid-cols-2 gap-2 text-xs border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Customer</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{detailSale.customerName || 'Walk-in'}</span>
                {detailSale.customerPhone && <p className="text-slate-400 text-[11px]">{detailSale.customerPhone}</p>}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Billed By</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{detailSale.billedByName || 'Cashier'}</span>
                <p className="text-slate-400 text-[11px]">Payment: {detailSale.paymentMethod}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 space-y-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between font-bold text-slate-400 uppercase text-[10px]">
                <span>Item</span>
                <span>Qty x Rate</span>
                <span>Total</span>
              </div>
              {detailSale.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{it.productName}</p>
                    <p className="text-[11px] text-slate-400">{it.unit || 'pcs'}</p>
                  </div>
                  <div className="text-slate-500">
                    {it.quantity} × {formatCurrency(it.price)}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(it.total)}
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="py-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(detailSale.subtotal)}</span>
              </div>
              {detailSale.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(detailSale.discount)}</span>
                </div>
              )}
              {detailSale.vatAmount > 0 && (
                <div className="flex justify-between">
                  <span>VAT ({(detailSale.vatRate * 100).toFixed(0)}%):</span>
                  <span>{formatCurrency(detailSale.vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Grand Total:</span>
                <span className="text-blue-600">{formatCurrency(detailSale.total)}</span>
              </div>
              {detailSale.dueAmount > 0 && (
                <div className="flex justify-between font-bold text-red-600">
                  <span>Udharo Due:</span>
                  <span>{formatCurrency(detailSale.dueAmount)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setReprintSale(detailSale);
                    setDetailSale(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>

              {!detailSale.isCancelled && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Void / Return Sale</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM VOID / RETURN MODAL ───────────────────────── */}
      {isCancelModalOpen && detailSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-red-600 mb-1">
              Void / Cancel Invoice
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cancelling <span className="font-bold">{detailSale.invoiceNumber}</span> will restock items back into inventory and reverse any credit.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Cancellation
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer returned items / Wrong billing"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Keep Invoice
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Confirm Void
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REPRINT RECEIPT MODAL ────────────────────────────── */}
      <ReceiptModal
        sale={reprintSale}
        shop={shop}
        printerSettings={printerSettings}
        onClose={() => setReprintSale(null)}
      />
    </div>
  );
};
