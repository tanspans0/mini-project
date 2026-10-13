import { Link } from 'react-router-dom'

const features = [
  { title: 'Room Management', desc: 'Live status for every classroom, lab and seminar hall across both buildings.' },
  { title: 'Smart Timetable', desc: 'One weekly grid per department and semester, filterable by day and building.' },
  { title: 'Real-Time Updates', desc: 'Room, timing or building changes surface instantly as a schedule-change alert.' },
  { title: 'Event Management', desc: 'Fests, workshops and seminars listed with venue, floor and organizing committee.' },
  { title: 'Role-Based Access', desc: 'Students view, teachers book and manage, and management oversees the full campus.' },
]

export default function Home() {
  return (
    <div>
      <section className="landing-hero">
        <div className="container">
          <div className="tagline">TSEC · Thadomal Shahani Engineering College</div>
          <h1>TSEC Sync</h1>
          <p className="lede">One Campus. One Schedule. Zero Confusion. A centralized platform for managing classrooms, laboratories, seminar halls, timetables and real-time academic updates.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-brass">Login</Link>
            <a href="#features" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Explore features</a>
          </div>
        </div>
      </section>
      <section className="landing-features" id="features">
        <div className="container">
          <h2>What TSEC Sync handles</h2>
          {features.map((f) => (
            <div className="feature-item" key={f.title}>
              <div className="feature-num">{'\u2726'}</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>{f.title}</h4>
                <p style={{ margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
