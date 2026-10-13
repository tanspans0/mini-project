import { NavLink } from 'react-router-dom'

const NAV_BY_ROLE = {
  student: [
    { to: '/app/dashboard', label: 'Dashboard', icon: '\u2302' },
    { to: '/app/timetable', label: 'Timetable', icon: '\u25A6' },

    { to: '/app/events', label: 'Events', icon: '\u2605' },
    { to: '/app/seminars', label: 'Seminars', icon: '\u2691' },
    { to: '/app/notifications', label: 'Notifications', icon: '\u26A0' },
    { to: '/app/profile', label: 'Profile', icon: '\u263A' },
  ],
  teacher: [
    { to: '/app/dashboard', label: 'Dashboard', icon: '\u2302' },
    { to: '/app/timetable', label: 'Timetable', icon: '\u25A6' },
    { to: '/app/rooms', label: 'Room Availability', icon: '\u25A3' },
    { to: '/app/events', label: 'Events', icon: '\u2605' },
    { to: '/app/seminars', label: 'Seminars', icon: '\u2691' },
    { to: '/app/notifications', label: 'Notifications', icon: '\u26A0' },
    { to: '/app/profile', label: 'Profile', icon: '\u263A' },
  ],
  management: [
    { to: '/app/dashboard', label: 'Dashboard', icon: '\u2302' },
    { to: '/app/timetable', label: 'Timetable', icon: '\u25A6' },
    { to: '/app/rooms', label: 'Room Availability', icon: '\u25A3' },
    { to: '/app/events', label: 'Events', icon: '\u2605' },
    { to: '/app/seminars', label: 'Seminars', icon: '\u2691' },
    { to: '/app/notifications', label: 'Notifications', icon: '\u26A0' },
    { to: '/app/profile', label: 'Profile', icon: '\u263A' },
  ],
}

export default function Sidebar({ role, open, onClose, onLogout }) {
  const items = NAV_BY_ROLE[role] || NAV_BY_ROLE.student
  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="mark">TSEC Sync</div>
          <div className="tag">One Campus. One Schedule.</div>
        </div>
        <nav className="sidebar-nav">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button
            onClick={onLogout}
            className="sidebar-link"
            style={{ borderLeft: 'none', width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
          >
            <span className="sidebar-icon">{'\u23FB'}</span> Logout
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-scrim" onClick={onClose} />}
    </>
  )
}
