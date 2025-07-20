const { scrapeFortniteSeasonData, scrapeFortniteSeasonDataFallback } = require('../../../lib/scraper');
const { advancedScrapeFortniteData, scrapeFromPageScript } = require('../../../lib/advanced-scraper');
const { scrapeWithProxy } = require('../../../lib/proxy-scraper');

// Cache the data for 30 minutes
let cache = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  try {
    // Check cache first
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cache.data);
    }

    // Try proxy scraper first (most likely to work)
    let seasonData = await scrapeWithProxy();
    
    // If proxy fails, try advanced scraper
    if (!seasonData.isDataValid) {
      console.log('Proxy scraper failed, trying advanced scraper...');
      seasonData = await advancedScrapeFortniteData();
    }
    
    // If advanced scraper fails, try API endpoint
    if (!seasonData.isDataValid) {
      console.log('Advanced scraper failed, trying API endpoint...');
      const apiData = await scrapeFromPageScript();
      if (apiData) {
        seasonData = apiData;
      }
    }
    
    // If still no data, try original scrapers
    if (!seasonData.isDataValid) {
      console.log('Trying original scrapers...');
      seasonData = await scrapeFortniteSeasonData();
      
      if (!seasonData.isDataValid) {
        console.log('Primary scraper failed, trying fallback...');
        seasonData = await scrapeFortniteSeasonDataFallback();
      }
    }

    // If we have valid data from scraping
    if (seasonData.isDataValid && seasonData.endDate) {
      const endDate = new Date(seasonData.endDate);
      
      // Calculate start date (assuming ~12 week seasons)
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 84); // 12 weeks back
      
      const responseData = {
        startDate: startDate.getTime(),
        countdownDate: endDate.getTime(),
        seasonNumber: seasonData.currentSeason || 30, // Default to 30 if not found
        isDataValid: true
      };

      // Update cache
      cache = {
        data: responseData,
        timestamp: now
      };

      return res.status(200).json(responseData);
    }

    // If scraping failed, try the old method as a last resort
    console.log('All scrapers failed, trying original method...');
    const response = await fetch(
      'https://fortniteprogress.com/assets/js/main.min.js'
    );
    const data = await response.text();
    const startStr = 'const start=new Date(';
    const endStr = ').getTime(),end=new Date(';
    const endStrClose = ').getTime();';

    const startIdx = data.indexOf(startStr) + startStr.length;
    const endIdx = data.indexOf(endStr) + endStr.length;
    const closeIdx = data.indexOf(endStrClose, endIdx);

    if (startIdx === -1 || endIdx === -1 || closeIdx === -1) {
      throw new Error('Failed to extract dates from all sources');
    }

    const startTimestamp =
      Number(data.substring(startIdx, endIdx - endStr.length)) * 1e5;
    const endTimestamp = Number(data.substring(endIdx, closeIdx)) * 1e5;

    const correctedStartTimestamp = startTimestamp / 1e5;
    const correctedEndTimestamp = endTimestamp / 1e5;

    const responseData = {
      startDate: correctedStartTimestamp,
      countdownDate: correctedEndTimestamp,
      seasonNumber: 30,
      isDataValid: true
    };

    // Update cache
    cache = {
      data: responseData,
      timestamp: now
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching countdown data from all sources:', error);
    
    // Return error response to trigger downtime UI
    res.status(200).json({
      isDataValid: false,
      error: 'Unable to fetch season countdown data',
      message: error.message
    });
  }
}
