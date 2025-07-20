import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Footer from '../../components/Footer'

export default function About() {
  const [showAds, setShowAds] = useState(true)
  const [crosshairIndex, setCrosshairIndex] = useState(1)
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedShowAds = localStorage.getItem('timenite_show_ads')
    if (savedShowAds !== null) {
      setShowAds(savedShowAds === 'true')
    }
  }, [])
  
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
  
  const renderAdImageWithCrosshair = (imageSrc, width, height, className = '', link = '', source = '', linkOffset = 0) => {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Image
            src={imageSrc}
            alt={`CenterPoint Gaming Ad - ${source}`}
            width={width}
            height={height}
            className='object-contain'
            priority
          />
        </a>
        <div
          className='absolute pointer-events-none transition-all duration-1000 ease-linear'
          style={{
            top: `${height / 2 - 50}px`,
            left: `${width / 2 - 50 + linkOffset}px`,
            width: '100px',
            height: '100px',
          }}
        >
          <Image
            src={`/dynamic_crosshairs/Crosshair${crosshairIndex}.svg`}
            alt='Crosshair'
            width={100}
            height={100}
            className='w-full h-full'
          />
        </div>
      </div>
    )
  }
  return (
    <div className='flex min-h-screen flex-col animated-gradient-dark items-center fade-in'>
      <Head>
        <title>About Timenite - Fortnite Countdown Timer</title>
        <meta
          name='description'
          content='Learn about Timenite, the premier Fortnite countdown timer created by Priyam Raj in 2019 and acquired by CenterPoint Gaming in 2023.'
        />
        <link
          rel='icon'
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='90' font-weight='bold'%3E⏰%3C/text%3E%3C/svg%3E"
        />
      </Head>
      
      <nav className='w-full flex justify-center'>
        <div className='w-full max-w-4xl flex justify-between items-center p-3 md:p-4 text-white'>
          <Link href="/" className='text-xl md:text-3xl font-bold'>
            Timenite
          </Link>
          
          <div className='flex items-center gap-3 md:gap-6'>
            {/* Nav Links */}
            <div className='flex gap-2 md:gap-4 text-xs md:text-base'>
              <Link href='/' className='text-white hover:text-yellow-300 transition-colors'>
                Home
              </Link>
              <Link href='/embed-config' className='text-white hover:text-yellow-300 transition-colors'>
                Embed
              </Link>
              <a href='https://x.com/timenite' className='text-white hover:text-yellow-300 transition-colors'>
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

      <div className='flex-grow w-full flex items-center justify-center px-4'>
        <div className='max-w-3xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-8 text-center'>About Timenite</h1>
          
          <div className='space-y-6 text-white/90'>
            <section>
              <h2 className='text-2xl font-semibold mb-3 text-yellow-300'>Our Story</h2>
              <p className='leading-relaxed'>
                Timenite was created by <a href='https://priyamraj.com' target='_blank' rel='noopener noreferrer' className='font-semibold text-yellow-300 hover:text-yellow-400 transition-colors underline'>Priyam Raj</a> in 2019 as a simple yet essential tool for Fortnite players. 
                Born from the need to track exactly when each Fortnite season would end, Timenite quickly became the go-to countdown timer 
                for players worldwide.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-3 text-yellow-300'>The Acquisition</h2>
              <p className='leading-relaxed'>
                In 2023, Timenite was acquired by <a href='https://centerpointgaming.com' target='_blank' rel='noopener noreferrer' className='font-semibold text-yellow-300 hover:text-yellow-400 transition-colors underline'>CenterPoint Gaming</a>, a Canadian software company 
                known for creating CrosshairX, the popular gaming crosshair overlay tool. This acquisition brought new resources and 
                expertise to Timenite, ensuring it remains the most accurate and reliable Fortnite countdown timer available.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-3 text-yellow-300'>What We Do</h2>
              <p className='leading-relaxed'>
                Timenite provides real-time countdown timers for Fortnite seasons, helping players:
              </p>
              <ul className='list-disc list-inside mt-3 space-y-2 ml-4'>
                <li>Track exactly when the current season ends</li>
                <li>Know when to expect new content and updates</li>
                <li>Stay informed about season changes in their local timezone</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-3 text-yellow-300'>CenterPoint Gaming</h2>
              <p className='leading-relaxed'>
                <a href='https://centerpointgaming.com' target='_blank' rel='noopener noreferrer' className='font-semibold text-yellow-300 hover:text-yellow-400 transition-colors underline'>CenterPoint Gaming</a> is dedicated to creating tools that enhance the gaming experience. From CrosshairX to Timenite, 
                we believe in building simple, effective tools that solve real problems for the gaming community.
              </p>
            </section>

            <div className='mt-8 pt-8 border-t border-white/20 text-center'>
              <Link href="/" className='inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium'>
                ← Back to Countdown
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}