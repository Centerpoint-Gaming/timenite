const fetch = require('node-fetch');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { bypassCloudflare, extractDataFromPartialHTML } = require('./cloudflare-bypass');

// Advanced scraping function with multiple bypass techniques
async function advancedScrapeFortniteData() {
  // First try Cloudflare bypass
  console.log('Attempting Cloudflare bypass...');
  const bypassResult = await bypassCloudflare();
  if (bypassResult.success) {
    console.log('Cloudflare bypass successful!');
    return parseFortniteData(bypassResult.html);
  }
  
  const strategies = [
    // Strategy 1: Random user agent with full browser headers
    async () => {
      const userAgent = new UserAgent({ deviceCategory: 'desktop' });
      const response = await fetch('https://fortnite.gg/season-countdown', {
        headers: {
          'User-Agent': userAgent.toString(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'max-age=0',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Connection': 'keep-alive'
        },
        redirect: 'follow',
        follow: 10
      });
      return response;
    },
    
    // Strategy 2: Mobile user agent
    async () => {
      const mobileAgent = new UserAgent({ deviceCategory: 'mobile' });
      const response = await fetch('https://fortnite.gg/season-countdown', {
        headers: {
          'User-Agent': mobileAgent.toString(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      return response;
    },
    
    // Strategy 3: Googlebot user agent (sometimes allowed through)
    async () => {
      const response = await fetch('https://fortnite.gg/season-countdown', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        }
      });
      return response;
    },
    
    // Strategy 4: Try with referer from Google
    async () => {
      const userAgent = new UserAgent();
      const response = await fetch('https://fortnite.gg/season-countdown', {
        headers: {
          'User-Agent': userAgent.toString(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      return response;
    },
    
    // Strategy 5: Try different URL variations
    async () => {
      const urls = [
        'https://fortnite.gg/season-countdown',
        'https://www.fortnite.gg/season-countdown',
        'http://fortnite.gg/season-countdown'
      ];
      
      for (const url of urls) {
        try {
          const userAgent = new UserAgent();
          const response = await fetch(url, {
            headers: {
              'User-Agent': userAgent.toString(),
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });
          if (response.ok) return response;
        } catch (e) {
          continue;
        }
      }
      throw new Error('All URL variations failed');
    }
  ];
  
  // Try each strategy
  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Trying strategy ${i + 1}...`);
      const response = await strategies[i]();
      
      if (response.ok) {
        const html = await response.text();
        return parseFortniteData(html);
      }
      
      console.log(`Strategy ${i + 1} failed with status: ${response.status}`);
    } catch (error) {
      console.log(`Strategy ${i + 1} error:`, error.message);
    }
  }
  
  // If all strategies fail, return error
  return {
    currentSeason: null,
    startDate: null,
    endDate: null,
    isDataValid: false,
    error: 'All scraping strategies failed'
  };
}

// Parse the HTML to extract countdown data
function parseFortniteData(html) {
  const $ = cheerio.load(html);
  const seasonData = {
    currentSeason: null,
    chapter: null,
    season: null,
    startDate: null,
    endDate: null,
    isDataValid: false
  };
  
  // Look for countdown element with data-target
  const countdownElement = $('#big-countdown');
  if (countdownElement.length) {
    const targetTimestamp = countdownElement.attr('data-target');
    if (targetTimestamp) {
      const endDate = new Date(parseInt(targetTimestamp));
      if (!isNaN(endDate.getTime()) && endDate > new Date()) {
        seasonData.endDate = endDate.toISOString();
        seasonData.isDataValid = true;
      }
    }
  }
  
  // Try to find timestamp in scripts
  if (!seasonData.isDataValid) {
    const scripts = $('script').text();
    const timestampMatch = scripts.match(/data-target=['"](\d+)['"]/);
    if (timestampMatch) {
      const endDate = new Date(parseInt(timestampMatch[1]));
      if (!isNaN(endDate.getTime()) && endDate > new Date()) {
        seasonData.endDate = endDate.toISOString();
        seasonData.isDataValid = true;
      }
    }
  }
  
  // Look for season info - check multiple sources
  let seasonText = $('title').text() + ' ';
  $('h1, h2, h3, .season-countdown, [class*="chapter"], [class*="season"]').each((i, elem) => {
    seasonText += ' ' + $(elem).text();
  });
  
  const chapterMatch = seasonText.match(/Chapter\s*(\d+)\s*Season\s*(\d+)/i);
  if (chapterMatch) {
    seasonData.chapter = parseInt(chapterMatch[1]);
    seasonData.season = parseInt(chapterMatch[2]);
    
    // Calculate total season number accurately
    const seasonCounts = { 1: 10, 2: 8, 3: 4, 4: 5, 5: 4 };
    let totalSeasons = 0;
    for (let ch = 1; ch < seasonData.chapter; ch++) {
      totalSeasons += seasonCounts[ch] || 4;
    }
    seasonData.currentSeason = totalSeasons + seasonData.season;
  }
  
  // Calculate start date if we have end date
  if (seasonData.endDate) {
    const endDate = new Date(seasonData.endDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 84); // ~12 weeks
    seasonData.startDate = startDate.toISOString();
  }
  
  return seasonData;
}

// Alternative: Try to get data from the page's JavaScript
async function scrapeFromPageScript() {
  try {
    // Sometimes the countdown data is loaded via JavaScript
    // We can try to access the API endpoint directly if we find it
    const response = await fetch('https://fortnite.gg/api/season-countdown', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        currentSeason: data.season || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        isDataValid: true
      };
    }
  } catch (error) {
    // API endpoint doesn't exist or is blocked
  }
  
  return null;
}

module.exports = {
  advancedScrapeFortniteData,
  scrapeFromPageScript
};