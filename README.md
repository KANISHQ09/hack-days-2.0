# Spendly — AI Travel Financial Copilot ✈️💱

> **"Every traveler should be able to say 'how much did I spend?' and get a clear answer — regardless of how many countries, currencies, or credit cards were involved."**

**Spendly — AI Travel Financial Copilot** is a conversational, AI-native travel expense management platform designed for international travelers, digital nomads, and trip planners. It eliminates the friction of multi-currency expense tracking by allowing users to record, query, analyze, and predict travel spending through natural language — via text or voice — in any currency, from any country.

---

## ✨ Key Features

- 💬 **Conversational AI Expense Entry**: Record expenses effortlessly by speaking or typing natural sentences like *"Dinner in Tokyo 8500 yen"* or *"Taxi in Bangkok 350 THB"*.
- 💱 **Dynamic Multi-Currency Engine**: Original amounts and currencies are preserved immutably. Convert and view all expenses in any reporting currency (USD, JPY, EUR, INR, GBP, etc.) on demand with live exchange rates.
- ⚡ **Instant Guest Trial (No Initial Sign-Up)**: Jump right into the main product application (`/app`) without forced registration. All trip data and session states persist locally in your browser.
- 📊 **Financial Analytics Dashboard**: Interactive charts powered by [Recharts](https://recharts.org/):
  - **Category Breakdown** (Donut chart with custom legends)
  - **Cross-Country Spending** (Bar chart sorted by total spend)
  - **Daily Spend Timeline** (Line chart tracking daily rate)
- 🧠 **Predictive Budget Intelligence**: Set trip budgets, track remaining balances, calculate daily spending targets vs. actual rate, and receive proactive overspend warning alerts.
- 📋 **Expense Ledger & CSV Export**: Filter by category, country, or search term, perform quick edits, and export clean CSV reports.
- ✈️ **Trip Management**: Create, switch, and manage multi-country trips with custom dates and budget targets.
- 🎨 **Modern Landing Page & Premium UI**: Built with glassmorphism header, dark/light theme support, and fluid animations powered by Tailwind CSS v4 and Framer Motion.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Library**: [React 19](https://react.dev)
- **Language**: TypeScript
- **AI Intelligence**: Anthropic Claude API / Next.js AI API Route (`/api/chat`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com), PostCSS, Framer Motion, Lucide Icons
- **UI & Components**: [Radix UI](https://www.radix-ui.com/), shadcn/ui patterns, Sonner, Embla Carousel
- **Data Visualization & Tools**: Recharts, Date-fns, Zod, React Hook Form
- **Exchange Rates API**: Frankfurter API / Open Exchange Rates (150+ ISO Currencies)

---

## 📁 Project Structure

```text
d:\kantik\hack-days-2.0/
├── app/                          # Next.js App Router
│   ├── api/                      # API Endpoints
│   │   └── chat/route.ts         # Multi-agent AI NLP & extraction endpoint
│   ├── app/                      # Main Copilot Application (/app)
│   │   └── page.tsx              # Main Product Controller (Chat, Analytics, Ledger, Trips)
│   ├── globals.css               # Global styles & Tailwind CSS configuration
│   ├── layout.tsx                # Root layout wrapper
│   └── page.tsx                  # Marketing Landing Page
├── components/                   # Feature components
│   ├── copilot/                  # Core Product Copilot Components
│   │   ├── analytics-dashboard.tsx # Recharts financial analytics & budget warning banner
│   │   ├── chat-interface.tsx    # Conversational AI assistant & prompt chips
│   │   ├── copilot-nav.tsx       # Top navigation header & reporting currency switcher
│   │   ├── expense-ledger.tsx    # Transaction table, search, filters & CSV export
│   │   └── trip-manager.tsx      # Trip creation, budget setting & card switcher
│   ├── header.tsx                # Landing Page Header (Try Now button -> /app)
│   ├── hero-section.tsx
│   ├── pricing-section.tsx
│   ├── stats-section.tsx
│   └── ui/                       # Reusable Radix UI & Shadcn components
├── lib/                          # Core Services & Utilities
│   ├── context/
│   │   └── copilot-context.tsx   # React Context & LocalStorage Guest Trial state
│   ├── services/
│   │   └── currency-service.ts   # Live exchange rates & dynamic conversion matrix
│   └── types/
│       └── copilot.ts            # TypeScript interfaces (Expense, Trip, Currency, ChatMessage)
└── public/                       # Static assets & media
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or later
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KANISHQ09/Hack-days-2.0.git
   cd Hack-days-2.0
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ```
   *(Note: If no API key is provided, the application runs on a built-in server-side AI fallback parser!)*

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the Landing Page or [http://localhost:3000/app](http://localhost:3000/app) to use the AI Copilot product directly.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Hot Module Replacement |
| `npm run build` | Builds the application for production optimization |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality and errors |

---

## 📄 Documentation

For full technical specifications, architecture diagrams, and product requirements:
- [`01_PRD_AI_Travel_Financial_Copilot.md`](./01_PRD_AI_Travel_Financial_Copilot.md) — Product Requirements Document
- [`02_SRS_AI_Travel_Financial_Copilot.md`](./02_SRS_AI_Travel_Financial_Copilot.md) — Software Requirements Specification
- [`03_System_Design_AI_Travel_Financial_Copilot.md`](./03_System_Design_AI_Travel_Financial_Copilot.md) — System Design Reference
- [`04_Implementation_Plan_AI_Travel_Financial_Copilot.md`](./04_Implementation_Plan_AI_Travel_Financial_Copilot.md) — Technical Implementation Roadmap
