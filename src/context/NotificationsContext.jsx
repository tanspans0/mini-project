import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { generateRegularTimetable } from '../data/timetable'
import { buildScheduleNotifications } from '../utils/changeDetection'
import { events } from '../data/events'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('tsecsync_read_notifs')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('tsecsync_read_notifs', JSON.stringify(readIds))
  }, [readIds])

  const notifications = useMemo(() => {
    if (!user) return []
    const deptId = user.department || 'comp'
    const semester = user.semester || 'SEM III'
    const timetable = generateRegularTimetable(deptId, semester)
    const scheduleNotifs = buildScheduleNotifications(timetable, deptId, semester)

    const eventNotifs = events.slice(0, 2).map(ev => ({
      id: `event-${ev.id}`,
      type: 'event',
      title: 'Upcoming Event',
      body: `${ev.name} is happening on ${ev.date} at ${ev.venue}, ${ev.building}.`,
      date: ev.date,
    }))

    return [...scheduleNotifs, ...eventNotifs].map(n => ({ ...n, unread: !readIds.includes(n.id) }))
  }, [user, readIds])

  const unreadCount = notifications.filter(n => n.unread).length

  function markAllRead() {
    setReadIds(notifications.map(n => n.id))
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}
