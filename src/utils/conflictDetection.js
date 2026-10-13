// Room-booking conflict detection.
// Two bookings on the same room + date conflict if their time ranges overlap.
// This is the classic "does [startA,endA) intersect [startB,endB)" check.
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function rangesOverlap(startA, endA, startB, endB) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA)
}

// Returns the conflicting booking if the requested slot is unavailable,
// otherwise null.
export function findConflict(bookings, { roomId, date, start, end }, ignoreId = null) {
  return bookings.find(b =>
    b.id !== ignoreId &&
    b.roomId === roomId &&
    b.date === date &&
    b.status !== 'cancelled' &&
    rangesOverlap(start, end, b.start, b.end)
  ) || null
}
