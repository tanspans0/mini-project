export default function EventCard({ event }) {
  const d = new Date(event.date + 'T00:00:00')
  const day = d.getDate()
  const month = d.toLocaleDateString('en-IN', { month: 'short' })
  return (
    <div className="card event-card">
      <div className="event-head">
        <div className="event-date-badge"><span className="d">{day}</span><span className="m">{month}</span></div>
        <div>
          <h4 style={{ margin: 0 }}>{event.name}</h4>
          <div className="tt-cell-meta">{event.time}</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13 }}>{event.description}</p>
      <div className="tt-cell-meta">{event.venue} · {event.floor} · {event.building}</div>
      <div className="tt-cell-meta">Organized by {event.committee}</div>
    </div>
  )
}
