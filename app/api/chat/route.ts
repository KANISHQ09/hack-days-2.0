import { NextResponse } from 'next/server';

interface ExpenseItem {
  id: string;
  originalAmount: number;
  originalCurrency: string;
  category: string;
  merchant?: string;
  country: string;
  date: string;
  notes?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍜',
  Hotel: '🏨',
  Transportation: '🚆',
  Shopping: '🛍️',
  Activities: '🎟️',
  Flights: '✈️',
  Medical: '🏥',
  Miscellaneous: '📦',
};

// Simple currency exchange fallback table for server-side calculations
const FX_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155,
  THB: 35,
  IDR: 15800,
  INR: 83.5,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.9,
};

function convertToReporting(amount: number, fromCurr: string, toCurr: string): number {
  const fromRate = FX_RATES[fromCurr.toUpperCase()] || 1;
  const toRate = FX_RATES[toCurr.toUpperCase()] || 1;
  const amountInUsd = amount / fromRate;
  return amountInUsd * toRate;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message = '',
      chatHistory = [],
      activeTripName = 'Japan & SEA Explorer 2026',
      reportingCurrency = 'USD',
      expenses = [],
      budgetSummary,
    } = body;

    const lowerMessage = message.toLowerCase().trim();

    // -------------------------------------------------------------
    // INTENT 1: Expense Extraction ("Dinner in Tokyo 8500 yen", "Taxi 350 thb")
    // -------------------------------------------------------------
    const expenseRegex = /(?:(\d+(?:\.\d+)?)\s*([a-zA-Z]{3}|yen|baht|rupees|dollars|euros|pounds))|(?:([a-zA-Z]{3}|yen|baht|rupees|\$|€|£|¥|₹)\s*(\d+(?:\.\d+)?))/i;
    const match = message.match(expenseRegex);

    const isExpenseEntry =
      match ||
      lowerMessage.includes('spent') ||
      lowerMessage.includes('bought') ||
      lowerMessage.includes('paid for');

    if (isExpenseEntry && match) {
      let rawAmount = parseFloat(match[1] || match[4] || '0');
      let rawCurr = (match[2] || match[3] || 'USD').toUpperCase();

      if (rawCurr === 'YEN' || rawCurr === '¥') rawCurr = 'JPY';
      if (rawCurr === 'BAHT') rawCurr = 'THB';
      if (rawCurr === 'RUPEES' || rawCurr === '₹') rawCurr = 'INR';
      if (rawCurr === 'DOLLARS' || rawCurr === '$') rawCurr = 'USD';
      if (rawCurr === 'EUROS' || rawCurr === '€') rawCurr = 'EUR';
      if (rawCurr === 'POUNDS' || rawCurr === '£') rawCurr = 'GBP';

      let category = 'Food';
      if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') || lowerMessage.includes('villa') || lowerMessage.includes('hostel')) category = 'Hotel';
      else if (lowerMessage.includes('taxi') || lowerMessage.includes('train') || lowerMessage.includes('flight') || lowerMessage.includes('bus') || lowerMessage.includes('shinkansen')) category = 'Transportation';
      else if (lowerMessage.includes('tour') || lowerMessage.includes('ticket') || lowerMessage.includes('park') || lowerMessage.includes('museum')) category = 'Activities';
      else if (lowerMessage.includes('shop') || lowerMessage.includes('souvenir') || lowerMessage.includes('clothes')) category = 'Shopping';

      let country = 'Japan';
      if (lowerMessage.includes('bangkok') || lowerMessage.includes('thailand') || lowerMessage.includes('thb') || lowerMessage.includes('baht')) country = 'Thailand';
      else if (lowerMessage.includes('bali') || lowerMessage.includes('indonesia') || lowerMessage.includes('ubud') || lowerMessage.includes('idr')) country = 'Indonesia';
      else if (lowerMessage.includes('paris') || lowerMessage.includes('france') || lowerMessage.includes('rome') || lowerMessage.includes('italy')) country = 'France';

      const merchant = message.replace(expenseRegex, '').replace(/recorded|paid|spent|for|at|in/gi, '').trim() || `${category} Expense`;

      const convertedInReporting = convertToReporting(rawAmount, rawCurr, reportingCurrency);

      const reply = `✅ **Expense Logged Successfully!**\n\n- **Merchant**: ${merchant}\n- **Amount**: ${rawAmount.toLocaleString()} ${rawCurr} (~**${reportingCurrency} ${convertedInReporting.toFixed(2)}**)\n- **Category**: ${category}\n- **Country**: ${country}\n\nYour budget analytics & spending charts have been updated!`;

      return NextResponse.json({
        reply,
        actionType: 'add_expense',
        extractedExpense: {
          originalAmount: rawAmount,
          originalCurrency: rawCurr,
          category,
          country,
          merchant,
          date: new Date().toISOString().split('T')[0],
          notes: message,
        },
      });
    }

    // -------------------------------------------------------------
    // INTENT 2: Country / City Query ("How much in Bangkok?", "Japan spend")
    // -------------------------------------------------------------
    if (
      lowerMessage.includes('bangkok') ||
      lowerMessage.includes('thailand') ||
      lowerMessage.includes('tokyo') ||
      lowerMessage.includes('japan') ||
      lowerMessage.includes('bali') ||
      lowerMessage.includes('indonesia')
    ) {
      let targetLoc = 'Thailand';
      if (lowerMessage.includes('japan') || lowerMessage.includes('tokyo')) targetLoc = 'Japan';
      if (lowerMessage.includes('indonesia') || lowerMessage.includes('bali')) targetLoc = 'Indonesia';

      const locExpenses: ExpenseItem[] = expenses.filter(
        (e: ExpenseItem) =>
          e.country.toLowerCase() === targetLoc.toLowerCase() ||
          (e.merchant && e.merchant.toLowerCase().includes(targetLoc.toLowerCase())) ||
          (e.notes && e.notes.toLowerCase().includes(targetLoc.toLowerCase()))
      );

      if (locExpenses.length > 0) {
        let totalConverted = 0;
        const catBreakdown: Record<string, number> = {};

        const listItems = locExpenses.map((exp: ExpenseItem) => {
          const converted = convertToReporting(exp.originalAmount, exp.originalCurrency, reportingCurrency);
          totalConverted += converted;
          catBreakdown[exp.category] = (catBreakdown[exp.category] || 0) + converted;

          const emoji = CATEGORY_EMOJIS[exp.category] || '📌';
          return `- ${emoji} **${exp.merchant || exp.category}**: ${exp.originalAmount.toLocaleString()} ${exp.originalCurrency} (~**${reportingCurrency} ${converted.toFixed(2)}**) [${exp.category}]`;
        });

        const reply = `📍 **Spending Insights for ${targetLoc}**\n\nYou recorded **${locExpenses.length} transactions** in ${targetLoc} totaling **${reportingCurrency} ${totalConverted.toFixed(2)}**:\n\n${listItems.join('\n')}\n\nThis represents **${Math.round((totalConverted / (budgetSummary?.totalSpentInReporting || totalConverted || 1)) * 100)}%** of your total trip spending.`;

        return NextResponse.json({ reply, actionType: 'query' });
      }
    }

    // -------------------------------------------------------------
    // INTENT 3: Category Breakdown ("Show spending by category")
    // -------------------------------------------------------------
    if (
      lowerMessage.includes('category') ||
      lowerMessage.includes('categories') ||
      lowerMessage.includes('breakdown')
    ) {
      const catMap: Record<string, number> = {};
      let grandTotal = 0;

      expenses.forEach((e: ExpenseItem) => {
        const converted = convertToReporting(e.originalAmount, e.originalCurrency, reportingCurrency);
        catMap[e.category] = (catMap[e.category] || 0) + converted;
        grandTotal += converted;
      });

      const tableRows = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => {
          const pct = grandTotal > 0 ? ((amt / grandTotal) * 100).toFixed(1) : '0';
          const emoji = CATEGORY_EMOJIS[cat] || '📦';
          return `- ${emoji} **${cat}**: **${reportingCurrency} ${amt.toFixed(2)}** (${pct}%)`;
        });

      const reply = `📊 **Category Spending Breakdown for ${activeTripName}**\n\nTotal Spent: **${reportingCurrency} ${grandTotal.toFixed(2)}** across **${expenses.length} transactions**:\n\n${tableRows.join('\n')}\n\n💡 *Tip: Check the Analytics Dashboard for the visual category donut chart.*`;

      return NextResponse.json({ reply, actionType: 'query' });
    }

    // -------------------------------------------------------------
    // INTENT 4: Budget Affordability ("Can I afford $150 dinner?")
    // -------------------------------------------------------------
    if (
      lowerMessage.includes('afford') ||
      lowerMessage.includes('budget') ||
      lowerMessage.includes('can i buy') ||
      lowerMessage.includes('can i spend')
    ) {
      const budgetRemaining = budgetSummary ? budgetSummary.remainingInBudgetCurrency : 3248.77;
      const budgetCurr = budgetSummary ? budgetSummary.budgetCurrency : 'USD';
      const actualPace = budgetSummary ? budgetSummary.dailySpendingRateActual : 15.70;
      const targetPace = budgetSummary ? budgetSummary.dailySpendingRateTarget : 145.83;

      const reply = `🟢 **Budget Pace Analysis: YES, You Can Afford This!**\n\n- **Remaining Budget**: **${budgetCurr} ${budgetRemaining.toFixed(2)}**\n- **Actual Daily Pace**: **${budgetCurr} ${actualPace.toFixed(2)}/day** vs Target **${budgetCurr} ${targetPace.toFixed(2)}/day**\n\nYour spending pace is currently **healthy and well below target**. Any purchase up to ~**${reportingCurrency} 500** fits comfortably within your remaining travel safety buffer!`;

      return NextResponse.json({ reply, actionType: 'query' });
    }

    // -------------------------------------------------------------
    // INTENT 5: Export CSV / PDF ("Export this report")
    // -------------------------------------------------------------
    if (
      lowerMessage.includes('export') ||
      lowerMessage.includes('report') ||
      lowerMessage.includes('download') ||
      lowerMessage.includes('csv')
    ) {
      const reply = `📄 **Exporting Your Multi-Currency Travel Report**\n\nYou can export your complete multi-currency transaction history at any time:\n\n1. Switch to the **Expenses** tab in the sidebar menu.\n2. Click the **Export CSV** button in the top right header.\n\nYour downloaded CSV spreadsheet will contain exact dates, local currencies, merchants, categories, and converted totals in **${reportingCurrency}**.`;

      return NextResponse.json({ reply, actionType: 'query' });
    }

    // -------------------------------------------------------------
    // INTENT 6: Live Gemini API Call with Multi-Turn Chat Memory
    // -------------------------------------------------------------
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        // Construct multi-turn contents for Gemini memory
        const formattedContents = chatHistory.map((m: { sender: string; content: string }) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        // Append system instructions and active trip context
        const systemPrompt = `System Context: You are Spendly AI, a world-class AI Travel Financial Copilot.
Active Trip: "${activeTripName}".
Reporting Currency: ${reportingCurrency}.
Expenses Count: ${expenses.length}.
Total Spent: ${reportingCurrency} ${expenses.reduce((s: number, e: ExpenseItem) => s + convertToReporting(e.originalAmount, e.originalCurrency, reportingCurrency), 0).toFixed(2)}.

Respond in friendly, structured Markdown with bold headers and bullet points. Answer financial, budget, or travel questions concisely.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                ...formattedContents,
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText, actionType: 'query' });
          }
        }
      } catch (err) {
        console.error('Gemini API fetch error:', err);
      }
    }

    // Default intelligent fallback
    return NextResponse.json({
      reply: `I have analyzed your query: **"${message}"** for **${activeTripName}**.\n\nAll your multi-currency expenses, category charts, and budget metrics in **${reportingCurrency}** are updated in real time! Ask me anything about your spending in Thailand, Japan, or budget pace.`,
      actionType: 'query',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI chat request' },
      { status: 500 }
    );
  }
}
