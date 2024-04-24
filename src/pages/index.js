import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'

export default function Home () {
  const [progress, setProgress] = useState(6)
  const [timeLeft, setTimeLeft] = useState('')
  const [seasonNumber, setSeasonNumber] = useState(0)
  const [startDate, setStartDate] = useState(null)
  const [countdownDate, setCountdownDate] = useState(null)
  const [crosshairIndex, setCrosshairIndex] = useState(1)

  useEffect(() => {
    const fetchCountdown = async () => {
      const res = await fetch('/api/fetchCountdown')
      const data = await res.json()
      setStartDate(data.startDate)
      setCountdownDate(data.countdownDate)
      setSeasonNumber(data.seasonNumber)
      return data
    }

    fetchCountdown()

    const fetchInterval = setInterval(fetchCountdown, 5000)

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

  return (
    <div className='flex min-h-screen flex-col bg-timenitePrimary items-center'>
      <Head>
        <title>Season 2 Countdown for Fortnite - Timenite</title>
        <meta
          name='description'
          content='Countdown to the next Season on Fortnite'
        />
        <meta
          name='keywords'
          content='Fortnite, Season 2, Countdown, Timenite'
        />
        <link
          rel='icon'
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='90' font-weight='bold'%3E⏰%3C/text%3E%3C/svg%3E"
        />
      </Head>
      <nav className='w-full flex justify-between items-center p-4 text-white'>
        <span className='text-3xl'>Timenite</span>
        <div className='flex gap-4'>
          <a href='https://twitter.com/CenterPointG' className='text-white'>
            Twitter
          </a>
          <a href='https://discord.gg/customcrosshair' className='text-white'>
            Discord
          </a>
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
          <h1 className='text-6xl font-bold text-white'>Season 2 Countdown</h1>
          <div
            className='w-full bg-white rounded-lg mt-4 relative'
            style={{ height: '40px' }}
          >
            <div
              className={`bg-timeniteSecondary rounded-lg absolute`}
              style={{
                width: `${progress}%`,
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: progress > 15 ? 'white' : 'transparent'
              }}
            >
              {progress}%
            </div>
            {progress <= 15 && (
              <div
                className='text-sm font-medium text-black leading-none rounded-lg w-full h-full flex items-center justify-center absolute'
                style={{
                  lineHeight: '40px'
                }}
              >
                {progress}%
              </div>
            )}
          </div>

          <p className='text-white mt-4 text-2xl'>{timeLeft}</p>
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
      <div className='flex items-center justify-center'>
        <p className='text-xl text-white mt-4'>
          This is the {seasonNumber}th season in Fortnite that started on{' '}
          {new Date(startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}{' '}
          and will end on{' '}
          {new Date(countdownDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          .
        </p>
      </div>
      <footer className='w-full text-center p-4  text-white'>
        By CenterPointGaming
      </footer>
    </div>
  )
}
