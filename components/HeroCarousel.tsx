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
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative h-[55vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -left-40 bottom-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Bem-vindo ao SINPROPNC</h1>
          </div>
        </div>
      </section>
    )
  }

  const slide = slides[currentSlide]

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Carousel Container */}
      <div className="relative h-[55vh] min-h-[400px] flex items-center justify-center">
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-800/90 to-blue-900/90" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900" />
        )}
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -left-40 bottom-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="space-y-4 overflow-hidden">
                <h1 
                  className="text-4xl lg:text-5xl font-bold text-white leading-tight text-balance animate-slide-in-left"
                  key={`title-${currentSlide}`}
                >
                  {slide.title}
                </h1>
                <p 
                  className="text-base text-blue-100 leading-relaxed max-w-xl font-light animate-slide-in-left"
                  style={{ animationDelay: '0.2s' }}
                  key={`subtitle-${currentSlide}`}
                >
                  {slide.subtitle}
                </p>
              </div>

              <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                <Link
                  href={slide.button_link}
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-xl hover:gap-4 group"
                >
                  {slide.button_text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Visual Element - Image or Placeholder */}
            <div className="hidden lg:flex items-center justify-center">
              {slide.image_url ? (
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl animate-float">
                  <Image 
                    src={slide.image_url} 
                    alt="" 
                    fill 
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-md border border-white/20 animate-float" />
                  <div className="absolute inset-4 bg-gradient-to-t from-blue-900 to-transparent rounded-xl animate-slide-in-right" />
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