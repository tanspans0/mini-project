// Official Computer Engineering timetables, w.e.f. 06-Jul-26.
//
// Each division is written as two lists:
//   lectures: [day, slotId, subject, faculty, room]
//             whole-division classes. room null = not shown on the sheet.
//   blocks:   [day, [slotIds], [[batch, subject, faculty, room?], ...]]
//             batch practicals. One line per sub-batch, spanning the listed
//             slots (the sheets show subject and faculty in adjacent columns).
//
// Every room is in the New Building for this academic year.
// Mentor Meeting and Remedial Lecture are kept as subjects.
//
// Data status:
//   SEM III C1 and SEM V C1 were read directly from the sheets.
//   The other divisions were transcribed earlier. Batch faculty there was
//   partly inferred from the order of stacked names, and is null where it
//   could not be read. Verify those against the originals.

import { timeSlots } from './timetable'

const DAY = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' }
const BUILDING = 'New Building'
const TIME = Object.fromEntries(timeSlots.map(s => [s.id, s.time]))

// Entry ids follow the same pattern as the generated timetable (for example
// "comp-SEM III-Friday-2") so the existing schedule overrides keep matching.
// Batch entries add the batch as a suffix.
function entry(semester, division, day, slotId, { subject, faculty, room, batch }) {
  const base = `comp-${semester}-${DAY[day]}-${slotId}`
  return {
    id: batch ? `${base}-${batch}` : base,
    day: DAY[day],
    slotId,
    time: TIME[slotId],
    subject,
    faculty: faculty ?? null,
    room: room ?? null,
    building: BUILDING,
    batch: batch ?? null,
    division,
    status: 'scheduled',
  }
}

function build(semester, division, lectures, blocks = []) {
  const out = []
  for (const [day, slotId, subject, faculty, room] of lectures) {
    out.push(entry(semester, division, day, slotId, { subject, faculty, room, batch: null }))
  }
  for (const [day, slots, rows] of blocks) {
    for (const slotId of slots) {
      for (const [batch, subject, faculty, room] of rows) {
        out.push(entry(semester, division, day, slotId, { subject, faculty, room, batch }))
      }
    }
  }
  return out
}

