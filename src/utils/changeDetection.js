// Simple, explainable change-detection logic.
//
// For every slot in the REGULAR timetable we look for a matching entry in
// the UPDATED overrides list. If one exists, we compare field by field —
// room, time, building, faculty, status — and build a plain-language
// notification for whichever fields differ. This mirrors the brief's
// pseudocode:
//   if (regularRoom !== updatedRoom) show "Room Changed"
import { scheduleOverrides } from '../data/timetable'

export function getEffectiveSlot(regularSlot) {
  const override = scheduleOverrides.find(o => o.matchId === regularSlot.id)
  if (!override) return { slot: regularSlot, changed: false, changes: [], override: null }

  const changes = []
  const merged = { ...regularSlot }

  if (override.changes.room && override.changes.room !== regularSlot.room) {
    changes.push({ field: 'Room', from: regularSlot.room, to: override.changes.room })
    merged.room = override.changes.room
  }
  if (override.changes.building && override.changes.building !== regularSlot.building) {
    changes.push({ field: 'Building', from: regularSlot.building, to: override.changes.building })
    merged.building = override.changes.building
  }
  if (override.changes.time && override.changes.time !== regularSlot.time) {
    changes.push({ field: 'Time', from: regularSlot.time, to: override.changes.time })
    merged.time = override.changes.time
  }
  if (override.changes.faculty && override.changes.faculty !== regularSlot.faculty) {
    changes.push({ field: 'Faculty', from: regularSlot.faculty, to: override.changes.faculty })
    merged.faculty = override.changes.faculty
  }
  if (override.changes.status && override.changes.status !== regularSlot.status) {
    changes.push({ field: 'Status', from: regularSlot.status, to: override.changes.status })
    merged.status = override.changes.status
  }

  return { slot: merged, changed: changes.length > 0, changes, override }
}

// Builds the notification feed for a given department + semester by
// walking every override that matches a slot in that timetable.
export function buildScheduleNotifications(regularTimetable, deptId, semester) {
  const notifications = []
  Object.values(regularTimetable).forEach(daySlots => {
    daySlots.forEach(regularSlot => {
      const { changed, changes, override } = getEffectiveSlot(regularSlot)
      if (!changed) return

      changes.forEach(change => {
        let type = 'info'
        let title = `${change.field} Changed`
        let body = ''

        if (change.field === 'Status' && change.to === 'cancelled') {
          type = 'urgent'
          title = 'Class Cancelled'
          body = `Your ${regularSlot.subject} lecture at ${regularSlot.time} on ${regularSlot.day} has been cancelled.`
        } else if (change.field === 'Room') {
          type = 'warning'
          body = `Your ${regularSlot.subject} lecture has been moved from ${change.from} to ${change.to}.`
        } else if (change.field === 'Building') {
          type = 'warning'
          body = `Your ${regularSlot.subject} lecture has been moved from the ${change.from} to the ${change.to}.`
        } else if (change.field === 'Time') {
          type = 'warning'
          body = `Your ${regularSlot.subject} lecture scheduled at ${change.from} has been moved to ${change.to}.`
        } else if (change.field === 'Faculty') {
          type = 'info'
          body = `Your ${regularSlot.subject} lecture will now be taken by ${change.to}.`
        }

        notifications.push({
          id: `${override.id}-${change.field}`,
          type,
          title,
          body,
          reason: override.reason,
          date: override.date,
          slotId: regularSlot.id,
          unread: true,
        })
      })
    })
  })
  return notifications
}
