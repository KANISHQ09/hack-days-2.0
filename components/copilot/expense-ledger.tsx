"use client";

import React, { useState } from 'react';
import { useCopilot } from '@/lib/context/copilot-context';
import { Expense, ExpenseCategory } from '@/lib/types/copilot';
import { convertCurrency, formatCurrencyAmount, SUPPORTED_CURRENCIES } from '@/lib/services/currency-service';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Tag,
  MapPin,
  Calendar,
  X,
  Plus,
  ArrowUpDown,
} from 'lucide-react';

export const ExpenseLedger: React.FC = () => {
  const {
    expenses,
    reportingCurrency,
    exchangeRates,
    updateExpense,
    deleteExpense,
    addExpense,
    activeTrip,
  } = useCopilot();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for manual add/edit
  const [formAmount, setFormAmount] = useState<string>('');
  const [formCurrency, setFormCurrency] = useState<string>('USD');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Food');
  const [formCountry, setFormCountry] = useState<string>('Japan');
  const [formMerchant, setFormMerchant] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  const tripExpenses = expenses.filter((e) => !activeTrip || e.tripId === activeTrip.id);

  // Extract unique countries
  const countriesList = Array.from(new Set(tripExpenses.map((e) => e.country)));

  // Filtered List
  const filteredExpenses = tripExpenses.filter((exp) => {
    const matchesSearch =
      (exp.merchant && exp.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
    const matchesCountry = selectedCountry === 'ALL' || exp.country === selectedCountry;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredExpenses.length === 0) return;

    const headers = ['ID', 'Date', 'Merchant', 'Category', 'Country', 'Original Amount', 'Original Currency', `Converted Amount (${reportingCurrency})`, 'Notes'];
    const rows = filteredExpenses.map((e) => [
      e.id,
      e.date,
      `"${e.merchant || ''}"`,
      e.category,
      e.country,
      e.originalAmount,
      e.originalCurrency,
      convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates),
      `"${e.notes || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Spendly_Expenses_${activeTrip?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setFormAmount(exp.originalAmount.toString());
    setFormCurrency(exp.originalCurrency);
    setFormCategory(exp.category);
    setFormCountry(exp.country);
    setFormMerchant(exp.merchant || '');
    setFormNotes(exp.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    updateExpense(editingExpense.id, {
      originalAmount: parseFloat(formAmount) || 0,
      originalCurrency: formCurrency,
      category: formCategory,
      country: formCountry,
      merchant: formMerchant,
      notes: formNotes,
    });

    setEditingExpense(null);
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || parseFloat(formAmount) <= 0) return;

    addExpense({
      tripId: activeTrip?.id || 'trip-1',
      originalAmount: parseFloat(formAmount),
      originalCurrency: formCurrency,
      category: formCategory,
      country: formCountry,
      merchant: formMerchant || 'Manual Entry',
      notes: formNotes,
    });
    setIsAddModalOpen(false);
    setFormAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Expense Ledger ({filteredExpenses.length})
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Immutable multi-currency transaction history for <span className="font-semibold text-rose-400">{activeTrip?.name || 'Active Trip'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormAmount('');
              setFormCurrency(reportingCurrency);
              setFormCountry(activeTrip?.countries[0] || 'Japan');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
          
          <button
            onClick={handleExportCsv}
            disabled={filteredExpenses.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18151f] hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, category, country, or notes..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-zinc-800 bg-[#131116] text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-sans"
          />
        </div>

        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 bg-[#131116] text-white focus:outline-none focus:border-rose-500 font-sans"
        >
          <option value="ALL" className="bg-[#141217] text-white">All Categories</option>
          <option value="Food" className="bg-[#141217] text-white">Food</option>
          <option value="Hotel" className="bg-[#141217] text-white">Hotel</option>
          <option value="Transportation" className="bg-[#141217] text-white">Transportation</option>
          <option value="Shopping" className="bg-[#141217] text-white">Shopping</option>
          <option value="Activities" className="bg-[#141217] text-white">Activities</option>
          <option value="Flights" className="bg-[#141217] text-white">Flights</option>
          <option value="Medical" className="bg-[#141217] text-white">Medical</option>
          <option value="Miscellaneous" className="bg-[#141217] text-white">Miscellaneous</option>
        </select>

        {/* Country Filter Dropdown */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 bg-[#131116] text-white focus:outline-none focus:border-rose-500 font-sans"
        >
          <option value="ALL" className="bg-[#141217] text-white">All Countries</option>
          {countriesList.map((c) => (
            <option key={c} value={c} className="bg-[#141217] text-white">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Card List View (Visible on mobile screens) */}
      <div className="block md:hidden space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((exp) => {
            const converted = convertCurrency(exp.originalAmount, exp.originalCurrency, reportingCurrency, exchangeRates);
            return (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-md space-y-2 text-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {exp.merchant || 'Expense'}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400">{exp.date}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-rose-400">
                      {reportingCurrency} {converted.toFixed(2)}
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      {formatCurrencyAmount(exp.originalAmount, exp.originalCurrency)}
                    </div>
                  </div>
                </div>

                {exp.notes && (
                  <p className="text-xs text-zinc-400 line-clamp-2">{exp.notes}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 font-medium text-[11px]">
                      {exp.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 font-medium text-[11px]">
                      {exp.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this expense?')) deleteExpense(exp.id);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-zinc-400 bg-[#131116] rounded-2xl border border-zinc-800">
            No matching expenses found.
          </div>
        )}
      </div>

      {/* Desktop Expenses Table Container (Hidden on mobile) */}
      <div className="hidden md:block bg-[#131116] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#18151f] text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Merchant & Notes</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 text-right">Original Amount</th>
                <th className="py-3.5 px-4 text-right">Reporting Amount ({reportingCurrency})</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-sm">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => {
                  const converted = convertCurrency(exp.originalAmount, exp.originalCurrency, reportingCurrency, exchangeRates);
                  return (
                    <tr key={exp.id} className="hover:bg-[#1a1820] transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-zinc-400 font-mono">
                        {exp.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {exp.merchant || 'Expense'}
                        </div>
                        {exp.notes && (
                          <div className="text-xs text-zinc-400 truncate max-w-xs">{exp.notes}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700/60 text-zinc-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700/60 text-zinc-200">
                          {exp.country}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-zinc-300">
                        {formatCurrencyAmount(exp.originalAmount, exp.originalCurrency)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-rose-400">
                        {reportingCurrency} {converted.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(exp)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this expense?')) deleteExpense(exp.id);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-zinc-400">
                    No matching expenses found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141217] border border-zinc-800 rounded-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Expense</h3>
              <button onClick={() => setEditingExpense(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Amount</label>
                <input
                  type="number"
                  step="any"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Currency</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#141217] text-white">
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Food" className="bg-[#141217] text-white">Food</option>
                    <option value="Hotel" className="bg-[#141217] text-white">Hotel</option>
                    <option value="Transportation" className="bg-[#141217] text-white">Transportation</option>
                    <option value="Shopping" className="bg-[#141217] text-white">Shopping</option>
                    <option value="Activities" className="bg-[#141217] text-white">Activities</option>
                    <option value="Flights" className="bg-[#141217] text-white">Flights</option>
                    <option value="Medical" className="bg-[#141217] text-white">Medical</option>
                    <option value="Miscellaneous" className="bg-[#141217] text-white">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Country</label>
                <input
                  type="text"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Merchant</label>
                <input
                  type="text"
                  value={formMerchant}
                  onChange={(e) => setFormMerchant(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141217] border border-zinc-800 rounded-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Amount</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 6000"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Currency</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#141217] text-white">
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Food" className="bg-[#141217] text-white">Food</option>
                    <option value="Hotel" className="bg-[#141217] text-white">Hotel</option>
                    <option value="Transportation" className="bg-[#141217] text-white">Transportation</option>
                    <option value="Shopping" className="bg-[#141217] text-white">Shopping</option>
                    <option value="Activities" className="bg-[#141217] text-white">Activities</option>
                    <option value="Flights" className="bg-[#141217] text-white">Flights</option>
                    <option value="Medical" className="bg-[#141217] text-white">Medical</option>
                    <option value="Miscellaneous" className="bg-[#141217] text-white">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="e.g. Japan"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Merchant</label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo Ramen House"
                  value={formMerchant}
                  onChange={(e) => setFormMerchant(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-md transition-all"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
