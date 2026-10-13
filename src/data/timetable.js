// Mock timetable engine.
//
// Real timetables would come from a backend, so this file only has two
// jobs: (1) generate a believable REGULAR weekly timetable per
// department + semester from a small subject list, and (2) hold a short
// list of UPDATED/override entries for specific dates. The two are kept
// separate on purpose — utils/changeDetection.js compares them at runtime
// so students see a "Schedule Changed" alert instead of the change being
// silently baked into one dataset.
import { rooms } from './rooms'



export const timeSlots = [
  { id: 1, time: '08:00', endTime: '09:00', label: '8:00–9:00 AM' },
  { id: 2, time: '09:15', endTime: '10:15', label: '9:15–10:15 AM' },
  { id: 3, time: '10:15', endTime: '11:15', label: '10:15–11:15 AM' },
  { id: 4, time: '11:15', endTime: '12:15', label: '11:15 AM–12:15 PM' },
  { id: 5, time: '13:00', endTime: '14:00', label: '1:00–2:00 PM' },
  { id: 6, time: '14:00', endTime: '15:00', label: '2:00–3:00 PM' },
  { id: 7, time: '15:00', endTime: '16:00', label: '3:00–4:00 PM' },
  { id: 8, time: '16:00', endTime: '17:00', label: '4:00–5:00 PM' },
]


export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]


const subjectBank = {
  comp: ['Data Structures', 'Java Programming', 'Database Management', 'Discrete Mathematics', 'Computer Networks'],
  it: ['Web Technologies', 'Operating Systems', 'Data Structures', 'Software Engineering', 'Computer Networks'],
  aids: ['Machine Learning', 'Statistics for AI', 'Data Structures', 'Python for Data Science', 'Neural Networks'],
  extc: ['Digital Electronics', 'Signals & Systems', 'Microprocessors', 'Communication Systems', 'Circuit Theory'],
  chem: ['Chemical Reaction Engineering', 'Process Calculations', 'Organic Chemistry', 'Mass Transfer', 'Thermodynamics'],
}

const facultyBank = {
  comp: 'Prof. R. Kulkarni', it: 'Prof. M. Shah', aids: 'Prof. N. Rao',
  extc: 'Prof. K. Nair', chem: 'Prof. V. Joshi',
}

const labFacultyBank = {
  comp: 'Prof. A. Deshpande', it: 'Prof. S. Pillai', aids: 'Prof. T. Bhatt',
  extc: 'Prof. D. Menon', chem: 'Prof. P. Kamath',
}

function roomsFor(deptId) {
  // slots 1-4 alternate lecture room / lab room so the demo shows both
  const lecture = rooms.filter(r => r.type === 'Classroom')
  const lab = rooms.filter(r => r.type !== 'Classroom' && r.type !== 'Seminar Hall')
  return { lecture, lab }
}

// Deterministic pseudo-random pick so the same dept+sem always renders the
// same timetable (no Math.random — keeps the demo stable across reloads).
function pick(arr, seed) {
  return arr[seed % arr.length]
}

export function generateRegularTimetable(deptId, semester) {
  const subjects = subjectBank[deptId] || subjectBank.comp
  const faculty = facultyBank[deptId] || facultyBank.comp
  const labFaculty = labFacultyBank[deptId] || labFacultyBank.comp
  const { lecture, lab } = roomsFor(deptId)
  const semNum = semester.replace('SEM ', '').trim()

  const table = {}
  days.forEach((day, dIdx) => {
    table[day] = timeSlots.map((slot, sIdx) => {
      const seed = dIdx * 4 + sIdx + semNum.length
      const isLab = sIdx === 1 // second slot of the day is a lab, for variety
      const room = isLab ? pick(lab, seed) : pick(lecture, seed)
      return {
        id: `${deptId}-${semester}-${day}-${slot.id}`,
        day,
        slotId: slot.id,
        time: slot.time,
        subject: pick(subjects, seed + (isLab ? 1 : 0)),
        faculty: isLab ? labFaculty : faculty,
        room: room.id,
        building: room.building,
        status: 'scheduled',
      }
    })
  })
  return table
}

// TODAY'S DATE for this demo build. In a real system this would be
// `new Date()` — it's fixed here so the seeded overrides below always show
// up as "today's" changes when you run the project.
export const DEMO_TODAY = '2026-09-25' // a Friday

// UPDATED SCHEDULE — a short, hand-seeded list of overrides applied on top
// of the generated regular timetable for DEMO_TODAY. changeDetection.js
// diffs each override against its matching regular slot to build the
// student-facing "Schedule Changed" alerts and notification feed.
export const scheduleOverrides = [
  {
    id: 'ov1',
    matchId: 'comp-SEM III-Friday-2', // Data Structures/Java lab slot for COMP SEM III
    date: DEMO_TODAY,
    changes: { room: 'N-204', building: 'New Building' },
    reason: 'Lab C-104 flooded due to AC maintenance; class relocated to the New Building.',
  },
  {
    id: 'ov2',
    matchId: 'comp-SEM III-Friday-3',
    date: DEMO_TODAY,
    changes: { time: '11:45 – 12:45' },
    reason: 'Shifted by 30 minutes to accommodate a department meeting.',
  },
  {
    id: 'ov3',
    matchId: 'comp-SEM III-Friday-4',
    date: DEMO_TODAY,
    changes: { status: 'cancelled' },
    reason: 'Faculty on approved leave.',
  },
  {
    id: 'ov4',
    matchId: 'it-SEM III-Friday-1',
    date: DEMO_TODAY,
    changes: { faculty: 'Prof. K. Iyer (substitute)' },
    reason: 'Regular faculty unavailable; substitute arranged.',
  },
]
