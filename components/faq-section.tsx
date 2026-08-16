import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does automatic transaction categorization work?",
    answer:
      "Our engine automatically parses transaction descriptions and merchant details from your manual entries or CSV bank uploads, classifying them into Food, Rent, Subscriptions, Travel, Bills, Shopping, or Entertainment without manual tagging.",
  },
  {
    question: "How is my personal financial data secured?",
    answer:
      "Your financial privacy is our highest priority. All financial transactions and user data are encrypted and stored privately to ensure complete confidentiality.",
  },
  {
    question: "Can I import bank statements via CSV?",
    answer:
      "Yes! You can bulk import transactions using standard CSV bank statement exports. The system handles messy date formats, missing fields, and duplicate entries gracefully.",
  },
  {
    question: "How is the Financial Health Score calculated?",
    answer:
      "The score evaluates factors like spending vs. income, savings rate, and budget adherence to generate a clear health indicator along with plain-language recommendations.",
  },
  {
    question: "What is the Subscription Detector?",
    answer:
      "It automatically scans your transaction history to detect recurring subscription payments and flags unused or forgotten services before they charge you again.",
  },
  {
    question: "Can I ask questions in natural language using the AI Assistant?",
    answer:
      "Yes! You can ask questions like 'How much did I spend on food last month?' or 'What is my top expense category?' and receive clear, accurate summaries instantly.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-10 px-6 mb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Frequently asked questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Smart Expense Analyzer. Have a question not listed? Contact our support.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 pb-6">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-foreground/30 overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 pt-1 leading-relaxed text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
