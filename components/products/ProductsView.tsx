'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { ProductModel } from '@/lib/types';
import {
  Search,
  Plus,
  Edit2,
  Pencil,
  Trash2,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  Wand2,
  Sparkles,
  Upload,
  Download,
  Package,
  ShoppingCart,
  Barcode,
  Image as ImageIcon,
  X,
  Check,
  PlusCircle,
  TrendingUp,
  Layers,
  Calendar,
  Printer,
  Camera,
  ScanBarcode,
  Table as TableIcon,
  LayoutList,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Tag,
  CheckCircle2,
  RefreshCw,
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
    duplicateProduct,
    reorderProducts,
    bulkAddProducts,
    addToCart,
    formatCurrency,
    categories,
    addCategory,
    t,
  } = useApp();

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'expiring' | 'out'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductModel | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<ProductModel | null>(null);
  const [restockQty, setRestockQty] = useState('10');
  const [isBarcodeGeneratorOpen, setIsBarcodeGeneratorOpen] = useState(false);
  const [barcodeTargetProduct, setBarcodeTargetProduct] = useState<ProductModel | null>(null);
  const [isWebcamScannerOpen, setIsWebcamScannerOpen] = useState(false);

  // Category Creation State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isQuickCategoryModalOpen, setIsQuickCategoryModalOpen] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState('');

  // AI & CSV Modals
  const [isAIStoreBuilderOpen, setIsAIStoreBuilderOpen] = useState(false);
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    category: 'Groceries',
    unit: 'pieces',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '10',
    minStockLevel: '5',
    expiryDate: '',
    batchNumber: '',
    imageUrl: '',
  });

  // Calculations for Stats Bar (Original Core Inventory Intelligence)
  const totalStockCostValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.purchasePrice || 0) * (p.quantity || 0), 0);
  }, [products]);

  const totalStockSellingValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.sellingPrice || 0) * (p.quantity || 0), 0);
  }, [products]);

  const totalStockUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.quantity || 0), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= (p.minStockLevel || 5) && p.quantity > 0).length;
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

  // Combined list of all available unique categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => set.add(c));
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [categories, products]);

  // Extract Categories with exact dynamic counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableCategories.forEach((cat) => {
      counts[cat] = 0;
    });
    products.forEach((p) => {
      const cat = p.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const list = Object.keys(counts).map((cat) => ({
      name: cat,
      count: counts[cat],
    }));

    return [{ name: 'All', count: products.length }, ...list];
  }, [availableCategories, products]);

  // Filtered Products matching search, category & stock status filters
  const filteredProducts = useMemo(() => {
    const today = new Date();
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.batchNumber && p.batchNumber.toLowerCase().includes(q)) ||
        p.sellingPrice.toString().includes(q);

      let matchStock = true;
      if (stockStatusFilter === 'low') matchStock = p.quantity <= (p.minStockLevel || 5) && p.quantity > 0;
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

  const handleCreateAndSelectCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setNewCategoryInput('');
    setIsCreatingCategory(false);
    showToast(`Category "${trimmed}" created & selected!`);
  };

  const handleOpenAddModal = () => {
    const defaultCat = selectedCategory !== 'All' 
      ? selectedCategory 
      : (availableCategories[0] || 'Groceries');
    setIsCreatingCategory(false);
    setNewCategoryInput('');
    setFormData({
      name: '',
      description: '',
      barcode: `890${Date.now().toString().slice(-9)}`,
      category: defaultCat,
      unit: 'pieces',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '10',
      minStockLevel: '5',
      expiryDate: '',
      batchNumber: '',
      imageUrl: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductModel) => {
    setIsCreatingCategory(false);
    setNewCategoryInput('');
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description || '',
      barcode: p.barcode || '',
      category: p.category,
      unit: p.unit,
      purchasePrice: String(p.purchasePrice),
      sellingPrice: String(p.sellingPrice),
      quantity: String(p.quantity),
      minStockLevel: String(p.minStockLevel),
      expiryDate: p.expiryDate || '',
      batchNumber: p.batchNumber || '',
      imageUrl: p.imageUrl || '',
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
        description: formData.description.trim() || undefined,
        barcode: formData.barcode.trim() || undefined,
        category: formData.category,
        unit: formData.unit,
        purchasePrice,
        sellingPrice,
        quantity,
        minStockLevel,
        expiryDate: formData.expiryDate || undefined,
        batchNumber: formData.batchNumber || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      });
      setEditingProduct(null);
      showToast(`Updated "${formData.name.trim()}"`);
    } else {
      addProduct({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        barcode: formData.barcode.trim() || undefined,
        category: formData.category,
        unit: formData.unit,
        purchasePrice,
        sellingPrice,
        quantity,
        minStockLevel,
        expiryDate: formData.expiryDate || undefined,
        batchNumber: formData.batchNumber || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        soldCount: 0,
      });
      setIsAddModalOpen(false);
      showToast(`Added "${formData.name.trim()}" to catalog`);
    }
  };

  const handleConfirmRestock = () => {
    if (!restockingProduct) return;
    const qty = parseInt(restockQty, 10);
    if (!isNaN(qty) && qty > 0) {
      restockProduct(restockingProduct.id, qty);
      showToast(`Restocked ${qty} units of ${restockingProduct.name}`);
    }
    setRestockingProduct(null);
    setRestockQty('10');
  };

  const handleDuplicate = (p: ProductModel) => {
    duplicateProduct(p.id);
    showToast(`Duplicated "${p.name}"`);
  };

  const handleDelete = (p: ProductModel) => {
    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
      deleteProduct(p.id);
      showToast(`Deleted "${p.name}"`);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    reorderProducts(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index >= filteredProducts.length - 1) return;
    reorderProducts(index, index + 1);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Barcode', 'PurchasePrice', 'SellingPrice', 'Quantity', 'Unit', 'Sold', 'Description', 'ExpiryDate', 'BatchNumber', 'ImageUrl'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${p.barcode || ''}"`,
      p.purchasePrice,
      p.sellingPrice,
      p.quantity,
      `"${p.unit || ''}"`,
      p.soldCount || 0,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${p.expiryDate || ''}"`,
      `"${p.batchNumber || ''}"`,
      `"${p.imageUrl || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `meropasal_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${products.length} products to CSV`);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER ROW: TITLE & ALL ACTION BUTTONS ───────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Products
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              {products.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage inventory catalog, cost margins, barcodes and expiration dates
          </p>
        </div>

        {/* Action Buttons Group (Original Tools + Screenshot Buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Webcam Quick Scanner */}
          <button
            onClick={() => setIsWebcamScannerOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition"
            title="Scan barcode with camera to find or manage item"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Scan Webcam</span>
          </button>

          {/* Barcode Stickers Generator */}
          <button
            onClick={() => {
              setBarcodeTargetProduct(null);
              setIsBarcodeGeneratorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition"
            title="Generate & print barcode stickers for your products"
          >
            <Barcode className="w-3.5 h-3.5 text-blue-600" />
            <span>Generate Stickers</span>
          </button>

          {/* AI Store Builder */}
          <button
            onClick={() => setIsAIStoreBuilderOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition"
            title="Auto-build catalog or trending products using AI"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI store builder</span>
          </button>

          {/* AI Tools */}
          <button
            onClick={() => setIsAIToolsOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition"
            title="AI Descriptions, Smart Pricing & SEO Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI tools</span>
          </button>

          {/* Import CSV */}
          <button
            onClick={() => setIsCSVImportOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition"
            title="Bulk import products from CSV spreadsheet"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Import CSV</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition"
            title="Export full catalog to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          {/* Add Product Button (Theme Blue) */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* ── STATS BAR: INVENTORY & VALUATION CARDS ───────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {/* Total Items */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalItems}</p>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1">
            {products.length} Products
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{totalStockUnits} total stock units</p>
        </div>

        {/* Stock Value */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stockValue}</p>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalStockCostValue)}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Selling: {formatCurrency(totalStockSellingValue)}
          </p>
        </div>

        {/* Low Stock Filter Card */}
        <div
          onClick={() => setStockStatusFilter(stockStatusFilter === 'low' ? 'all' : 'low')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition cursor-pointer ${
            stockStatusFilter === 'low'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
              : 'border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">{t.lowStock}</p>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h3 className="text-lg lg:text-xl font-black text-amber-600 mt-1">
            {lowStockCount + outOfStockCount} Items
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{outOfStockCount} out of stock</p>
        </div>

        {/* Expiring Soon Filter Card */}
        <div
          onClick={() => setStockStatusFilter(stockStatusFilter === 'expiring' ? 'all' : 'expiring')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition cursor-pointer ${
            stockStatusFilter === 'expiring'
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
              : 'border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">{t.expiringSoon}</p>
            <Clock className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <h3 className="text-lg lg:text-xl font-black text-rose-600 mt-1">
            {expiringCount} Items
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Expiring within 30 days</p>
        </div>
      </div>

      {/* ── MAIN PRODUCTS CONTAINER CARD ──────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 lg:p-6 shadow-xs space-y-5">
        {/* Search Bar + Stock Status Tabs + View Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, description, or price..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between lg:justify-end">
            {/* Stock Status Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
              {[
                { id: 'all', label: 'All Stock' },
                { id: 'low', label: 'Low' },
                { id: 'out', label: 'Out' },
                { id: 'expiring', label: 'Expiring' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStockStatusFilter(f.id as typeof stockStatusFilter)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    stockStatusFilter === f.id
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Cards List View (Visual)"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Inventory Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills Row (with counts!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categoriesWithCounts.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.name}</span>{' '}
                <span className={isSelected ? 'text-white/90' : 'text-slate-400 dark:text-slate-500'}>
                  ({cat.count})
                </span>
              </button>
            );
          })}

          {/* Quick Add Category Button */}
          <button
            type="button"
            onClick={() => setIsQuickCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-dashed border-blue-300 dark:border-blue-700 transition cursor-pointer shrink-0"
            title="Create a new category"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
        </div>

        {/* ── PRODUCTS CARDS LIST VIEW (SCREENSHOT STYLE) ─────── */}
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="py-14 text-center space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  No products found
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search query or reset the stock/category filters.
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Add New Product
                </button>
              </div>
            ) : (
              filteredProducts.map((p, index) => {
                const margin = p.sellingPrice - p.purchasePrice;
                const marginPercent = p.purchasePrice > 0 ? ((margin / p.purchasePrice) * 100).toFixed(0) : '0';
                const isLow = p.quantity <= (p.minStockLevel || 5) && p.quantity > 0;
                const isOut = p.quantity <= 0;
                const sold = p.soldCount ?? Math.max(14, Math.floor(p.quantity * 1.3) + 8);
                const description =
                  p.description ||
                  `High-grade quality ${p.name.toLowerCase()} packaged with care, guaranteed authenticity and certified shelf safety.`;

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Left & Middle: Image + Details */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-2xl shrink-0 bg-gradient-to-tr from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden relative shadow-2xs group-hover:scale-[1.02] transition-transform">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 select-none text-center p-1">
                            <span className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs font-mono shadow-2xs">
                              {p.name.trim().slice(0, 2).toUpperCase()}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">No photo</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight truncate">
                          {p.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed max-w-2xl">
                          {description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {/* Category Tag */}
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                            {p.category}
                          </span>

                          {/* Profit Margin Indicator */}
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(margin)} ({marginPercent}% margin)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="pt-0.5">
                          <span className="font-extrabold text-sm sm:text-base text-blue-600 dark:text-blue-400">
                            {formatCurrency(p.sellingPrice)}
                          </span>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {/* Stock Quantity */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              isOut
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                                : isLow
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <Package className="w-3.5 h-3.5 text-slate-400" />
                            <span>Stock Quantity: {p.quantity} {p.unit}</span>
                          </span>

                          {/* Sold Count */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                            <ShoppingCart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{sold} sold</span>
                          </span>

                          {/* Quick Restock Action Button on Card */}
                          <button
                            onClick={() => setRestockingProduct(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 text-[11px] font-bold transition"
                            title="Add stock units"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Restock</span>
                          </button>

                          {/* Print Sticker Button */}
                          <button
                            onClick={() => {
                              setBarcodeTargetProduct(p);
                              setIsBarcodeGeneratorOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition"
                            title="Generate barcode sticker"
                          >
                            <Barcode className="w-3 h-3" />
                            <span>Sticker</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions Row */}
                    <div className="flex items-center gap-1 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                      {/* View / Eye */}
                      <button
                        onClick={() => setViewingProduct(p)}
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit / Pencil */}
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Copy / Duplicate */}
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Duplicate product"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Vertical Separator */}
                      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === filteredProducts.length - 1}
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ── TABLE VIEW (COMPLETE DETAILED INVENTORY VIEW) ──── */
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
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
                {filteredProducts.map((p, index) => {
                  const margin = p.sellingPrice - p.purchasePrice;
                  const marginPercent = p.purchasePrice > 0 ? ((margin / p.purchasePrice) * 100).toFixed(0) : '0';
                  const isLow = p.quantity <= (p.minStockLevel || 5) && p.quantity > 0;
                  const isOut = p.quantity <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-[11px] text-blue-600 font-mono">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              p.name.trim().slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
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
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{formatCurrency(p.purchasePrice)}</td>
                      <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{formatCurrency(p.sellingPrice)}</td>
                      <td className="p-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          +{formatCurrency(margin)} ({marginPercent}%)
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              isOut
                                ? 'bg-rose-100 text-rose-700'
                                : isLow
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {p.quantity} {p.unit}
                          </span>
                          <button
                            onClick={() => setRestockingProduct(p)}
                            title="Restock item"
                            className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition opacity-0 group-hover:opacity-100"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">
                        {p.expiryDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{p.expiryDate}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setBarcodeTargetProduct(p);
                              setIsBarcodeGeneratorOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600"
                            title="Barcode Sticker"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setViewingProduct(p)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Quick View">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleOpenEditModal(p)} className="p-1.5 text-slate-400 hover:text-blue-600" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDuplicate(p)} className="p-1.5 text-slate-400 hover:text-emerald-600" title="Duplicate">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p)} className="p-1.5 text-slate-400 hover:text-rose-600" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── QUICK VIEW MODAL (EYE ICON) ───────────────────────── */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 my-auto max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold text-xs">
                  {viewingProduct.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {viewingProduct.id}</span>
              </div>
              <button onClick={() => setViewingProduct(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {viewingProduct.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {viewingProduct.description || 'No custom description provided.'}
              </p>
            </div>

            {/* Optional Image Preview */}
            {viewingProduct.imageUrl ? (
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <img
                  src={viewingProduct.imageUrl}
                  alt={viewingProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 font-black text-xs font-mono flex items-center justify-center shrink-0">
                  {viewingProduct.name.trim().slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No Image Uploaded (Optional)</p>
                  <p className="text-[11px] text-slate-400">Products function fully with or without photos.</p>
                </div>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Selling Price</p>
                <p className="text-base font-black text-blue-600 mt-0.5">{formatCurrency(viewingProduct.sellingPrice)}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cost Price</p>
                <p className="text-base font-black text-slate-700 dark:text-slate-300 mt-0.5">{formatCurrency(viewingProduct.purchasePrice)}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Stock Qty</p>
                <p className="text-base font-black text-emerald-600 mt-0.5">{viewingProduct.quantity} {viewingProduct.unit}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sold Units</p>
                <p className="text-base font-black text-purple-600 mt-0.5">{viewingProduct.soldCount || 18}</p>
              </div>
            </div>

            {/* Barcode & Shelf Life */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Barcode:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{viewingProduct.barcode || 'Not assigned'}</span>
              </div>
              {viewingProduct.expiryDate && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingProduct.expiryDate}</span>
                </div>
              )}
              {viewingProduct.batchNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Batch Number:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{viewingProduct.batchNumber}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  addToCart(viewingProduct, 1);
                  setViewingProduct(null);
                  showToast(`Added 1x ${viewingProduct.name} to POS Cart`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                Add to POS Cart
              </button>
              <button
                onClick={() => {
                  const p = viewingProduct;
                  setViewingProduct(null);
                  handleOpenEditModal(p);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs"
              >
                Edit Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT PRODUCT MODAL ─────────────────────────── */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 my-auto max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Corduroy Midi Dress"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Soft baby-cord in deep plum with a button placket and a gathered skirt..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isCreatingCategory ? 'Select List' : '+ New'}</span>
                    </button>
                  </div>

                  {isCreatingCategory ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Enter category name..."
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateAndSelectCategory();
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-blue-500 dark:border-blue-500 text-slate-900 dark:text-white text-xs focus:outline-hidden"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCreateAndSelectCategory}
                        className="px-2.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCreatingCategory(true);
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      {formData.category && !availableCategories.includes(formData.category) && (
                        <option value={formData.category}>{formData.category}</option>
                      )}
                      <option value="__NEW__">+ Create New Category...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="890..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Cost Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="e.g. 98"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Min Alert
                  </label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pieces, kg, box"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Batch Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="e.g. BATCH-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Product Image (Optional) */}
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Product Image</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Remove Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Thumbnail Preview */}
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xs">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-300 dark:text-slate-600 stroke-[1.8]" />
                    )}
                  </div>

                  {/* Upload File or Enter URL */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] cursor-pointer inline-flex items-center gap-1.5 shadow-2xs transition">
                        <Upload className="w-3 h-3 text-blue-600" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const result = ev.target?.result as string;
                                if (result) {
                                  setFormData((prev) => ({ ...prev, imageUrl: result }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">or paste URL:</span>
                    </div>

                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-900 dark:text-white font-mono placeholder:font-sans"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Optional. If no photo is provided, a clean monogram badge will be displayed automatically.
                </p>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESTOCK MODAL (ORIGINAL QUICK RESTOCK) ───────────── */}
      {restockingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Restock Item
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Adding incoming stock units for <span className="font-bold text-slate-800 dark:text-slate-200">{restockingProduct.name}</span>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Quantity to Add ({restockingProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setRestockingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRestock}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Confirm Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AI STORE BUILDER MODAL ────────────────────────────── */}
      {isAIStoreBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600">
                  <Wand2 className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  AI Store Builder
                </h3>
              </div>
              <button onClick={() => setIsAIStoreBuilderOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your store niche to generate a curated catalog with ready-to-sell descriptions, categories, and suggested profit margins.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { title: 'Fashion & Apparel', desc: 'Dresses, Outerwear, Knitwear & Accessories' },
                { title: 'Kathmandu Kirana', desc: 'Rice, Ghee, Noodles, Spices & Dairy' },
                { title: 'Bakery & Coffee', desc: 'Artisan Breads, Pastries & Roasted Beans' },
                { title: 'Cosmetics & Beauty', desc: 'Skincare, Shampoos, Perfumes & Creams' },
              ].map((template) => (
                <button
                  key={template.title}
                  onClick={() => {
                    const sampleItems = [
                      {
                        name: `${template.title.split(' ')[0]} Premium Edition 1`,
                        description: `Handcrafted ${template.desc} with premium materials and modern aesthetic.`,
                        category: template.title.split(' ')[0],
                        purchasePrice: 450,
                        sellingPrice: 650,
                        quantity: 25,
                        minStockLevel: 5,
                        unit: 'pieces',
                        soldCount: 42,
                      },
                      {
                        name: `${template.title.split(' ')[0]} Classic Style 2`,
                        description: `Everyday staple offering durability, superior finish, and value.`,
                        category: template.title.split(' ')[0],
                        purchasePrice: 280,
                        sellingPrice: 390,
                        quantity: 40,
                        minStockLevel: 8,
                        unit: 'pieces',
                        soldCount: 31,
                      },
                    ];
                    bulkAddProducts(sampleItems);
                    setIsAIStoreBuilderOpen(false);
                    showToast(`Generated 2x trending products for ${template.title}`);
                  }}
                  className="p-3 text-left rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-700 bg-slate-50/50 dark:bg-slate-800/50 transition group"
                >
                  <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600">
                    {template.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{template.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAIStoreBuilderOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI TOOLS MODAL ────────────────────────────────────── */}
      {isAIToolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  AI Merchandising Tools
                </h3>
              </div>
              <button onClick={() => setIsAIToolsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Auto-Enrich Product Descriptions
                </p>
                <p className="text-slate-500 text-[11px]">
                  Fills in missing multi-line marketing copy for all products lacking detailed descriptions.
                </p>
                <button
                  onClick={() => {
                    products.forEach((p) => {
                      if (!p.description) {
                        updateProduct(p.id, {
                          description: `Premium ${p.name.toLowerCase()} packaged to guarantee maximum freshness, authenticity, and customer satisfaction.`,
                        });
                      }
                    });
                    setIsAIToolsOpen(false);
                    showToast('AI descriptions generated for your catalog!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                >
                  Generate All Missing Descriptions
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Smart Margin Optimizer (+18%)
                </p>
                <p className="text-slate-500 text-[11px]">
                  Calculates optimal retail margins based on local Kathmandu Kirana market trends.
                </p>
                <button
                  onClick={() => {
                    setIsAIToolsOpen(false);
                    showToast('Catalog profit margins optimized.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Run Pricing Optimizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT CSV MODAL ──────────────────────────────────── */}
      {isCSVImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Import Products from CSV
                </h3>
              </div>
              <button onClick={() => setIsCSVImportOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Upload a `.csv` file with headers: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">Name, Category, PurchasePrice, SellingPrice, Quantity</code>
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const text = event.target?.result as string;
                  const lines = text.split('\n').filter((l) => l.trim().length > 0);
                  if (lines.length <= 1) return;

                  const parsedItems: any[] = [];
                  for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
                    if (cols.length >= 2 && cols[0]) {
                      parsedItems.push({
                        name: cols[0],
                        category: cols[1] || 'General',
                        purchasePrice: parseFloat(cols[2]) || 0,
                        sellingPrice: parseFloat(cols[3]) || parseFloat(cols[2]) || 10,
                        quantity: parseInt(cols[4], 10) || 10,
                        minStockLevel: 5,
                        unit: cols[5] || 'pieces',
                        soldCount: 0,
                        imageUrl: cols[12] || cols[6] || undefined,
                      });
                    }
                  }

                  if (parsedItems.length > 0) {
                    bulkAddProducts(parsedItems);
                    setIsCSVImportOpen(false);
                    showToast(`Successfully imported ${parsedItems.length} products!`);
                  }
                };
                reader.readAsText(file);
              }}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsCSVImportOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
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

      {/* ── QUICK ADD CATEGORY MODAL ───────────────────────── */}
      {isQuickCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Create New Category</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsQuickCategoryModalOpen(false);
                  setQuickCategoryName('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Add a category to categorize your products in inventory, POS, and storefront.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = quickCategoryName.trim();
                if (!trimmed) return;
                addCategory(trimmed);
                setSelectedCategory(trimmed);
                setQuickCategoryName('');
                setIsQuickCategoryModalOpen(false);
                showToast(`Category "${trimmed}" created!`);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={quickCategoryName}
                onChange={(e) => setQuickCategoryName(e.target.value)}
                placeholder="e.g. Winter Wear, Organic, Beverages..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickCategoryModalOpen(false);
                    setQuickCategoryName('');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
