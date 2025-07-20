const cacheService = require('../../../lib/cache-service');

export default async function handler(req, res) {
  try {
    // Get data from the cache service
    const cachedData = cacheService.getCache();
    
    if (cachedData) {
      console.log('[API] Serving from cache service, age:', cacheService.getCacheAge() + 'ms');
      return res.status(200).json(cachedData);
    }
    
    // If no cache available yet (shouldn't happen after initial load)
    console.log('[API] No cache available, waiting for cache service...');
    
    // Wait a bit for cache service to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const retryData = cacheService.getCache();
    if (retryData) {
      return res.status(200).json(retryData);
    }
    
    // Return error response if still no data
    res.status(200).json({
      isDataValid: false,
      error: 'Cache service is initializing, please try again',
      message: 'The server is starting up'
    });
  } catch (error) {
    console.error('[API] Error:', error);
    
    res.status(200).json({
      isDataValid: false,
      error: 'Unable to fetch season countdown data',
      message: error.message
    });
  }
}