import { useState } from 'react'
import { departments } from '../data/departments'
import { rooms } from '../data/rooms'
import { useData } from '../context/DataContext'

const empty = { department: departments[0].id, date: '2026-09-25', start: '10:00', end: '11:00', roomId: rooms[0].id, purpose: '', faculty: '' }

export default function BookingForm({ onDone, onToast, defaultFaculty }) {
  const [form, setForm] = useState({ ...empty, faculty: defaultFaculty || '' })
  const [msg, setMsg] = useState(null)
  const { createBooking } = useData()

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.purpose.trim() || !form.faculty.trim()) {
      setMsg({ kind: 'error', text: 'Please fill in purpose and faculty name.' })
      return
    }
    if (form.end <= form.start) {
      setMsg({ kind: 'error', text: 'End time must be after start time.' })
      return
    }
    const result = createBooking(form)
    if (!result.ok) {
      setMsg({ kind: 'error', text: result.message })
      return
    }
    setMsg({ kind: 'success', text: `Room booked — ${form.roomId} confirmed for ${form.start}–${form.end}.` })
    onToast && onToast({ kind: 'success', message: `Booking confirmed for ${form.roomId}` })
    setTimeout(() => onDone && onDone(), 900)
  }

  const room = rooms.find(r => r.id === form.roomId)

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label>Department</label>
          <select value={form.department} onChange={e => update('department', e.target.value)}>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => update('date', e.target.value)} />
        </div>
        <div className="field">
          <label>Start time</label>
          <input type="time" value={form.start} onChange={e => update('start', e.target.value)} />
        </div>
        <div className="field">
          <label>End time</label>
          <input type="time" value={form.end} onChange={e => update('end', e.target.value)} />
        </div>
        <div className="field">
          <label>Room / Lab / Hall</label>
          <select value={form.roomId} onChange={e => update('roomId', e.target.value)}>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.id} — {r.building}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Building</label>
          <input value={room?.building || ''} disabled />
        </div>
        <div className="field field-full">
          <label>Purpose</label>
          <input value={form.purpose} onChange={e => update('purpose', e.target.value)} placeholder="e.g. Extra lecture — Database Management" />
        </div>
        <div className="field field-full">
          <label>Faculty name</label>
          <input value={form.faculty} onChange={e => update('faculty', e.target.value)} placeholder="Prof. ..." />
        </div>
      </div>

      {msg && <div className={`form-msg ${msg.kind === 'error' ? 'form-msg-error' : 'form-msg-success'}`}>{msg.text}</div>}

      <button type="submit" className="btn btn-brass" style={{ marginTop: 16, width: '100%' }}>Check availability &amp; book</button>
    </form>
  )
}
