"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

interface CurrencyOption {
  code: string;
  symbol: string;
  rate: number;
}

const currencies: CurrencyOption[] = [
  { code: "USD", symbol: "$", rate: 1.0 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "INR", symbol: "₹", rate: 83.5 },
  { code: "JPY", symbol: "¥", rate: 155 },
  { code: "AUD", symbol: "A$", rate: 1.52 },
];

export function PricingSection() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencies[0]);
  const [isAnnual, setIsAnnual] = useState(false);

  // Base USD monthly prices according to PRD docs:
  // Hobby: Free $0 | Pro: $6.99/mo ($5.50/mo annual) | Enterprise: $19.99/mo ($15.99/mo annual)
  const calculatePrice = (baseUsdMonthly: number) => {
    if (baseUsdMonthly === 0) return `${selectedCurrency.symbol}0`;
    const monthlyRate = isAnnual ? baseUsdMonthly * 0.8 : baseUsdMonthly;
    const converted = monthlyRate * selectedCurrency.rate;
    
    if (selectedCurrency.code === "INR" || selectedCurrency.code === "JPY") {
      return `${selectedCurrency.symbol}${Math.round(converted)}`;
    }
    return `${selectedCurrency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <section id="pricing" className="py-24 px-6 bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-sans">
            Pick a pricing that <br /> fits your needs
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Every plan includes a free trial. Choose the one that fits your international travel needs.
          </p>

          {/* Interactive Controls: Currency Selector & Billing Cycle Toggle */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            
            {/* Currency Dropdown Selector */}
            <div className="flex items-center bg-[#18181b] border border-zinc-800 rounded-full p-1 shadow-lg max-w-full overflow-hidden">
              <span className="text-xs font-semibold px-2 text-zinc-400 hidden xs:inline shrink-0">Currency:</span>
              <div className="flex items-center gap-1 overflow-x-auto [::-webkit-scrollbar]:hidden [scrollbar-width:none] max-w-full shrink-0">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCurrency.code === curr.code
                        ? "bg-rose-500 text-white shadow-md shadow-rose-950/40"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {curr.code} ({curr.symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div className="flex items-center bg-[#18181b] border border-zinc-800 rounded-full p-1 shadow-lg">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !isAnnual
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isAnnual
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] uppercase tracking-wider font-extrabold">
                  20% OFF
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto pt-4">

          {/* 1. HOBBY / FREE PLAN CARD */}
          <div className="bg-[#121115] border border-zinc-800/90 rounded-3xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl">
            <div className="space-y-6">
              <div className="bg-[#1a1820] p-6 rounded-2xl border border-zinc-800/80 text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Hobby</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  For indie hackers and travelers trying out AI for the first time.
                </p>
              </div>

              <div className="pt-2 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight text-white">
                    {calculatePrice(0)}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    / Month
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium mt-1">
                  100% Free Forever • No credit card required
                </p>
              </div>

              <Link
                href="/app"
                className="w-full py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-bold transition-all flex items-center justify-center shadow-md active:scale-95"
              >
                Start a free trial
              </Link>

              <div className="pt-4 border-t border-zinc-800/80 space-y-3 text-left">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  HOBBY PLAN INCLUDES
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>1 Active Trip</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>50 Expenses</strong> per trip</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Text-only Natural Language Entry</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real-time FX Currency Conversion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic Category Analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>1 Member Seat</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. PRO FEATURED PLAN CARD */}
          <div className="bg-white text-zinc-900 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-rose-900/30 relative transform md:-translate-y-3 border-2 border-rose-500">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
              MOST POPULAR
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-left">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Pro</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  For travelers & nomads that need more power and AI voice flexibility.
                </p>
              </div>

              <div className="pt-2 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight text-zinc-900">
                    {calculatePrice(6.99)}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    / Month
                  </span>
                </div>
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {isAnnual ? "Billed annually (Save 20%)" : "Billed monthly"}
                </p>
              </div>

              <Link
                href="/app"
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-indigo-600 via-rose-600 to-red-600 hover:from-indigo-500 hover:to-red-500 text-white text-sm font-extrabold transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center active:scale-95"
              >
                Get started
              </Link>

              <div className="pt-4 border-t border-zinc-200 space-y-3 text-left">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  PRO PLAN INCLUDES
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-800">
                  <li className="flex items-center gap-2.5 font-bold text-zinc-900">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Unlimited Trips & Multi-Country Storage</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-bold text-zinc-900">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Unlimited Expense Logging</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>Voice Input AI Assistant</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>AI Receipt OCR Photo Scanning</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>PDF Report Export & CSV Downloads</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Predictive Budget Intelligence</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Priority Support & All AI Models</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. ENTERPRISE / TEAM PLAN CARD */}
          <div className="bg-[#121115] border border-zinc-800/90 rounded-3xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl">
            <div className="space-y-6">
              <div className="bg-[#1a1820] p-6 rounded-2xl border border-zinc-800/80 text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  For large organizations & travel teams with custom needs.
                </p>
              </div>

              <div className="pt-2 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight text-white">
                    {calculatePrice(19.99)}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {isAnnual ? "/ Year" : "/ Month"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium mt-1">
                  Custom team seats & group splitwise
                </p>
              </div>

              <Link
                href="/app"
                className="w-full py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-bold transition-all flex items-center justify-center shadow-md active:scale-95"
              >
                Contact sales
              </Link>

              <div className="pt-4 border-t border-zinc-800/80 space-y-3 text-left">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  ENTERPRISE PLAN INCLUDES
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span><strong>Everything in Pro</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Shared Group Trips & Bill Splitting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Multi-User Admin Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>SSO & SAML Security</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>White-label Reports & API Access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>24/7 Dedicated Account Manager</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