export const officialTimetables = {
  comp: {
    'SEM III': {
      C1: build('SEM III', 'C1', [
        ['Mon', 2, 'Remedial Lecture', null, '601'],
        ['Mon', 3, 'WDW', 'RS', '601'],
        ['Mon', 4, 'AOA', 'KI', '601'],
        ['Mon', 5, 'EM', 'SK1', '601'],
        ['Mon', 6, 'EM', 'SK1', '601'],
        ['Mon', 7, 'DSGT', 'SK', '601'],
        ['Tue', 2, 'FJP', 'VA', '601'],
        ['Tue', 3, 'COA', 'RK', '601'],
        ['Tue', 4, 'AOA', 'KI', '601'],
        ['Tue', 7, 'ED(P)', 'SV', '601'],
        ['Tue', 8, 'ED(P)', 'SV', '601'],
        ['Wed', 2, 'FJP', 'VA', '601'],
        ['Wed', 3, 'DSGT', 'SK', '601'],
        ['Wed', 4, 'AOA', 'KI', '601'],
        ['Wed', 5, 'EVS', 'GS', '601'],
        ['Wed', 6, 'EVS', 'GS', '601'],
        ['Wed', 7, 'ED', 'SV', '601'],
        ['Wed', 8, 'ED', 'SV', '601'],
        ['Thu', 2, 'Mentor Meeting', null, null],
        ['Thu', 3, 'DSGT', 'SK', '601'],
        ['Thu', 4, 'WDW', 'RS', '601'],
        ['Thu', 5, 'COA', 'RK', '601'],
        ['Thu', 6, 'EM', 'SK1', '601'],
        ['Fri', 2, 'EVS(P)', 'GS', '601'],
        ['Fri', 3, 'EVS(P)', 'GS', '601'],
        ['Fri', 4, 'COA', 'RK', '601'],
        ['Fri', 7, 'Mentor Meeting', null, null],
        ['Sat', 3, 'Remedial Lecture', null, '601'],
        ['Sat', 4, 'Remedial Lecture', null, '601'],
        ['Sat', 5, 'Mentor Meeting', null, null],
      ], [
        ['Tue', [5, 6], [['C11', 'FJP', 'SMS'], ['C12', 'AOA', 'KI'], ['C13', 'FJP', 'VA'], ['C14', 'COA', 'RK']]],
        ['Thu', [7, 8], [['C11', 'COA', 'RK'], ['C12', 'COA', 'GS'], ['C13', 'AOA', 'DK'], ['C14', 'AOA', 'KI']]],
        ['Fri', [5, 6], [['C11', 'AOA', 'KI'], ['C12', 'FJP', 'RS'], ['C13', 'COA', 'RK'], ['C14', 'FJP', 'VA']]],
      ]),

      C2: build('SEM III', 'C2', [
        ['Mon', 2, 'Mentor Meeting', null, null],
        ['Mon', 3, 'COA', 'GS', '604'],
        ['Mon', 4, 'FJP', 'SMS', '604'],
        ['Mon', 7, 'ED', 'KA', '604'],
        ['Mon', 8, 'ED', 'KA', '604'],
        ['Tue', 2, 'Remedial Lecture', null, '604'],
        ['Tue', 3, 'COA', 'GS', '604'],
        ['Tue', 4, 'FJP', 'SMS', '604'],
        ['Tue', 5, 'WDW', 'SI', '604'],
        ['Tue', 6, 'DSGT', 'BJ', '604'],
        ['Tue', 7, 'ED(P)', 'KA', '604'],
        ['Tue', 8, 'ED(P)', 'KA', '604'],
        ['Wed', 2, 'COA', 'GS', '604'],
        ['Wed', 5, 'EM', 'MK', '604'],
        ['Wed', 6, 'AOA', 'SSS', '604'],
        ['Wed', 7, 'EVS(P)', 'RK', '604'],
        ['Wed', 8, 'EVS(P)', 'RK', '604'],
        ['Thu', 2, 'DSGT', 'BJ', '604'],
        ['Thu', 3, 'WDW', 'SI', '604'],
        ['Thu', 4, 'AOA', 'SSS', '604'],
        ['Thu', 7, 'Mentor Meeting', null, null],
        ['Fri', 2, 'Remedial Lecture', null, '604'],
        ['Fri', 3, 'AOA', 'SSS', '604'],
        ['Fri', 4, 'DSGT', 'BJ', '604'],
        ['Fri', 5, 'EM', 'MK', '604'],
        ['Fri', 6, 'EM', 'MK', '604'],
        ['Fri', 7, 'EVS', 'RK', '604'],
        ['Fri', 8, 'EVS', 'RK', '604'],
        ['Sat', 3, 'Remedial Lecture', null, '604'],
        ['Sat', 4, 'Mentor Meeting', null, null],
      ], [
        ['Mon', [5, 6], [['C21', 'AOA', 'KI'], ['C22', 'AOA', 'SSS'], ['C23', 'COA', 'GS'], ['C24', 'FJP', 'SMS']]],
        ['Wed', [3, 4], [['C21', 'FJP', 'VA'], ['C22', 'COA', 'GS'], ['C23', 'AOA', 'SSS'], ['C24', 'COA', 'RK']]],
        ['Thu', [5, 6], [['C21', 'COA', 'GS'], ['C22', 'FJP', 'SMS'], ['C23', 'FJP', 'RS'], ['C24', 'AOA', 'VA']]],
      ]),

      C3: build('SEM III', 'C3', [
        ['Mon', 2, 'Mentor Meeting', null, null],
        ['Mon', 3, 'ED(P)', 'BJ', '505'],
        ['Mon', 4, 'COA', 'TM', '505'],
        ['Mon', 5, 'FJP', 'RS', '505'],
        ['Mon', 6, 'EM', 'SK1', '505'],
        ['Tue', 2, 'DSGT', 'KI', '505'],
        ['Tue', 3, 'COA', 'TM', '505'],
        ['Tue', 4, 'AOA', 'DK', '505'],
        ['Tue', 5, 'EVS', 'ASD', '505'],
        ['Tue', 6, 'EVS', 'ASD', '505'],
        ['Tue', 7, 'ED(P)', 'BJ', '505'],
        ['Tue', 8, 'Remedial Lecture', null, '505'],
        ['Wed', 2, 'DSGT', 'KI', '505'],
        ['Wed', 3, 'WDW', 'SMS', '505'],
        ['Wed', 4, 'FJP', 'RS', '505'],
        ['Wed', 7, 'EVS(P)', 'ASD', '505'],
        ['Wed', 8, 'Mentor Meeting', null, null],
        ['Thu', 2, 'Remedial Lecture', null, '505'],
        ['Thu', 3, 'WDW', 'SMS', '505'],
        ['Thu', 4, 'DSGT', 'KI', '505'],
        ['Thu', 5, 'COA', 'TM', '505'],
        ['Thu', 6, 'AOA', 'DK', '505'],
        ['Thu', 7, 'EM', 'SK1', '505'],
        ['Fri', 2, 'AOA', 'DK', '505'],
        ['Fri', 5, 'ED', 'BJ', '505'],
        ['Fri', 6, 'ED', 'BJ', '505'],
        ['Fri', 7, 'EVS(P)', 'ASD', '505'],
        ['Fri', 8, 'EM', 'SK1', '505'],
        ['Sat', 2, 'Remedial Lecture', null, '505'],
        ['Sat', 3, 'Mentor Meeting', null, null],
        ['Sat', 4, 'Mentor Meeting', null, null],
      ], [
        ['Mon', [7, 8], [['C31', 'COA', 'RK'], ['C32', 'COA', 'TM'], ['C33', 'AOA', 'SSS'], ['C34', 'FJP', 'SMS']]],
        ['Wed', [5, 6], [['C31', 'AOA', 'VA'], ['C32', 'AOA', 'KI'], ['C33', 'FJP', 'RS'], ['C34', 'COA', 'NS']]],
        ['Fri', [3, 4], [['C31', 'FJP', 'SMS'], ['C32', 'FJP', 'RS'], ['C33', 'COA', 'TM'], ['C34', 'AOA', 'DK']]],
      ]),
    },

    'SEM V': {
      C1: build('SEM V', 'C1', [
        ['Mon', 2, 'CN', 'SI', '504'],
        ['Mon', 3, 'AISC', 'SK', '504'],
        ['Mon', 4, 'DWM', 'SSS', '504'],
        ['Mon', 7, 'Remedial Lecture', null, '504'],
        ['Mon', 8, 'Mentor Meeting', null, null],
        ['Tue', 2, 'CN', 'SI', '508'],
        ['Tue', 5, 'SE', 'KA', '504'],
        ['Tue', 6, 'IKS', 'NS', '504'],
        ['Tue', 7, 'DWM', 'SSS', '504'],
        ['Tue', 8, 'Remedial Lecture', null, '504'],
        ['Wed', 2, 'CN', 'SI', '504'],
        ['Wed', 3, 'CDS', 'MD', '504'],
        ['Wed', 4, 'WMC', 'PJ', '504'],
        ['Wed', 7, 'IKS(P)', 'NS', '504'],
        ['Wed', 8, 'IKS(P)', 'NS', '504'],
        ['Thu', 2, 'IKS', 'NS', '504'],
        ['Thu', 3, 'WMC', 'PJ', '504'],
        ['Thu', 4, 'CDS', 'MD', '504'],
        ['Thu', 5, 'AISC', 'SK', '504'],
        ['Thu', 6, 'SE', 'KA', '504'],
        ['Fri', 2, 'WMC', 'PJ', '404'],
        ['Fri', 5, 'DWM', 'SSS', '504'],
        ['Fri', 6, 'AISC', 'SK', '504'],
        ['Fri', 7, 'SE', 'KA', '504'],
        ['Fri', 8, 'Mentor Meeting', null, null],
        ['Sat', 4, 'Remedial Lecture', null, '504'],
        ['Sat', 5, 'Mentor Meeting', null, null],
      ], [
        ['Mon', [5, 6], [['C11', 'AISC', 'SK'], ['C12', 'CN', 'SI'], ['C13', 'WMC', 'PJ'], ['C14', 'SE', 'KA']]],
        ['Tue', [3, 4], [['C11', 'CN', 'SI'], ['C12', 'DWM', 'SSS'], ['C13', 'AISC', 'SK'], ['C14', 'WMC', 'PJ']]],
        ['Wed', [5, 6], [['C11', 'WMC', 'PJ'], ['C12', 'AISC', 'SK'], ['C13', 'SE', 'KA'], ['C14', 'CN', 'SI']]],
        ['Thu', [7, 8], [['C11', 'DWM', 'AC'], ['C12', 'SE', 'KA'], ['C13', 'DWM', 'SSS'], ['C14', 'DWM', 'MD']]],
        ['Fri', [3, 4], [['C11', 'SE', 'KA'], ['C12', 'WMC', 'PJ'], ['C13', 'CN', 'SI'], ['C14', 'AISC', 'SK']]],
      ]),

      C2: build('SEM V', 'C2', [
        ['Mon', 2, 'IKS', 'VA', '508'],
        ['Mon', 3, 'IKS', 'VA', '508'],
        ['Mon', 4, 'SE', 'PJ', '508'],
        ['Mon', 5, 'WMC', 'AK', '504'],
        ['Mon', 6, 'AISC', 'VS', '504'],
        ['Tue', 2, 'DWM', 'UB', '504'],
        ['Tue', 3, 'AISC', 'VS', '504'],
        ['Tue', 4, 'CDS', 'BJ', '504'],
        ['Tue', 5, 'CN', 'TM', '508'],
        ['Tue', 6, 'SE', 'PJ', '508'],
        ['Wed', 2, 'DWM', 'UB', '305'],
        ['Wed', 5, 'CN', 'TM', '504'],
        ['Wed', 6, 'WMC', 'AK', '504'],
        ['Wed', 7, 'SE', 'PJ', '508'],
        ['Wed', 8, 'Mentor Meeting', null, null],
        ['Thu', 2, 'DWM', 'UB', '508'],
        ['Thu', 3, 'CN', 'TM', '508'],
        ['Thu', 4, 'AISC', 'VS', '508'],
        ['Thu', 7, 'CDS', 'BJ', '504'],
        ['Thu', 8, 'Mentor Meeting', null, null],
        ['Fri', 2, 'IKS(P)', 'VA', '504'],
        ['Fri', 3, 'IKS(P)', 'VA', '504'],
        ['Fri', 4, 'WMC', 'AK', '504'],
        ['Fri', 7, 'Remedial Lecture', null, '508'],
        ['Sat', 4, 'Remedial Lecture', null, '508'],
        ['Sat', 5, 'Remedial Lecture', null, '508'],
        ['Sat', 6, 'Mentor Meeting', null, null],
      ], [
        ['Mon', [7, 8], [['C22', 'AISC', 'VS']]],
        ['Tue', [7, 8], [['C22', 'DWM', 'MD']]],
        ['Wed', [3, 4], [['C21', 'SE', 'SI'], ['C22', 'CN', 'KA'], ['C23', 'AISC', 'BJ'], ['C24', 'CN', 'TM']]],
        ['Thu', [5, 6], [['C21', 'DWM', null], ['C22', 'WMC', null], ['C23', 'CN', null], ['C24', 'SE', null]]],
        ['Fri', [5, 6], [['C21', 'CN', null], ['C22', 'SE', null], ['C23', 'DWM', null], ['C24', 'AISC', null]]],
      ]),

      C3: build('SEM V', 'C3', [
        ['Mon', 2, 'CDS', 'AC', '305'],
        ['Mon', 4, 'Remedial Lecture', null, null],
        ['Mon', 6, 'WMC', 'SJ', '508'],
        ['Mon', 7, 'IKS', 'AP', '508'],
        ['Tue', 2, 'Mentor Meeting', null, null],
        ['Tue', 3, 'SE', 'NS', '508'],
        ['Tue', 4, 'DWM', 'JJ', '508'],
        ['Tue', 7, 'IKS(P)', 'AP', '508'],
        ['Wed', 2, 'SE', 'JG', '508'],
        ['Wed', 3, 'CDS', 'AC', '508'],
        ['Wed', 4, 'AISC', 'TS', '508'],
        ['Wed', 5, 'CN', 'VP', '508'],
        ['Wed', 6, 'WMC', 'SJ', '508'],
        ['Thu', 2, 'Remedial Lecture', null, '305'],
        ['Thu', 5, 'AISC', 'TS', '508'],
        ['Thu', 6, 'CN', 'VP', '508'],
        ['Thu', 7, 'DWM', 'JJ', '508'],
        ['Fri', 2, 'SE', 'NS', '508'],
        ['Fri', 3, 'WMC', 'SJ', '508'],
        ['Fri', 4, 'DWM', 'JJ', '508'],
        ['Fri', 5, 'AISC', 'TS', '508'],
        ['Fri', 6, 'CN', 'VP', '508'],
        ['Sat', 3, 'Remedial Lecture', null, '508'],
        ['Sat', 4, 'Mentor Meeting', null, null],
        ['Sat', 5, 'Mentor Meeting', null, null],
      ], [
        ['Mon', [3], [['C31', 'WMC', 'AK'], ['C32', 'SE', 'JG'], ['C33', 'DWM', 'JJ'], ['C34', 'DWM', 'AC']]],
        ['Tue', [5, 6], [['C31', 'SE', 'SV'], ['C32', 'CN', 'RS'], ['C33', 'SE', 'JG'], ['C34', 'WMC', 'AK']]],
        ['Wed', [7, 8], [['C31', 'AISC', 'BJ'], ['C32', 'WMC', 'AK'], ['C33', 'WMC', 'SJ'], ['C34', 'CN', 'RS']]],
        ['Thu', [3, 4], [['C31', 'CN', 'VP'], ['C32', 'DWM', 'JJ'], ['C33', 'AISC', 'BJ'], ['C34', 'SE', 'SV']]],
        ['Fri', [7, 8], [['C31', 'DWM', 'JJ'], ['C32', 'AISC', 'BJ'], ['C33', 'CN', 'VP'], ['C34', 'AISC', 'TS']]],
      ]),
    },

    'SEM VII': {
      C1: build('SEM VII', 'C1', [
        ['Mon', 2, 'Mentor Meeting', null, null],
        ['Mon', 5, 'ML', 'TS', '305'],
        ['Mon', 6, 'NLP', 'VP', '305'],
        ['Mon', 7, 'MIS', 'AK/SV', '305'],
        ['Tue', 2, 'Remedial Lecture', null, '305'],
        ['Tue', 3, 'NLP', 'VP', '305'],
        ['Tue', 4, 'ML', 'TS', '305'],
        ['Tue', 8, 'PR', null, null],
        ['Wed', 2, 'Mentor Meeting', null, null],
        ['Wed', 3, 'Remedial Lecture', null, '305'],
        ['Wed', 4, 'BDA', 'SJ', '305'],
        ['Wed', 5, 'ML', 'TS', '305'],
        ['Wed', 6, 'BC', 'AP', '305'],
        ['Thu', 2, 'Mentor Meeting', null, null],
        ['Thu', 5, 'BC', 'AP', '305'],
        ['Thu', 6, 'BDA', 'SJ', '305'],
        ['Thu', 8, 'PR', null, null],
        ['Fri', 3, 'PR', null, null],
        ['Fri', 4, 'NLP', 'VP', '305'],
        ['Fri', 5, 'BC', 'AP', '305'],
        ['Fri', 6, 'BDA', 'SJ', '305'],
        ['Fri', 7, 'MIS', 'AK/SV', '305'],
        ['Sat', 2, 'Remedial Lecture', null, '305'],
      ], [
        ['Mon', [3, 4], [['C11', 'NLP', null]]],
        ['Tue', [5, 6], [['C11', 'BDA', null]]],
        ['Tue', [7], [['C11', 'PR', null]]],
        ['Wed', [7, 8], [['C11', 'BC', null]]],
        ['Thu', [3, 4], [['C11', 'ML', null]]],
        ['Sat', [3], [['C11', 'PR', null]]],
        ['Sat', [5], [['C11', 'PR', null]]],
        ['Sat', [7], [['C11', 'PR', null]]],
      ]),

      C2: build('SEM VII', 'C2', [
        ['Mon', 2, 'Remedial Lecture', null, null],
        ['Mon', 3, 'NLP', 'UB', '305'],
        ['Mon', 4, 'ML', 'DK', '305'],
        ['Mon', 7, 'MIS', 'AK/SV', '404'],
        ['Tue', 2, 'Mentor Meeting', null, null],
        ['Tue', 5, 'BC', 'AC', '305'],
        ['Tue', 6, 'BDA', 'NJ', '305'],
        ['Tue', 8, 'PR', null, null],
        ['Wed', 2, 'Remedial Lecture', null, '404'],
        ['Wed', 3, 'ML', 'DK', '404'],
        ['Wed', 4, 'NLP', 'UB', '404'],
        ['Wed', 8, 'PR', null, null],
        ['Thu', 2, 'Mentor Meeting', null, null],
        ['Thu', 3, 'BDA', 'NJ', '305'],
        ['Thu', 4, 'ML', 'DK', '305'],
        ['Thu', 5, 'NLP', 'UB', '404'],
        ['Thu', 6, 'BC', 'AC', '404'],
        ['Thu', 8, 'PR', null, null],
        ['Fri', 2, 'Remedial Lecture', null, null],
        ['Fri', 3, 'BC', 'AC', '404'],
        ['Fri', 4, 'BDA', 'NJ', '404'],
        ['Fri', 7, 'MIS', 'AK/SV', '404'],
        ['Sat', 2, 'Mentor Meeting', null, null],
        ['Sat', 4, 'PR', null, null],
        ['Sat', 6, 'PR', null, null],
        ['Sat', 8, 'PR', null, null],
      ], [
        ['Mon', [5, 6], [['C22', 'NLP', null]]],
        ['Tue', [3, 4], [['C22', 'BC', null, '305']]],
        ['Wed', [5, 6], [['C22', 'ML', null]]],
        ['Wed', [7], [['C22', 'PR', null]]],
        ['Fri', [5, 6], [['C22', 'BDA', null]]],
        ['Sat', [3], [['C22', 'PR', null]]],
        ['Sat', [5], [['C22', 'PR', null]]],
        ['Sat', [7], [['C22', 'PR', null]]],
      ]),

      C3: build('SEM VII', 'C3', [
        ['Mon', 3, 'PR', null, null],
        ['Mon', 4, 'ML', 'VS', '404'],
        ['Mon', 5, 'BDA', 'ASD', '404'],
        ['Mon', 6, 'BC', 'JJ', '404'],
        ['Mon', 7, 'MIS', 'AK/SV', '404'],
        ['Tue', 2, 'Mentor Meeting', null, null],
        ['Tue', 3, 'Remedial Lecture', null, '404'],
        ['Tue', 4, 'NLP', 'JG', '404'],
        ['Tue', 5, 'ML', 'VS', '404'],
        ['Tue', 6, 'BC', 'JJ', '404'],
        ['Wed', 2, 'Mentor Meeting', null, null],
        ['Wed', 5, 'BC', 'JJ', '404'],
        ['Wed', 6, 'ML', 'VS', '404'],
        ['Wed', 8, 'PR', null, null],
        ['Thu', 2, 'Remedial Lecture', null, '404'],
        ['Thu', 3, 'NLP', 'JG', '404'],
        ['Thu', 4, 'BDA', 'ASD', '404'],
        ['Thu', 8, 'PR', null, null],
        ['Fri', 5, 'NLP', 'JG', '404'],
        ['Fri', 6, 'BDA', 'ASD', '404'],
        ['Fri', 7, 'MIS', 'AK/SV', '404'],
        ['Sat', 2, 'Mentor Meeting', null, null],
      ], [
        ['Tue', [7, 8], [['C31', 'NLP', 'JG'], ['C32', 'BC', 'JJ'], ['C33', 'BDA', 'ASD']]],
        ['Wed', [3, 4], [['C31', 'ML', 'VS'], ['C32', 'BDA', 'ASD'], ['C33', 'NLP', 'JG']]],
        ['Thu', [5, 6], [['C31', 'BC', 'JJ'], ['C32', 'NLP', 'JG'], ['C33', 'ML', 'VS']]],
        ['Fri', [3, 4], [['C31', 'BDA', 'ASD'], ['C32', 'ML', 'VS'], ['C33', 'BC', 'AP']]],
        ['Sat', [3], [['C31', 'PR', null], ['C33', 'PR', null]]],
        ['Sat', [5], [['C31', 'PR', null], ['C33', 'PR', null]]],
        ['Sat', [7], [['C31', 'PR', null], ['C33', 'PR', null]]],
      ]),
    },
  },
}
