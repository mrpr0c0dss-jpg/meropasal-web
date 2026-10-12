'use client';

import React from 'react';
import { SaleModel, ShopModel, PrinterSettingsModel } from '@/lib/types';
import { Printer, Share2, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/store';

interface ReceiptModalProps {
  sale: SaleModel | null;
  shop: ShopModel;
  printerSettings: PrinterSettingsModel;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  shop,
  printerSettings,
  onClose,
}) => {
  const { t, formatCurrency } = useApp();

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const itemList = sale.items
      .map((item, idx) => `${idx + 1}. ${item.productName} x ${item.quantity} = Rs. ${item.total}`)
      .join('\n');

    const message = `🧾 *${shop.name}* - Tax Invoice / Bill\n` +
      `📅 Date: ${new Date(sale.createdAt).toLocaleString()}\n` +
      `🔢 Invoice #: *${sale.invoiceNumber}*\n` +
      `👤 Customer: ${sale.customerName || 'Customer'}\n\n` +
      `*Items:*\n${itemList}\n\n` +
      `💵 *Subtotal:* Rs. ${sale.subtotal}\n` +
      (sale.discount > 0 ? `🏷️ *Discount:* -Rs. ${sale.discount}\n` : '') +
      (sale.vatAmount > 0 ? `🏛️ *VAT (${sale.vatRate * 100}%):* Rs. ${sale.vatAmount}\n` : '') +
      `💰 *Grand Total:* *Rs. ${sale.total}*\n` +
      `💳 *Paid via:* ${sale.paymentMethod} (Rs. ${sale.paidAmount})\n` +
      (sale.dueAmount > 0 ? `⚠️ *Remaining Due (Udharo):* *Rs. ${sale.dueAmount}*\n` : '') +
      `\n🙏 ${printerSettings.footerMessage || 'Thank you for shopping with us!'}`;

    const encoded = encodeURIComponent(message);
    const phoneNum = sale.customerPhone ? sale.customerPhone.replace(/[^0-9]/g, '') : '';
    const url = phoneNum
      ? `https://wa.me/977${phoneNum}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  };

  const is58mm = printerSettings.paperSize === '58mm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden flex flex-col my-auto max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">{t.saleCompletedSuccessfully}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-950/50 flex justify-center">
          <div
            id="printable-receipt"
            className={`bg-white text-black p-5 shadow-md border border-slate-200 rounded-lg text-xs leading-relaxed font-mono ${
              is58mm ? 'w-[260px]' : 'w-[340px]'
            }`}
          >
            {/* Header / Shop Info */}
            <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
              <h2 className="font-bold text-sm tracking-wide uppercase">{shop.name}</h2>
              <p className="text-[11px] text-slate-700">{shop.address}</p>
              <p className="text-[11px] text-slate-700">Tel: {shop.phone}</p>
              {shop.panVat && <p className="text-[11px] font-semibold">PAN/VAT: {shop.panVat}</p>}
            </div>

            {/* Bill Meta */}
            <div className="border-b border-dashed border-slate-400 pb-2 mb-2 text-[11px] space-y-0.5">
              <div className="flex justify-between">
                <span>Inv #:</span>
                <span className="font-bold">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(sale.createdAt).toLocaleDateString()} {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {sale.customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{sale.customerName}</span>
                </div>
              )}
              {sale.billedByName && (
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{sale.billedByName}</span>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="border-b border-dashed border-slate-400 pb-2 mb-2">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-1 mb-1 text-[11px]">
                <span className="w-1/2">ITEM</span>
                <span className="w-1/4 text-center">QTY</span>
                <span className="w-1/4 text-right">AMT</span>
              </div>
              {sale.items.map((item, i) => (
                <div key={i} className="flex justify-between py-0.5 text-[11px]">
                  <span className="w-1/2 truncate font-medium">{item.productName}</span>
                  <span className="w-1/4 text-center">{item.quantity}</span>
                  <span className="w-1/4 text-right">{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals Calculation */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-2 mb-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-{sale.discount.toFixed(2)}</span>
                </div>
              )}
              {sale.vatAmount > 0 && (
                <div className="flex justify-between">
                  <span>VAT ({(sale.vatRate * 100).toFixed(0)}%):</span>
                  <span>{sale.vatAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-200">
                <span>GRAND TOTAL:</span>
                <span>Rs. {sale.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 pt-0.5">
                <span>Paid ({sale.paymentMethod}):</span>
                <span>Rs. {sale.paidAmount.toFixed(2)}</span>
              </div>
              {sale.dueAmount > 0 && (
                <div className="flex justify-between font-bold text-red-600">
                  <span>UDHARO DUE:</span>
                  <span>Rs. {sale.dueAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center pt-1 text-[10px] text-slate-600">
              <p>{printerSettings.footerMessage || 'Thank You! Visit Again.'}</p>
              <p className="text-[9px] mt-1 text-slate-400">Powered by MeroPasal POS</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-2 justify-between">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Share2 className="w-4 h-4" />
            {t.shareWhatsApp}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            {t.printReceipt}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
