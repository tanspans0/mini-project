// Mock room inventory. Keep this list separate from UI code so the real
// room register can be dropped in later without touching any component.
export const roomTypes = ['Classroom', 'Computer Lab', 'Electronics Lab', 'Seminar Hall']

export const rooms = [
  { id: 'C-301', building: 'Old Building', type: 'Classroom', floor: '3rd Floor', capacity: 60 },
  { id: 'C-302', building: 'Old Building', type: 'Classroom', floor: '3rd Floor', capacity: 60 },
  { id: 'C-303', building: 'Old Building', type: 'Classroom', floor: '3rd Floor', capacity: 60 },
  { id: 'C-304', building: 'Old Building', type: 'Classroom', floor: '3rd Floor', capacity: 60 },
  { id: 'C-305', building: 'Old Building', type: 'Classroom', floor: '3rd Floor', capacity: 60 },
  { id: 'IT-201', building: 'Old Building', type: 'Computer Lab', floor: '2nd Floor', capacity: 40 },
  { id: 'AIDS-202', building: 'Old Building', type: 'Computer Lab', floor: '2nd Floor', capacity: 40 },
  { id: 'EXTC-305', building: 'Old Building', type: 'Electronics Lab', floor: '3rd Floor', capacity: 35 },
  { id: 'CH-101', building: 'Old Building', type: 'Classroom', floor: '1st Floor', capacity: 50 },
  { id: 'Seminar Hall 1', building: 'New Building', type: 'Seminar Hall', floor: '3rd Floor', capacity: 150 },
  { id: 'N-201', building: 'New Building', type: 'Classroom', floor: '2nd Floor', capacity: 60 },
  { id: 'N-202', building: 'New Building', type: 'Classroom', floor: '2nd Floor', capacity: 60 },
  { id: 'N-203', building: 'New Building', type: 'Classroom', floor: '2nd Floor', capacity: 60 },
  { id: 'N-204', building: 'New Building', type: 'Classroom', floor: '2nd Floor', capacity: 60 },
  { id: 'C-104', building: 'New Building', type: 'Computer Lab', floor: '1st Floor', capacity: 40 },
  { id: 'Seminar Hall 2', building: 'New Building', type: 'Seminar Hall', floor: '4th Floor', capacity: 120 },
]

// Live booking / occupancy state — teachers & management mutate this array
// through the app; it starts pre-seeded so the room availability page has
// something to show on first load.
export const initialBookings = [
  { id: 'bk1', roomId: 'C-304', date: '2026-09-25', start: '10:00', end: '11:00', department: 'comp', purpose: 'Regular Lecture — Data Structures', faculty: 'Prof. R. Kulkarni', status: 'confirmed' },
  { id: 'bk2', roomId: 'N-204', date: '2026-09-25', start: '10:00', end: '11:00', department: 'comp', purpose: 'Regular Lecture — Data Structures (relocated)', faculty: 'Prof. R. Kulkarni', status: 'confirmed' },
  { id: 'bk3', roomId: 'Seminar Hall 1', date: '2026-09-28', start: '10:00', end: '16:00', department: 'comp', purpose: 'TechFest 2026', faculty: 'Technical Committee', status: 'confirmed' },
  { id: 'bk4', roomId: 'C-104', date: '2026-09-25', start: '10:00', end: '11:00', department: 'comp', purpose: 'Java Programming Lab', faculty: 'Prof. A. Deshpande', status: 'confirmed' },
]
