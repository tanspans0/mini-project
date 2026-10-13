import { createContext, useContext, useState } from 'react'
import { rooms, initialBookings } from '../data/rooms'
import { events } from '../data/events'
import { seminars } from '../data/seminars'
import { findConflict } from '../utils/conflictDetection'

const DataContext = createContext(null)

// Central place for the mutable, in-memory "database" of the prototype:
// room bookings, plus any toasts / recent-change log the rest of the app
// wants to react to. Kept in one context so the Teacher and Management
// dashboards both see the same live booking list.
export function DataProvider({ children }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [recentChanges, setRecentChanges] = useState([
    { id: 'rc1', text: 'Data Structures (COMP SEM III) moved to N-204', time: 'Today' },
    { id: 'rc2', text: 'Database Management lecture cancelled', time: 'Today' },
  ])

  function bookingsForRoomOnDate(roomId, date) {
    return bookings.filter(b => b.roomId === roomId && b.date === date && b.status !== 'cancelled')
  }

  function isRoomAvailable(roomId, date, start, end, ignoreId = null) {
    return !findConflict(bookings, { roomId, date, start, end }, ignoreId)
  }

  function createBooking(payload) {
    const conflict = findConflict(bookings, payload)
    if (conflict) {
      return { ok: false, message: `Room unavailable — ${payload.roomId} is already booked ${conflict.start}–${conflict.end} for "${conflict.purpose}".` }
    }
    const newBooking = { ...payload, id: `bk${Date.now()}`, status: 'confirmed' }
    setBookings(prev => [newBooking, ...prev])
    setRecentChanges(prev => [{ id: `rc${Date.now()}`, text: `${payload.roomId} booked for ${payload.purpose}`, time: 'Just now' }, ...prev].slice(0, 8))
    return { ok: true, booking: newBooking }
  }

  function updateBooking(id, updates) {
    const target = bookings.find(b => b.id === id)
    if (!target) return { ok: false, message: 'Booking not found.' }
    const merged = { ...target, ...updates }
    const conflict = findConflict(bookings, merged, id)
    if (conflict) {
      return { ok: false, message: `Room unavailable — conflicts with existing booking ${conflict.start}–${conflict.end}.` }
    }
    setBookings(prev => prev.map(b => (b.id === id ? merged : b)))
    setRecentChanges(prev => [{ id: `rc${Date.now()}`, text: `Booking for ${merged.roomId} updated`, time: 'Just now' }, ...prev].slice(0, 8))
    return { ok: true }
  }

  function cancelBooking(id) {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b)))
    setRecentChanges(prev => [{ id: `rc${Date.now()}`, text: `A booking was cancelled`, time: 'Just now' }, ...prev].slice(0, 8))
  }

  function setBookingApproval(id, status) {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, approval: status } : b)))
  }

  return (
    <DataContext.Provider
      value={{
        rooms, bookings, events, seminars, recentChanges,
        bookingsForRoomOnDate, isRoomAvailable, createBooking, updateBooking, cancelBooking, setBookingApproval,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
