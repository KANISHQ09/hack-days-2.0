"use client";

import React from 'react';
import { useCopilot } from '@/lib/context/copilot-context';
import { convertCurrency, formatCurrencyAmount } from '@/lib/services/currency-service';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Tag, MapPin, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#ef4444', // Red
  Hotel: '#f59e0b', // Amber
  Transportation: '#3b82f6', // Blue
  Shopping: '#8b5cf6', // Purple
  Activities: '#ec4899', // Pink
  Flights: '#06b6d4', // Cyan
  Medical: '#10b981', // Emerald
  Miscellaneous: '#64748b', // Slate
};

interface TripOverviewWidgetProps {
  onNavigateTab: (tab: 'chat' | 'dashboard' | 'expenses' | 'trips') => void;
}

export const TripOverviewWidget: React.FC<TripOverviewWidgetProps> = ({
  onNavigateTab,
}) => {
  const {
    expenses,
    activeTrip,
    reportingCurrency,
    exchangeRates,
    getTripBudgetSummary,
  } = useCopilot();

  const tripExpenses = expenses.filter((e) => !activeTrip || e.tripId === activeTrip.id);
  const budgetSummary = getTripBudgetSummary();

  // Total spent in reporting currency
  const totalSpentInReporting = tripExpenses.reduce((sum, e) => {
    return sum + convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
  }, 0);

  // Category map for donut chart
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

  const recentExpenses = tripExpenses.slice(0, 3);

  return (
    <div className="space-y-4 text-zinc-900 dark:text-zinc-100">
      
      {/* 1. Trip Overview Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131116] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Trip Overview
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Total Spent</span>
            <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {reportingCurrency} {totalSpentInReporting.toFixed(2)}
            </span>
          </div>

          {budgetSummary && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs">Remaining Budget</span>
              <span className={`font-bold font-mono ${budgetSummary.remainingInBudgetCurrency < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {budgetSummary.budgetCurrency} {budgetSummary.remainingInBudgetCurrency.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Daily Average</span>
            <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">
              {reportingCurrency} {(totalSpentInReporting / Math.max(1, new Set(tripExpenses.map((e) => e.date)).size)).toFixed(2)}
            </span>
          </div>

          {budgetSummary && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs">Days Remaining</span>
              <span className="font-semibold font-mono text-rose-500">
                {Math.max(0, budgetSummary.totalDays - budgetSummary.daysElapsed)} days
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Categories Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131116] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Top Categories
        </h3>

        {categoryData.length > 0 ? (
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={44}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${reportingCurrency} ${val.toFixed(2)}`, 'Spend']}
                    contentStyle={{ backgroundColor: '#18151f', borderColor: '#3f3f46', borderRadius: '10px', color: '#ffffff' }}
                    itemStyle={{ color: '#ffffff', fontWeight: '600' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-1 text-xs">
              {categoryData.slice(0, 4).map((cat) => {
                const pct = totalSpentInReporting > 0 ? Math.round((cat.value / totalSpentInReporting) * 100) : 0;
                return (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-zinc-600 dark:text-zinc-400 truncate">{cat.name}</span>
                    </span>
                    <span className="font-semibold font-mono text-zinc-800 dark:text-zinc-200">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 py-2">No category data yet.</p>
        )}
      </div>

      {/* 3. Recent Expenses Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131116] border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Recent Expenses
          </h3>
          <button
            onClick={() => onNavigateTab('expenses')}
            className="text-xs font-semibold text-rose-500 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="space-y-2.5">
          {recentExpenses.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {exp.merchant || exp.category}
                  </div>
                  <div className="text-[10px] text-zinc-400">{exp.country} • {exp.category}</div>
                </div>
              </div>

              <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0 ml-2">
                {formatCurrencyAmount(exp.originalAmount, exp.originalCurrency)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
