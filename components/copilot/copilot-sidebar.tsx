"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Plane,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

interface CopilotSidebarProps {
  activeTab: 'chat' | 'dashboard' | 'expenses' | 'trips' | 'pricing';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'expenses' | 'trips' | 'pricing') => void;
}

export const CopilotSidebar: React.FC<CopilotSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0d0c0f] text-zinc-900 dark:text-zinc-100 p-4 pb-12 justify-between transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-20 items-center' : 'w-64'
      }`}
    >
      <div className="space-y-6 w-full">
        {/* Brand Logo & Sidebar Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-1`}>
          {isCollapsed ? (
            /* When minimized: NO ARROW BUTTON. Clicking the bold red S logo opens/expands the sidebar */
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-9 h-9 rounded-xl bg-[#ff3b30] text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-500/30 hover:scale-110 transition-transform cursor-pointer shrink-0 font-sans"
                title="Click Logo to Expand Sidebar"
              >
                S
              </button>
          ) : (
            /* When expanded: Non-clickable Bold Red S Logo + Spendly text + ChevronLeft minimize button */
            <>
              <div className="flex items-center gap-2.5 shrink-0 select-none">
                <div className="w-8 h-8 rounded-xl bg-[#ff3b30] text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-500/30 shrink-0 font-sans">
                S
              </div>
              <span className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Spendly
              </span>
            </div>

              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                title="Minimize Sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1 w-full">
          {!isCollapsed && (
            <div className="px-3 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              MAIN MENU
            </div>
          )}
          
          <nav className="space-y-1 pt-1 w-full">
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              title={isCollapsed ? "Dashboard" : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold shadow-xs border border-rose-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            {/* 2. AI Copilot */}
            <button
              onClick={() => setActiveTab('chat')}
              title={isCollapsed ? "AI Copilot" : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold shadow-xs border border-rose-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>AI Copilot</span>}
            </button>

            {/* 3. Expenses */}
            <button
              onClick={() => setActiveTab('expenses')}
              title={isCollapsed ? "Expenses" : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                activeTab === 'expenses'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold shadow-xs border border-rose-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Receipt className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Expenses</span>}
            </button>

            {/* 4. Trips */}
            <button
              onClick={() => setActiveTab('trips')}
              title={isCollapsed ? "Trips" : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                activeTab === 'trips'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold shadow-xs border border-rose-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Plane className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Trips</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Area: Return to Home Option & Pro Banner */}
      <div className="space-y-2.5 w-full mt-6">
        {/* Return to Home Menu Option */}
        <Link
          href="/"
          title={isCollapsed ? "Return to Home" : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'p-2.5' : 'px-3 py-2'} text-xs font-semibold text-rose-500 dark:text-rose-400 transition-transform duration-200 hover:scale-105 group cursor-pointer`}
        >
          {isCollapsed ? (
            <ArrowLeft className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          ) : (
            <span className="group-hover:underline">Return to Home</span>
          )}
        </Link>

        {/* Bottom Pro Banner */}
        {!isCollapsed ? (
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1c1622] via-[#15121b] to-[#100e14] border border-rose-500/30 shadow-xl shadow-rose-950/30 text-left space-y-2.5 w-full">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Unlock Pro Features</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
              Export custom PDF reports, multi-trip analytics & receipt scanning.
            </p>
            <button
              onClick={() => setActiveTab('pricing')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/40 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('pricing')}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-rose-900/40 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
            title="Upgrade to Pro"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
