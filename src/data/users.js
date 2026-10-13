// Mock authentication data.
// NOTE: this is a frontend-only demo. In a real deployment this whole file
// is replaced by a backend auth service (JWT / college SSO) — the LoginForm
// component and AuthContext are already structured so that swap only touches
// this file and the login() function in AuthContext.
export const mockUsers = [
  {
    email: 'student@tsec.edu',
    password: 'student123',
    role: 'student',
    name: 'Ananya Mehta',
    department: 'comp',
    semester: 'SEM III',
  },
  {
    email: 'teacher@tsec.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Prof. R. Kulkarni',
    department: 'comp',
  },
  {
    email: 'admin@tsec.edu',
    password: 'admin123',
    role: 'management',
    name: 'Dr. S. Iyer',
    department: null,
  },
]
