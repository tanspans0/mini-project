import { useState } from 'react'
import { useData } from '../context/DataContext'
import DashboardCard from '../components/DashboardCard'
import StatCard from '../components/StatCard'
import BuildingCard from '../components/BuildingCard'
import StatusBadge from '../components/StatusBadge'
import ToastStack from '../components/Toast'
import { rooms } from '../data/rooms'
import { events } from '../data/events'
import { DEMO_TODAY } from '../data/timetable'

function buildingStats(buildingName, bookings, bookingsForRoomOnDate) {
  const buildingRooms = rooms.filter(r => r.building === buildingName)
  const occupiedIds = new Set(
    buildingRooms.filter(r => bookingsForRoomOnDate(r.id, DEMO_TODAY).some(b => b.start <= '10:00' && '10:00' < b.end)).map(r => r.id)
  )
  return {
    total: buildingRooms.length,
    occupied: occupiedIds.size,
    available: buildingRooms.length - occupiedIds.size,
    labs: buildingRooms.filter(r => r.type.includes('Lab')).length,
    halls: buildingRooms.filter(r => r.type === 'Seminar Hall').length,
  }
}

export default function ManagementDashboard() {
  const { bookings, cancelBooking, bookingsForRoomOnDate, recentChanges } = useData()
  const [toasts, setToasts] = useState([])

  function pushToast(t) {
    const id = `t${Date.now()}`
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500)
  }

  const activeBookings = bookings.filter(b => b.status !== 'cancelled')
  const pending = bookings.filter(b => b.approval === 'pending')

  const oldStats = buildingStats('Old Building', bookings, bookingsForRoomOnDate)
  const newStats = buildingStats('New Building', bookings, bookingsForRoomOnDate)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="grid grid-4">
        <StatCard label="Total rooms" value={rooms.length} />
        <StatCard label="Available rooms" value={oldStats.available + newStats.available} />
        <StatCard label="Occupied rooms" value={oldStats.occupied + newStats.occupied} />
        <StatCard label="Today's events" value={events.length} />
        <StatCard label="Pending requests" value={pending.length} />
        <StatCard label="Active bookings" value={activeBookings.length} />
        <StatCard label="Seminar halls" value={rooms.filter(r => r.type === 'Seminar Hall').length} />
        <StatCard label="Recent changes" value={recentChanges.length} />
      </div>

      <div className="grid grid-2">
        <BuildingCard name="Old Building" stats={oldStats} />
        <BuildingCard name="New Building" stats={newStats} />
      </div>

      <DashboardCard title="All Room Bookings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bookings.map(b => (
            <div className="schedule-item" key={b.id}>
              <div className="schedule-time">{b.start}–{b.end}</div>
              <div className="schedule-info" style={{ flex: 1 }}>
                <h4>{b.purpose}</h4>
                <div className="meta">{b.roomId} · {b.date} · {b.faculty}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <StatusBadge status={b.status} />
                {b.status !== 'cancelled' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => { cancelBooking(b.id); pushToast({ kind: 'success', message: `${b.roomId} booking cancelled.` }) }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Changes Log">
        {recentChanges.map(rc => (
          <div className="schedule-item" key={rc.id}>
            <div className="schedule-info"><h4>{rc.text}</h4><div className="meta">{rc.time}</div></div>
          </div>
        ))}
      </DashboardCard>

      <ToastStack toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  )
}
