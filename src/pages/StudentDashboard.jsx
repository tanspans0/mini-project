import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'
import { getTimetable, filterByBatch, placeLabel } from '../data/timetableSource'
import { getEffectiveSlot } from '../utils/changeDetection'
import { departments } from '../data/departments'
import DashboardCard from '../components/DashboardCard'
import StatCard from '../components/StatCard'
import { useData } from '../context/DataContext'
import { Link } from 'react-router-dom'

// Today is fixed to a Friday for this demo build (see data/timetable.js).
const TODAY_NAME = 'Friday'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { notifications } = useNotifications()
  const { events, seminars } = useData()
  const dept = departments.find(d => d.id === user?.department)
  const timetable = filterByBatch(
    getTimetable(user?.department || 'comp', user?.semester || 'SEM III', user?.division),
    user?.batch,
  )
  const todaySlots = (timetable[TODAY_NAME] || []).map(s => ({ regular: s, ...getEffectiveSlot(s) }))
  const changedToday = todaySlots.filter(s => s.changed)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="grid grid-4">
        <StatCard label="Classes today" value={todaySlots.filter(s => s.slot.status !== 'cancelled').length} />
        <StatCard label="Schedule changes today" value={changedToday.length} />
        <StatCard label="Upcoming events" value={events.length} />
        <StatCard label="Seminars open" value={seminars.length} />
      </div>

      {changedToday.length > 0 && (
        <DashboardCard title="Schedule Changed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {changedToday.map(({ regular, changes, slot }) => (
              <div className="schedule-changed" key={regular.id}>
                <strong>{regular.subject}</strong> — {regular.time}
                <div style={{ marginTop: 4 }}>
                  {changes.map(c => (
                    <div key={c.field} style={{ fontSize: 13 }}>
                      {c.field}: <span className="old">{c.from}</span> {'\u2192'} <span className="new">{c.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      <DashboardCard title="Today's Schedule" action={<Link to="/app/timetable" className="btn btn-outline btn-sm">Full timetable</Link>}>
        <div className="topbar-sub" style={{ marginBottom: 8 }}>{dept?.name} · {user?.semester} · {TODAY_NAME}</div>
        {todaySlots.map(({ regular, slot, changed }) => (
          <div className="schedule-item" key={regular.id}>
            <div className="schedule-time">{slot.time}</div>
            <div className="schedule-info">
              <h4 style={{ textDecoration: slot.status === 'cancelled' ? 'line-through' : 'none' }}>{slot.batch ? `${slot.batch} · ` : ''}{slot.subject}</h4>
              <div className="meta">{[slot.faculty, placeLabel(slot)].filter(Boolean).join(' · ')}</div>
              {slot.status === 'cancelled' && <span className="badge badge-bad" style={{ marginTop: 4 }}>Cancelled</span>}
              {changed && slot.status !== 'cancelled' && <span className="badge badge-warn" style={{ marginTop: 4 }}>Room/Time updated</span>}
            </div>
          </div>
        ))}
      </DashboardCard>

      <DashboardCard title="Recent Notifications" action={<Link to="/app/notifications" className="btn btn-outline btn-sm">View all</Link>}>
        {notifications.slice(0, 3).map(n => (
          <div className="schedule-item" key={n.id}>
            <div className="schedule-info">
              <h4>{n.title}</h4>
              <div className="meta">{n.body}</div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p>No new notifications.</p>}
      </DashboardCard>
    </div>
  )
}
