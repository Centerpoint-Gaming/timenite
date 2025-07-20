const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Cloudflare bypass techniques
async function bypassCloudflare() {
  const strategies = [
    // Strategy 1: Try with TLS fingerprinting headers
    async () => {
      const response = await fetch('https://fortnite.gg/season-countdown', {
        method: 'GET',
        headers: {
          'Host': 'fortnite.gg',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
          'TE': 'trailers'
        }
      });
      return response;
    },
    
    // Strategy 2: Try with cookie headers (simulate previous visit)
    async () => {
      const response = await fetch('https://fortnite.gg/season-countdown', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cookie': '__cf_bm=fake; cf_clearance=fake',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none'
        }
      });
      return response;
    },
    
    // Strategy 3: Use HTTP/1.1 with specific order
    async () => {
      const response = await fetch('https://fortnite.gg/season-countdown', {
        headers: {
          'GET /season-countdown HTTP/1.1': '',
          'Host': 'fortnite.gg',
          'Connection': 'keep-alive',
          'Cache-Control': 'max-age=0',
          'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-User': '?1',
          'Sec-Fetch-Dest': 'document',
          'Referer': 'https://fortnite.gg/',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      return response;
    }
  ];
  
  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Trying Cloudflare bypass strategy ${i + 1}...`);
      const response = await strategies[i]();
      
      if (response.ok) {
        const html = await response.text();
        
        // Check if we got actual content or Cloudflare challenge
        if (!html.includes('Checking your browser') && !html.includes('cf-browser-verification')) {
          return { success: true, html };
        }
      }
      
      console.log(`Strategy ${i + 1} status: ${response.status}`);
    } catch (error) {
      console.log(`Strategy ${i + 1} error:`, error.message);
    }
  }
  
  return { success: false, error: 'All Cloudflare bypass attempts failed' };
}

// Try to extract data even from partial HTML
function extractDataFromPartialHTML(html) {
  // Sometimes we might get partial data even with 403
  // Look for any JSON-LD data
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      if (data.endDate) {
        return {
          endDate: data.endDate,
          isDataValid: true
        };
      }
    } catch (e) {}
  }
  
  // Look for any date patterns in meta tags
  const metaDateMatch = html.match(/<meta[^>]*content="([^"]*2025[^"]*)"[^>]*>/);
  if (metaDateMatch) {
    const dateStr = metaDateMatch[1];
    const date = new Date(dateStr);
    if (!isNaN(date.getTime()) && date > new Date()) {
      return {
        endDate: date.toISOString(),
        isDataValid: true
      };
    }
  }
  
  return null;
}

module.exports = {
  bypassCloudflare,
  extractDataFromPartialHTML
};