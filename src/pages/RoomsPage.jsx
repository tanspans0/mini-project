import { useState } from 'react'
import { rooms, roomTypes } from '../data/rooms'
import { DEMO_TODAY } from '../data/timetable'
import RoomCard from '../components/RoomCard'
import DashboardCard from '../components/DashboardCard'
import { useData } from '../context/DataContext'

export default function RoomsPage() {
  const { bookingsForRoomOnDate } = useData()
  const [building, setBuilding] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState(DEMO_TODAY)
  const [time, setTime] = useState('10:00')

  const filtered = rooms.filter(r => (!building || r.building === building) && (!type || r.type === type))

  function statusFor(room) {
    const dayBookings = bookingsForRoomOnDate(room.id, date)
    const active = dayBookings.find(b => b.start <= time && time < b.end)
    if (active) return { status: 'Occupied', occupant: active.purpose }
    const upcoming = dayBookings.find(b => b.start > time)
    if (upcoming) return { status: 'Reserved', occupant: `Booked ${upcoming.start}–${upcoming.end}` }
    return { status: 'Available', occupant: null }
  }

  return (
    <DashboardCard title="Room Availability">
      <div className="filter-bar">
        <select value={building} onChange={e => setBuilding(e.target.value)}>
          <option value="">All buildings</option>
          <option value="Old Building">Old Building</option>
          <option value="New Building">New Building</option>
        </select>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">All room types</option>
          {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">{'\u25A3'}</div>
          No rooms match these filters.
        </div>
      ) : (
        <div className="grid grid-3">
          {filtered.map(room => {
            const { status, occupant } = statusFor(room)
            return <RoomCard key={room.id} room={room} status={status} occupant={occupant} />
          })}
        </div>
      )}
    </DashboardCard>
  )
}
