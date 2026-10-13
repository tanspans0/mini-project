import { createContext, useContext, useState } from 'react'
import { mockUsers } from '../data/users'

const AuthContext = createContext(null)

// Frontend-only mock authentication. To connect a real backend later,
// replace the body of login() with an API call and keep the same
// context shape (user / login / logout) so no other component changes.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tsecsync_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(email, password, role) {
    const match = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
    )
    if (!match) return { ok: false, message: 'Invalid email, password or role. Check the demo credentials below.' }
    const { password: _pw, ...safeUser } = match
    setUser(safeUser)
    localStorage.setItem('tsecsync_user', JSON.stringify(safeUser))
    return { ok: true, user: safeUser }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('tsecsync_user')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
