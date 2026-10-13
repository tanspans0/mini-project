import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'management', label: 'Management' },
]

const DEMO_CREDS = {
  student: 'student@tsec.edu / student123',
  teacher: 'teacher@tsec.edu / teacher123',
  management: 'admin@tsec.edu / admin123',
}

export default function LoginForm() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(email, password, role)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/app/dashboard')
  }

  function fillDemo() {
    const [demoEmail, demoPassword] = DEMO_CREDS[role].split(' / ')
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="role-toggle">
        {ROLES.map(r => (
          <button
            type="button"
            key={r.id}
            className={`role-btn ${role === r.id ? 'active' : ''}`}
            onClick={() => setRole(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="email">College email</label>
        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@tsec.edu" />
      </div>
      <div className="field" style={{ marginBottom: 6 }}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </div>

      {error && <div className="form-msg form-msg-error">{error}</div>}

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 14 }}>
        Log in as {ROLES.find(r => r.id === role).label}
      </button>

      <div className="demo-creds">
        Demo login for {ROLES.find(r => r.id === role).label.toLowerCase()}: <strong>{DEMO_CREDS[role]}</strong>
        <br />
        <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={fillDemo}>
          Fill demo credentials
        </button>
      </div>
    </form>
  )
}
