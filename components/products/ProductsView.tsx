'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { ProductModel } from '@/lib/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  Package,
  Sparkles,
  Barcode,
  X,
  PlusCircle,
  TrendingUp,
  Layers,
  Calendar,
  Printer,
  Camera,
  ScanBarcode,
} from 'lucide-react';
import { BarcodeGeneratorModal } from './BarcodeGeneratorModal';
import { ContinuousBarcodeScanner } from '../shared/ContinuousBarcodeScanner';

export const ProductsView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    formatCurrency,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'expiring' | 'out'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<ProductModel | null>(null);
  const [restockQty, setRestockQty] = useState('10');
  const [isBarcodeGeneratorOpen, setIsBarcodeGeneratorOpen] = useState(false);
  const [barcodeTargetProduct, setBarcodeTargetProduct] = useState<ProductModel | null>(null);
  const [isWebcamScannerOpen, setIsWebcamScannerOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: 'Groceries',
    unit: 'pieces',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    minStockLevel: '5',
    expiryDate: '',
    batchNumber: '',
  });

  // Extract Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Calculations for Stats Bar
  const totalStockCostValue = useMemo(() => {
    return products.reduce((acc, p) => acc + p.purchasePrice * p.quantity, 0);
  }, [products]);

  const totalStockSellingValue = useMemo(() => {
    return products.reduce((acc, p) => acc + p.sellingPrice * p.quantity, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= p.minStockLevel && p.quantity > 0).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= 0).length;
  }, [products]);

  const expiringCount = useMemo(() => {
    const today = new Date();
    return products.filter((p) => {
      if (!p.expiryDate) return false;
      const exp = new Date(p.expiryDate);
      const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 30 && diff >= 0;
    }).length;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const today = new Date();
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.batchNumber && p.batchNumber.toLowerCase().includes(q));

      let matchStock = true;
      if (stockStatusFilter === 'low') matchStock = p.quantity <= p.minStockLevel && p.quantity > 0;
      if (stockStatusFilter === 'out') matchStock = p.quantity <= 0;
      if (stockStatusFilter === 'expiring') {
        if (!p.expiryDate) return false;
        const exp = new Date(p.expiryDate);
        const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        matchStock = diff <= 30 && diff >= 0;
      }

      return matchCat && matchQuery && matchStock;
    });
  }, [products, selectedCategory, searchQuery, stockStatusFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      barcode: `890${Date.now().toString().slice(-9)}`,
      category: 'Groceries',
      unit: 'pieces',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '10',
      minStockLevel: '5',
      expiryDate: '',
      batchNumber: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductModel) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      barcode: p.barcode || '',
      category: p.category,
      unit: p.unit,
      purchasePrice: String(p.purchasePrice),
      sellingPrice: String(p.sellingPrice),
      quantity: String(p.quantity),
      minStockLevel: String(p.minStockLevel),
      expiryDate: p.expiryDate || '',
      batchNumber: p.batchNumber || '',
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice) return;

    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const quantity = parseInt(formData.quantity, 10) || 0;
    const minStockLevel = parseInt(formData.minStockLevel, 10) || 5;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        barcode: formData.barcode.trim() || undefined,
        category: formData.category,
        unit: formData.unit,
        purchasePrice,
        sellingPrice,
        quantity,
        minStockLevel,
        expiryDate: formData.expiryDate || undefined,
        batchNumber: formData.batchNumber || undefined,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name.trim(),
        barcode: formData.barcode.trim() || undefined,
        category: formData.category,
        unit: formData.unit,
        purchasePrice,
        sellingPrice,
        quantity,
        minStockLevel,
        expiryDate: formData.expiryDate || undefined,
        batchNumber: formData.batchNumber || undefined,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmRestock = () => {
    if (!restockingProduct) return;
    const qty = parseInt(restockQty, 10);
    if (!isNaN(qty) && qty > 0) {
      restockProduct(restockingProduct.id, qty);
    }
    setRestockingProduct(null);
    setRestockQty('10');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── HEADER & ADD BUTTON ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.products}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage inventory catalog, cost margins, barcodes and expiration dates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Webcam Quick Scanner */}
          <button
            onClick={() => setIsWebcamScannerOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
            title="Scan barcode with camera to find or manage item"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Scan Webcam</span>
          </button>

          {/* Barcode Generator & Printer */}
          <button
            onClick={() => {
              setBarcodeTargetProduct(null);
              setIsBarcodeGeneratorOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
            title="Generate & print barcode stickers for your products"
          >
            <Barcode className="w-4 h-4 text-blue-600" />
            <span>Generate Stickers</span>
          </button>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addProduct}</span>
          </button>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">{t.totalItems}</p>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1">
            {products.length} Products
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{products.reduce((a, b) => a + b.quantity, 0)} total stock units</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">{t.stockValue}</p>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalStockCostValue)}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Selling: {formatCurrency(totalStockSellingValue)}
          </p>
        </div>

        <div
          onClick={() => setStockStatusFilter(stockStatusFilter === 'low' ? 'all' : 'low')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition cursor-pointer ${
            stockStatusFilter === 'low'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400'
          }`}
        >
          <p className="text-xs font-bold text-amber-600 uppercase">{t.lowStock}</p>
          <h3 className="text-lg lg:text-xl font-black text-amber-600 mt-1">
            {lowStockCount + outOfStockCount} Items
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{outOfStockCount} out of stock</p>
        </div>

        <div
          onClick={() => setStockStatusFilter(stockStatusFilter === 'expiring' ? 'all' : 'expiring')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition cursor-pointer ${
            stockStatusFilter === 'expiring'
              ? 'border-red-500 ring-2 ring-red-500/20 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-400'
          }`}
        >
          <p className="text-xs font-bold text-red-600 uppercase">{t.expiringSoon}</p>
          <h3 className="text-lg lg:text-xl font-black text-red-600 mt-1">
            {expiringCount} Items
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Expiring within 30 days</p>
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchProducts}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Stock Status Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'low', label: 'Low Stock' },
              { id: 'out', label: 'Out of Stock' },
              { id: 'expiring', label: 'Expiring Soon' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStockStatusFilter(f.id as typeof stockStatusFilter)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition ${
                  stockStatusFilter === f.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? t.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS TABLE / GRID ────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">{t.productName}</th>
                <th className="p-4">{t.category}</th>
                <th className="p-4">{t.costPrice}</th>
                <th className="p-4">{t.sellingPrice}</th>
                <th className="p-4">{t.profitMargin}</th>
                <th className="p-4">{t.currentStock}</th>
                <th className="p-4">{t.expiryDate}</th>
                <th className="p-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const margin = p.sellingPrice - p.purchasePrice;
                  const marginPercent = p.purchasePrice > 0 ? ((margin / p.purchasePrice) * 100).toFixed(0) : '0';
                  const isLow = p.quantity <= p.minStockLevel && p.quantity > 0;
                  const isOut = p.quantity <= 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                    >
                      {/* Name & Barcode */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {p.barcode ? (
                            <span className="flex items-center gap-0.5 font-mono">
                              <Barcode className="w-3 h-3" /> {p.barcode}
                            </span>
                          ) : (
                            <span>No Barcode</span>
                          )}
                          {p.batchNumber && <span>• Batch: {p.batchNumber}</span>}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          {p.category}
                        </span>
                      </td>

                      {/* Cost Price */}
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        {formatCurrency(p.purchasePrice)}
                      </td>

                      {/* Selling Price */}
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(p.sellingPrice)}
                      </td>

                      {/* Margin */}
                      <td className="p-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          +{formatCurrency(margin)} ({marginPercent}%)
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              isOut
                                ? 'bg-red-100 dark:bg-red-950 text-red-600'
                                : isLow
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : `${p.quantity} ${p.unit}`}
                          </span>
                          <button
                            onClick={() => setRestockingProduct(p)}
                            title="Restock this item"
                            className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition opacity-0 group-hover:opacity-100"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {p.expiryDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{p.expiryDate}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setBarcodeTargetProduct(p);
                              setIsBarcodeGeneratorOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Generate / Print Barcode Sticker"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD / EDIT PRODUCT MODAL ─────────────────────────── */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product' : t.addProduct}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Basmati Rice 25kg"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Barcode (Scan / Generate)
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="890..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Groceries">Groceries (किराना)</option>
                    <option value="Dairy">Dairy & Milk (दूध/दही)</option>
                    <option value="Beverages">Beverages & Cold Drinks</option>
                    <option value="Snacks">Snacks & Noodles (चाउचाउ)</option>
                    <option value="Bakery">Bakery & Biscuits</option>
                    <option value="Cosmetics">Cosmetics & Personal Care</option>
                    <option value="General">General / Others</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cost Price (Purchase Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="e.g. 2400"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="e.g. 2750"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Min Stock Alert
                  </label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="pieces">Pieces (Pcs)</option>
                    <option value="kg">Kilogram (Kg)</option>
                    <option value="liter">Liter (Ltr)</option>
                    <option value="packet">Packet (Pkt)</option>
                    <option value="box">Box / Carton</option>
                    <option value="dozen">Dozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Batch Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="e.g. BATCH-2026"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESTOCK MODAL ────────────────────────────────────── */}
      {restockingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Restock Item
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Adding new stock units for <span className="font-bold text-slate-800 dark:text-slate-200">{restockingProduct.name}</span>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Quantity to Add ({restockingProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setRestockingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRestock}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Confirm Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── BARCODE GENERATOR & PRINT MODAL ─────────────────── */}
      <BarcodeGeneratorModal
        isOpen={isBarcodeGeneratorOpen}
        onClose={() => {
          setIsBarcodeGeneratorOpen(false);
          setBarcodeTargetProduct(null);
        }}
        initialProduct={barcodeTargetProduct}
      />

      {/* ── WEBCAM SCANNER MODAL ─────────────────────────────── */}
      <ContinuousBarcodeScanner
        isOpen={isWebcamScannerOpen}
        onClose={() => setIsWebcamScannerOpen(false)}
        onProductScanned={(prod) => {
          setIsWebcamScannerOpen(false);
          handleOpenEditModal(prod);
        }}
      />
    </div>
  );
};
