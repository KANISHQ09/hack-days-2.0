"use client"

import { Home, Key, Shield } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const services = [
  {
    icon: Home,
    title: "Automatic Categorization",
    description: "Automatically classifies transactions into Food, Rent, Shopping, Subscriptions, Travel, Bills, & Entertainment.",
  },
  {
    icon: Key,
    title: "Spending Pattern Analysis",
    description: "Surfaces real insights on top spending categories, month-over-month trends, and recurring payments.",
  },
  {
    icon: Shield,
    title: "Financial Health Score",
    description: "Generates a clear health indicator and provides personalized, actionable guidance to improve savings.",
  },
]

function AnimatedIcon({ Icon, delay = 0 }: { Icon: any; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (iconRef.current) {
      observer.observe(iconRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={iconRef} className="relative">
      <Icon
        className={`text-foreground h-16 w-16 ${isVisible ? "animate-draw-icon" : ""}`}
        strokeWidth={1}
        style={{
          strokeDasharray: isVisible ? undefined : 1000,
          strokeDashoffset: isVisible ? undefined : 1000,
        }}
      />
    </div>
  )
}

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="py-16 sm:py-32 px-4 sm:px-6 pb-16 sm:pb-24 relative overflow-hidden">
      <style jsx>{`
        @keyframes drawPath {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
        :global(.animate-draw-icon) :global(path),
        :global(.animate-draw-icon) :global(line),
        :global(.animate-draw-icon) :global(polyline),
        :global(.animate-draw-icon) :global(circle),
        :global(.animate-draw-icon) :global(rect) {
          animation: drawPath 2s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-10 mb-16 sm:mb-32 overflow-hidden rounded-3xl">
          {/* Background image that spans full width */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/7aecbceb-cbd3-4cbd-901c-dd0125d41525.png"
              alt="Beautiful house"
              className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                isVisible ? "scale-100" : "scale-110"
              }`}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 sm:bg-black/20" />
          </div>

          {/* Text content on top */}
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            <div className="order-1 lg:order-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/80 font-medium mb-3 sm:mb-4">Real-World Context</p>
              <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-medium text-white text-balance mb-6 sm:mb-8 leading-tight break-words max-w-full">
                Understand where your money actually goes
              </h2>
              <div className="space-y-4 sm:space-y-6 text-white/90 text-sm sm:text-base leading-relaxed break-words">
                <p>
                  Most people don't really know where their money goes each month. They earn, they spend, and by the end of the month they're often surprised at how little is left — without ever understanding why.
                </p>
                <p>
                  Real financial health isn't just about tracking expenses — it's about understanding patterns. Our smart expense analyzer turns raw transaction data into honest financial guidance.
                </p>
              </div>
              <div className="mt-6 sm:mt-10"></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A complete platform to analyze spending, track budgets, and improve your financial health.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl hover:bg-zinc-50 transition-colors duration-300 text-center"
            >
              <div className="mb-6 flex justify-center">
                <AnimatedIcon Icon={service.icon} delay={index * 0.2} />
              </div>
              <h3 className="text-xl font-medium mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
