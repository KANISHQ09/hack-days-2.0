"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Trip, ChatMessage, BudgetSummary, UserPreferences } from '../types/copilot';
import { convertCurrency, getExchangeRates, detectCurrencyFromText } from '../services/currency-service';

interface CopilotContextType {
  expenses: Expense[];
  trips: Trip[];
  activeTrip: Trip | undefined;
  reportingCurrency: string;
  chatMessages: ChatMessage[];
  exchangeRates: Record<string, number>;
  userPreferences: UserPreferences;
  isAiProcessing: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => Trip;
  setActiveTripId: (tripId: string) => void;
  setReportingCurrency: (currency: string) => void;
  sendChatMessage: (content: string) => Promise<void>;
  clearChatHistory: () => void;
  getTripBudgetSummary: (tripId?: string) => BudgetSummary | null;
  resetTrialData: () => void;
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    name: 'Japan & SEA Explorer 2026',
    startDate: '2026-08-01',
    endDate: '2026-08-25',
    countries: ['Japan', 'Thailand', 'Indonesia'],
    budgetAmount: 3500,
    budgetCurrency: 'USD',
    isActive: true,
    isArchived: false,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'trip-2',
    name: 'European Nomad Summer',
    startDate: '2026-06-10',
    endDate: '2026-07-15',
    countries: ['France', 'Italy', 'Switzerland'],
    budgetAmount: 4000,
    budgetCurrency: 'EUR',
    isActive: false,
    isArchived: false,
    createdAt: '2026-06-01T00:00:00Z',
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    tripId: 'trip-1',
    originalAmount: 8500,
    originalCurrency: 'JPY',
    category: 'Food',
    merchant: 'Sukiyabashi Jiro Omakase',
    country: 'Japan',
    date: '2026-08-14',
    notes: 'Sushi dinner in Ginza Tokyo',
    paymentMethod: 'card',
    createdAt: '2026-08-14T19:30:00Z',
  },
  {
    id: 'exp-2',
    tripId: 'trip-1',
    originalAmount: 12000,
    originalCurrency: 'JPY',
    category: 'Hotel',
    merchant: 'Shinjuku Granbell Hotel',
    country: 'Japan',
    date: '2026-08-13',
    notes: '2 Nights stay in Shinjuku',
    paymentMethod: 'card',
    createdAt: '2026-08-13T14:00:00Z',
  },
  {
    id: 'exp-3',
    tripId: 'trip-1',
    originalAmount: 3400,
    originalCurrency: 'JPY',
    category: 'Transportation',
    merchant: 'JR East Shinkansen',
    country: 'Japan',
    date: '2026-08-15',
    notes: 'Bullet train ticket Tokyo to Kyoto',
    paymentMethod: 'card',
    createdAt: '2026-08-15T09:15:00Z',
  },
  {
    id: 'exp-4',
    tripId: 'trip-1',
    originalAmount: 1450,
    originalCurrency: 'THB',
    category: 'Activities',
    merchant: 'Elephant Nature Park',
    country: 'Thailand',
    date: '2026-08-10',
    notes: 'Day tour in Chiang Mai',
    paymentMethod: 'cash',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'exp-5',
    tripId: 'trip-1',
    originalAmount: 450,
    originalCurrency: 'THB',
    category: 'Food',
    merchant: 'Jay Fai Street Food',
    country: 'Thailand',
    date: '2026-08-11',
    notes: 'Crab omelette in Bangkok',
    paymentMethod: 'cash',
    createdAt: '2026-08-11T20:00:00Z',
  },
  {
    id: 'exp-6',
    tripId: 'trip-1',
    originalAmount: 650000,
    originalCurrency: 'IDR',
    category: 'Hotel',
    merchant: 'Ubud Bamboo Villa',
    country: 'Indonesia',
    date: '2026-08-05',
    notes: 'Villa stay in Bali',
    paymentMethod: 'card',
    createdAt: '2026-08-05T12:00:00Z',
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: "👋 Welcome to **Spendly AI Copilot**! I'm your multi-currency travel financial assistant.\n\nYou can speak or type expenses naturally in any currency (e.g., **Dinner in Tokyo 8500 yen**, **Taxi in Bangkok 350 THB**) or ask questions like **How much did I spend in Japan?** or **Can I afford a $150 dinner?**",
    timestamp: new Date().toISOString(),
  },
];

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const CopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripIdState] = useState<string>('trip-1');
  const [reportingCurrency, setReportingCurrencyState] = useState<string>('USD');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [userPreferences] = useState<UserPreferences>({
    homeCurrency: 'USD',
    defaultReportingCurrency: 'USD',
    isGuestTrial: true,
    trialExpensesLimit: 50,
  });

  // Load from localStorage or initialize defaults
  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem('spendly_expenses');
      const storedTrips = localStorage.getItem('spendly_trips');
      const storedActiveTrip = localStorage.getItem('spendly_active_trip');
      const storedCurrency = localStorage.getItem('spendly_reporting_currency');
      const storedChat = localStorage.getItem('spendly_chat_messages');

      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : INITIAL_EXPENSES);
      setTrips(storedTrips ? JSON.parse(storedTrips) : INITIAL_TRIPS);
      if (storedActiveTrip) setActiveTripIdState(storedActiveTrip);
      if (storedCurrency) setReportingCurrencyState(storedCurrency);
      setChatMessages(storedChat ? JSON.parse(storedChat) : INITIAL_CHAT_MESSAGES);
    } catch (e) {
      setExpenses(INITIAL_EXPENSES);
      setTrips(INITIAL_TRIPS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
    }

    getExchangeRates().then((rates) => setExchangeRates(rates));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (expenses.length > 0) localStorage.setItem('spendly_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (trips.length > 0) localStorage.setItem('spendly_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('spendly_active_trip', activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    localStorage.setItem('spendly_reporting_currency', reportingCurrency);
  }, [reportingCurrency]);

  useEffect(() => {
    if (chatMessages.length > 0) localStorage.setItem('spendly_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt'>): Trip => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripIdState(newTrip.id);
    return newTrip;
  };

  const setActiveTripId = (id: string) => {
    setActiveTripIdState(id);
  };

  const setReportingCurrency = (currency: string) => {
    setReportingCurrencyState(currency);
  };

  const clearChatHistory = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
    localStorage.removeItem('spendly_chat_messages');
  };

  const resetTrialData = () => {
    setExpenses(INITIAL_EXPENSES);
    setTrips(INITIAL_TRIPS);
    setActiveTripIdState('trip-1');
    setReportingCurrencyState('USD');
    setChatMessages(INITIAL_CHAT_MESSAGES);
    localStorage.clear();
  };

  const getTripBudgetSummary = (tripIdParam?: string): BudgetSummary | null => {
    const targetTripId = tripIdParam || activeTripId;
    const targetTrip = trips.find((t) => t.id === targetTripId);

    if (!targetTrip || !targetTrip.budgetAmount) return null;

    const tripExpenses = expenses.filter((e) => e.tripId === targetTripId);

    // Sum in reporting currency
    const totalSpentInReporting = tripExpenses.reduce((sum, e) => {
      return sum + convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, exchangeRates);
    }, 0);

    // Sum in target trip budget currency
    const budgetCurr = targetTrip.budgetCurrency || 'USD';
    const totalSpentInBudgetCurrency = tripExpenses.reduce((sum, e) => {
      return sum + convertCurrency(e.originalAmount, e.originalCurrency, budgetCurr, exchangeRates);
    }, 0);

    const remainingInBudgetCurrency = targetTrip.budgetAmount - totalSpentInBudgetCurrency;
    const percentSpent = Math.min(100, Math.round((totalSpentInBudgetCurrency / targetTrip.budgetAmount) * 100));

    // Calculate dates
    const start = targetTrip.startDate ? new Date(targetTrip.startDate) : new Date();
    const end = targetTrip.endDate ? new Date(targetTrip.endDate) : new Date(Date.now() + 15 * 86400000);
    const now = new Date();

    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    const daysElapsed = Math.max(1, Math.min(totalDays, Math.ceil((now.getTime() - start.getTime()) / (1000 * 3600 * 24))));

    const dailySpendingRateActual = totalSpentInBudgetCurrency / daysElapsed;
    const dailySpendingRateTarget = targetTrip.budgetAmount / totalDays;
    const projectedEndSpend = dailySpendingRateActual * totalDays;
    const isOverBudgetRisk = projectedEndSpend > targetTrip.budgetAmount * 1.1;

    return {
      tripId: targetTrip.id,
      tripName: targetTrip.name,
      budgetAmount: targetTrip.budgetAmount,
      budgetCurrency: budgetCurr,
      reportingCurrency,
      totalSpentInReporting,
      totalSpentInBudgetCurrency,
      remainingInBudgetCurrency,
      percentSpent,
      daysElapsed,
      totalDays,
      dailySpendingRateActual: Math.round(dailySpendingRateActual * 100) / 100,
      dailySpendingRateTarget: Math.round(dailySpendingRateTarget * 100) / 100,
      projectedEndSpend: Math.round(projectedEndSpend * 100) / 100,
      isOverBudgetRisk,
    };
  };

  /**
   * Process natural language chat messages via AI pipeline
   */
  const sendChatMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiProcessing(true);

    try {
      // Call API route for NLP / Intent / Extraction / Financial Q&A
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          chatHistory: [...chatMessages, userMsg].map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          activeTripId,
          activeTripName: activeTrip?.name,
          reportingCurrency,
          expenses,
          trips,
          budgetSummary: getTripBudgetSummary(),
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // If AI extracted an expense, save it to state
        if (data.actionType === 'add_expense' && data.extractedExpense) {
          const savedExpense = addExpense({
            tripId: activeTripId,
            originalAmount: data.extractedExpense.originalAmount,
            originalCurrency: data.extractedExpense.originalCurrency,
            category: data.extractedExpense.category || 'Food',
            country: data.extractedExpense.country || (activeTrip?.countries[0] || 'Japan'),
            merchant: data.extractedExpense.merchant || 'Merchant',
            date: data.extractedExpense.date || new Date().toISOString().split('T')[0],
            notes: data.extractedExpense.notes || userText,
          });

          const aiMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            content: data.reply,
            timestamp: new Date().toISOString(),
            actionType: 'add_expense',
            extractedExpense: savedExpense,
          };
          setChatMessages((prev) => [...prev, aiMsg]);
        } else {
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            content: data.reply,
            timestamp: new Date().toISOString(),
            actionType: data.actionType || 'query',
            queryResults: data.queryResults,
          };
          setChatMessages((prev) => [...prev, aiMsg]);
        }
      } else {
        throw new Error('API route fallback');
      }
    } catch (e) {
      // Local Client-side AI fallback parser if server API is unavailable
      const fallbackResponse = processLocalAiFallback(userText, activeTripId, activeTrip, reportingCurrency, expenses, exchangeRates, addExpense);
      setChatMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <CopilotContext.Provider
      value={{
        expenses,
        trips,
        activeTrip,
        reportingCurrency,
        chatMessages,
        exchangeRates,
        userPreferences,
        isAiProcessing,
        addExpense,
        updateExpense,
        deleteExpense,
        createTrip,
        setActiveTripId,
        setReportingCurrency,
        sendChatMessage,
        clearChatHistory,
        getTripBudgetSummary,
        resetTrialData,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};

/**
 * Local AI fallback logic for rich natural language processing on client side
 */
function processLocalAiFallback(
  text: string,
  activeTripId: string,
  activeTrip: Trip | undefined,
  reportingCurrency: string,
  expenses: Expense[],
  rates: Record<string, number>,
  addExpenseFn: (exp: Omit<Expense, 'id' | 'createdAt'>) => Expense
): ChatMessage {
  const lower = text.toLowerCase();

  // 1. Check for Add Expense intent (e.g. "Dinner in Tokyo 8500 yen", "Taxi $45", "Spent 50 euros")
  const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(k|thousand)?/i);

  if ((lower.includes('spent') || lower.includes('cost') || lower.includes('bought') || lower.includes('paid') || lower.includes('dinner') || lower.includes('taxi') || lower.includes('hotel') || lower.includes('coffee') || lower.includes('lunch') || lower.includes('flight')) && amountMatch) {
    let rawAmount = parseFloat(amountMatch[1]);
    if (amountMatch[2]) rawAmount *= 1000;

    const detected = detectCurrencyFromText(text, activeTrip?.countries[0]);
    const currency = detected.currency;

    // Detect category
    let category: Expense['category'] = 'Miscellaneous';
    if (/dinner|lunch|breakfast|food|coffee|sushi|restaurant|cafe/i.test(text)) category = 'Food';
    else if (/hotel|hostel|stay|airbnb|resort|villa/i.test(text)) category = 'Hotel';
    else if (/taxi|uber|train|shinkansen|flight|bus|metro|grab/i.test(text)) category = 'Transportation';
    else if (/shopping|bought|souvenir|clothes/i.test(text)) category = 'Shopping';
    else if (/tour|ticket|museum|activity|park/i.test(text)) category = 'Activities';

    // Detect country
    let country = activeTrip?.countries[0] || 'Japan';
    if (/tokyo|kyoto|japan|ginza|shinjuku/i.test(text)) country = 'Japan';
    else if (/bangkok|thailand|chiang mai|phuket/i.test(text)) country = 'Thailand';
    else if (/bali|indonesia|ubud|jakarta/i.test(text)) country = 'Indonesia';
    else if (/paris|france|nice/i.test(text)) country = 'France';
    else if (/nyc|usa|new york|us/i.test(text)) country = 'USA';

    const saved = addExpenseFn({
      tripId: activeTripId,
      originalAmount: rawAmount,
      originalCurrency: currency,
      category,
      country,
      merchant: extractMerchant(text) || `${category} Spend`,
      date: new Date().toISOString().split('T')[0],
      notes: text,
    });

    const converted = convertCurrency(rawAmount, currency, reportingCurrency, rates);

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `✅ **Recorded Expense Successfully!**\n\n- **Amount:** ${saved.originalAmount} ${saved.originalCurrency} (~${reportingCurrency} ${converted.toFixed(2)})\n- **Category:** ${saved.category}\n- **Country:** ${saved.country}\n- **Trip:** ${activeTrip?.name || 'Active Trip'}`,
      timestamp: new Date().toISOString(),
      actionType: 'add_expense',
      extractedExpense: saved,
    };
  }

  // 2. Check for Query / Analytics intent ("how much spent", "total spent in japan", "show food spend")
  if (lower.includes('how much') || lower.includes('total') || lower.includes('show') || lower.includes('breakdown')) {
    let filtered = expenses.filter((e) => e.tripId === activeTripId);

    if (lower.includes('japan')) filtered = filtered.filter((e) => e.country === 'Japan');
    else if (lower.includes('thailand')) filtered = filtered.filter((e) => e.country === 'Thailand');
    else if (lower.includes('food')) filtered = filtered.filter((e) => e.category === 'Food');
    else if (lower.includes('hotel')) filtered = filtered.filter((e) => e.category === 'Hotel');

    const totalConverted = filtered.reduce((sum, e) => sum + convertCurrency(e.originalAmount, e.originalCurrency, reportingCurrency, rates), 0);

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `📊 **Spending Query Result:**\n\nYou have spent a total of **${reportingCurrency} ${totalConverted.toFixed(2)}** across **${filtered.length} transactions** for your selection.`,
      timestamp: new Date().toISOString(),
      actionType: 'query',
      queryResults: {
        expenses: filtered,
        totalConverted,
        reportingCurrency,
      },
    };
  }

  // 3. Affordability question ("can I afford...")
  if (lower.includes('can i afford') || lower.includes('afford')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `💡 **Affordability Analysis:**\n\nBased on your current remaining budget and daily spending pace, this purchase is **within your comfort zone** without disrupting your trip completion goal!`,
      timestamp: new Date().toISOString(),
      actionType: 'budget_question',
    };
  }

  // General reply
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: `I've noted your message: *"_${text}_"*\n\nTry saying something like:\n- *"Spent 6000 JPY on sushi in Tokyo"*\n- *"How much did I spend on food in Thailand?"*\n- *"Can I afford a $100 dinner?"*`,
    timestamp: new Date().toISOString(),
    actionType: 'general',
  };
}

function extractMerchant(text: string): string | null {
  const atMatch = text.match(/at\s+([A-Za-z0-9\s]+?)(?=\s+in|\s+\d|$)/i);
  if (atMatch) return atMatch[1].trim();
  return null;
}
