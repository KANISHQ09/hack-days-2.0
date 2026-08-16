export type ExpenseCategory =
  | 'Food'
  | 'Hotel'
  | 'Transportation'
  | 'Shopping'
  | 'Activities'
  | 'Flights'
  | 'Medical'
  | 'Communication'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  tripId: string;
  originalAmount: number;
  originalCurrency: string;
  category: ExpenseCategory;
  subcategory?: string;
  merchant?: string;
  country: string;
  date: string; // ISO string 'YYYY-MM-DD'
  time?: string;
  notes?: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'digital_wallet';
  receiptUrl?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  countries: string[];
  budgetAmount?: number;
  budgetCurrency?: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  extractedExpense?: Expense;
  actionType?: 'add_expense' | 'query' | 'modify' | 'delete' | 'budget_question' | 'clarification';
  clarificationField?: string;
  queryResults?: {
    expenses: Expense[];
    totalConverted: number;
    reportingCurrency: string;
    categoryTotals?: Record<string, number>;
    countryTotals?: Record<string, number>;
  };
}

export interface BudgetSummary {
  tripId: string;
  tripName: string;
  budgetAmount: number;
  budgetCurrency: string;
  reportingCurrency: string;
  totalSpentInReporting: number;
  totalSpentInBudgetCurrency: number;
  remainingInBudgetCurrency: number;
  percentSpent: number;
  daysElapsed: number;
  totalDays: number;
  dailySpendingRateActual: number;
  dailySpendingRateTarget: number;
  projectedEndSpend: number;
  isOverBudgetRisk: boolean;
}

export interface UserPreferences {
  homeCurrency: string;
  defaultReportingCurrency: string;
  isGuestTrial: boolean;
  trialExpensesLimit: number;
}
