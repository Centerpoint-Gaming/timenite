import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home () {
  const [progress, setProgress] = useState(6)
  const [timeLeft, setTimeLeft] = useState('')
  const [seasonNumber, setSeasonNumber] = useState(0)
  const [startDate, setStartDate] = useState(null)
  const [countdownDate, setCountdownDate] = useState(null)

  useEffect(() => {
    const fetchCountdown = async () => {
      const res = await fetch('/api/fetchCountdown')
      const data = await res.json()
      setStartDate(data.startDate)
      setCountdownDate(data.countdownDate)
      setSeasonNumber(data.seasonNumber)
      console.log(data)
      return data
    }

    fetchCountdown() // Fetch immediately on component mount

    const fetchInterval = setInterval(fetchCountdown, 5000) // Then every 5 seconds

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

    const realTimeInterval = setInterval(updateRealTimeCountdown, 1) // Update every millisecond

    return () => clearInterval(realTimeInterval)
  }, [countdownDate, startDate]) // Depend on countdownDate and startDate to restart the interval when they change

  return (
    <div className='flex min-h-screen flex-col bg-timenitePrimary'>
      <Head>
        <title>Season 2 Countdown</title>
      </Head>
      <nav className='flex justify-between items-center p-4 text-white'>
        <span className='text-3xl'>Timenite</span>
        <div className='flex gap-4'>
          <a href='https://twitter.com/timenitedaily' className='text-white'>
            Twitter
          </a>
          <a href='https://discord.gg/zsxyqkvB5t' className='text-white'>
            Discord
          </a>
        </div>
      </nav>
      <div className='flex-grow flex items-center justify-center'>
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
      </div>
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
