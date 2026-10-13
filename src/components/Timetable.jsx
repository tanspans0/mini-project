import { days, timeSlots } from '../data/timetable'
import { getEffectiveSlot } from '../utils/changeDetection'

// Renders the weekly grid. Each cell looks up its "effective" slot (regular
// slot merged with any override) via getEffectiveSlot, so a changed class
// shows its new room/time/building directly in the grid, with a small
// "changed" note — same underlying data the notifications feed reads.
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
                const regularSlot = regularTimetable[day]?.find(s => s.slotId === slot.id)
                if (!regularSlot) return <td key={day}>—</td>
                const { slot: effective, changed } = getEffectiveSlot(regularSlot)
                const cancelled = effective.status === 'cancelled'
                return (
                  <td key={day}>
                    <div className="tt-cell-subject" style={cancelled ? { textDecoration: 'line-through', color: 'var(--muted)' } : undefined}>
                      {effective.subject}
                    </div>
                    <div className="tt-cell-meta">{effective.faculty}</div>
                    <div className="tt-cell-meta">{effective.room} · {effective.building}</div>
                    {changed && !cancelled && <span className="badge badge-warn" style={{ marginTop: 4 }}>Changed</span>}
                    {cancelled && <span className="badge badge-bad" style={{ marginTop: 4 }}>Cancelled</span>}
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
