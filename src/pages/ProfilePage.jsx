import { useAuth } from '../context/AuthContext'
import { departments } from '../data/departments'
import DashboardCard from '../components/DashboardCard'

const ROLE_LABEL = { student: 'Student', teacher: 'Teacher', management: 'Management' }

export default function ProfilePage() {
  const { user } = useAuth()
  const dept = departments.find(d => d.id === user?.department)

  return (
    <DashboardCard title="Profile">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
          {(user?.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{user?.name}</h3>
          <div className="tt-cell-meta">{ROLE_LABEL[user?.role]}</div>
        </div>
      </div>
      <div className="form-grid">
        <div className="field"><label>Email</label><input disabled value={user?.email} /></div>
        <div className="field"><label>Role</label><input disabled value={ROLE_LABEL[user?.role]} /></div>
        {dept && <div className="field"><label>Department</label><input disabled value={dept.name} /></div>}
        {user?.semester && <div className="field"><label>Semester</label><input disabled value={user.semester} /></div>}
      </div>
    </DashboardCard>
  )
}
