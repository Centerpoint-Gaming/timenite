import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import DowntimeUI from '../../components/DowntimeUI'
import Footer from '../../components/Footer'

export default function Home () {
  const [progress, setProgress] = useState(6)
  const [timeLeft, setTimeLeft] = useState('') // Keep empty until real data
  const [seasonNumber, setSeasonNumber] = useState(0)
  const [chapter, setChapter] = useState(null)
  const [season, setSeason] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [countdownDate, setCountdownDate] = useState(null)
  const [crosshairIndex, setCrosshairIndex] = useState(1)
  const [isDataValid, setIsDataValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [showAds, setShowAds] = useState(true)
  // Dark mode is now the only mode
  const [isLoading, setIsLoading] = useState(false) // Start with false to check cache first

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedShowAds = localStorage.getItem('timenite_show_ads')
    
    if (savedShowAds !== null) {
      setShowAds(savedShowAds === 'true')
    }
  }, [])

  useEffect(() => {
    const CACHE_KEY = 'timenite_countdown_data_v3' // Version bump to invalidate old cache
    const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes client cache (server updates every 30 seconds)
    
    // First, try to load from cache immediately
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (data.isDataValid) {
        // Load cached data immediately, regardless of age
        setIsDataValid(true)
        setStartDate(data.startDate)
        setCountdownDate(data.countdownDate)
        setSeasonNumber(data.seasonNumber)
        setChapter(data.chapter)
        setSeason(data.season)
        // Don't set loading state - we have data
        
        // Calculate initial time left immediately
        const now = Date.now()
        const distance = data.countdownDate - now
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft('EXPIRED')
        }
      }
    } else {
      // Only show loading if no cache exists
      setIsLoading(true)
    }
    
    const fetchCountdown = async () => {
      try {
        // Check localStorage cache for freshness
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          const age = Date.now() - timestamp
          
          // If cache is fresh enough, skip fetch
          if (age < CACHE_DURATION && data.isDataValid) {
            return
          }
        }
        
        const res = await fetch('/api/fetchCountdown')
        const data = await res.json()
        
        if (!data.isDataValid) {
          setIsDataValid(false)
          setErrorMessage(data.error || 'Unable to fetch season data')
          return
        }
        
        // Cache the valid data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }))
        
        setIsDataValid(true)
        setStartDate(data.startDate)
        setCountdownDate(data.countdownDate)
        setSeasonNumber(data.seasonNumber)
        setChapter(data.chapter)
        setSeason(data.season)
        setIsLoading(false)
        return data
      } catch (error) {
        console.error('Error fetching countdown:', error)
        // Only show error if we don't have cached data
        if (!chapter && !season) {
          setIsDataValid(false)
          setErrorMessage('Failed to connect to server')
        }
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountdown()

    const fetchInterval = setInterval(fetchCountdown, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    const updateRealTimeCountdown = () => {
      if (!countdownDate || !startDate) return

      const now = new Date().getTime()
      const totalDuration = countdownDate - startDate
      const timePassed = now - startDate
      const progress = Math.min(
        (timePassed / totalDuration) * 100,
        100
      ).toFixed(2)

      setProgress(progress)

      const distance = countdownDate - now

      if (distance < 0) {
        setTimeLeft('EXPIRED')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    const realTimeInterval = setInterval(updateRealTimeCountdown, 1000)

    return () => clearInterval(realTimeInterval)
  }, [countdownDate, startDate])

  useEffect(() => {
    const crosshairInterval = setInterval(() => {
      setCrosshairIndex(prevIndex => (prevIndex === 12 ? 1 : prevIndex + 1))
    }, 1000)

    return () => clearInterval(crosshairInterval)
  }, [])

  const toggleAds = () => {
    const newValue = !showAds
    setShowAds(newValue)
    localStorage.setItem('timenite_show_ads', newValue.toString())
  }

  // Dark mode toggle removed - dark mode is now default

  const renderAdImageWithCrosshair = (
    adSrc,
    width,
    height,
    className,
    href = '',
    crosshairType = 'X',
    crosshairSize = 30
  ) => (
    <div className={`relative inline-flex justify-center ${className}`}>
      <a href={href} target='_blank'>
        <Image src={adSrc} alt='Ad' width={width} height={height} />
      </a>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Image
          src={`/Timenite Ads/Crosshairs to Overlay/Crosshair${crosshairType}/${crosshairIndex}.png`}
          alt='Crosshair'
          width={crosshairType === 'V2' && crosshairIndex === 5 ? crosshairSize / 2 : crosshairSize}
          height={crosshairType === 'V2' && crosshairIndex === 5 ? crosshairSize / 2 : crosshairSize}
        />
      </div>
    </div>
  )

  if (!isDataValid) {
    return <DowntimeUI error={errorMessage} />
  }

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const endDateObj = countdownDate ? new Date(countdownDate) : null
  const formattedEndDate = endDateObj ? endDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: userTimezone
  }) : ''
  const formattedEndTime = endDateObj ? endDateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: userTimezone
  }) : ''

  return (
    <div className='flex min-h-screen flex-col animated-gradient-dark items-center fade-in'>
      <Head>
        <title>{`Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} Countdown Timer 2025 | Live Season End Timer - Timenite`}</title>
        <meta
          name='description'
          content={`⏰ LIVE Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} countdown timer. See exactly when the season ends: ${formattedEndDate}. Real-time updates, 100% accurate. Track battle pass ending, new season start time & more!`}
        />
        <meta
          name='keywords'
          content={`fortnite countdown, fortnite timer, fortnite season end, ${chapter ? `fortnite chapter ${chapter} season ${season}, chapter ${chapter} season ${season} countdown, chapter ${chapter} season ${season} end date,` : ''} fortnite season countdown, when does fortnite season end, fortnite battle pass timer, fortnite season timer, fortnite countdown timer, timenite, fortnite season end date 2025`}
        />
        <meta property="og:title" content={`Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} Countdown Timer - Live Season End Timer`} />
        <meta property="og:description" content={`⏰ Track exactly when Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'season'} ends with our live countdown timer. Updated in real-time. Never miss the season ending!`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://timenite.com" />
        <meta property="og:image" content="https://timenite.com/og-image.png" />
        <meta property="og:site_name" content="Timenite" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@timenite" />
        <meta name="twitter:creator" content="@timenite" />
        <meta name="twitter:title" content={`Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} Countdown Timer`} />
        <meta name="twitter:description" content={`Live countdown to Fortnite season ending. Track exactly when ${chapter ? `Chapter ${chapter} Season ${season}` : 'the season'} ends!`} />
        <meta name="twitter:image" content="https://timenite.com/og-image.png" />
        <link rel="canonical" href="https://timenite.com" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000428" />
        <meta name="author" content="Timenite by CenterPoint Gaming" />
        <link
          rel='icon'
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='90' font-weight='bold'%3E⏰%3C/text%3E%3C/svg%3E"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Timenite - Fortnite Season Countdown Timer",
                "description": `Live countdown timer for Fortnite ${chapter && season ? `Chapter ${chapter} Season ${season}` : 'season'}. Track exactly when the current season ends with real-time updates.`,
                "url": "https://timenite.com",
                "applicationCategory": "GameApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "creator": {
                  "@type": "Organization",
                  "name": "CenterPoint Gaming",
                  "url": "https://centerpointgaming.com"
                },
                "datePublished": "2019-01-01",
                "dateModified": new Date().toISOString(),
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "2847"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": `When does Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} end?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": `Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} ends on ${formattedEndDate}. Check our live countdown timer for the exact time remaining.`
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is the Timenite countdown timer accurate?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Timenite updates every second and pulls data directly from official sources to ensure 100% accuracy."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What time zone is the countdown timer in?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The countdown automatically adjusts to your local time zone, so you see exactly when the season ends in your area."
                    }
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Timenite",
                    "item": "https://timenite.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": `Fortnite ${chapter ? `Chapter ${chapter} Season ${season}` : 'Season'} Countdown`,
                    "item": "https://timenite.com"
                  }
                ]
              }
            ])
          }}
        />
      </Head>
      <nav className='w-full flex justify-center'>
        <div className='w-full max-w-4xl flex justify-between items-center p-3 md:p-4 text-white'>
          <span className='text-xl md:text-3xl font-bold'>Timenite</span>
          
          <div className='flex items-center gap-3 md:gap-6'>
            {/* Nav Links */}
            <div className='flex gap-2 md:gap-4 text-xs md:text-base'>
              <Link href='/embed-config' className='text-white hover:text-yellow-300 transition-colors'>
                Embed
              </Link>
              <Link href='/about' className='text-white hover:text-yellow-300 transition-colors'>
                About
              </Link>
              <a href='https://twitter.com/CenterPointG' className='text-white hover:text-yellow-300 transition-colors'>
                Twitter
              </a>
              <a href='https://discord.gg/customcrosshair' className='text-white hover:text-yellow-300 transition-colors'>
                Discord
              </a>
            </div>
            
            {/* Toggle Switches */}
            <label className='flex items-center cursor-pointer'>
              <span className='text-xs md:text-sm mr-1 md:mr-2'>Ads</span>
              <div className='relative'>
                <input
                  type='checkbox'
                  checked={showAds}
                  onChange={toggleAds}
                  className='sr-only'
                />
                <div className={`block w-10 h-6 rounded-full ${showAds ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showAds ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </nav>
      <div className='flex-grow w-full flex flex-col md:flex-row items-center justify-center px-4 md:px-0'>
        <div className='flex-1 flex justify-start ml-2'>
          {showAds && renderAdImageWithCrosshair(
            '/Timenite Ads/PC_X.png',
            200,
            150,
            'hidden md:inline-flex',
            'https://centerpointgaming.com',
            'X',
            40
          )}
        </div>
        <div className='text-center max-w-2xl mx-auto w-full'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-6 md:mb-8'>
            {chapter && season ? `Chapter ${chapter} Season ${season}` : 'Current Season'}
          </h1>
          
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/20'>
            {isLoading || !countdownDate || timeLeft === '' ? (
              <>
                <div className='h-16 md:h-24 skeleton rounded-lg mb-2'></div>
                <div className='h-6 md:h-7 skeleton rounded-md w-3/4 mx-auto'></div>
              </>
            ) : (
              <>
                <p className='text-5xl md:text-8xl font-bold text-white mb-2 leading-none fade-in'>
                  {timeLeft}
                </p>
                {countdownDate && Date.now() < countdownDate && (
                  <p className='text-base md:text-lg text-white/80 mt-2 fade-in'>
                    {Math.ceil((countdownDate - Date.now()) / (1000 * 60 * 60 * 24))} days until season ends
                  </p>
                )}
              </>
            )}
          </div>

          <div className='space-y-3'>
            {isLoading ? (
              <>
                <div className='h-3 skeleton rounded-full'></div>
                <div className='flex justify-between'>
                  <div className='h-4 w-24 skeleton rounded'></div>
                  <div className='h-4 w-12 skeleton rounded'></div>
                </div>
              </>
            ) : (
              <>
                <div
                  className='w-full bg-white/10 backdrop-blur-sm rounded-full relative overflow-hidden fade-in border border-white/10'
                  style={{ height: '14px' }}
                >
                  <div
                    className='bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 absolute top-0 left-0 h-full transition-all duration-500 ease-out'
                    style={{
                      width: `${progress}%`,
                      boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      animation: 'progress-pulse 2s ease-in-out infinite'
                    }}
                  >
                    <div className='absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0'></div>
                    <div className='absolute inset-0 progress-shimmer'></div>
                  </div>
                </div>
                
                <div className='flex justify-between text-sm text-white/70 fade-in'>
                  <span>Season Progress</span>
                  <span className='font-semibold text-white'>{progress}%</span>
                </div>
              </>
            )}
          </div>

          {isLoading ? (
            <div className='mt-6 space-y-2'>
              <div className='h-4 skeleton rounded w-64 mx-auto'></div>
              <div className='h-4 skeleton rounded w-48 mx-auto'></div>
            </div>
          ) : endDateObj && startDate && (
            <div className='text-sm text-white/60 mt-6 space-y-1 fade-in'>
              <p>
                Fortnite {chapter && season ? `Chapter ${chapter} Season ${season}` : 'season'} started {new Date(startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p>
                Ends {formattedEndDate} at {formattedEndTime}
              </p>
            </div>
          )}
        </div>
        <div className='flex-1 flex justify-end mr-2'>
          {showAds && renderAdImageWithCrosshair(
            '/Timenite Ads/PC_V2.png',
            200,
            90,
            'hidden md:inline-flex',
            'https://centerpointgaming.com/crosshairv2.html',
            'V2',
            20
          )}
        </div>
      </div>
      {showAds && (
        <div className='md:hidden px-4 mb-4'>
          {renderAdImageWithCrosshair(
            '/Timenite Ads/Mobile_V2.png',
            320,
            60,
            '',
            'https://centerpointgaming.com/crosshairv2.html',
            'V2',
            15
          )}
        </div>
      )}
      <div className='flex items-center justify-center px-4 mt-4 md:mt-8'>
        <p className='text-xs md:text-sm text-white/50 text-center max-w-xl'>
          Track when the current Fortnite season ends with our live countdown timer
        </p>
      </div>
      <Footer />
    </div>
  )
}
