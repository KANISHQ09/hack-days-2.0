"use client";

import React, { useState } from 'react';
import { CopilotProvider } from '@/lib/context/copilot-context';
import { CopilotSidebar } from '@/components/copilot/copilot-sidebar';
import { CopilotNav } from '@/components/copilot/copilot-nav';
import { ChatInterface } from '@/components/copilot/chat-interface';
import { TripOverviewWidget } from '@/components/copilot/trip-overview-widget';
import { AnalyticsDashboard } from '@/components/copilot/analytics-dashboard';
import { ExpenseLedger } from '@/components/copilot/expense-ledger';
import { TripManager } from '@/components/copilot/trip-manager';
import { PricingBillingView } from '@/components/copilot/pricing-billing-view';

export default function CopilotAppPage() {
  return (
    <CopilotProvider>
      <CopilotContent />
    </CopilotProvider>
  );
}

function CopilotContent() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'expenses' | 'trips' | 'pricing'>('dashboard');
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0a0d] text-zinc-100 flex font-sans antialiased selection:bg-rose-500/30 selection:text-rose-200">

      {/* 1. Left Fixed Sidebar for PC & Tablet (lg screens) */}
      <CopilotSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar Navigation */}
        <CopilotNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewTripModal={() => {
            setActiveTab('trips');
            setIsNewTripModalOpen(true);
          }}
        />

        {/* Main Tab Content Body */}
        <main className={`flex-1 ${activeTab === 'chat' ? 'p-2 sm:p-4 overflow-hidden flex flex-col min-h-0' : 'p-3 sm:p-5 lg:p-6 overflow-y-auto'}`}>
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col min-h-0">
              <ChatInterface />
            </div>
          )}

          {activeTab === 'dashboard' && <AnalyticsDashboard />}
          {activeTab === 'expenses' && <ExpenseLedger />}
          {activeTab === 'trips' && (
            <TripManager
              onOpenNewTripModal={() => setIsNewTripModalOpen(true)}
              isCreateModalOpen={isNewTripModalOpen}
              setIsCreateModalOpen={setIsNewTripModalOpen}
            />
          )}
          {activeTab === 'pricing' && (
            <PricingBillingView onBackToDashboard={() => setActiveTab('dashboard')} />
          )}
        </main>
      </div>
    </div>
  );
}
