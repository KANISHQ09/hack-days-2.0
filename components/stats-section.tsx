"use client"

import { useEffect, useState, useRef } from "react"

function useCountUp(end: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { value: count + suffix, start: () => setHasStarted(true), hasStarted }
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const transactions = useCountUp(15, 2000, "K+")
  const insights = useCountUp(120, 2000, "+")
  const users = useCountUp(50, 2000, "K+")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          transactions.start()
          insights.start()
          users.start()
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <section ref={sectionRef} id="stats-section" className="px-6 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Live Experience</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Smart Expense Analyzer & Financial Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Track expenses, visualize spendings, and gain actionable financial insights seamlessly in real time.
          </p>
        </div>

        {/* iPhone Frame with Video Screen Overlay */}
        <div className="relative mb-20 flex justify-center w-full">
          <div
            className={`relative w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            {/* Ambient shadow behind the phone */}
            <div className="absolute inset-4 bg-black/40 blur-2xl rounded-full z-0" />

            {/* Container for iPhone Frame & Screen Video */}
            <div className="relative z-10 w-full">
              {/* Video layer fitted inside the phone screen cutout */}
              <div className="absolute top-[2.4%] left-[4.6%] w-[90.8%] h-[95.2%] rounded-[36px] sm:rounded-[42px] md:rounded-[50px] overflow-hidden bg-black z-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="video.mp4"
                />
              </div>

              {/* iPhone Frame PNG Overlay */}
              <img
                src="/images/iphone-frame.png"
                alt="Spendly Mobile App"
                className="w-full h-auto relative z-10 pointer-events-none drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
