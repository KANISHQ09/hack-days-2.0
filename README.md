# Spendly — Smart Expense Analyzer & Financial Health Platform

A modern, high-performance web landing page and financial analytics dashboard built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**. 

Spendly empowers users to track, analyze, and optimize their personal or business finances with automated categorization, financial health scoring, and real-time interactive insights.

---

## ✨ Features

- 📊 **Smart Expense Analyzer**: Interactive analytics and revenue breakdown powered by [Recharts](https://recharts.org/).
- ⚡ **Real-Time Financial Insights**: Dynamic transaction feed, live balance animation, and automated expense categorization engine.
- 🎨 **Modern & Premium UI**: Glassmorphism navigation bar, smooth scroll interactions, dark/light theme support, and fluid animations powered by Framer Motion.
- 🎯 **Budget & Goal Tracking**: Keep tabs on recurring subscriptions, utility bills, and financial goals effortlessly.
- 📱 **Fully Responsive Layout**: Designed with a mobile-first philosophy using Radix UI primitives and Tailwind CSS v4.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com), PostCSS, Framer Motion, Lucide Icons
- **Components & Primitives**: [Radix UI](https://www.radix-ui.com/), shadcn/ui patterns, Sonner, Embla Carousel
- **Data Visualization & Tools**: Recharts, Date-fns, Zod, React Hook Form
- **Language**: TypeScript

---

## 📁 Project Structure

```text
homepage/
├── app/                  # Next.js App Router (Layout, Pages, Styles)
│   ├── globals.css       # Global styles & Tailwind CSS configuration
│   ├── layout.tsx        # Root layout wrapper
│   └── page.tsx          # Main homepage composition
├── components/           # Feature components & UI primitives
│   ├── animated-revenue-chart.tsx
│   ├── features-section.tsx
│   ├── header.tsx
│   ├── hero-section.tsx
│   ├── pricing-section.tsx
│   ├── realtime-property-card.tsx
│   ├── services-section.tsx
│   ├── testimonials-section.tsx
│   └── ui/               # Reusable Radix UI & Shadcn components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions (clsx, tailwind-merge)
├── public/               # Static assets & media
└── styles/               # CSS modules & styling helpers
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or later
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KANISHQ09/Hack-days-2.0.git
   cd homepage
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application in your browser.

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

## 🤖 Built with v0

This project is connected with [v0.app](https://v0.app). You can continue developing or iterating on components by visiting the link below:

[Continue working on v0 →](https://v0.app/chat/projects/prj_RAr7rDWgGx7BTig1spyHGxVeQcNo)
