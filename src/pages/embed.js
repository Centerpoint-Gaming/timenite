import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Embed() {
  const router = useRouter();
  const [progress, setProgress] = useState(6);
  const [timeLeft, setTimeLeft] = useState('');
  const [seasonNumber, setSeasonNumber] = useState(0);
  const [chapter, setChapter] = useState(null);
  const [season, setSeason] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [countdownDate, setCountdownDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataValid, setIsDataValid] = useState(true);
  
  // Get config from URL params
  const transparent = router.query.transparent === '1';

  useEffect(() => {
    const CACHE_KEY = 'timenite_countdown_data_v3';
    const CACHE_DURATION = 2 * 60 * 1000;
    
    // First, try to load from cache immediately
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      if (data.isDataValid) {
        setIsDataValid(true);
        setStartDate(data.startDate);
        setCountdownDate(data.countdownDate);
        setSeasonNumber(data.seasonNumber);
        setChapter(data.chapter);
        setSeason(data.season);
        
        // Calculate initial time left immediately
        const now = Date.now();
        const distance = data.countdownDate - now;
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('EXPIRED');
        }
      }
    } else {
      setIsLoading(true);
    }
    
    const fetchCountdown = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION && data.isDataValid) {
            return;
          }
        }
        
        const res = await fetch('/api/fetchCountdown');
        const data = await res.json();
        
        if (!data.isDataValid) {
          setIsDataValid(false);
          return;
        }
        
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        
        setIsDataValid(true);
        setStartDate(data.startDate);
        setCountdownDate(data.countdownDate);
        setSeasonNumber(data.seasonNumber);
        setChapter(data.chapter);
        setSeason(data.season);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching countdown:', error);
        if (!chapter && !season) {
          setIsDataValid(false);
        }
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountdown();
    const fetchInterval = setInterval(fetchCountdown, 5 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const updateRealTimeCountdown = () => {
      if (!countdownDate || !startDate) return;

      const now = Date.now();
      const totalDuration = countdownDate - startDate;
      const elapsed = now - startDate;
      const calculatedProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
      setProgress(Math.round(calculatedProgress));

      const distance = countdownDate - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const realTimeInterval = setInterval(updateRealTimeCountdown, 1000);
    return () => clearInterval(realTimeInterval);
  }, [countdownDate, startDate]);

  if (!isDataValid) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: transparent ? 'transparent' : '#000428',
        color: '#ffffff'
      }}>
        <p>Unable to load countdown data</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Fortnite Countdown Embed - Timenite</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div 
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: transparent ? 'transparent' : '#000428',
          color: '#ffffff',
          fontFamily: '"curseCasual", sans-serif'
        }}
      >
        {isLoading || timeLeft === '' ? (
          <div style={{ fontSize: '5rem', opacity: 0.5 }}>Loading...</div>
        ) : (
          <p style={{ 
            fontSize: '5rem',
            fontWeight: 'bold',
            margin: 0,
            lineHeight: 1,
            textAlign: 'center'
          }}>
            {timeLeft}
          </p>
        )}

      </div>
    </>
  );
}