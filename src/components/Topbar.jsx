import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { departments } from '../data/departments'

export default function Topbar({ user, unreadCount, onMenuClick }) {
  const [now, setNow] = useState(new Date())

useEffect(() => {
  const timer = setInterval(() => {
    setNow(new Date())
  }, 1000)

  return () => clearInterval(timer)
}, [])

  const dept = departments.find(d => d.id === user?.department)
  const today = new Date()
  const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

const timeLabel = now.toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata'
})

  const initials = (user?.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="topbar-hamburger" onClick={onMenuClick} aria-label="Open menu">{'\u2630'}</button>
        <div className="topbar-left">
          <div className="topbar-title">{dept ? dept.name : 'TSEC Sync'}{user?.semester ? ` · ${user.semester}` : ''}</div>
          <div className="topbar-sub">{dateLabel} · {timeLabel} IST</div>

        </div>
      </div>
      <div className="topbar-right">
        <Link to="/app/notifications" className="icon-btn" aria-label="Notifications">
          {'\u26A0'}
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </Link>
        <Link to="/app/profile" className="avatar" title={user?.name}>{initials}</Link>
      </div>
    </header>
  )
}
