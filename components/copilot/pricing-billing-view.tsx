"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Zap,
  Globe,
  Receipt,
  Download,
  Building,
} from 'lucide-react';

interface PricingBillingViewProps {
  onBackToDashboard: () => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'INR', symbol: '₹', rate: 83.5 },
  { code: 'JPY', symbol: '¥', rate: 155.0 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
];

export const PricingBillingView: React.FC<PricingBillingViewProps> = ({
  onBackToDashboard,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isAnnual, setIsAnnual] = useState(true);
  const [activePlan, setActivePlan] = useState('pro');

  const curr = CURRENCIES.find((c) => c.code === selectedCurrency) || CURRENCIES[0];

  const formatPrice = (usdAmount: number) => {
    if (usdAmount === 0) return 'Free';
    const converted = usdAmount * curr.rate;
    if (curr.code === 'JPY' || curr.code === 'INR') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  const plans = [
    {
      id: 'hobby',
      name: 'Hobby',
      tagline: 'Ideal for occasional solo travelers.',
      monthlyUsd: 0,
      annualUsd: 0,
      popular: false,
      features: [
        '1 Active Trip',
        'Up to 50 expenses / month',
        'Basic AI Text Chat Entry',
        'Standard FX Conversions',
        'Export to CSV',
      ],
      cta: 'Current Free Plan',
      isCurrent: true,
    },
    {
      id: 'pro',
      name: 'Pro Traveler',
      tagline: 'Best for frequent global travelers & nomads.',
      monthlyUsd: 6.99,
      annualUsd: 5.5,
      popular: true,
      features: [
        'Unlimited Active Trips & Expenses',
        'Voice Input & Hands-Free Entry',
        'Smart Receipt OCR Scanning',
        'Real-time Multi-Currency Conversion',
        'PDF Financial Reports & CSV Export',
        'Proactive Budget Overspend Alerts',
        'Priority Gemini AI Intelligence',
      ],
      cta: 'Upgrade to Pro',
      isCurrent: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'For corporate teams & travel managers.',
      monthlyUsd: 19.99,
      annualUsd: 15.99,
      popular: false,
      features: [
        'Everything in Pro Traveler',
        'Shared Multi-User Group Trips',
        'Admin Financial Dashboard',
        'Custom Expense Approval Workflows',
        'SSO & Dedicated Account Manager',
        'SLA 99.9% Uptime Guarantee',
      ],
      cta: 'Contact Sales',
      isCurrent: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-white">
      
      {/* Top Header with Back to Dashboard Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 font-sans">
              <Sparkles className="w-6 h-6 text-rose-500" /> Plans & Billing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Special Offer
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your subscription, change currency views, and download invoices
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700/80 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" /> Back to Dashboard
        </button>
      </div>

      {/* Current Active Plan Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181420] via-[#131116] to-[#181420] border border-rose-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Account Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active Trial
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Spendly Pro Trial Mode <span className="text-xs font-mono text-zinc-400">(Renews in 14 days)</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl">
            You are currently accessing all Pro features under the Guest Trial mode. Upgrade to keep unlimited receipt scanning, live FX conversions, and PDF reports forever.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-zinc-400">Payment Method</div>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5 justify-end">
              <CreditCard className="w-4 h-4 text-rose-400" /> •••• 4242
            </div>
          </div>
        </div>
      </div>

      {/* Currency & Billing Period Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#131116] border border-zinc-800/80 max-w-full overflow-hidden">
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2.5 max-w-full overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-zinc-300">View Prices In:</span>
          </div>
          <div className="flex items-center gap-1 bg-[#18151f] p-1 rounded-xl border border-zinc-800 max-w-full overflow-x-auto [::-webkit-scrollbar]:hidden [scrollbar-width:none] shrink-0">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCurrency(c.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCurrency === c.code
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {c.code} ({c.symbol})
              </button>
            ))}
          </div>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-zinc-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-zinc-800 p-1 transition-colors relative cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-zinc-400'}`}>
            <span>Annual</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const priceUsd = isAnnual ? plan.annualUsd : plan.monthlyUsd;
          const formattedPrice = formatPrice(priceUsd);

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-rose-500/10 via-[#131116] to-[#131116] border-rose-500/60 shadow-2xl shadow-rose-950/40 ring-1 ring-rose-500/40'
                  : 'bg-[#131116] border-zinc-800/80 hover:border-zinc-700 shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md tracking-wider uppercase">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">{formattedPrice}</span>
                    {priceUsd > 0 && (
                      <span className="text-xs text-zinc-400 font-medium">
                        / month {isAnnual ? '(billed annually)' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-800">
                  <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Features included:</div>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setActivePlan(plan.id);
                    alert(`Selected ${plan.name}! Pro features activated.`);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-950/50 hover:scale-[1.02] active:scale-95'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/80'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice & Billing History Section */}
      <div className="p-6 rounded-2xl bg-[#131116] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-rose-500" /> Billing History & Invoices
          </h3>
          <span className="text-xs text-zinc-400">All invoices sent to guest@spendly.ai</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-800 uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              <tr className="hover:bg-[#18151f]">
                <td className="py-3 px-3 text-zinc-400 font-mono">2026-08-01</td>
                <td className="py-3 px-3 font-semibold text-white">Spendly Pro Trial Activation</td>
                <td className="py-3 px-3 font-mono text-zinc-300">$0.00 USD</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Paid
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => alert('Downloading invoice PDF...')}
                    className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
