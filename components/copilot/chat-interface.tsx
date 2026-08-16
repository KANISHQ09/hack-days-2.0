"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCopilot } from '@/lib/context/copilot-context';
import { formatCurrencyAmount, convertCurrency } from '@/lib/services/currency-service';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  Trash2,
  CheckCircle2,
  Tag,
  MapPin,
  CheckCheck,
} from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    isAiProcessing,
    clearChatHistory,
    reportingCurrency,
    exchangeRates,
    activeTrip,
  } = useCopilot();

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiProcessing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiProcessing) return;
    const text = input;
    setInput('');
    await sendChatMessage(text);
  };

  const handleChipClick = async (chipText: string) => {
    if (isAiProcessing) return;
    await sendChatMessage(chipText);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput('Dinner in Tokyo 6500 yen');
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-2 sm:px-4 pt-1 pb-6 space-y-3 min-h-0">



      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 [::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${isUser
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-rose-900/30 shadow-md'
                  }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm shadow-md transition-all ${
                  isUser
                    ? 'bg-rose-950/40 border border-rose-500/30 text-white rounded-tr-none'
                    : 'bg-[#131116] border border-zinc-800/80 text-white rounded-tl-none'
                }`}
              >
                <div className="leading-relaxed">
                  <FormattedMarkdownText content={msg.content} />
                </div>

                {/* Structured Expense Card if extracted */}
                {msg.extractedExpense && (
                  <div className="mt-3 p-3.5 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Expense Card Created
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {msg.extractedExpense.date}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
                        {formatCurrencyAmount(msg.extractedExpense.originalAmount, msg.extractedExpense.originalCurrency)}
                      </span>
                      <span className="text-xs font-medium text-rose-500">
                        (~{reportingCurrency} {convertCurrency(msg.extractedExpense.originalAmount, msg.extractedExpense.originalCurrency, reportingCurrency, exchangeRates).toFixed(2)})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-purple-500" /> {msg.extractedExpense.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" /> {msg.extractedExpense.country}
                      </span>
                      {msg.extractedExpense.merchant && (
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                          {msg.extractedExpense.merchant}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer timestamp & checkmark */}
                <div className={`flex items-center gap-1 text-[10px] text-zinc-400 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>10:31 AM</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-rose-500" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiProcessing && (
          <div className="flex items-center gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-[#131116] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl rounded-tl-none p-3 px-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-xs font-medium text-zinc-400 ml-1">Spendly Copilot thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="py-1 overflow-x-auto flex items-center gap-2 scrollbar-none text-xs">
        <button
          onClick={() => handleChipClick('How much in Bangkok?')}
          className="px-3.5 py-1.5 rounded-full bg-[#131116] hover:bg-rose-500/15 hover:border-rose-500/50 border border-zinc-800 text-zinc-200 hover:text-white font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer"
        >
          How much in Bangkok?
        </button>
        <button
          onClick={() => handleChipClick('Show spending by category')}
          className="px-3.5 py-1.5 rounded-full bg-[#131116] hover:bg-rose-500/15 hover:border-rose-500/50 border border-zinc-800 text-zinc-200 hover:text-white font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer"
        >
          Show spending by category
        </button>
        <button
          onClick={() => handleChipClick('Can I afford $150 dinner?')}
          className="px-3.5 py-1.5 rounded-full bg-[#131116] hover:bg-rose-500/15 hover:border-rose-500/50 border border-zinc-800 text-zinc-200 hover:text-white font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer"
        >
          Can I afford $150 dinner?
        </button>
        <button
          onClick={() => handleChipClick('Export this report')}
          className="px-3.5 py-1.5 rounded-full bg-[#131116] hover:bg-rose-500/15 hover:border-rose-500/50 border border-zinc-800 text-zinc-200 hover:text-white font-medium whitespace-nowrap transition-colors shadow-xs cursor-pointer"
        >
          Export this report
        </button>

        <button
          onClick={clearChatHistory}
          className="px-3 py-1.5 rounded-full bg-[#131116] hover:bg-red-500/15 hover:text-red-400 border border-zinc-800 text-zinc-400 font-medium whitespace-nowrap transition-colors shadow-xs ml-auto flex items-center gap-1 shrink-0 cursor-pointer"
          title="Clear Chat History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Floating Bottom Input Bar */}
      <form onSubmit={handleSubmit} className="relative pt-1 pb-3 mb-2 w-full max-w-full">
        <div className="flex items-center bg-[#131116] border border-zinc-800 rounded-2xl p-1.5 sm:p-2 shadow-lg focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-transparent transition-all w-full max-w-full overflow-hidden">

          {/* Voice Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-rose-500 hover:bg-rose-500/10'
            }`}
            title={isRecording ? 'Listening... Speak now' : 'Voice Input (Hands-free)'}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening... Speak your expense...'
                : 'Ask anything about your expenses...'
            }
            className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent border-none outline-none text-white placeholder-zinc-500 truncate"
            disabled={isAiProcessing}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isAiProcessing}
            className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white shadow-md shadow-rose-900/30 transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

const FormattedMarkdownText: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-zinc-100">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="h-1" />;

        const isBullet = line.trim().startsWith('-');
        const cleanLine = isBullet ? line.trim().substring(1).trim() : line;
        const parts = parseInlineMarkdown(cleanLine);

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2 text-sm">
              <span className="text-rose-500 font-bold text-base leading-none">•</span>
              <div className="text-zinc-200">{parts}</div>
            </div>
          );
        }

        return <p key={lineIdx} className="text-zinc-100">{parts}</p>;
      })}
    </div>
  );
};

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|`.*?`)/g;
  const tokens = text.split(regex);

  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-rose-400">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
      return (
        <em key={idx} className="italic text-rose-300 font-medium">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-white text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}
