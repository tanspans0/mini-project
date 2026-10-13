import LoginForm from '../components/LoginForm'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ marginBottom: 2 }}>TSEC Sync</h2>
        </Link>
        <p style={{ marginTop: 0, marginBottom: 20, fontSize: 13 }}>Sign in to view your timetable, rooms and campus updates.</p>
        <LoginForm />
      </div>
    </div>
  )
}
