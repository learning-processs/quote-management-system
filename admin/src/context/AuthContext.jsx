import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const BACKEND = import.meta.env.VITE_BACKEND_URL

  const [admin, setAdmin]     = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    const savedAdmin = localStorage.getItem('adminUser')

    if (savedToken && savedAdmin) {
      setToken(savedToken)
      setAdmin(JSON.parse(savedAdmin))
    }
    setLoading(false)
  }, [])

  const login = (token, user) => {
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminUser', JSON.stringify(user))
    setToken(token)
    setAdmin(user)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ BACKEND, admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}