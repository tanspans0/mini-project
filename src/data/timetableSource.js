// Single entry point for "which timetable should this user see".
// Official COMP timetables are used when they exist for the department,
// semester and division. Everything else falls back to the demo generator.
import { days, generateRegularTimetable } from './timetable'
import { officialTimetables } from './officialTimetables'

export function getOfficialEntries(deptId, semester, division) {
  return officialTimetables?.[deptId]?.[semester]?.[division] || []
}

// Returns { Monday: [entries], ... }. Several entries can share a slot when
// batch practicals are present; each one carries a `batch` label.
export function getTimetable(deptId, semester, division) {
  const official = getOfficialEntries(deptId, semester, division)
  if (official.length) {
    return Object.fromEntries(days.map(day => [day, official.filter(e => e.day === day)]))
  }
  return generateRegularTimetable(deptId, semester)
}

// Keeps whole-division entries plus the chosen batch's entries.
// No batch selected = everything.
export function filterByBatch(timetable, batch) {
  if (!batch) return timetable
  return Object.fromEntries(
    Object.entries(timetable).map(([day, list]) => [day, list.filter(e => !e.batch || e.batch === batch)])
  )
}

// C1 -> [C11, C12, C13, C14]
export function batchesFor(division) {
  return division ? [1, 2, 3, 4].map(n => `${division}${n}`) : []
}

// "504 · New Building", or just the building when no room is shown.
export function placeLabel(entry) {
  return [entry.room, entry.building].filter(Boolean).join(' · ')
}
