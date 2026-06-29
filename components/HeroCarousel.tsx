'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image_url: string | null
  background_image_url: string | null
}

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  if (!slides || slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-slate-950 text-white">
        <div className="relative min-h-[560px]">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--cms-primary),#0f172a_55%,#020617)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%)]" />
          <div className="relative z-10 mx-auto flex min-h-[560px] max-w-6xl items-center px-6 py-16">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                Sindicato da Aviação Civil
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">Bem-vindo ao SINPROPNC</h1>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const slide = slides[currentSlide]

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Carousel Container */}
      <div className="relative min-h-[620px] flex items-center justify-center">
        {/* Background - Image or Gradient */}
        {slide.background_image_url ? (
          <div className="absolute inset-0">
            <Image 
              src={slide.background_image_url} 
              alt="" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92),rgba(2,6,23,0.72)_48%,rgba(2,6,23,0.36))]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--cms-primary),#0f172a_55%,#020617)]" />
        )}
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />

        {/* Slide Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                Defesa, representação e apoio sindical
              </p>
              <div className="space-y-4 overflow-hidden">
                <h1 
                  className="text-4xl lg:text-6xl font-bold text-white leading-tight text-balance animate-slide-in-left"
                  key={`title-${currentSlide}`}
                >
                  {slide.title}
                </h1>
                <p 
                  className="text-lg text-white/80 leading-relaxed max-w-xl font-light animate-slide-in-left"
                  style={{ animationDelay: '0.2s' }}
                  key={`subtitle-${currentSlide}`}
                >
                  {slide.subtitle}
                </p>
              </div>

              <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                <Link
                  href={slide.button_link}
                  className="inline-flex items-center gap-3 rounded-lg bg-[var(--cms-secondary)] px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 transition-all hover:brightness-95 hover:gap-4 group"
                >
                  {slide.button_text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Visual Element - Image or Placeholder */}
            <div className="hidden lg:flex items-center justify-center">
              {slide.image_url ? (
                <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-white/15 shadow-2xl">
                  <Image 
                    src={slide.image_url} 
                    alt="" 
                    fill 
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full max-w-sm rounded-lg border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur">
                  <div className="grid grid-cols-2 gap-4">
                    {['Direitos', 'Apoio', 'União', 'Segurança'].map((item) => (
                      <div key={item} className="rounded-md border border-white/10 bg-white/10 p-5">
                        <p className="text-sm font-semibold text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Carousel Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx)
                    setAutoPlay(false)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group border border-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group border border-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Slide Counter */}
            <div className="text-white text-sm font-medium">
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
