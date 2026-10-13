export default function SeminarCard({ seminar }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ margin: 0 }}>{seminar.title}</h4>
        <span className={`badge ${seminar.status === 'Full' ? 'badge-bad' : 'badge-good'}`}>{seminar.status}</span>
      </div>
      <div className="tt-cell-meta">Speaker: {seminar.speaker}</div>
      <div className="tt-cell-meta">{seminar.date} · {seminar.time}</div>
      <div className="tt-cell-meta">{seminar.hall} · {seminar.floor} · {seminar.building}</div>
      <div className="tt-cell-meta">Organized by {seminar.committee}</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{seminar.seatsAvailable} / {seminar.seatsTotal} seats available</div>
    </div>
  )
}
