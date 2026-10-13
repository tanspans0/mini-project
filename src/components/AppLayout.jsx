import { useState } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) return <Navigate to="/login" replace />

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <Sidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="main-col">
        <Topbar user={user} unreadCount={unreadCount} onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
