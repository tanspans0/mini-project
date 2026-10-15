import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import AppLayout from './components/AppLayout'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import TimetablePage from './pages/TimetablePage'
import RoomsPage from './pages/RoomsPage'
import EventsPage from './pages/EventsPage'
import SeminarsPage from './pages/SeminarsPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuth } from './context/AuthContext'

// Picks the right dashboard component for the logged-in user's role.
function RoleDashboard() {
  const { user } = useAuth()
  if (user?.role === 'teacher') return <TeacherDashboard />
  if (user?.role === 'admin') return <AdminDashboard />
  return <StudentDashboard />
}
function RoomAccess() {
  const { user } = useAuth()

  if (user?.role === 'teacher' || user?.role === 'admin') {
    return <RoomsPage />
  }

  return <Navigate to="/app/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RoleDashboard />} />
        <Route path="timetable" element={<TimetablePage />} />
<Route
  path="rooms"
  element={
    <RoomAccess />
  }
/>
<Route path="events" element={<EventsPage />} />
        <Route path="seminars" element={<SeminarsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
