import { officialTimetables } from '../data/officialTimetables'
import { useState } from 'react'
import { departments, semesters, days } from '../data/departments'
import { generateRegularTimetable } from '../data/timetable'
import Timetable from '../components/Timetable'
import DashboardCard from '../components/DashboardCard'
import { useAuth } from '../context/AuthContext'

export default function TimetablePage() {
  const { user } = useAuth()
const [dept, setDept] = useState(user?.department || 'comp')
const [sem, setSem] = useState(user?.semester || 'SEM III')
const [division, setDivision] = useState('C3')
const [day, setDay] = useState('')
const [building, setBuilding] = useState('')

  
const officialEntries =
  dept === 'comp'
    ? officialTimetables?.[dept]?.[sem]?.[division]
    : null

let timetable =
  officialEntries?.length
    ? Object.fromEntries(
        days.map(day => [
          day,
          officialEntries.filter(slot => slot.day === day),
        ])
      )
    : generateRegularTimetable(dept, sem)


  if (building) {
    timetable = Object.fromEntries(
      Object.entries(timetable).map(([d, slots]) => [d, slots.filter(s => s.building === building)])
    )
  }

  return (
    <DashboardCard title="Timetable">
      <div className="filter-bar">
        <select value={dept} onChange={e => setDept(e.target.value)}>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select
  value={division}
  onChange={e => setDivision(e.target.value)}
>
  <option value="C1">C1</option>
  <option value="C2">C2</option>
  <option value="C3">C3</option>
</select>
        <select value={day} onChange={e => setDay(e.target.value)}>
          <option value="">All days</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={building} onChange={e => setBuilding(e.target.value)}>
          <option value="">All buildings</option>
          <option value="Old Building">Old Building</option>
          <option value="New Building">New Building</option>
        </select>
      </div>
      <Timetable regularTimetable={timetable} dayFilter={day || null} />
    </DashboardCard>
  )
}
