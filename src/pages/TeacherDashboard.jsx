import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import DashboardCard from '../components/DashboardCard'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import BookingForm from '../components/BookingForm'
import ToastStack from '../components/Toast'
import StatusBadge from '../components/StatusBadge'
import { rooms } from '../data/rooms'
import { DEMO_TODAY } from '../data/timetable'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { bookings, cancelBooking, bookingsForRoomOnDate } = useData()
  const [showForm, setShowForm] = useState(false)
  const [toasts, setToasts] = useState([])

  function pushToast(t) {
    const id = `t${Date.now()}`
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500)
  }

  const myBookings = bookings.filter(b => b.faculty === user?.name || b.department === user?.department)
  const todaysBookings = myBookings.filter(b => b.date === DEMO_TODAY && b.status !== 'cancelled')
  const availableNow = rooms.filter(r => bookingsForRoomOnDate(r.id, DEMO_TODAY).every(b => b.start > '10:00' || b.end <= '10:00'))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="grid grid-4">
        <StatCard label="Your bookings today" value={todaysBookings.length} />
        <StatCard label="Rooms free right now" value={availableNow.length} />
        <StatCard label="Total rooms & halls" value={rooms.length} />
        <StatCard label="Your cancelled bookings" value={myBookings.filter(b => b.status === 'cancelled').length} />
      </div>

      <DashboardCard
        title="Room & Lab Booking"
        action={<button className="btn btn-brass btn-sm" onClick={() => setShowForm(true)}>+ Book a room</button>}
      >
        <p style={{ marginTop: 0 }}>Book a classroom, lab or seminar hall. Availability is checked automatically — a conflicting slot is rejected before it can be confirmed.</p>
      </DashboardCard>

      <DashboardCard title="Your Bookings">
        {myBookings.length === 0 ? (
          <div className="empty-state"><div className="glyph">{'\u25A3'}</div>No bookings yet — book a room to see it listed here.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myBookings.map(b => (
              <div className="schedule-item" key={b.id}>
                <div className="schedule-time">{b.start}–{b.end}</div>
                <div className="schedule-info" style={{ flex: 1 }}>
                  <h4>{b.purpose}</h4>
                  <div className="meta">{b.roomId} · {b.date} · {b.faculty}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={b.status} />
                  {b.status !== 'cancelled' && (
                    <button className="btn btn-outline btn-sm" onClick={() => { cancelBooking(b.id); pushToast({ kind: 'success', message: 'Booking cancelled.' }) }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {showForm && (
        <Modal title="Book a Room / Lab / Seminar Hall" onClose={() => setShowForm(false)}>
          <BookingForm defaultFaculty={user?.name} onToast={pushToast} onDone={() => setShowForm(false)} />
        </Modal>
      )}
      <ToastStack toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  )
}
