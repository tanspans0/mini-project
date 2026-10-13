import StatusBadge from './StatusBadge'

export default function RoomCard({ room, status, occupant }) {
  const buildingClass = room.building === 'Old Building' ? 'accent-old' : 'accent-new'
  return (
    <div className={`card ${buildingClass}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0 }}>{room.id}</h4>
          <div className="tt-cell-meta">{room.building} · {room.floor}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="tt-cell-meta">{room.type} · Capacity {room.capacity}</div>
      {occupant && <div className="tt-cell-meta">Currently: {occupant}</div>}
    </div>
  )
}
