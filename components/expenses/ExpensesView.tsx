'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { ExpenseModel } from '@/lib/types';
import { Plus, Trash2, Calendar, Tag, Wallet, ArrowDownRight, Layers, FileText } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, formatCurrency, t } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Tea & Refreshments' as ExpenseModel['category'],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const categories: ExpenseModel['category'][] = [
    'Rent',
    'Electricity & Water',
    'Salary',
    'Transport',
    'Tea & Refreshments',
    'Maintenance',
    'Miscellaneous',
  ];

  // Calculations
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, e) => acc + e.amount, 0);
  }, [expenses]);

  const thisMonthExpenses = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses
      .filter((e) => e.date.startsWith(currentMonth))
      .reduce((acc, e) => acc + e.amount, 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => selectedCategory === 'All' || e.category === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedCategory]);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (!formData.title.trim() || isNaN(amount) || amount <= 0) return;

    addExpense({
      title: formData.title.trim(),
      amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes.trim() || undefined,
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      amount: '',
      category: 'Tea & Refreshments',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.expenses}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log shop utilities, rent, staff snacks, and operational costs
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addExpense}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">{t.monthlyExpenses}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(thisMonthExpenses)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Current month shop expenditures</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">All Time Total Expenses</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalExpenses)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{expenses.length} Total records</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
          Expense Entries ({filteredExpenses.length})
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No expenses recorded in this category.
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{exp.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{exp.category}</span>
                      <span>•</span>
                      <span>{exp.date}</span>
                      {exp.notes && <span>• {exp.notes}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-red-600">
                    -{formatCurrency(exp.amount)}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete expense "${exp.title}"?`)) deleteExpense(exp.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              {t.addExpense}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Expense Title / Purpose *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Shop Electricity Bill"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Expense Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseModel['category'] })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes / Details
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Paid online via eSewa"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
