const { scrapeWithProxy } = require('./proxy-scraper');
const { advancedScrapeFortniteData } = require('./advanced-scraper');

class CacheService {
  constructor() {
    this.cache = {
      data: null,
      timestamp: 0,
      isUpdating: false
    };
    
    // Start the automatic refresh
    this.startAutoRefresh();
    
    // Initial fetch
    this.updateCache();
  }
  
  async updateCache() {
    if (this.cache.isUpdating) {
      console.log('[CacheService] Update already in progress, skipping...');
      return;
    }
    
    this.cache.isUpdating = true;
    console.log('[CacheService] Updating cache...');
    
    try {
      // Try proxy scraper first
      let seasonData = await scrapeWithProxy();
      console.log('[CacheService] Proxy scraper result:', JSON.stringify(seasonData));
      
      // If proxy fails, try advanced scraper
      if (!seasonData.isDataValid) {
        console.log('[CacheService] Proxy failed, trying advanced scraper...');
        seasonData = await advancedScrapeFortniteData();
        console.log('[CacheService] Advanced scraper result:', JSON.stringify(seasonData));
      }
      
      // If we have valid data, process it
      if (seasonData.isDataValid && seasonData.endDate) {
        const endDate = new Date(seasonData.endDate);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 84); // 12 weeks back
        
        this.cache.data = {
          startDate: startDate.getTime(),
          countdownDate: endDate.getTime(),
          seasonNumber: seasonData.currentSeason || 30,
          chapter: seasonData.chapter,
          season: seasonData.season,
          isDataValid: true
        };
        
        this.cache.timestamp = Date.now();
        console.log('[CacheService] Cache updated successfully');
      } else {
        console.log('[CacheService] All scrapers failed, keeping existing cache');
      }
    } catch (error) {
      console.error('[CacheService] Error updating cache:', error);
    } finally {
      this.cache.isUpdating = false;
    }
  }
  
  startAutoRefresh() {
    // Update every 30 seconds
    setInterval(() => {
      this.updateCache();
    }, 30 * 1000);
    
    console.log('[CacheService] Auto-refresh started (30 second interval)');
  }
  
  getCache() {
    return this.cache.data;
  }
  
  getCacheAge() {
    return Date.now() - this.cache.timestamp;
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;