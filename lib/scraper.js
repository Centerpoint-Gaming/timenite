const cheerio = require('cheerio');

async function scrapeFortniteSeasonData() {
  try {
    const response = await fetch('https://fortnite.gg/season-countdown', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to find countdown elements - these selectors may need adjustment based on actual HTML
    const seasonData = {
      currentSeason: null,
      startDate: null,
      endDate: null,
      isDataValid: false
    };

    // Look for season number - try multiple selectors
    const seasonSelectors = ['.season-countdown h1', '.season-info', '.current-season', 'h1', 'h2'];
    let seasonText = '';
    
    for (const selector of seasonSelectors) {
      const element = $(selector);
      if (element.length) {
        seasonText += ' ' + element.text();
      }
    }
    
    // Look for Chapter 6 Season 3 pattern
    const chapterMatch = seasonText.match(/Chapter\s*(\d+)\s*Season\s*(\d+)/i);
    if (chapterMatch) {
      const chapter = parseInt(chapterMatch[1]);
      const season = parseInt(chapterMatch[2]);
      // Calculate total season number (assuming 4 seasons per chapter for chapters 1-3, then varies)
      // This is approximate - you may need to adjust based on actual Fortnite history
      seasonData.currentSeason = ((chapter - 1) * 4) + season + 20; // Rough estimate
    } else {
      // Fallback to just Season X pattern
      const seasonMatch = seasonText.match(/Season\s*(\d+)/i);
      if (seasonMatch) {
        seasonData.currentSeason = parseInt(seasonMatch[1]);
      }
    }

    // Look for the main countdown element with data-target attribute
    const countdownElement = $('#big-countdown');
    if (countdownElement.length) {
      const targetTimestamp = countdownElement.attr('data-target');
      if (targetTimestamp) {
        // Convert timestamp to date
        const endDate = new Date(parseInt(targetTimestamp));
        if (!isNaN(endDate.getTime()) && endDate > new Date()) {
          seasonData.endDate = endDate.toISOString();
          seasonData.isDataValid = true;
        }
      }
    }

    // If that didn't work, try other selectors
    if (!seasonData.isDataValid) {
      const dateSelectors = [
        '.season-countdown h3 span',
        '.season-countdown h3',
        '[data-countdown]',
        '[data-target]'
      ];

      for (const selector of dateSelectors) {
        const element = $(selector).first();
        if (element.length) {
          // Check for data attributes
          const targetAttr = element.attr('data-target') || element.attr('data-countdown');
          if (targetAttr) {
            const timestamp = parseInt(targetAttr);
            if (!isNaN(timestamp)) {
              const date = new Date(timestamp);
              if (!isNaN(date.getTime()) && date > new Date()) {
                seasonData.endDate = date.toISOString();
                seasonData.isDataValid = true;
                break;
              }
            }
          }
          
          // Check text content for date patterns
          const text = element.text().trim();
          const dateMatch = text.match(/(\w+\s+\d{1,2},?\s+\d{4})|(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/);
          if (dateMatch) {
            const date = new Date(dateMatch[0]);
            if (!isNaN(date.getTime()) && date > new Date()) {
              seasonData.endDate = date.toISOString();
              seasonData.isDataValid = true;
              break;
            }
          }
        }
      }
    }

    // If we couldn't find structured data, try to parse from script tags
    if (!seasonData.isDataValid) {
      $('script').each((i, elem) => {
        const scriptContent = $(elem).html();
        if (scriptContent && scriptContent.includes('countdown')) {
          // Look for JSON data or date variables
          const datePattern = /["']end["']?\s*:\s*["']([^"']+)["']|endDate\s*[:=]\s*["']([^"']+)["']/;
          const match = scriptContent.match(datePattern);
          if (match) {
            seasonData.endDate = match[1] || match[2];
            seasonData.isDataValid = true;
            return false; // break the loop
          }
        }
      });
    }

    // Validate the parsed date
    if (seasonData.endDate) {
      const parsedDate = new Date(seasonData.endDate);
      if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
        seasonData.isDataValid = false;
      }
    }

    return seasonData;
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      currentSeason: null,
      startDate: null,
      endDate: null,
      isDataValid: false,
      error: error.message
    };
  }
}

// Alternative scraping function with more aggressive parsing
async function scrapeFortniteSeasonDataFallback() {
  try {
    const response = await fetch('https://fortnite.gg/season-countdown', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const html = await response.text();
    
    // Look for any date-like patterns in the entire HTML
    const datePatterns = [
      /Season\s*ends?\s*(?:on\s*)?([A-Za-z]+\s*\d{1,2},?\s*\d{4})/i,
      /End\s*date:\s*([A-Za-z]+\s*\d{1,2},?\s*\d{4})/i,
      /Until\s*([A-Za-z]+\s*\d{1,2},?\s*\d{4})/i,
      /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/,
      /new\s*Date\(['"]([^'"]+)['"]\)/
    ];

    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match) {
        const date = new Date(match[1]);
        if (!isNaN(date.getTime()) && date > new Date()) {
          return {
            currentSeason: null,
            startDate: null,
            endDate: match[1],
            isDataValid: true
          };
        }
      }
    }

    return {
      currentSeason: null,
      startDate: null,
      endDate: null,
      isDataValid: false,
      error: 'Could not parse date from page'
    };
  } catch (error) {
    return {
      currentSeason: null,
      startDate: null,
      endDate: null,
      isDataValid: false,
      error: error.message
    };
  }
}
module.exports = {
  scrapeFortniteSeasonData,
  scrapeFortniteSeasonDataFallback
};
