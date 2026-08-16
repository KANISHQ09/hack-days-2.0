"use client";

import React, { useState } from 'react';
import { useCopilot } from '@/lib/context/copilot-context';
import { SUPPORTED_CURRENCIES, convertCurrency } from '@/lib/services/currency-service';
import {
  Plane,
  Plus,
  Calendar,
  Globe,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  PieChart,
} from 'lucide-react';

interface TripManagerProps {
  onOpenNewTripModal: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const TripManager: React.FC<TripManagerProps> = ({
  onOpenNewTripModal,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const {
    trips,
    activeTrip,
    setActiveTripId,
    createTrip,
    expenses,
    reportingCurrency,
    exchangeRates,
  } = useCopilot();

  const [name, setName] = useState('');
  const [countriesText, setCountriesText] = useState('Japan, Thailand');
  const [budgetAmount, setBudgetAmount] = useState('3500');
  const [budgetCurrency, setBudgetCurrency] = useState('USD');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-20');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const countries = countriesText.split(',').map((c) => c.trim()).filter(Boolean);

    createTrip({
      name,
      countries: countries.length > 0 ? countries : ['Japan'],
      budgetAmount: budgetAmount ? parseFloat(budgetAmount) : undefined,
      budgetCurrency,
      startDate,
      endDate,
      isActive: true,
      isArchived: false,
    });

    setIsCreateModalOpen(false);
    setName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 font-sans">
            <Plane className="w-6 h-6 text-rose-500" /> Trip Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Organize multi-currency expenses into dedicated trip budgets and dates
          </p>
        </div>

        <button
          onClick={onOpenNewTripModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40 transition-all w-fit cursor-pointer hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create New Trip
        </button>
      </div>

      {/* Trips Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => {
          const isActive = trip.id === activeTrip?.id;
          const tripExpenses = expenses.filter((e) => e.tripId === trip.id);

          const totalSpentInReporting = tripExpenses.reduce((sum, e) => {
            return sum + convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
          }, 0);

          const budgetCurr = trip.budgetCurrency || 'USD';
          const totalSpentInBudgetCurrency = tripExpenses.reduce((sum, e) => {
            return sum + convertCurrency(e.originalAmount, e.originalCurrency, budgetCurr, exchangeRates);
          }, 0);

          const pctSpent = trip.budgetAmount
            ? Math.min(100, Math.round((totalSpentInBudgetCurrency / trip.budgetAmount) * 100))
            : 0;

          return (
            <div
              key={trip.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-rose-500/10 via-[#131116] to-[#131116] border-rose-500/60 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/40'
                  : 'bg-[#131116] border-zinc-800/80 hover:border-zinc-700 shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Status Badge & Name */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg text-white leading-snug">
                    {trip.name}
                  </h3>
                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveTripId(trip.id)}
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 border border-zinc-700/60"
                    >
                      Make Active
                    </button>
                  )}
                </div>

                {/* Date & Countries */}
                <div className="space-y-1.5 text-xs text-zinc-400">
                  {trip.startDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{trip.startDate} to {trip.endDate || 'Ongoing'}</span>
                    </div>
                  )}
                  {trip.countries && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Globe className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      {trip.countries.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-md bg-zinc-800/90 border border-zinc-700/60 text-zinc-200 font-medium text-xs"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Spending Stats */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-zinc-400">Total Spent:</span>
                    <span className="font-bold text-sm text-white font-mono">
                      {reportingCurrency} {totalSpentInReporting.toFixed(2)}
                    </span>
                  </div>

                  {trip.budgetAmount && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-zinc-300">
                        <span>Budget Progress: {pctSpent}%</span>
                        <span>{trip.budgetCurrency} {trip.budgetAmount}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pctSpent > 90
                              ? 'bg-red-500'
                              : pctSpent > 75
                              ? 'bg-amber-500'
                              : 'bg-gradient-to-r from-red-600 to-rose-500'
                          }`}
                          style={{ width: `${pctSpent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">{tripExpenses.length} transactions</span>
                {!isActive && (
                  <button
                    onClick={() => setActiveTripId(trip.id)}
                    className="font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Switch to Trip <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Trip Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141217] border border-zinc-800 rounded-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Trip</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Trip Name</label>
                <input
                  type="text"
                  placeholder="e.g. EuroTrip Summer 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Countries (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. France, Italy, Spain"
                  value={countriesText}
                  onChange={(e) => setCountriesText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Budget Amount</label>
                  <input
                    type="number"
                    placeholder="e.g. 4000"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Budget Currency</label>
                  <select
                    value={budgetCurrency}
                    onChange={(e) => setBudgetCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#141217] text-white">
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-[#1a1820] text-white focus:border-rose-500 focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-md transition-all"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
