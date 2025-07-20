const fetch = require('node-fetch');
const cheerio = require('cheerio');

// List of public CORS proxies to try
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors.bridged.cc/',
  'https://cors-proxy.htmldriven.com/?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://api.codetabs.com/v1/proxy?quest='
];

async function scrapeWithProxy() {
  const targetUrl = 'https://fortnite.gg/season-countdown';
  
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`Trying proxy: ${proxy}`);
      const proxyUrl = proxy + encodeURIComponent(targetUrl);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000 // 10 second timeout
      });
      
      if (response.ok) {
        const html = await response.text();
        
        // Check if we got real content
        if (html.includes('countdown') || html.includes('season') || html.includes('fortnite')) {
          console.log('Proxy fetch successful!');
          return parseProxyData(html);
        }
      }
    } catch (error) {
      console.log(`Proxy ${proxy} failed:`, error.message);
      continue;
    }
  }
  
  return {
    currentSeason: null,
    startDate: null,
    endDate: null,
    isDataValid: false,
    error: 'All proxy attempts failed'
  };
}

function parseProxyData(html) {
  const $ = cheerio.load(html);
  const seasonData = {
    currentSeason: null,
    startDate: null,
    endDate: null,
    isDataValid: false
  };
  
  // Look for countdown with various selectors
  const selectors = [
    '#big-countdown[data-target]',
    '[data-target]',
    '.countdown[data-target]',
    '[data-countdown]',
    '[data-end]'
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length) {
      const timestamp = element.attr('data-target') || 
                       element.attr('data-countdown') || 
                       element.attr('data-end');
      
      if (timestamp) {
        const endDate = new Date(parseInt(timestamp));
        if (!isNaN(endDate.getTime()) && endDate > new Date()) {
          seasonData.endDate = endDate.toISOString();
          seasonData.isDataValid = true;
          
          // Calculate start date
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 84);
          seasonData.startDate = startDate.toISOString();
          break;
        }
      }
    }
  }
  
  // Try to extract from text if no data attribute found
  if (!seasonData.isDataValid) {
    const text = $('body').text();
    
    // Look for dates in various formats
    const datePatterns = [
      /August\s+\d{1,2},?\s+2025/i,
      /\d{1,2}\/\d{1,2}\/2025/,
      /2025-\d{2}-\d{2}/,
      /ends?\s+on\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const dateStr = match[0] || match[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime()) && date > new Date()) {
          seasonData.endDate = date.toISOString();
          seasonData.isDataValid = true;
          
          const startDate = new Date(date);
          startDate.setDate(startDate.getDate() - 84);
          seasonData.startDate = startDate.toISOString();
          break;
        }
      }
    }
  }
  
  // Look for season number
  const seasonMatch = $('body').text().match(/Chapter\s*(\d+)\s*Season\s*(\d+)/i);
  if (seasonMatch) {
    const chapter = parseInt(seasonMatch[1]);
    const season = parseInt(seasonMatch[2]);
    seasonData.currentSeason = ((chapter - 1) * 4) + season + 20;
  }
  
  return seasonData;
}

module.exports = {
  scrapeWithProxy
};