import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import DowntimeUI from '../../components/DowntimeUI'

export default function Home () {
  const [progress, setProgress] = useState(6)
  const [timeLeft, setTimeLeft] = useState('')
  const [seasonNumber, setSeasonNumber] = useState(0)
  const [startDate, setStartDate] = useState(null)
  const [countdownDate, setCountdownDate] = useState(null)
  const [crosshairIndex, setCrosshairIndex] = useState(1)
  const [isDataValid, setIsDataValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const CACHE_KEY = 'timenite_countdown_data'
    const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes
    
    const fetchCountdown = async () => {
      try {
        // Check localStorage cache first
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          const age = Date.now() - timestamp
          
          // Use cached data if it's less than 30 minutes old
          if (age < CACHE_DURATION && data.isDataValid) {
            setIsDataValid(true)
            setStartDate(data.startDate)
            setCountdownDate(data.countdownDate)
            setSeasonNumber(data.seasonNumber)
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
        return data
      } catch (error) {
        console.error('Error fetching countdown:', error)
        setIsDataValid(false)
        setErrorMessage('Failed to connect to server')
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
      const milliseconds = Math.floor((distance % 1000) / 10)

      setTimeLeft(
        `${days}d ${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`
      )
    }

    const realTimeInterval = setInterval(updateRealTimeCountdown, 1)

    return () => clearInterval(realTimeInterval)
  }, [countdownDate, startDate])

  useEffect(() => {
    const crosshairInterval = setInterval(() => {
      setCrosshairIndex(prevIndex => (prevIndex === 12 ? 1 : prevIndex + 1))
    }, 1000)

    return () => clearInterval(crosshairInterval)
  }, [])

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
    <div className='flex min-h-screen flex-col animated-gradient-light items-center'>
      <Head>
        <title>{`Fortnite Chapter 6 Season 3 Countdown Timer - Timenite`}</title>
        <meta
          name='description'
          content={`Live countdown to Fortnite Chapter 6 Season 3 ending on ${formattedEndDate}. Track the exact time remaining with our real-time countdown timer.`}
        />
        <meta
          name='keywords'
          content='Fortnite, Chapter 6, Season 3, Countdown, Timer, Battle Pass, Season End, Timenite'
        />
        <meta property="og:title" content="Fortnite Chapter 6 Season 3 Countdown Timer" />
        <meta property="og:description" content={`Track when Fortnite Chapter 6 Season 3 ends. Live countdown timer showing exact time remaining.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel='icon'
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='90' font-weight='bold'%3E⏰%3C/text%3E%3C/svg%3E"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Timenite - Fortnite Season Countdown",
              "description": `Live countdown timer for Fortnite Chapter 6 Season 3. See exactly when the current season ends.`,
              "url": "https://timenite.com",
              "applicationCategory": "GameApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>
      <nav className='w-full flex justify-center'>
        <div className='w-full max-w-4xl flex justify-between items-center p-4 text-white'>
          <span className='text-3xl font-bold'>Timenite</span>
          <div className='flex gap-6'>
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
        </div>
      </nav>
      {renderAdImageWithCrosshair(
        '/Timenite Ads/Mobile_X.png',
        450,
        300,
        'md:hidden',
        'https://centerpointgaming.com',
        'X',
        40
      )}
      <div className='flex-grow w-full flex flex-col md:flex-row items-center justify-center'>
        <div className='flex-1 flex justify-start ml-2'>
          {renderAdImageWithCrosshair(
            '/Timenite Ads/PC_X.png',
            200,
            150,
            'hidden md:inline-flex',
            'https://centerpointgaming.com',
            'X',
            40
          )}
        </div>
        <div className='text-center'>
          <h1 className='text-6xl font-bold text-white'>Fortnite Chapter 6 Season 3 Countdown</h1>
          {endDateObj && (
            <div className='mt-2'>
              <p className='text-xl text-white/90'>
                Season ends {formattedEndDate} at {formattedEndTime}
              </p>
            </div>
          )}
          <div
            className='w-full bg-white/20 backdrop-blur-sm rounded-lg mt-4 relative border border-white/30 overflow-hidden'
            style={{ height: '40px' }}
          >
            <div
              className={`bg-gradient-to-r from-purple-600 to-blue-600 absolute top-0 left-0 h-full`}
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
              }}
            />
            <div
              className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-semibold'
              style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}
            >
              {progress}%
            </div>
          </div>

          <p className='text-white mt-4 text-2xl'>{timeLeft}</p>
          {countdownDate && Date.now() < countdownDate && (
            <p className='text-white/70 mt-2 text-lg'>
              {Math.ceil((countdownDate - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
            </p>
          )}
        </div>
        <div className='flex-1 flex justify-end mr-2'>
          {renderAdImageWithCrosshair(
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
      {renderAdImageWithCrosshair(
        '/Timenite Ads/Mobile_V2.png',
        450,
        80,
        'md:hidden',
        'https://centerpointgaming.com/crosshairv2.html',
        'V2',
        20
      )}
      <div className='flex items-center justify-center px-4'>
        <div className='text-center max-w-3xl'>
          <p className='text-xl text-white mt-4 mb-2'>
            <span className='font-semibold'>Fortnite Chapter 6 Season 3</span> began on{' '}
            {startDate && new Date(startDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className='text-lg text-white/80'>
            {progress > 0 && progress < 100 && (
              <>The Fortnite season is <span className='font-semibold text-yellow-300'>{Math.round(progress)}% complete</span> with approximately <span className='font-semibold text-yellow-300'>{Math.ceil((countdownDate - Date.now()) / (1000 * 60 * 60 * 24))} days</span> remaining until the next Fortnite season begins.</>
            )}
            {progress >= 100 && (
              <>The Fortnite season has ended!</>
            )}
          </p>
          <p className='text-sm text-white/60 mt-3'>
            Know exactly when the current Fortnite season ends with our live countdown timer.
          </p>
        </div>
      </div>
      <footer className='w-full flex justify-center'>
        <div className='w-full max-w-4xl text-center p-4 text-white/60 text-sm'>
          © 2025 CenterPoint Gaming
        </div>
      </footer>
    </div>
  )
}
