import { days, timeSlots } from '../data/timetable'
import { getEffectiveSlot } from '../utils/changeDetection'
import { placeLabel } from '../data/timetableSource'

// Renders the weekly grid. A slot can hold more than one entry when batch
// practicals are present (one line per sub-batch). Each entry is merged with
// any schedule override via getEffectiveSlot, so changed classes show their
// new room or time directly in the grid.
export default function Timetable({ regularTimetable, dayFilter }) {
  const visibleDays = dayFilter ? days.filter(d => d === dayFilter) : days

  return (
    <div className="tt-table-wrap">
      <table className="tt-table">
        <thead>
          <tr>
            <th>Time</th>
            {visibleDays.map(d => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slot => (
            <tr key={slot.id}>
              <td className="tt-cell-meta" style={{ fontWeight: 700, color: 'var(--ink-soft)' }}>
                {slot.label}
              </td>
              {visibleDays.map(day => {
                const entries = (regularTimetable[day] || []).filter(s => s.slotId === slot.id)
                if (!entries.length) return <td key={day}>—</td>
                return (
                  <td key={day}>
                    {entries.map((regularSlot, i) => {
                      const { slot: effective, changed } = getEffectiveSlot(regularSlot)
                      const cancelled = effective.status === 'cancelled'
                      return (
                        <div key={regularSlot.id} style={{ marginTop: i ? 8 : 0 }}>
                          {effective.batch && (
                            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '0 6px', marginBottom: 2, borderRadius: 4, background: 'var(--line, #e5e7eb)' }}>
                              {effective.batch}
                            </span>
                          )}
                          <div className="tt-cell-subject" style={cancelled ? { textDecoration: 'line-through', color: 'var(--muted)' } : undefined}>
                            {effective.subject}
                          </div>
                          {effective.faculty && <div className="tt-cell-meta">{effective.faculty}</div>}
                          {placeLabel(effective) && <div className="tt-cell-meta">{placeLabel(effective)}</div>}
                          {changed && !cancelled && <span className="badge badge-warn" style={{ marginTop: 4 }}>Changed</span>}
                          {cancelled && <span className="badge badge-bad" style={{ marginTop: 4 }}>Cancelled</span>}
                        </div>
                      )
                    })}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
