const MAP = {
  Available: 'good', Occupied: 'bad', Reserved: 'warn',
  confirmed: 'good', cancelled: 'bad', pending: 'warn',
  scheduled: 'good',
}

export default function StatusBadge({ status }) {
  const tone = MAP[status] || 'neutral'
  return (
    <span className={`badge badge-${tone}`}>
      <span className={`dot dot-${tone === 'neutral' ? 'warn' : tone}`} />
      {status}
    </span>
  )
}
