export default async function handler (req, res) {
  try {
    const response = await fetch(
      'https://fortniteprogress.com/assets/js/main.min.js'
    )
    const data = await response.text()
    const startStr = 'const start=new Date('
    const endStr = ').getTime(),end=new Date('
    const endStrClose = ').getTime();'

    const startIdx = data.indexOf(startStr) + startStr.length
    const endIdx = data.indexOf(endStr) + endStr.length
    const closeIdx = data.indexOf(endStrClose, endIdx)

    if (startIdx === -1 || endIdx === -1 || closeIdx === -1) {
      throw new Error('Failed to extract dates')
    }

    const startTimestamp =
      Number(data.substring(startIdx, endIdx - endStr.length)) * 1e5
    const endTimestamp = Number(data.substring(endIdx, closeIdx)) * 1e5

    const correctedStartTimestamp = startTimestamp / 1e5
    const correctedEndTimestamp = endTimestamp / 1e5

    res.status(200).json({
      startDate: correctedStartTimestamp,
      countdownDate: correctedEndTimestamp,
      seasonNumber: 29
    })
  } catch (error) {
    console.error('Error fetching or parsing countdown data:', error)
    const fallbackStartDate = '2024-03-09T14:00:00Z'
    const fallbackEndDate = '2024-05-24T04:00:00Z'

    res.status(200).json({
      countdownDate: new Date(fallbackEndDate).getTime(),
      startDate: new Date(fallbackStartDate).getTime(),
      seasonNumber: 29
    })
  }
}
