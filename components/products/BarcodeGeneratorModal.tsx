'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { ProductModel } from '@/lib/types';
import { Barcode, Printer, Download, Sparkles, X, Check, RefreshCw } from 'lucide-react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: ProductModel | null;
}

export const BarcodeGeneratorModal: React.FC<BarcodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  const { products, shop, formatCurrency } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(initialProduct?.id || '');
  const [barcodeValue, setBarcodeValue] = useState<string>(initialProduct?.barcode || `890${Date.now().toString().slice(-9)}`);
  const [labelTitle, setLabelTitle] = useState<string>(initialProduct?.name || 'Item Name');
  const [labelPrice, setLabelPrice] = useState<string>(initialProduct ? String(initialProduct.sellingPrice) : '150');
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'EAN13'>('CODE128');
  const [stickerCopies, setStickerCopies] = useState<number>(6);

  const svgRef = useRef<SVGSVGElement>(null);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setLabelTitle(prod.name);
      setLabelPrice(String(prod.sellingPrice));
      setBarcodeValue(prod.barcode || `890${Date.now().toString().slice(-9)}`);
    }
  };

  const handleGenerateRandom = () => {
    const randomCode = `890${Math.floor(100000000 + Math.random() * 900000000)}`;
    setBarcodeValue(randomCode);
  };

  useEffect(() => {
    if (!isOpen || !svgRef.current) return;
    try {
      JsBarcode(svgRef.current, barcodeValue || '8901234567890', {
        format: barcodeFormat,
        lineColor: '#000000',
        width: 1.8,
        height: 45,
        displayValue: true,
        fontSize: 12,
        font: 'monospace',
        margin: 5,
      });
    } catch {
      // Ignore format errors
    }
  }, [isOpen, barcodeValue, barcodeFormat]);

  if (!isOpen) return null;

  const handlePrintStickers = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200/80 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Barcode Generator &amp; Sticker Printer
              </h3>
              <p className="text-[11px] text-slate-400">
                Generate standard scannable EAN/Code128 stickers
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="py-4 space-y-3.5 text-xs">
          {/* Select Existing Product */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Product From Inventory (Optional)
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value="">Custom Item / Create New</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Rs. {p.sellingPrice})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Product Label Title
              </label>
              <input
                type="text"
                value={labelTitle}
                onChange={(e) => setLabelTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Printed Price (Rs.)
              </label>
              <input
                type="number"
                value={labelPrice}
                onChange={(e) => setLabelPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Barcode Number / Code
              </label>
              <button
                type="button"
                onClick={handleGenerateRandom}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto Generate New</span>
              </button>
            </div>
            <input
              type="text"
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* ── BARCODE STICKER PREVIEW PAPER ────────────────── */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">Live Sticker Preview</span>
            <div
              id="printable-barcode-sticker"
              className="bg-white text-black p-3.5 rounded-xl border border-slate-300 shadow-sm text-center w-[230px] flex flex-col items-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700 truncate max-w-[200px]">
                {shop.name}
              </p>
              <h5 className="font-extrabold text-xs text-black truncate max-w-[200px] mt-0.5">
                {labelTitle}
              </h5>
              <div className="my-1 flex justify-center w-full">
                <svg ref={svgRef} className="max-w-full" />
              </div>
              <p className="font-black text-sm text-black">
                Price: Rs. {labelPrice}
              </p>
              <p className="text-[9px] text-slate-500 font-medium">Incl. all taxes</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={handlePrintStickers}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sticker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
