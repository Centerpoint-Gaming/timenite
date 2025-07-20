import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/Footer';

export default function EmbedConfig() {
  const [transparent, setTransparent] = useState(false);
  const [width, setWidth] = useState('400');
  const [height, setHeight] = useState('150');
  const [embedCode, setEmbedCode] = useState('');

  useEffect(() => {
    generateEmbedCode();
  }, [transparent, width, height]);

  const generateEmbedCode = () => {
    const params = new URLSearchParams({
      transparent: transparent ? '1' : '0'
    });
    
    const embedUrl = `https://timenite.com/embed?${params.toString()}`;
    const code = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0"></iframe>`;
    setEmbedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  return (
    <div className='flex min-h-screen flex-col animated-gradient-dark items-center fade-in'>
      <Head>
        <title>Embed Timer - Timenite</title>
        <meta name='description' content='Embed Fortnite countdown timer in your stream or website' />
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
            <div className='flex gap-2 md:gap-4 text-xs md:text-base'>
              <Link href='/' className='text-white hover:text-yellow-300 transition-colors'>
                Home
              </Link>
              <Link href='/about' className='text-white hover:text-yellow-300 transition-colors'>
                About
              </Link>
              <a href='https://x.com/timenite' className='text-white hover:text-yellow-300 transition-colors'>
                Twitter
              </a>
              <a href='https://discord.gg/customcrosshair' className='text-white hover:text-yellow-300 transition-colors'>
                Discord
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className='flex-grow w-full flex items-center justify-center px-4'>
        <div className='max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20'>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-8 text-center'>Embed Timer Configuration</h1>
          
          <div className='space-y-6'>
            {/* Preview */}
            <div className='bg-black/30 rounded-lg p-4'>
              <h3 className='text-white font-semibold mb-3'>Preview</h3>
              <div 
                className='rounded-lg overflow-hidden'
                style={{ 
                  backgroundColor: transparent ? 'transparent' : '#000428',
                  backgroundImage: transparent ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px' : 'none'
                }}
              >
                <iframe 
                  src={`/embed?transparent=${transparent ? '1' : '0'}`}
                  width='100%'
                  height='150'
                  frameBorder='0'
                  className='w-full'
                />
              </div>
            </div>

            {/* Settings */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-white text-sm mb-2 block'>Width (pixels)</label>
                <input
                  type='number'
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className='w-full bg-black/30 text-white px-3 py-2 rounded'
                  placeholder='400'
                />
              </div>

              <div>
                <label className='text-white text-sm mb-2 block'>Height (pixels)</label>
                <input
                  type='number'
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className='w-full bg-black/30 text-white px-3 py-2 rounded'
                  placeholder='200'
                />
              </div>
            </div>

            {/* Toggles */}
            <div className='space-y-3'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={transparent}
                  onChange={(e) => setTransparent(e.target.checked)}
                  className='w-5 h-5'
                />
                <span className='text-white'>Transparent Background (for OBS overlays)</span>
              </label>
            </div>

            {/* Embed Code */}
            <div>
              <h3 className='text-white font-semibold mb-2'>Embed Code</h3>
              <div className='bg-black/30 rounded-lg p-4'>
                <code className='text-green-400 text-sm break-all'>{embedCode}</code>
              </div>
              <button
                onClick={copyToClipboard}
                className='mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors w-full'
              >
                Copy Embed Code
              </button>
            </div>

            {/* Instructions */}
            <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4'>
              <h4 className='text-yellow-300 font-semibold mb-2'>Instructions for Streamers</h4>
              <ul className='text-white/80 text-sm space-y-1 list-disc list-inside'>
                <li>Copy the embed code above</li>
                <li>In OBS, add a Browser Source</li>
                <li>Set the URL to the iframe src value</li>
                <li>Set width and height to match your settings</li>
                <li>Enable "Shutdown source when not visible" for performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}