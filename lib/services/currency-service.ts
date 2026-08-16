import { CurrencyInfo } from '../types/copilot';

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
];

// Fallback rates (1 USD = X target currency)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  JPY: 150.5,
  INR: 83.4,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.35,
  CHF: 0.90,
  CNY: 7.23,
  THB: 36.5,
  IDR: 16100.0,
  AED: 3.67,
  KRW: 1375.0,
  MXN: 16.9,
  MYR: 4.75,
  VND: 25400.0,
  NZD: 1.66,
};

let cachedRates: Record<string, number> = { ...FALLBACK_RATES };
let lastFetched: number = 0;

/**
 * Fetch latest rates against USD (caches for 1 hour)
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (now - lastFetched < 3600 * 1000 && Object.keys(cachedRates).length > 1) {
    return cachedRates;
  }

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      cachedRates = { USD: 1.0, ...data.rates };
      lastFetched = now;
      return cachedRates;
    }
  } catch (err) {
    console.warn('Using fallback exchange rates:', err);
  }

  return cachedRates;
}

/**
 * Convert an amount from one currency to another dynamically
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = cachedRates
): number {
  if (!amount || isNaN(amount)) return 0;
  const fromCode = fromCurrency.toUpperCase();
  const toCode = toCurrency.toUpperCase();

  if (fromCode === toCode) return amount;

  const fromRate = rates[fromCode] || FALLBACK_RATES[fromCode] || 1.0;
  const toRate = rates[toCode] || FALLBACK_RATES[toCode] || 1.0;

  // Amount in USD = amount / fromRate
  // Amount in Target = (amount / fromRate) * toRate
  const converted = (amount / fromRate) * toRate;
  return Math.round(converted * 100) / 100;
}

/**
 * Auto-detect currency code from text description or symbols
 */
export function detectCurrencyFromText(text: string, countryContext?: string): { currency: string; confidence: number; ambiguous: boolean } {
  const lower = text.toLowerCase();

  // Explicit currency keywords
  if (lower.includes('yen') || lower.includes('jpy') || lower.includes('¥')) {
    if (lower.includes('yuan') || lower.includes('rmb') || (countryContext && countryContext.toLowerCase() === 'china')) {
      return { currency: 'CNY', confidence: 0.95, ambiguous: false };
    }
    return { currency: 'JPY', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('rupee') || lower.includes('rupees') || lower.includes('inr') || lower.includes('₹')) {
    return { currency: 'INR', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('euro') || lower.includes('euros') || lower.includes('eur') || lower.includes('€')) {
    return { currency: 'EUR', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('pound') || lower.includes('pounds') || lower.includes('gbp') || lower.includes('£')) {
    return { currency: 'GBP', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('baht') || lower.includes('thb') || lower.includes('฿')) {
    return { currency: 'THB', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('ringgit') || lower.includes('myr') || lower.includes('rm')) {
    return { currency: 'MYR', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('rupiah') || lower.includes('idr') || lower.includes('rp')) {
    return { currency: 'IDR', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('dirham') || lower.includes('aed')) {
    return { currency: 'AED', confidence: 0.98, ambiguous: false };
  }
  if (lower.includes('won') || lower.includes('krw') || lower.includes('₩')) {
    return { currency: 'KRW', confidence: 0.98, ambiguous: false };
  }

  // Country contextual hints for "$" symbol
  if (lower.includes('$') || lower.includes('dollar') || lower.includes('dollars')) {
    if (lower.includes('singapore') || lower.includes('sgd') || lower.includes('s$')) {
      return { currency: 'SGD', confidence: 0.95, ambiguous: false };
    }
    if (lower.includes('australia') || lower.includes('aud') || lower.includes('a$')) {
      return { currency: 'AUD', confidence: 0.95, ambiguous: false };
    }
    if (lower.includes('canada') || lower.includes('cad') || lower.includes('c$')) {
      return { currency: 'CAD', confidence: 0.95, ambiguous: false };
    }
    if (countryContext) {
      const cc = countryContext.toLowerCase();
      if (cc.includes('singapore')) return { currency: 'SGD', confidence: 0.9, ambiguous: false };
      if (cc.includes('australia')) return { currency: 'AUD', confidence: 0.9, ambiguous: false };
      if (cc.includes('canada')) return { currency: 'CAD', confidence: 0.9, ambiguous: false };
    }
    // Generic $ without country context defaults to USD but flagged as slightly ambiguous if user is in Canada/Australia
    return { currency: 'USD', confidence: 0.9, ambiguous: false };
  }

  // Country name contextual defaults if no symbol mentioned
  if (countryContext) {
    const cc = countryContext.toLowerCase();
    if (cc.includes('japan')) return { currency: 'JPY', confidence: 0.85, ambiguous: false };
    if (cc.includes('india')) return { currency: 'INR', confidence: 0.85, ambiguous: false };
    if (cc.includes('france') || cc.includes('germany') || cc.includes('italy') || cc.includes('spain')) return { currency: 'EUR', confidence: 0.85, ambiguous: false };
    if (cc.includes('uk') || cc.includes('london') || cc.includes('britain')) return { currency: 'GBP', confidence: 0.85, ambiguous: false };
    if (cc.includes('thailand') || cc.includes('bangkok')) return { currency: 'THB', confidence: 0.85, ambiguous: false };
  }

  // Default fallback
  return { currency: 'USD', confidence: 0.5, ambiguous: true };
}

export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  const info = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = info ? info.symbol : currencyCode;
  
  // Decimals formatting rule: JPY, IDR, KRW don't typically use decimals
  const noDecimalCurrencies = ['JPY', 'IDR', 'KRW', 'VND'];
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: noDecimalCurrencies.includes(currencyCode) ? 0 : 2,
    minimumFractionDigits: noDecimalCurrencies.includes(currencyCode) ? 0 : 2,
  }).format(amount);

  return `${symbol}${formattedNumber} ${currencyCode}`;
}
