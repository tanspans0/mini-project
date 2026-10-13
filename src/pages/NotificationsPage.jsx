import { useNotifications } from '../context/NotificationsContext'
import NotificationCard from '../components/NotificationCard'
import DashboardCard from '../components/DashboardCard'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead } = useNotifications()

  return (
    <DashboardCard
      title={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
      action={unreadCount > 0 && <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all as read</button>}
    >
      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">{'\u26A0'}</div>
          You're all caught up — no schedule changes right now.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => <NotificationCard key={n.id} notif={n} />)}
        </div>
      )}
    </DashboardCard>
  )
}
