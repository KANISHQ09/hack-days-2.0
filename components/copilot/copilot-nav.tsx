"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useCopilot } from '@/lib/context/copilot-context';
import { SUPPORTED_CURRENCIES } from '@/lib/services/currency-service';
import {
  MessageSquare,
  BarChart3,
  Receipt,
  Plane,
  ChevronDown,
  Sparkles,
  Plus,
  RefreshCw,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeft,
  ArrowRight,
  Globe,
} from 'lucide-react';

interface CopilotNavProps {
  activeTab: 'chat' | 'dashboard' | 'expenses' | 'trips' | 'pricing';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'expenses' | 'trips' | 'pricing') => void;
  onOpenNewTripModal: () => void;
}

export const CopilotNav: React.FC<CopilotNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTripModal,
}) => {
  const {
    trips,
    activeTrip,
    setActiveTripId,
    reportingCurrency,
    setReportingCurrency,
    resetTrialData,
  } = useCopilot();

  const [isTripMenuOpen, setIsTripMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeCurrencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === reportingCurrency) || SUPPORTED_CURRENCIES[0];

  const handleMobileNavClick = (tab: 'chat' | 'dashboard' | 'expenses' | 'trips' | 'pricing') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0d0c0f]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Left: Mobile Brand & Active Trip Selector */}
          <div className="flex items-center gap-3">
            {/* Mobile Brand (Visible on mobile/tablet) */}
            <Link href="/" className="lg:hidden flex items-center gap-2 cursor-pointer" title="Go to Home Page">
              <div className="w-7 h-7 rounded-xl bg-[#ff3b30] text-white font-black text-base flex items-center justify-center shadow-xs shrink-0 font-sans">
                S
              </div>
              <span className="text-lg font-medium tracking-tight text-white hidden xs:inline">
                Spendly
              </span>
            </Link>

            {/* Trip Selector Dropdown Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTripMenuOpen(!isTripMenuOpen);
                  setIsCurrencyMenuOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 rounded-full border border-zinc-800 bg-[#151318] hover:bg-[#1c1921] text-xs sm:text-sm font-medium text-zinc-100 transition-colors shadow-xs cursor-pointer"
              >
                <Plane className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="max-w-[70px] xs:max-w-[110px] sm:max-w-[200px] truncate">
                  {activeTrip?.name || 'Select Trip'}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
              </button>

              {isTripMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 max-w-[90vw] rounded-2xl border border-zinc-800 bg-[#141217] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Select Active Trip
                  </div>
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => {
                        setActiveTripId(trip.id);
                        setIsTripMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-zinc-800/60 transition-colors cursor-pointer ${
                        trip.id === activeTrip?.id
                          ? 'bg-rose-500/10 text-rose-400 font-semibold'
                          : 'text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{trip.name}</span>
                      {trip.countries && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {trip.countries.length} countries
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-zinc-800 my-1.5"></div>
                  <button
                    onClick={() => {
                      setIsTripMenuOpen(false);
                      onOpenNewTripModal();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-400 flex items-center gap-2 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create New Trip
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Utilities: Currency Selector, Notifications, Guest Avatar & Hamburger Button */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Dynamic Reporting Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                  setIsTripMenuOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-full border border-zinc-800 bg-[#151318] hover:bg-[#1c1921] text-xs font-semibold text-zinc-200 transition-colors shadow-xs cursor-pointer"
                title="Change Reporting Currency"
              >
                <span>{reportingCurrency} <span className="hidden xs:inline">({activeCurrencyInfo.symbol})</span></span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto scrollbar-thin rounded-2xl border border-zinc-800 bg-[#141217] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Reporting Currency
                  </div>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setReportingCurrency(curr.code);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-zinc-800/60 transition-colors cursor-pointer ${
                        curr.code === reportingCurrency
                          ? 'bg-rose-500/10 text-rose-400 font-semibold'
                          : 'text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <span>{curr.name}</span>
                      </span>
                      <span className="font-mono text-zinc-500">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Icon */}
            <button
              onClick={() => alert('Notifications: All trip budgets normal.')}
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-full hover:bg-zinc-800/60 cursor-pointer hidden xs:block"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Guest Trial Avatar Pill */}
            <button
              onClick={() => setActiveTab('pricing')}
              className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#151318] hover:bg-zinc-800 border border-zinc-800 text-xs transition-colors cursor-pointer"
              title="View Subscription Plans & Billing"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-bold text-[10px]">
                GT
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-zinc-200 text-[11px]">Guest</span>
                <span className="text-[9px] text-rose-400">Trial</span>
              </div>
            </button>

            {/* Top Right Responsive Hamburger Menu Button (Mobile & Tablet only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-200 hover:text-white bg-[#151318] hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer shadow-xs shrink-0"
              title="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5 text-zinc-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Slide-Out Navigation Menu Drawer (Rendered via React Portal at document.body level for unconstrained 100vh height) */}
      {isMobileMenuOpen && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex justify-end animate-in fade-in duration-200">
          <div className="w-full sm:w-[420px] max-w-full h-full h-[100dvh] bg-[#131116] border-l border-zinc-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 text-white overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Header & Close Button */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ff3b30] text-white font-black text-xl flex items-center justify-center shadow-md font-sans">
                    S
                  </div>
                  <span className="text-xl font-bold text-white">Spendly AI</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-6 h-6 text-rose-500" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="space-y-2">
                <div className="px-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  NAVIGATION MENU
                </div>

                <button
                  onClick={() => handleMobileNavClick('dashboard')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md'
                      : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick('chat')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md'
                      : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>AI Copilot</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick('expenses')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                    activeTab === 'expenses'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md'
                      : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Receipt className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Expense Ledger</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick('trips')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                    activeTab === 'trips'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md'
                      : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Plane className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Trip Manager</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick('pricing')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md'
                      : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Plans & Billing</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              {/* Return to Home Menu Option */}
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:underline transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-rose-400" />
                <span>Return to Home</span>
              </Link>

              {/* Upgrade Banner in Drawer */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1c1622] via-[#15121b] to-[#100e14] border border-rose-500/30 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Unlock Pro Features</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Get unlimited voice entry, receipt scanning & PDF reports.
                </p>
                <button
                  onClick={() => handleMobileNavClick('pricing')}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Upgrade Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
