export default function handler (req, res) {
  const countdownDate = new Date('2024-05-24T04:00:00Z').getTime()
  const startDate = new Date('2024-03-09T14:00:00Z').getTime()
  res.status(200).json({ countdownDate, startDate, seasonNumber: 29 })
}
