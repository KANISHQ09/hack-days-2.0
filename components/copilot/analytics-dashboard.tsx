"use client";

import React from 'react';
import { useCopilot } from '@/lib/context/copilot-context';
import { convertCurrency, formatCurrencyAmount } from '@/lib/services/currency-service';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart as PieChartIcon,
  Globe,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#ef4444', // Red
  Hotel: '#f59e0b', // Amber
  Transportation: '#3b82f6', // Blue
  Shopping: '#8b5cf6', // Purple
  Activities: '#ec4899', // Pink
  Flights: '#06b6d4', // Cyan
  Medical: '#10b981', // Emerald
  Communication: '#6366f1', // Indigo
  Miscellaneous: '#64748b', // Slate
};

export const AnalyticsDashboard: React.FC = () => {
  const {
    expenses,
    activeTrip,
    reportingCurrency,
    exchangeRates,
    getTripBudgetSummary,
  } = useCopilot();

  const tripExpenses = expenses.filter((e) => !activeTrip || e.tripId === activeTrip.id);
  const budgetSummary = getTripBudgetSummary();

  const totalSpentInReporting = tripExpenses.reduce((sum, e) => {
    return sum + convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
  }, 0);

  const categoryMap: Record<string, number> = {};
  tripExpenses.forEach((e) => {
    const converted = convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
    categoryMap[e.category] = (categoryMap[e.category] || 0) + converted;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    color: CATEGORY_COLORS[name] || '#64748b',
  }));

  const countryMap: Record<string, number> = {};
  tripExpenses.forEach((e) => {
    const converted = convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
    countryMap[e.country] = (countryMap[e.country] || 0) + converted;
  });

  const countryData = Object.entries(countryMap)
    .map(([country, amount]) => ({
      country,
      amount: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  const dailyMap: Record<string, number> = {};
  tripExpenses.forEach((e) => {
    const converted = convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
    dailyMap[e.date] = (dailyMap[e.date] || 0) + converted;
  });

  const dailyData = Object.entries(dailyMap)
    .map(([date, amount]) => ({
      date: date.substring(5),
      amount: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const daysCount = Math.max(1, new Set(tripExpenses.map((e) => e.date)).size);
  const avgDailySpend = totalSpentInReporting / daysCount;
  const topCategoryEntry = categoryData.sort((a, b) => b.value - a.value)[0];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-6 text-zinc-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Financial Intelligence</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Live FX: {reportingCurrency}
            </span>
          </h1>
          <p className="text-sm text-zinc-400">
            Real-time multi-currency aggregated insights for <span className="font-medium text-white">{activeTrip?.name || 'Active Trip'}</span>
          </p>
        </div>
      </div>

      {/* Budget Warning Banner */}
      {budgetSummary && (() => {
        const convertedDailyActual = convertCurrency(budgetSummary.dailySpendingRateActual, budgetSummary.budgetCurrency, reportingCurrency, exchangeRates);
        const convertedDailyTarget = convertCurrency(budgetSummary.dailySpendingRateTarget, budgetSummary.budgetCurrency, reportingCurrency, exchangeRates);
        const convertedProjected = convertCurrency(budgetSummary.projectedEndSpend, budgetSummary.budgetCurrency, reportingCurrency, exchangeRates);
        const convertedRemaining = convertCurrency(budgetSummary.remainingInBudgetCurrency, budgetSummary.budgetCurrency, reportingCurrency, exchangeRates);

        return (
          <div
            className={`p-4 rounded-2xl border transition-all ${
              budgetSummary.isOverBudgetRisk
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {budgetSummary.isOverBudgetRisk ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-sm">
                    {budgetSummary.isOverBudgetRisk
                      ? 'Proactive Budget Warning: Overspend Pace Detected'
                      : 'Budget On Track: Spending Pace Healthy'}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    Actual Rate: <strong>{reportingCurrency} {convertedDailyActual.toFixed(2)}/day</strong> vs Target: <strong>{reportingCurrency} {convertedDailyTarget.toFixed(2)}/day</strong>.
                    Projected End Spend: <strong>{reportingCurrency} {convertedProjected.toFixed(2)}</strong>.
                  </p>
                </div>
              </div>

              <div className="sm:w-48 shrink-0 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Spent: {budgetSummary.percentSpent}%</span>
                  <span>Remaining: {reportingCurrency} {convertedRemaining.toFixed(0)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      budgetSummary.percentSpent > 90 ? 'bg-red-500' : budgetSummary.percentSpent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, budgetSummary.percentSpent)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Trip Spend</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-white">
              {reportingCurrency} {totalSpentInReporting.toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Converted at live exchange rates</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Daily Average Pace</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-white">
              {reportingCurrency} {avgDailySpend.toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Across {daysCount} active travel days</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Transactions Recorded</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-white">
              {tripExpenses.length}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Stored in original currencies</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Top Spend Category</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <PieChartIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-white truncate">
              {topCategoryEntry ? topCategoryEntry.name : 'N/A'}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {topCategoryEntry ? `${reportingCurrency} ${topCategoryEntry.value.toFixed(2)}` : 'No expenses'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-rose-500" /> Category Breakdown
            </h3>
            <span className="text-xs text-zinc-500">In {reportingCurrency}</span>
          </div>

          {categoryData.length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${reportingCurrency} ${val.toFixed(2)}`, 'Spend']}
                    contentStyle={{ backgroundColor: '#18151f', borderColor: '#3f3f46', borderRadius: '12px', color: '#ffffff' }}
                    itemStyle={{ color: '#ffffff', fontWeight: '600' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-zinc-500">
              No category data recorded yet.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-800">
            {categoryData.map((cat) => {
              const pct = totalSpentInReporting > 0 ? ((cat.value / totalSpentInReporting) * 100).toFixed(0) : '0';
              return (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-zinc-400 truncate">{cat.name}</span>
                  <span className="font-semibold text-white font-mono ml-auto">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> Cross-Country Spending
            </h3>
            <span className="text-xs text-zinc-500">Sorted by highest spend</span>
          </div>

          {countryData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} margin={{ top: 10, right: 15, left: 15, bottom: 0 }}>
                  <XAxis dataKey="country" stroke="#71717a" fontSize={12} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    formatter={(val: number) => [`${reportingCurrency} ${val.toFixed(2)}`, 'Country Total']}
                    contentStyle={{ backgroundColor: '#18151f', borderColor: '#3f3f46', borderRadius: '12px', color: '#ffffff' }}
                    itemStyle={{ color: '#ffffff', fontWeight: '600' }}
                    labelStyle={{ color: '#a1a1aa' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {countryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="#ef4444"
                        className="transition-all duration-300 hover:brightness-125 cursor-pointer"
                        style={{
                          filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))',
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-zinc-500">
              No country data available.
            </div>
          )}
        </div>
      </div>

      {/* Daily Spend Line Chart */}
      <div className="p-5 rounded-2xl bg-[#131116] border border-zinc-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" /> Daily Spending Timeline
          </h3>
          <span className="text-xs text-zinc-500">In {reportingCurrency}</span>
        </div>

        {dailyData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 15, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  cursor={{ stroke: 'rgba(244, 63, 94, 0.4)', strokeDasharray: '3 3' }}
                  formatter={(val: number) => [`${reportingCurrency} ${val.toFixed(2)}`, 'Daily Total']}
                  contentStyle={{ backgroundColor: '#18151f', borderColor: '#3f3f46', borderRadius: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff', fontWeight: '600' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-zinc-500">
            No daily activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
