import { useState, useEffect, useCallback } from 'react'
import { useLobbyDisplay } from '../hooks/useLobbyDisplay'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { AppointmentsBlock } from '../components/AppointmentsBlock'
import { FeaturedVehiclesBlock } from '../components/FeaturedVehiclesBlock'
import { SoldVehiclesBlock } from '../components/SoldVehiclesBlock'
import { ReputationBlock } from '../components/ReputationBlock'
import { FooterBlock } from '../components/FooterBlock'
import { LoadingScreen } from '../components/LoadingScreen'
import { ErrorScreen } from '../components/ErrorScreen'

const SLIDE_DURATION_MS = 8_000

type SlideId = 'appointments' | 'featured' | 'sold' | 'reputation'

const SLIDES: SlideId[] = ['appointments', 'featured', 'sold', 'reputation']

interface SlideIndicatorProps {
  total: number
  current: number
}

function SlideIndicator({ total, current }: SlideIndicatorProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-3 py-4" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={String(i)}
          className={`h-2 rounded-full transition-all duration-500 ${
            i === current ? 'w-8 bg-blue-400' : 'w-2 bg-slate-600'
          }`}
        />
      ))}
    </div>
  )
}

export function LobbyDisplayPage(): JSX.Element {
  const { data, isLoading, isError } = useLobbyDisplay()
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  const advanceSlide = useCallback((): void => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
      setIsTransitioning(false)
    }, 400)
  }, [])

  useEffect(() => {
    if (!data) return
    const interval = setInterval(advanceSlide, SLIDE_DURATION_MS)
    return (): void => { clearInterval(interval) }
  }, [data, advanceSlide])

  if (isLoading) return <LoadingScreen />
  if (isError || !data) return <ErrorScreen />

  const activeSlide: SlideId = SLIDES[currentSlide] ?? 'appointments'

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col" data-testid="lobby-display-page">
      {/* Always-visible header */}
      <WelcomeHeader dealership={data.dealership} />

      {/* Slide indicator */}
      <SlideIndicator total={SLIDES.length} current={currentSlide} />

      {/* Rotating content area */}
      <main
        className={`flex-1 transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        data-testid="slide-content"
        data-slide={activeSlide}
      >
        {activeSlide === 'appointments' && (
          <AppointmentsBlock appointments={data.appointments} />
        )}
        {activeSlide === 'featured' && (
          <FeaturedVehiclesBlock vehicles={data.featuredVehicles} />
        )}
        {activeSlide === 'sold' && (
          <SoldVehiclesBlock vehicles={data.soldVehicles} />
        )}
        {activeSlide === 'reputation' && (
          <ReputationBlock reputation={data.reputation} />
        )}
      </main>

      {/* Always-visible footer */}
      <FooterBlock dealership={data.dealership} />
    </div>
  )
}
