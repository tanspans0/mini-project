const ICONS = { info: '\u2139', warning: '\u26A0', urgent: '\u2757', event: '\u2605' }
const LABELS = { info: 'Update', warning: 'Schedule Changed', urgent: 'Urgent', event: 'Event' }

export default function NotificationCard({ notif }) {
  return (
    <div className={`notif-card ${notif.unread ? 'unread' : ''}`}>
      <span className="notif-icon">{ICONS[notif.type] || '\u2139'}</span>
      <div style={{ flex: 1 }}>
        <div className="notif-title">{notif.title || LABELS[notif.type]}</div>
        <div className="notif-body">{notif.body}</div>
        {notif.reason && <div className="notif-time">Reason: {notif.reason}</div>}
        <div className="notif-time">{notif.date || 'Today'}</div>
      </div>
    </div>
  )
}
